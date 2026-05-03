import { storeOTPData, getOTPData } from './tokenStorage';

const generateOTP = () => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  return otp;
};

export const sendOTPToEmail = async (email) => {
  try {
    const otp = generateOTP();
    
    console.log(`[DEVELOPMENT] OTP for ${email}: ${otp}`);
    console.log('[DEVELOPMENT] In production, this would be sent via email');


    await storeOTPData({
      email,
      otp,
      attempts: 0,
    });








    return {
      success: true,
      message: 'OTP sent to email',
      email,

      developmentOTP: otp,
    };
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw new Error('Failed to send OTP. Please try again.');
  }
};

export const verifyOTP = async (email, otp) => {
  try {
    const otpData = await getOTPData();

    if (!otpData) {
      throw new Error('OTP has expired. Please request a new one.');
    }

    if (otpData.email !== email) {
      throw new Error('Email does not match. Please check and try again.');
    }

    if (otpData.otp !== otp) {

      otpData.attempts = (otpData.attempts || 0) + 1;
      
      if (otpData.attempts >= 5) {
        throw new Error('Too many failed attempts. Please request a new OTP.');
      }
      
      await storeOTPData(otpData);
      throw new Error('Invalid OTP. Please try again.');
    }


    return {
      success: true,
      message: 'OTP verified successfully',
      email,
    };
  } catch (error) {
    console.error('Error verifying OTP:', error);
    throw error;
  }
};

export const resendOTP = async (email) => {
  try {

    return await sendOTPToEmail(email);
  } catch (error) {
    console.error('Error resending OTP:', error);
    throw error;
  }
};

export const getOTPExpiryTime = async () => {
  try {
    const otpData = await getOTPData();
    if (!otpData) return 0;

    const remainingTime = Math.ceil((otpData.expiresAt - Date.now()) / 1000);
    return Math.max(0, remainingTime);
  } catch (error) {
    console.error('Error getting OTP expiry time:', error);
    return 0;
  }
};