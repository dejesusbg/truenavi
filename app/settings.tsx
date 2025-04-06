import React, { useState } from 'react';
import { View, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import Text, { fontStyle } from '~/components/Text';
import ScreenView from '~/components/ScreenView';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface SettingsItemProps {
  title: string;
  icon: string;
  isSwitch?: boolean;
  value?: boolean;
  onValueChange?: (value: boolean) => void;
  onPress?: () => void;
}

const SettingItem = ({
  icon,
  title,
  isSwitch,
  value,
  onValueChange,
  onPress,
}: SettingsItemProps) => {
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
        />
      ) : (
        <MaterialIcons name="chevron-right" style={styles.chevronIcon} />
      )}
    </TouchableOpacity>
  );
};

const Settings = () => {
  const insets = useSafeAreaInsets();
  const [darkMode, setDarkMode] = useState(true);
  const [language, setLanguage] = useState(true);
  const [weather, setWeather] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [vibration, setVibration] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const settingsGroups = [
    {
      title: 'General',
      items: [
        {
          icon: 'dark-mode',
          title: 'turn on dark mode',
          isSwitch: true,
          value: darkMode,
          onValueChange: setDarkMode,
        },
        {
          icon: 'language',
          title: 'set language to spanish',
          isSwitch: true,
          value: language,
          onValueChange: setLanguage,
        },
        {
          icon: 'thermostat',
          title: 'say weather',
          isSwitch: true,
          value: weather,
          onValueChange: setWeather,
        },
        {
          icon: 'notifications',
          title: 'allow notifications',
          isSwitch: true,
          value: notifications,
          onValueChange: setNotifications,
        },
        {
          icon: 'vibration',
          title: 'allow vibration',
          isSwitch: true,
          value: vibration,
          onValueChange: setVibration,
        },
      ],
    },
  ];

  return (
    <ScreenView title="settings" goBack={true}>
      <View style={[styles.container, { paddingBottom: insets.bottom }]}>
        {settingsGroups.map((group, groupIndex) => (
          <View key={`group-${groupIndex}`} style={styles.settingsGroup}>
            <View style={styles.settingsGroupItems}>
              {group.items.map((item, itemIndex) => (
                <React.Fragment key={`item-${groupIndex}-${itemIndex}`}>
                  <SettingItem
                    icon={item.icon}
                    title={item.title}
                    isSwitch={item.isSwitch}
                    value={item.value}
                    onValueChange={item.onValueChange}
                  />
                  {itemIndex < group.items.length - 1 && <View style={styles.itemSeparator} />}
                </React.Fragment>
              ))}
            </View>

            {groupIndex < settingsGroups.length - 1 && <View style={styles.groupSeparator} />}
          </View>
        ))}

        {isAdmin ? (
          <TouchableOpacity style={styles.dangerButton}>
            <MaterialIcons name="logout" style={styles.dangerIcon} />
            <Text style={styles.signOutText}>sign out</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.dangerButton}>
            <MaterialIcons name="delete" style={styles.dangerIcon} />
            <Text style={styles.signOutText}>erase all data</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScreenView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    gap: 24,
  },
  settingsGroup: {
    width: '100%',
  },
  settingsGroupTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
    paddingHorizontal: 16,
    ...fontStyle,
  },
  settingsGroupItems: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
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
    color: '#fff',
    ...fontStyle,
  },
  settingText: {
    fontSize: 16,
    color: '#fff',
    ...fontStyle,
  },
  chevronIcon: {
    fontSize: 22,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  itemSeparator: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginHorizontal: 16,
  },
  groupSeparator: {
    height: 1,
    backgroundColor: 'transparent',
    marginVertical: 12,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 70, 70, 0.2)',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  dangerIcon: {
    fontSize: 20,
    color: '#ff4646',
  },
  signOutText: {
    fontSize: 16,
    color: '#ff4646',
    fontWeight: '600',
    ...fontStyle,
  },
});

export default Settings;
