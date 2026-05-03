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

import { auth } from "../../firebaseConfig";
import { createUserProfile } from "./firestoreService";
import { storeToken, storeUserId } from "./tokenStorage";

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

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

export const validatePhone = (phone) => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone.replace(/\D/g, ""));
};

export const signup = async (email, password, userData) => {
  try {

    if (!validateEmail(email)) {
      throw new Error("Invalid email format");
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      throw new Error(passwordValidation.message);
    }


    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;


    if (userData.name) {
      await updateProfile(firebaseUser, {
        displayName: userData.name,
      });
    }


    const profileData = await createUserProfile(firebaseUser.uid, {
      email,
      name: userData.name,
      phone: userData.phone,
      isEmailVerified: false,
      userType: userData.userType || "customer",
      createdAt: new Date().toISOString(),
    });


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

export const login = async (email, password) => {
  try {

    if (!validateEmail(email)) {
      throw new Error("Invalid email format");
    }

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;


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

      return {
        success: true,
        message: "If an account exists with this email, you will receive a password reset link",
      };
    }
    throw error;
  }
};

export const resetPassword = async (code, newPassword) => {
  try {
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
      throw new Error(passwordValidation.message);
    }


    await verifyPasswordResetCode(auth, code);


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


    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);


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

export const getCurrentUser = () => {
  return auth.currentUser;
};

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