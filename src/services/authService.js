import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  confirmPasswordReset,
  verifyPasswordResetCode,
  updateProfile,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
  signOut,
} from "firebase/auth";

import { auth } from "../firebaseConfig";
import { createUserProfile } from "./firestoreService";
import { storeToken, storeUserId } from "./tokenStorage";

/**
 * Validate email format
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * Requirements: at least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
 */
export const validatePassword = (password) => {
  if (password.length < 8) {
    return { valid: false, message: "Password must be at least 8 characters" };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: "Password must contain an uppercase letter" };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: "Password must contain a lowercase letter" };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: "Password must contain a number" };
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return { valid: false, message: "Password must contain a special character" };
  }
  return { valid: true };
};

/**
 * Validate phone number (basic validation)
 */
export const validatePhone = (phone) => {
  const phoneRegex = /^[0-9]{10}$/; // Simple 10-digit validation
  return phoneRegex.test(phone.replace(/\D/g, ""));
};

/**
 * Sign up new user with email and password
 */
export const signup = async (email, password, userData) => {
  try {
    // Validate inputs
    if (!validateEmail(email)) {
      throw new Error("Invalid email format");
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      throw new Error(passwordValidation.message);
    }

    // Create Firebase auth user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // Update Firebase user profile with display name
    if (userData.name) {
      await updateProfile(firebaseUser, {
        displayName: userData.name,
      });
    }

    // Create user profile in Firestore
    const profileData = await createUserProfile(firebaseUser.uid, {
      email,
      name: userData.name,
      phone: userData.phone,
      isEmailVerified: false,
      userType: userData.userType || "customer",
      createdAt: new Date().toISOString(),
    });

    // Store tokens
    const token = firebaseUser.getIdToken ? await firebaseUser.getIdToken() : firebaseUser.uid;
    await storeToken(token);
    await storeUserId(firebaseUser.uid);

    return {
      user: firebaseUser,
      profile: profileData,
      success: true,
    };
  } catch (error) {
    console.error("Sign up error:", error);
    throw error;
  }
};

/**
 * Login user with email and password
 */
export const login = async (email, password) => {
  try {
    // Validate inputs
    if (!validateEmail(email)) {
      throw new Error("Invalid email format");
    }

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // Store tokens
    const token = firebaseUser.getIdToken ? await firebaseUser.getIdToken() : firebaseUser.uid;
    await storeToken(token);
    await storeUserId(firebaseUser.uid);

    return {
      user: firebaseUser,
      success: true,
    };
  } catch (error) {
    console.error("Login error:", error);
    if (error.code === "auth/user-not-found") {
      throw new Error("User not found. Please sign up first.");
    }
    if (error.code === "auth/wrong-password") {
      throw new Error("Incorrect password. Please try again.");
    }
    if (error.code === "auth/too-many-requests") {
      throw new Error("Too many login attempts. Please try again later.");
    }
    throw error;
  }
};

/**
 * Send password reset email
 */
export const sendPasswordReset = async (email) => {
  try {
    if (!validateEmail(email)) {
      throw new Error("Invalid email format");
    }

    await sendPasswordResetEmail(auth, email);
    return {
      success: true,
      message: "Password reset link sent to your email",
    };
  } catch (error) {
    console.error("Send password reset error:", error);
    if (error.code === "auth/user-not-found") {
      // For security, don't reveal if email exists
      return {
        success: true,
        message: "If an account exists with this email, you will receive a password reset link",
      };
    }
    throw error;
  }
};

/**
 * Verify password reset code and reset password
 */
export const resetPassword = async (code, newPassword) => {
  try {
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
      throw new Error(passwordValidation.message);
    }

    // Verify the reset code is valid
    await verifyPasswordResetCode(auth, code);

    // Reset the password
    await confirmPasswordReset(auth, code, newPassword);

    return {
      success: true,
      message: "Password reset successfully",
    };
  } catch (error) {
    console.error("Reset password error:", error);
    if (error.code === "auth/invalid-action-code") {
      throw new Error("Password reset link has expired. Please request a new one.");
    }
    throw error;
  }
};

/**
 * Change password for logged-in user
 */
export const changePassword = async (currentPassword, newPassword) => {
  try {
    const user = auth.currentUser;
    if (!user || !user.email) {
      throw new Error("User not authenticated");
    }

    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
      throw new Error(passwordValidation.message);
    }

    // Reauthenticate user
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);

    // Update password
    await updatePassword(user, newPassword);

    return {
      success: true,
      message: "Password changed successfully",
    };
  } catch (error) {
    console.error("Change password error:", error);
    if (error.code === "auth/wrong-password") {
      throw new Error("Current password is incorrect");
    }
    throw error;
  }
};

/**
 * Logout user
 */
export const logout = async () => {
  try {
    await signOut(auth);
    return {
      success: true,
      message: "Logged out successfully",
    };
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};

/**
 * Get current user
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};

/**
 * Get user ID token
 */
export const getIdToken = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not authenticated");
    }
    return await user.getIdToken();
  } catch (error) {
    console.error("Get ID token error:", error);
    throw error;
  }
};