import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import Header from '../components/Header';
import AppInput from '../components/AppInput';
import AppButton from '../components/AppButton';
import { colors, fonts, spacing } from '../constants/theme';
import { login, validateEmail } from '../services/authService';
import { updateLastLogin } from '../services/firestoreService';

export default function LogInScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const result = await login(email.trim(), password);

      if (result.success && result.user) {
        // Update last login
        try {
          await updateLastLogin(result.user.uid);
        } catch (error) {
          console.log('Error updating last login:', error);
        }

        // Navigate to main app
        navigation.replace('MainTabs');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Login Failed', error.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Log In" />
      <KeyboardAvoidingView 
        style={styles.content} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.form}>
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
          
          <TouchableOpacity 
            style={styles.forgotPassword}
            onPress={() => navigation.navigate('ForgotPassword')}
            disabled={loading}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
          
          <AppButton 
            title={loading ? "Logging in..." : "Log In"}
            onPress={handleLogin}
            disabled={loading}
          />
        </View>
        
        <View style={styles.bottomRow}>
          <Text style={styles.bottomText}>Don't have an account? </Text>
          <TouchableOpacity 
            onPress={() => navigation.navigate('SignUp')}
            disabled={loading}
          >
            <Text style={styles.signupText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    justifyContent: 'space-between',
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.xl,
  },
  form: {
    marginTop: spacing.xl,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: spacing.xxl,
  },
  forgotPasswordText: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.primary,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  bottomText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textLight,
  },
  signupText: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.primary,
  },
});
