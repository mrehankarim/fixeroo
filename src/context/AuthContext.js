import React, { createContext, useState, useEffect, useCallback } from 'react';
import { auth } from '../../firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserData } from '../services/firestoreService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOTPSent, setIsOTPSent] = useState(false);
  const [otpVerificationEmail, setOtpVerificationEmail] = useState(null);
  const [authError, setAuthError] = useState(null);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      try {
        if (authUser) {

          setUser(authUser);
          

          try {
            const userData = await getUserData(authUser.uid);
            if (userData) {
              setUserData(userData);

              await AsyncStorage.setItem('userData', JSON.stringify(userData));
            }
          } catch (error) {
            console.log('Error fetching user data:', error);

            const cachedData = await AsyncStorage.getItem('userData');
            if (cachedData) {
              setUserData(JSON.parse(cachedData));
            }
          }
        } else {
          setUser(null);
          setUserData(null);
          setIsOTPSent(false);
          setOtpVerificationEmail(null);
          await AsyncStorage.removeItem('userData');
          await AsyncStorage.removeItem('userToken');
        }
      } catch (error) {
        console.log('Error in onAuthStateChanged:', error);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      await signOut(auth);
      setUser(null);
      setUserData(null);
      setIsOTPSent(false);
      setOtpVerificationEmail(null);
      await AsyncStorage.removeItem('userData');
      await AsyncStorage.removeItem('userToken');
      setAuthError(null);
    } catch (error) {
      console.log('Logout error:', error);
      setAuthError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearAuthError = useCallback(() => {
    setAuthError(null);
  }, []);

  const setOTPSent = useCallback((email) => {
    setIsOTPSent(true);
    setOtpVerificationEmail(email);
  }, []);

  const resetOTP = useCallback(() => {
    setIsOTPSent(false);
    setOtpVerificationEmail(null);
  }, []);

  const value = {
    user,
    userData,
    setUserData,
    loading,
    logout,
    isOTPSent,
    otpVerificationEmail,
    setOTPSent,
    resetOTP,
    authError,
    setAuthError,
    clearAuthError,
    isAuthenticated: !!user,
    isEmailVerified: user?.emailVerified,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};