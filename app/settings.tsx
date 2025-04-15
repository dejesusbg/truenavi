import React, { useState } from 'react';
import { View, StyleSheet, Switch, TouchableOpacity, Platform } from 'react-native';
import Text, { fontStyle } from '~/components/Text';
import ScreenView from '~/components/ScreenView';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';

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
          style={Platform.OS == 'web' ? {} : styles.settingSwitch}
        />
      ) : (
        <MaterialIcons name="chevron-right" style={styles.chevronIcon} />
      )}
    </TouchableOpacity>
  );
};

const Settings = () => {
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
        title: 'admin',
        onPress: () => router.push('/login'),
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
          <React.Fragment key={`item-${item.title}`}>
            <SettingItem
              icon={item.icon}
              title={item.title}
              isSwitch={isSwitch}
              value={isSwitch ? item.value : undefined}
              onValueChange={isSwitch ? item.onValueChange : undefined}
              onPress={!isSwitch ? item.onPress : undefined}
            />
            {index < items.length - 1 && <View style={styles.itemSeparator} />}
          </React.Fragment>
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
};

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
    color: 'rgba(255, 255, 255, 0.7)',
    ...fontStyle,
  },
  settingText: {
    fontSize: 16,
    color: '#fff',
    ...fontStyle,
  },
  settingSwitch: {
    height: 0,
    paddingVertical: 12,
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
  dangerText: {
    fontSize: 16,
    color: '#ff4646',
    fontWeight: 600,
    ...fontStyle,
  },
});

export default Settings;
