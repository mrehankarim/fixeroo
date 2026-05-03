import React, { useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { colors, fonts, spacing } from '../constants/theme';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Onboarding');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoPlaceholder}>
          <Text style={styles.logoText}>H</Text>
        </View>
        
        <Text style={styles.title}>
          Plumber & expart{'\n'}nearby you
        </Text>
        
        <Text style={styles.subtitle}>
          Lorem ipsum is a placeholder text commonly used to demonstrate the visual.
        </Text>
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
    paddingHorizontal: spacing.xxl,
  },
  logoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  logoText: {
    fontSize: 48,
    fontFamily: fonts.bold,
    color: colors.primary,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 28,
    color: colors.primary,
    textAlign: 'center',
    lineHeight: 36,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    marginTop: spacing.m,
    lineHeight: 22,
  },
});
