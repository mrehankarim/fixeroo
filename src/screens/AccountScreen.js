import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image } from 'react-native';
import Header from '../components/Header';
import { colors, fonts } from '../constants/theme';
import Person from "../assets/person.jpeg";
import { MaterialCommunityIcons } from '@expo/vector-icons';
export default function AccountScreen() {
  const menuItems = [
    { title: 'Personal Information', icon: 'account-outline' },
    { title: 'Languages', icon: 'translate' },
    { title: 'Privacy Policy', icon: 'shield-outline' },
    { title: 'Help Center', icon: 'help-circle-outline' },
    { title: 'Settings', icon: 'cog-outline' },
  ];
  return (
    <SafeAreaView style={styles.container}>
      <Header title="Account" showBack={false} style={styles.header} />
      <View style={styles.infoContainer}>
        <Image source={Person} style={styles.image} />
        <View>
          <Text style={styles.heading}>Tom Ryan</Text>
          <Text style={styles.text}>ryan.khk@example.com</Text>
        </View>
        <MaterialCommunityIcons name='pencil' size={20} color={colors.textLight} />
      </View>
      <View
            style={{
              height: 1,
              backgroundColor: colors.border,
              marginHorizontal: 20,
              marginVertical: 10
            }}
          />

      {menuItems.map((item, index) => (
        <React.Fragment key={index}>
          <View style={styles.logoutContainer}>
            <MaterialCommunityIcons
              name={item.icon}
              size={20}
              color={colors.textLight}
            />
            <Text style={[styles.header, { marginLeft: 10 }]}>
              {item.title}
            </Text>
          </View>

          <View
            style={{
              height: 1,
              backgroundColor: colors.border,
              marginHorizontal: 20,
              marginVertical: 5
            }}
          />
        </React.Fragment>
      ))}
      <View style={styles.logoutContainer}>
        <MaterialCommunityIcons name="logout" size={20} color={colors.accent} />
        <Text style={[styles.heading, { marginLeft: 10, color: colors.accent }]}>Log Out</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontFamily: fonts.medium,
    fontSize: 16,
    color: colors.text,
    fontWeight: 'bold'
  },
  text: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.textLight,
  },
  header: {
    fontWeight: 'bold'
  },
  image: {
    width: 70, height: 70, borderRadius: 50, alignSelf: 'center'
  },
  infoContainer: {
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  logoutContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10
  }
});
