import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { db } from '../firebaseConfig';

const USERS_COLLECTION = 'users';

/**
 * Store user data in Firestore
 */
export const createUserProfile = async (userId, userData) => {
  try {
    const userDocRef = doc(db, USERS_COLLECTION, userId);
    
    const profileData = {
      uid: userId,
      email: userData.email,
      name: userData.name,
      phone: userData.phone || '',
      profileImage: userData.profileImage || null,
      address: userData.address || '',
      city: userData.city || '',
      state: userData.state || '',
      pinCode: userData.pinCode || '',
      isEmailVerified: userData.isEmailVerified || false,
      isPhoneVerified: userData.isPhoneVerified || false,
      userType: userData.userType || 'customer', // customer or provider
      createdAt: userData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      accountStatus: 'active',
      ratings: 0,
      totalBookings: 0,
      services: userData.services || [], // For service providers
      bio: userData.bio || '',
      businessName: userData.businessName || '', // For service providers
    };

    await setDoc(userDocRef, profileData);
    return profileData;
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

/**
 * Get user data from Firestore
 */
export const getUserData = async (userId) => {
  try {
    const userDocRef = doc(db, USERS_COLLECTION, userId);
    const userSnap = await getDoc(userDocRef);

    if (userSnap.exists()) {
      return userSnap.data();
    }
    return null;
  } catch (error) {
    console.error('Error getting user data:', error);
    throw error;
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (userId, updates) => {
  try {
    const userDocRef = doc(db, USERS_COLLECTION, userId);
    
    const updateData = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await updateDoc(userDocRef, updateData);
    return updateData;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

/**
 * Update last login timestamp
 */
export const updateLastLogin = async (userId) => {
  try {
    const userDocRef = doc(db, USERS_COLLECTION, userId);
    await updateDoc(userDocRef, {
      lastLogin: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error updating last login:', error);
    // Don't throw - this is non-critical
  }
};

/**
 * Mark email as verified
 */
export const markEmailAsVerified = async (userId) => {
  try {
    const userDocRef = doc(db, USERS_COLLECTION, userId);
    await updateDoc(userDocRef, {
      isEmailVerified: true,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error marking email as verified:', error);
    throw error;
  }
};

/**
 * Check if email already exists
 */
export const checkEmailExists = async (email) => {
  try {
    const usersRef = collection(db, USERS_COLLECTION);
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error checking email:', error);
    throw error;
  }
};

/**
 * Get user by email
 */
export const getUserByEmail = async (email) => {
  try {
    const usersRef = collection(db, USERS_COLLECTION);
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data();
    }
    return null;
  } catch (error) {
    console.error('Error getting user by email:', error);
    throw error;
  }
};

/**
 * Delete user profile (admin/cleanup function)
 */
export const deleteUserProfile = async (userId) => {
  try {
    // In production, you might want to soft-delete instead
    const userDocRef = doc(db, USERS_COLLECTION, userId);
    await updateDoc(userDocRef, {
      accountStatus: 'deleted',
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error deleting user profile:', error);
    throw error;
  }
};
