import { Fragment, useState } from 'react';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import Theme, { Text, ScreenView } from '~/components';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface SettingsItemProps {
  title: string;
  icon: string;
  isSwitch?: boolean;
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
          style={styles.settingSwitch}
        />
      ) : (
        <MaterialIcons name="chevron-right" style={styles.chevronIcon} />
      )}
    </TouchableOpacity>
  );
}

export default function Settings() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [language, setLanguage] = useState(true);
  const [weather, setWeather] = useState(true);
  const [vibration, setVibration] = useState(false);

  const settingsData = {
    switches: [
      {
        icon: 'language',
        title: 'set language to spanish',
        value: language,
        onValueChange: setLanguage,
      },
      {
        icon: 'thermostat',
        title: 'say weather',
        value: weather,
        onValueChange: setWeather,
      },
      {
        icon: 'vibration',
        title: 'allow vibration',
        value: vibration,
        onValueChange: setVibration,
      },
    ],
    links: [
      {
        icon: 'admin-panel-settings',
        title: 'terms and conditions',
        onPress: () => router.push('/'),
      },
      {
        icon: 'gavel',
        title: 'privacy policy',
        onPress: () => router.push('/'),
      },
    ],
  };

  const renderSettingsGroup = (items: SettingsItemProps[], isSwitch: boolean) => (
    <View style={styles.settingsGroup}>
      <View style={styles.settingsGroupItems}>
        {items.map((item, index) => (
          <Fragment key={`item-${item.title}`}>
            <SettingItem
              icon={item.icon}
              title={item.title}
              isSwitch={isSwitch}
              value={isSwitch ? item.value : undefined}
              onValueChange={isSwitch ? item.onValueChange : undefined}
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

        <TouchableOpacity style={styles.dangerButton} onPress={() => router.push('/')}>
          <MaterialIcons name="delete" style={styles.dangerIcon} />
          <Text style={styles.dangerText}>erase all data</Text>
        </TouchableOpacity>
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
    gap: 12,
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
});
