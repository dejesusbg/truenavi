import { Fragment, useEffect, useState } from 'react';
import { StyleSheet, Switch, TouchableOpacity, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { ScreenView, Text } from '~/components/layout';
import Theme from '~/components/theme';
import usePreferences from '~/context/PreferencesProvider';
import { deviceId, PreferencesProps, resetPreferences, updatePreferences } from '~/services';

interface SettingsItemProps {
  title: string;
  icon: string;
  isSwitch?: boolean;
  prop?: string;
  value?: boolean;
  onValueChange?: (value: boolean) => void;
}

function SettingItem({ icon, title, isSwitch, value, onValueChange }: SettingsItemProps) {
  return (
    <TouchableOpacity style={styles.settingItem}>
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
  const { preferences, loadPreferences } = usePreferences();
  const [identifier, setIdentifier] = useState('');

  useEffect(() => {
    const getIdentifier = async () => {
      const id = await deviceId();
      setIdentifier(id);
    };

    getIdentifier();
  }, []);

  const handleChange = async (key: keyof PreferencesProps, value: boolean) => {
    await updatePreferences({ ...preferences, [key]: value });
    loadPreferences();
  };

  const handleReset = async () => {
    await resetPreferences();
    loadPreferences();
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
              isSwitch
              onValueChange={
                isSwitch
                  ? (value) => handleChange(item.prop as keyof PreferencesProps, value)
                  : undefined
              }
            />
            {index < items.length - 1 && <View style={styles.itemSeparator} />}
          </Fragment>
        ))}
      </View>
    </View>
  );

  return (
    <ScreenView title="settings" goBack={true}>
      <View style={styles.container}>
        {renderSettingsGroup(settingsData.switches, true)}
        {renderSettingsGroup(settingsData.links, false)}

        <TouchableOpacity style={styles.dangerButton} onPress={handleReset}>
          <MaterialIcons name="delete" style={styles.dangerIcon} />
          <Text style={styles.dangerText}>erase all data</Text>
        </TouchableOpacity>
        <Text style={styles.idText}>{identifier}</Text>
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
