import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert } from 'react-native';
import Header from '../components/Header';
import AppInput from '../components/AppInput';
import AppButton from '../components/AppButton';
import { colors, fonts, spacing } from '../constants/theme';
import { signup, validateEmail, validatePassword, validatePhone } from "../services/authService";
import { sendOTPToEmail } from "../services/otpService";
import { useAuth } from '../context/AuthContext';

export default function SignUpScreen({ navigation }) {
  const { setOTPSent } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPasswordHint, setShowPasswordHint] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(phone)) {
      newErrors.phone = 'Phone must be 10 digits';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else {
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.valid) {
        newErrors.password = passwordValidation.message;
      }
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const result = await signup(email.trim(), password, {
        name: name.trim(),
        phone: phone.trim(),
        userType: 'customer',
      });

      if (result.success) {
        const otpResult = await sendOTPToEmail(email.trim());
        setOTPSent(email.trim());
        if (otpResult.developmentOTP) {
          Alert.alert(
            'Development Mode',
            `Your OTP is: ${otpResult.developmentOTP}\n\n(This is shown for testing only. In production, check your email.)`
          );
        }
        navigation.navigate('VerifyOTP', { email: email.trim() });
      }
    } catch (error) {
      console.error('Sign up error:', error);
      Alert.alert('Sign Up Failed', error.message || 'An error occurred during sign up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Sign Up" />
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : null}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.form}>
            <TouchableOpacity
              onPress={() => setShowPasswordHint(!showPasswordHint)}
              style={styles.hintToggle}
            >
              <Text style={styles.hintText}>
                {showPasswordHint ? '📋 Password Requirements' : 'ℹ️ Password Help'}
              </Text>
            </TouchableOpacity>

            {showPasswordHint && (
              <View style={styles.hintBox}>
                <Text style={styles.hintTitle}>Password must have:</Text>
                <Text style={styles.hintItem}>✓ At least 8 characters</Text>
                <Text style={styles.hintItem}>✓ One uppercase letter (A-Z)</Text>
                <Text style={styles.hintItem}>✓ One lowercase letter (a-z)</Text>
                <Text style={styles.hintItem}>✓ One number (0-9)</Text>
                <Text style={styles.hintItem}>✓ One special character (!@#$%^&*)</Text>
              </View>
            )}

            <AppInput
              icon="account-outline"
              placeholder="Full Name"
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (errors.name) {
                  setErrors({ ...errors, name: '' });
                }
              }}
              editable={!loading}
              error={errors.name}
            />

            <AppInput
              icon="email-outline"
              placeholder="Email address"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) {
                  setErrors({ ...errors, email: '' });
                }
              }}
              keyboardType="email-address"
              editable={!loading}
              error={errors.email}
            />

            <AppInput
              icon="phone-outline"
              placeholder="Phone number"
              value={phone}
              onChangeText={(text) => {
                setPhone(text);
                if (errors.phone) {
                  setErrors({ ...errors, phone: '' });
                }
              }}
              keyboardType="phone-pad"
              editable={!loading}
              error={errors.phone}
            />

            <AppInput
              icon="lock-outline"
              placeholder="Password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) {
                  setErrors({ ...errors, password: '' });
                }
              }}
              secureTextEntry
              editable={!loading}
              error={errors.password}
            />

            <AppInput
              icon="lock-outline"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (errors.confirmPassword) {
                  setErrors({ ...errors, confirmPassword: '' });
                }
              }}
              secureTextEntry
              editable={!loading}
              error={errors.confirmPassword}
            />

            <AppButton
              title={loading ? "Creating Account..." : "Sign Up"}
              onPress={handleSignUp}
              style={styles.button}
              disabled={loading}
            />
          </View>

          <View style={styles.bottomRow}>
            <Text style={styles.bottomText}>Already have an account? </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('LogIn')}
              disabled={loading}
            >
              <Text style={styles.loginText}>Log In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.xl,
  },
  form: {
    marginTop: spacing.m,
  },
  hintToggle: {
    marginBottom: spacing.m,
    paddingVertical: spacing.s,
  },
  hintText: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.primary,
  },
  hintBox: {
    backgroundColor: colors.primary + '10',
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    padding: spacing.m,
    marginBottom: spacing.m,
    borderRadius: 8,
  },
  hintTitle: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    color: colors.text,
    marginBottom: spacing.s,
  },
  hintItem: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.text,
    marginVertical: spacing.xs,
  },
  button: {
    marginTop: spacing.l,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
  },
  bottomText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textLight,
  },
  loginText: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.primary,
  },
});