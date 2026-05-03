import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import Header from '../components/Header';
import { colors, fonts, spacing } from '../constants/theme';

export default function BookingsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Header title="My Bookings" showBack={true} />
      <View style={styles.content}>
        <Text style={styles.text}>Bookings Placeholder</Text>
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
  text: {
    fontFamily: fonts.medium,
    fontSize: 16,
    color: colors.textLight,
  },
});
