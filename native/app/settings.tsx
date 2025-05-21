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

/**
 * Renders a single settings item with an icon, title, and either a switch or a chevron.
 *
 * @param icon - The name of the MaterialIcon to display on the left.
 * @param title - The title text for the setting.
 * @param isSwitch - If true, displays a Switch component; otherwise, displays a chevron icon.
 * @param value - The current value of the switch (if `isSwitch` is true).
 * @param onValueChange - Callback function called when the switch value changes (if `isSwitch` is true).
 */
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

/**
 * Renders the Settings screen, allowing users to view and modify application preferences.
 *
 * This component displays a list of toggle switches for user preferences (such as weather,
 * language, and vibration), as well as links to legal documents (terms and conditions, data
 * policy). It also provides an option to reset all preferences and displays the device identifier
 * at the bottom of the screen.
 *
 * Preferences are loaded and updated using the `usePreferences` hook. The device identifier is fetched asynchronously on mount.
 */
export default function Settings() {
  const { preferences, loadPreferences } = usePreferences();
  const [identifier, setIdentifier] = useState('');

  if (preferences === null) return null;

  useEffect(() => {
    const getIdentifier = async () => {
      const id = await deviceId();
      setIdentifier(id);
    };

    getIdentifier();
  }, []);

  const handleChange = async (key: keyof PreferencesProps, value: boolean) => {
    await updatePreferences({ ...preferences, [key]: value });
    await loadPreferences();
  };

  const handleReset = async () => {
    await resetPreferences();
    await loadPreferences();
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
