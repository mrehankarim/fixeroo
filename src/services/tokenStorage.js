import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'userToken';
const REFRESH_TOKEN_KEY = 'userRefreshToken';
const USER_ID_KEY = 'userId';
const OTP_STORAGE_KEY = 'otpData';

/**
 * Store authentication token
 */
export const storeToken = async (token) => {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error('Error storing token:', error);
    throw error;
  }
};

/**
 * Retrieve authentication token
 */
export const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    return token;
  } catch (error) {
    console.error('Error retrieving token:', error);
    return null;
  }
};

/**
 * Remove authentication token
 */
export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error removing token:', error);
    throw error;
  }
};

/**
 * Store refresh token
 */
export const storeRefreshToken = async (refreshToken) => {
  try {
    await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  } catch (error) {
    console.error('Error storing refresh token:', error);
    throw error;
  }
};

/**
 * Retrieve refresh token
 */
export const getRefreshToken = async () => {
  try {
    const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
    return refreshToken;
  } catch (error) {
    console.error('Error retrieving refresh token:', error);
    return null;
  }
};

/**
 * Remove refresh token
 */
export const removeRefreshToken = async () => {
  try {
    await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('Error removing refresh token:', error);
    throw error;
  }
};

/**
 * Store user ID
 */
export const storeUserId = async (userId) => {
  try {
    await AsyncStorage.setItem(USER_ID_KEY, userId);
  } catch (error) {
    console.error('Error storing user ID:', error);
    throw error;
  }
};

/**
 * Retrieve user ID
 */
export const getUserId = async () => {
  try {
    const userId = await AsyncStorage.getItem(USER_ID_KEY);
    return userId;
  } catch (error) {
    console.error('Error retrieving user ID:', error);
    return null;
  }
};

/**
 * Store OTP data temporarily (for verification)
 * OTP data includes: email, otp, expiresAt, attempts
 */
export const storeOTPData = async (otpData) => {
  try {
    const dataWithExpiry = {
      ...otpData,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
      createdAt: Date.now(),
    };
    await AsyncStorage.setItem(OTP_STORAGE_KEY, JSON.stringify(dataWithExpiry));
  } catch (error) {
    console.error('Error storing OTP data:', error);
    throw error;
  }
};

/**
 * Retrieve OTP data
 */
export const getOTPData = async () => {
  try {
    const otpData = await AsyncStorage.getItem(OTP_STORAGE_KEY);
    if (!otpData) return null;

    const data = JSON.parse(otpData);
    
    // Check if OTP has expired
    if (data.expiresAt && Date.now() > data.expiresAt) {
      await removeOTPData();
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error retrieving OTP data:', error);
    return null;
  }
};

/**
 * Remove OTP data
 */
export const removeOTPData = async () => {
  try {
    await AsyncStorage.removeItem(OTP_STORAGE_KEY);
  } catch (error) {
    console.error('Error removing OTP data:', error);
    throw error;
  }
};

/**
 * Clear all authentication data
 */
export const clearAllAuthData = async () => {
  try {
    await Promise.all([
      removeToken(),
      removeRefreshToken(),
      AsyncStorage.removeItem(USER_ID_KEY),
      removeOTPData(),
    ]);
  } catch (error) {
    console.error('Error clearing auth data:', error);
    throw error;
  }
};

/**
 * Check if user is logged in (has valid token)
 */
export const isUserLoggedIn = async () => {
  try {
    const token = await getToken();
    return !!token;
  } catch (error) {
    console.error('Error checking login status:', error);
    return false;
  }
};
