import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';

export default function Sidebar(props: DrawerContentComponentProps) {
  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerHeader}>
        <Text style={styles.drawerHeaderText}>Admin Panel</Text>
      </View>
      <DrawerItemList {...props} />
      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={() => {
          // Add logout logic here
          // For now, we'll just log to console
          console.log('Logout pressed');
        }}
      >
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  drawerHeader: {
    backgroundColor: '#f4f4f4',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  drawerHeaderText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  logoutButton: {
    margin: 16,
    padding: 12,
    backgroundColor: '#ff3b30',
    borderRadius: 4,
  },
  logoutButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

