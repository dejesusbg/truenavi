import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList, Modal, Alert } from 'react-native';
import Text, { TextInput } from '~/components/Text';
import ScreenView from '~/components/ScreenView';
import { useRouter } from 'expo-router';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Admin = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Sample admin data
  const [admins, setAdmins] = useState([
    { id: '1', name: 'Ricardo Barrios', email: 'ricardo@truenavi.com', password: '********' },
    { id: '2', name: 'Gianmarco Gambin', email: 'gianmarco@truenavi.com', password: '********' },
    { id: '3', name: 'Alex Marquez', email: 'alex@truenavi.com', password: '********' },
    { id: '4', name: 'Daniel Paez', email: 'daniel@truenavi.com', password: '********' },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<{
    id: string;
    name: string;
    email: string;
    password: string;
  } | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [searchQuery, setSearchQuery] = useState('');

  // Reset form when modal closes
  useEffect(() => {
    if (!modalVisible) {
      setFormData({ name: '', email: '', password: '' });
      setEditingAdmin(null);
    }
  }, [modalVisible]);

  // Open modal for editing
  const handleEditAdmin = (admin: any) => {
    setEditingAdmin(admin);
    setFormData({
      name: admin.name,
      email: admin.email,
      password: admin.password,
    });
    setModalVisible(true);
  };

  // Open modal for adding
  const handleAddAdmin = () => {
    setModalVisible(true);
  };

  // Handle form submission
  const handleSubmit = () => {
    // Validate form
    if (!formData.name || !formData.email || !formData.password) {
      Alert.alert('validation Error', 'all fields are required');
      return;
    }

    if (editingAdmin) {
      // Update existing admin
      setAdmins(
        admins.map((admin) => (admin.id === editingAdmin.id ? { ...admin, ...formData } : admin))
      );
    } else {
      // Add new admin
      const newAdmin = {
        id: Date.now().toString(),
        ...formData,
      };
      setAdmins([...admins, newAdmin]);
    }

    setModalVisible(false);
  };

  // Handle admin deletion
  const handleDeleteAdmin = (adminId: any) => {
    Alert.alert('confirm deletion', 'are you sure you want to delete this admin?', [
      { text: 'cancel', style: 'cancel' },
      {
        text: 'delete',
        style: 'destructive',
        onPress: () => {
          setAdmins(admins.filter((admin) => admin.id !== adminId));
        },
      },
    ]);
  };

  // Filter admins based on search query
  const filteredAdmins = admins.filter(
    (admin) =>
      admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Render each admin in the list
  const renderAdminItem = ({ item }: { item: any }) => (
    <View style={styles.adminItem}>
      <View style={styles.adminInfo}>
        <Text style={styles.adminName}>{item.name}</Text>
        <Text style={styles.adminEmail}>{item.email}</Text>
      </View>

      <View style={styles.adminActions}>
        <TouchableOpacity onPress={() => handleEditAdmin(item)}>
          <MaterialIcons name="edit" style={styles.actionIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteAdmin(item.id)}>
          <MaterialIcons name="delete" style={styles.deleteIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScreenView
      title="manage"
      icons={[
        { name: 'map', onPress: () => router.push('/map') },
        { name: 'exit-to-app', onPress: () => router.push('/') },
      ]}
      goBack={true}>
      <View style={[styles.container, { paddingBottom: insets.bottom }]}>
        {/* Search and add row */}
        <View style={styles.searchRow}>
          <View style={styles.searchContainer}>
            <MaterialIcons name="search" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="search admins..."
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery !== '' && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <MaterialIcons name="clear" style={styles.clearIcon} />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity style={styles.addButton} onPress={handleAddAdmin}>
            <MaterialIcons name="person-add" style={styles.addIcon} />
          </TouchableOpacity>
        </View>

        <View style={styles.listContainer}>
          <Text style={styles.listTitle}>administrators ({filteredAdmins.length})</Text>

          {filteredAdmins.length > 0 ? (
            <FlatList
              data={filteredAdmins}
              renderItem={renderAdminItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          ) : (
            <View style={styles.emptyState}>
              <MaterialIcons name="person-search" style={styles.emptyStateIcon} />
              <Text style={styles.emptyStateText}>No administrators found</Text>
            </View>
          )}
        </View>

        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
          statusBarTranslucent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {editingAdmin ? 'edit administrator' : 'add administrator'}
                </Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <MaterialIcons name="close" style={styles.closeIcon} />
                </TouchableOpacity>
              </View>

              <View style={styles.form}>
                <View style={styles.formField}>
                  <Text style={styles.fieldLabel}>name</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="full name"
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    value={formData.name}
                    onChangeText={(text) => setFormData({ ...formData, name: text })}
                  />
                </View>

                <View style={styles.formField}>
                  <Text style={styles.fieldLabel}>email</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="admin@truenavi.com"
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={formData.email}
                    onChangeText={(text) => setFormData({ ...formData, email: text })}
                  />
                </View>

                <View style={styles.formField}>
                  <Text style={styles.fieldLabel}>password</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="password"
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    secureTextEntry={true}
                    value={formData.password}
                    onChangeText={(text) => setFormData({ ...formData, password: text })}
                  />
                </View>

                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                  <Text style={styles.submitButtonText}>{editingAdmin ? 'update' : 'create'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ScreenView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
    marginTop: 16,
  },
  searchRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  searchContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 48,
  },
  searchIcon: {
    fontSize: 22,
    color: 'rgba(255, 255, 255, 0.7)',
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  clearIcon: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  addButton: {
    backgroundColor: 'rgba(129, 176, 255, 0.4)',
    height: 48,
    width: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addIcon: {
    fontSize: 24,
    color: '#fff',
  },
  listContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: '#fff',
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 12,
  },
  adminItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  adminInfo: {
    flex: 1,
  },
  adminName: {
    fontSize: 16,
    fontWeight: 500,
    color: '#fff',
  },
  adminEmail: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 4,
  },
  adminActions: {
    flexDirection: 'row',
    gap: 16,
  },
  actionIcon: {
    fontSize: 22,
    color: 'rgba(129, 176, 255, 0.8)',
  },
  deleteIcon: {
    fontSize: 22,
    color: 'rgba(255, 70, 70, 0.8)',
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateIcon: {
    fontSize: 48,
    color: 'rgba(255, 255, 255, 0.3)',
    marginBottom: 12,
  },
  emptyStateText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    width: '100%',
    maxWidth: 500,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 600,
    color: '#fff',
  },
  closeIcon: {
    fontSize: 24,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  form: {
    gap: 16,
  },
  formField: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#fff',
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: 'rgba(129, 176, 255, 0.8)',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 600,
  },
});

export default Admin;
