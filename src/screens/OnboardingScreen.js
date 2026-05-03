import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import AppButton from '../components/AppButton';
import { colors, fonts, spacing } from '../constants/theme';

export default function OnboardingScreen({ navigation }) {
  const handleHomeSimulation = () => {
    navigation.navigate('MainTabs');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topSection}>
        <Text style={styles.brand}>Housing</Text>
        <Text style={styles.tagline}>Home Services</Text>
      </View>

      <View style={styles.bottomSection}>
        <AppButton
          title="Log In"
          onPress={() => navigation.navigate('LogIn')}
          style={styles.button}
        />

        <AppButton
          title="Sign Up"
          variant="outline"
          onPress={() => navigation.navigate('SignUp')}
          style={styles.button}
        />

        <View style={styles.dividerContainer}>
          <View style={styles.line} />
          <Text style={styles.orText}>Or</Text>
          <View style={styles.line} />
        </View>

        <AppButton
          title="Continue with Google"
          icon="google"
          variant="outline"
          onPress={handleHomeSimulation}
          style={styles.socialButton}
          textStyle={{ color: colors.text }}
        />

        <AppButton
          title="Continue with Facebook"
          icon="facebook"
          onPress={handleHomeSimulation}
          style={[styles.socialButton, { backgroundColor: '#1877F2', borderWidth: 0 }]}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: {
    fontFamily: fonts.bold,
    fontSize: 36,
    color: colors.primary,
  },
  tagline: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textLight,
    marginTop: -8,
  },
  bottomSection: {
    paddingHorizontal: spacing.xxl,
    paddingBottom: spacing.xxxl,
  },
  button: {
    marginBottom: spacing.l,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.l,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  orText: {
    marginHorizontal: spacing.m,
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textLight,
  },
  socialButton: {
    marginBottom: spacing.l,
    borderColor: colors.border,
  },
});