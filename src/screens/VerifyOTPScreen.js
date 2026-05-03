import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import Header from '../components/Header';
import AppInput from '../components/AppInput';
import AppButton from '../components/AppButton';
import { colors, spacing, fonts } from '../constants/theme';
import { verifyOTP, resendOTP, getOTPExpiryTime } from '../services/otpService';
import { markEmailAsVerified } from '../services/firestoreService';
import { useAuth } from '../context/AuthContext';
import { auth } from '../firebaseConfig';

export default function VerifyOTPScreen({ navigation, route }) {
  const { resetOTP } = useAuth();
  const { email } = route.params || {};
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600);
  const [error, setError] = useState('');


  useEffect(() => {
    const timer = setInterval(async () => {
      const remaining = await getOTPExpiryTime();
      setTimeLeft(Math.max(0, remaining));

      if (remaining === 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length < 4) {
      setError('Please enter a valid 4-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {

      await verifyOTP(email || auth.currentUser?.email, otp);


      await markEmailAsVerified(auth.currentUser.uid);


      resetOTP();

      Alert.alert(
        'Success',
        'Email verified successfully! You can now access all features.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('MainTabs'),
          },
        ]
      );
    } catch (err) {
      console.error('OTP verification error:', err);
      setError(err.message || 'Failed to verify OTP');
      Alert.alert('Verification Failed', err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResending(true);
    setError('');

    try {
      const result = await resendOTP(email || auth.currentUser?.email);

      if (result.developmentOTP) {
        Alert.alert(
          'OTP Resent',
          `New OTP: ${result.developmentOTP}\n\n(For testing only)`
        );
      } else {
        Alert.alert('Success', 'OTP has been resent to your email');
      }

      setOtp('');
      setTimeLeft(600);
    } catch (err) {
      console.error('Resend OTP error:', err);
      setError(err.message || 'Failed to resend OTP');
      Alert.alert('Resend Failed', err.message || 'An error occurred');
    } finally {
      setResending(false);
    }
  };

  const handleSkipVerification = () => {
    Alert.alert(
      'Skip Verification?',
      'Some features may be limited without email verification. Are you sure?',
      [
        { text: 'Cancel', onPress: () => {} },
        {
          text: 'Skip',
          onPress: () => {
            resetOTP();
            navigation.navigate('MainTabs');
          },
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Verify Email" />
      <View style={styles.content}>
        <View style={styles.infoSection}>
          <Text style={styles.infoText}>
            We've sent a 4-digit OTP to
          </Text>
          <Text style={styles.emailText}>
            {email || auth.currentUser?.email || 'your email'}
          </Text>
        </View>

        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
          </View>
        ) : null}

        <AppInput
          placeholder="Enter 4-digit OTP"
          value={otp}
          onChangeText={(text) => {
            setOtp(text.slice(0, 6));
            if (error) setError('');
          }}
          keyboardType="number-pad"
          maxLength={6}
          editable={!loading && !resending}
        />

        <View style={styles.timerBox}>
          <Text style={styles.timerLabel}>OTP expires in:</Text>
          <Text style={[styles.timerText, { color: timeLeft < 60 ? colors.error : colors.primary }]}>
            {formatTime(timeLeft)}
          </Text>
        </View>

        <AppButton
          title={loading ? "Verifying..." : "Verify OTP"}
          onPress={handleVerifyOTP}
          style={styles.button}
          disabled={loading || resending || timeLeft === 0}
        />

        <TouchableOpacity
          onPress={handleResendOTP}
          disabled={resending || loading}
          style={styles.resendButton}
        >
          {resending ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <Text style={styles.resendText}>
              Didn't receive OTP? <Text style={styles.resendLink}>Resend</Text>
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSkipVerification}
          disabled={loading || resending}
          style={styles.skipButton}
        >
          <Text style={styles.skipText}>Skip for Now</Text>
        </TouchableOpacity>
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
  infoSection: {
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  infoText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textLight,
    marginBottom: spacing.s,
  },
  emailText: {
    fontFamily: fonts.semibold,
    fontSize: 16,
    color: colors.text,
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
  timerBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.primary + '10',
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.l,
    borderRadius: 8,
    marginVertical: spacing.l,
  },
  timerLabel: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.textLight,
  },
  timerText: {
    fontFamily: fonts.bold,
    fontSize: 20,
    color: colors.primary,
  },
  button: {
    marginTop: spacing.l,
  },
  resendButton: {
    alignItems: 'center',
    marginTop: spacing.l,
    paddingVertical: spacing.m,
  },
  resendText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textLight,
  },
  resendLink: {
    fontFamily: fonts.semibold,
    color: colors.primary,
  },
  skipButton: {
    alignItems: 'center',
    marginTop: spacing.m,
    paddingVertical: spacing.m,
  },
  skipText: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.textLight,
    textDecorationLine: 'underline',
  },
});