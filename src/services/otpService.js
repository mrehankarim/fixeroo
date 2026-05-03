import { storeOTPData, getOTPData } from './tokenStorage';

/**
 * Generate a random 6-digit OTP
 */
const generateOTP = () => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  return otp;
};

/**
 * Send OTP via email (mocked for now - in production use Firebase Functions or email service)
 * In production, you should use:
 * - Firebase Cloud Functions with nodemailer
 * - SendGrid/Mailgun/Twilio API
 * - Firebase Authentication's sendSignInLinkToEmail
 */
export const sendOTPToEmail = async (email) => {
  try {
    const otp = generateOTP();
    
    console.log(`[DEVELOPMENT] OTP for ${email}: ${otp}`);
    console.log('[DEVELOPMENT] In production, this would be sent via email');

    // Store OTP data locally with expiry
    await storeOTPData({
      email,
      otp,
      attempts: 0,
    });

    // In production, you would call a backend endpoint:
    // const response = await fetch('YOUR_BACKEND/send-otp', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email, otp }),
    // });

    return {
      success: true,
      message: 'OTP sent to email',
      email,
      // FOR DEVELOPMENT ONLY - Remove in production
      developmentOTP: otp,
    };
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw new Error('Failed to send OTP. Please try again.');
  }
};

/**
 * Verify OTP
 */
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
      // Increment failed attempts
      otpData.attempts = (otpData.attempts || 0) + 1;
      
      if (otpData.attempts >= 5) {
        throw new Error('Too many failed attempts. Please request a new OTP.');
      }
      
      await storeOTPData(otpData);
      throw new Error('Invalid OTP. Please try again.');
    }

    // OTP is valid
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

/**
 * Resend OTP (rate limiting in production recommended)
 */
export const resendOTP = async (email) => {
  try {
    // In production, implement rate limiting here
    return await sendOTPToEmail(email);
  } catch (error) {
    console.error('Error resending OTP:', error);
    throw error;
  }
};

/**
 * Get remaining OTP expiry time in seconds
 */
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
