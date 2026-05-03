import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Alert } from 'react-native';
import Header from '../components/Header';
import AppInput from '../components/AppInput';
import AppButton from '../components/AppButton';
import { colors, spacing, fonts } from '../constants/theme';
import { sendPasswordReset, validateEmail } from '../services/authService';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSendReset = async () => {
    setError('');

    // Validate email
    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }

    if (!validateEmail(email)) {
      setError('Invalid email format');
      return;
    }

    setLoading(true);
    try {
      const result = await sendPasswordReset(email.trim());

      if (result.success) {
        setSent(true);
        Alert.alert(
          'Check Your Email',
          'We\'ve sent a password reset link to your email address. Please check your inbox and follow the instructions.',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      }
    } catch (err) {
      console.error('Send password reset error:', err);
      setError(err.message || 'Failed to send reset link');
      Alert.alert('Error', err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Forgot Password" />
      <View style={styles.content}>
        {!sent ? (
          <>
            <Text style={styles.description}>
              Enter your email address and we'll send you a link to reset your password.
            </Text>

            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>⚠️ {error}</Text>
              </View>
            ) : null}

            <AppInput
              icon="email-outline"
              placeholder="Enter your email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (error) setError('');
              }}
              keyboardType="email-address"
              editable={!loading}
              error={error}
            />

            <AppButton
              title={loading ? "Sending..." : "Send Reset Link"}
              onPress={handleSendReset}
              style={styles.button}
              disabled={loading}
            />
          </>
        ) : (
          <View style={styles.successBox}>
            <Text style={styles.successIcon}>✓</Text>
            <Text style={styles.successTitle}>Email Sent!</Text>
            <Text style={styles.successText}>
              We've sent a password reset link to{'\n'}
              <Text style={styles.emailHighlight}>{email}</Text>
            </Text>
            <Text style={styles.successSubtext}>
              The link will expire in 24 hours.
            </Text>
          </View>
        )}
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
    padding: spacing.xl,
    flex: 1,
  },
  description: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textLight,
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  errorBox: {
    backgroundColor: '#FFEBEE',
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
    padding: spacing.m,
    borderRadius: 8,
    marginBottom: spacing.m,
  },
  errorText: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.error,
  },
  button: {
    marginTop: spacing.l,
  },
  successBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successIcon: {
    fontSize: 60,
    marginBottom: spacing.m,
  },
  successTitle: {
    fontFamily: fonts.bold,
    fontSize: 24,
    color: colors.text,
    marginBottom: spacing.s,
  },
  successText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.m,
  },
  emailHighlight: {
    fontFamily: fonts.semibold,
    color: colors.text,
  },
  successSubtext: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textLight,
  },
});
