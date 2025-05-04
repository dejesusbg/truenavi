import { Fragment, useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import Theme, { Text, ScreenView } from '~/components';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { PreferencesProps, getPreferences, updatePreferences } from '~/services/preferences';
import { deviceId } from '~/utils/api';
import useLocale from '~/hooks/useLocale';

interface SettingsItemProps {
  title: string;
  icon: string;
  isSwitch?: boolean;
  prop?: string;
  value?: boolean;
  onValueChange?: (value: boolean) => void;
  onPress?: () => void;
}

function SettingItem({ icon, title, isSwitch, value, onValueChange, onPress }: SettingsItemProps) {
  return (
    <TouchableOpacity style={styles.settingItem} onPress={onPress} disabled={isSwitch || !onPress}>
      <View style={styles.settingItemLeft}>
        <MaterialIcons name={icon} style={styles.settingIcon} />
        <Text style={styles.settingText}>{title}</Text>
      </View>
      {isSwitch ? (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: '#767577', true: '#a2c3fc' }}
          thumbColor={value ? '#3365a6' : '#f4f3f4'}
          style={[styles.settingSwitch, value && { marginRight: 8 }]}
        />
      ) : (
        <MaterialIcons name="chevron-right" style={styles.chevronIcon} />
      )}
    </TouchableOpacity>
  );
}

export default function Settings() {
  const insets = useSafeAreaInsets();
  const { updateLocale } = useLocale();
  const [preferences, setPreferences] = useState<PreferencesProps>({});
  const [id, setId] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const res = await getPreferences();
      if (res.success && res.data) setPreferences(res.data);
      deviceId().then(setId);
    };
    fetchData();
  }, []);

  const handleUpdate = async (newPreferences: PreferencesProps) => {
    await updatePreferences(newPreferences);
    setPreferences(newPreferences);
    updateLocale();
  };

  const handleChange = async (key: keyof PreferencesProps, value: boolean) => {
    await handleUpdate({ ...preferences, [key]: value });
  };

  const handleReset = async () => {
    await handleUpdate({ spanish: true, weather: true, vibration: true });
  };

  const settingsData = {
    switches: [
      { icon: 'thermostat', prop: 'weather', title: 'show weather', value: preferences.weather },
      { icon: 'language', prop: 'spanish', title: 'switch to spanish', value: preferences.spanish },
      { icon: 'vibration', prop: 'vibration', title: 'vibration', value: preferences.vibration },
    ],
    links: [
      { icon: 'admin-panel-settings', title: 'terms and conditions' },
      { icon: 'gavel', title: 'data policy' },
    ],
  };

  const renderSettingsGroup = (items: SettingsItemProps[], isSwitch: boolean) => (
    <View style={styles.settingsGroup}>
      <View style={styles.settingsGroupItems}>
        {items.map((item, index) => (
          <Fragment key={index}>
            <SettingItem
              {...item}
              isSwitch={isSwitch}
              value={item.value}
              onValueChange={
                isSwitch
                  ? (value) => handleChange(item.prop as keyof PreferencesProps, value)
                  : undefined
              }
              onPress={!isSwitch ? item.onPress : undefined}
            />
            {index < items.length - 1 && <View style={styles.itemSeparator} />}
          </Fragment>
        ))}
      </View>
    </View>
  );

  return (
    <ScreenView title="settings" goBack={true}>
      <View style={[styles.container, { paddingBottom: insets.bottom }]}>
        {renderSettingsGroup(settingsData.switches, true)}
        {renderSettingsGroup(settingsData.links, false)}

        <TouchableOpacity style={styles.dangerButton} onPress={handleReset}>
          <MaterialIcons name="delete" style={styles.dangerIcon} />
          <Text style={styles.dangerText}>erase all data</Text>
        </TouchableOpacity>
        <Text style={styles.idText}>{id}</Text>
      </View>
    </ScreenView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 16,
    gap: 24,
  },
  settingsGroup: {
    width: '100%',
  },
  settingsGroupItems: {
    backgroundColor: Theme.container,
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  settingIcon: {
    fontSize: 22,
    color: Theme.icon,
  },
  settingText: {
    fontSize: 16,
    fontWeight: 400,
    color: Theme.white,
  },
  settingSwitch: {
    height: 0,
    paddingVertical: 12,
  },
  chevronIcon: {
    fontSize: 22,
    color: Theme.iconMuted,
  },
  itemSeparator: {
    height: 1,
    backgroundColor: Theme.iconSubtle,
    marginHorizontal: 16,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.dangerLight,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  dangerIcon: {
    fontSize: 20,
    color: Theme.danger,
  },
  dangerText: {
    fontSize: 16,
    color: Theme.danger,
    fontWeight: 600,
  },
  idText: {
    fontSize: 12,
    color: Theme.foregroundSubtle,
    margin: 'auto',
    marginTop: 0,
  },
});
