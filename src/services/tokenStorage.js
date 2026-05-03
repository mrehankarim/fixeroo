import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'userToken';
const REFRESH_TOKEN_KEY = 'userRefreshToken';
const USER_ID_KEY = 'userId';
const OTP_STORAGE_KEY = 'otpData';

export const storeToken = async (token) => {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error('Error storing token:', error);
    throw error;
  }
};

export const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    return token;
  } catch (error) {
    console.error('Error retrieving token:', error);
    return null;
  }
};

export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error removing token:', error);
    throw error;
  }
};

export const storeRefreshToken = async (refreshToken) => {
  try {
    await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  } catch (error) {
    console.error('Error storing refresh token:', error);
    throw error;
  }
};

export const getRefreshToken = async () => {
  try {
    const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
    return refreshToken;
  } catch (error) {
    console.error('Error retrieving refresh token:', error);
    return null;
  }
};

export const removeRefreshToken = async () => {
  try {
    await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('Error removing refresh token:', error);
    throw error;
  }
};

export const storeUserId = async (userId) => {
  try {
    await AsyncStorage.setItem(USER_ID_KEY, userId);
  } catch (error) {
    console.error('Error storing user ID:', error);
    throw error;
  }
};

export const getUserId = async () => {
  try {
    const userId = await AsyncStorage.getItem(USER_ID_KEY);
    return userId;
  } catch (error) {
    console.error('Error retrieving user ID:', error);
    return null;
  }
};

export const storeOTPData = async (otpData) => {
  try {
    const dataWithExpiry = {
      ...otpData,
      expiresAt: Date.now() + 10 * 60 * 1000,
      createdAt: Date.now(),
    };
    await AsyncStorage.setItem(OTP_STORAGE_KEY, JSON.stringify(dataWithExpiry));
  } catch (error) {
    console.error('Error storing OTP data:', error);
    throw error;
  }
};

export const getOTPData = async () => {
  try {
    const otpData = await AsyncStorage.getItem(OTP_STORAGE_KEY);
    if (!otpData) return null;

    const data = JSON.parse(otpData);
    

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

export const removeOTPData = async () => {
  try {
    await AsyncStorage.removeItem(OTP_STORAGE_KEY);
  } catch (error) {
    console.error('Error removing OTP data:', error);
    throw error;
  }
};

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

export const isUserLoggedIn = async () => {
  try {
    const token = await getToken();
    return !!token;
  } catch (error) {
    console.error('Error checking login status:', error);
    return false;
  }
};