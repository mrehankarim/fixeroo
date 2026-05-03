import React from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, Image,
  TouchableOpacity, Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { colors, fonts, spacing } from '../constants/theme';
import Person from '../assets/person.jpeg';

export default function AccountScreen({ navigation }) {
  const { user, userData, logout } = useAuth();

  const displayName = userData?.name || user?.displayName || 'User';
  const displayEmail = user?.email || '';

  const menuItems = [
    { id: 'personal', title: 'Personal information', icon: 'account-outline', rightText: null },
    { id: 'language', title: 'Language', icon: 'web', rightText: 'English (US)' },
    { id: 'privacy', title: 'Privacy Policy', icon: 'lock-outline', rightText: null },
    { id: 'help', title: 'Help center', icon: 'information-outline', rightText: null },
    { id: 'settings', title: 'Setting', icon: 'cog-outline', rightText: null },
  ];

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.canGoBack() && navigation.goBack()}
          style={styles.headerBack}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Account</Text>
        <View style={{ width: 32 }} />
      </View>

      <View style={styles.userRow}>
        <Image source={Person} style={styles.avatar} />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{displayName}</Text>
          <Text style={styles.userEmail}>{displayEmail}</Text>
        </View>
        <TouchableOpacity style={styles.editBtn}>
          <MaterialCommunityIcons name="pencil-outline" size={22} color={colors.textLight} />
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />

      {menuItems.map((item) => (
        <React.Fragment key={item.id}>
          <TouchableOpacity style={styles.menuItem}>
            <MaterialCommunityIcons name={item.icon} size={22} color={colors.text} />
            <Text style={styles.menuTitle}>{item.title}</Text>
            {item.rightText ? (
              <Text style={styles.menuRight}>{item.rightText}</Text>
            ) : null}
          </TouchableOpacity>
          <View style={styles.divider} />
        </React.Fragment>
      ))}

      <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
        <MaterialCommunityIcons name="logout" size={22} color="#E53935" />
        <Text style={[styles.menuTitle, styles.logoutText]}>Log out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.m,
  },
  headerBack: { padding: 4 },
  headerTitle: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: colors.text,
    textAlign: 'center',
    flex: 1,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.l,
  },
  avatar: { width: 60, height: 60, borderRadius: 30 },
  userInfo: { flex: 1, marginLeft: spacing.m },
  userName: { fontFamily: fonts.semiBold, fontSize: 16, color: colors.text },
  userEmail: { fontFamily: fonts.regular, fontSize: 13, color: colors.textLight, marginTop: 2 },
  editBtn: { padding: 4 },
  divider: { height: 1, backgroundColor: colors.border, marginHorizontal: spacing.l },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.l,
    gap: spacing.m,
  },
  menuTitle: { flex: 1, fontFamily: fonts.medium, fontSize: 15, color: colors.text },
  menuRight: { fontFamily: fonts.regular, fontSize: 14, color: colors.textLight },
  logoutText: { color: '#E53935', flex: 1 },
});