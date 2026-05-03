import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, fonts, spacing } from '../constants/theme';

export default function OfferCard({ offer, onPress, style }) {
  return (
    <LinearGradient
      colors={[colors.primary, colors.secondary]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.card, style]}
    >
      <View style={styles.content}>
        <View style={styles.left}>
          <Text style={styles.title}>{offer.title}</Text>
          <Text style={styles.discount}>{offer.discount}</Text>
          <Text style={styles.code}>Use code: {offer.code}</Text>
        </View>
        <View style={styles.right}>
          <TouchableOpacity style={styles.button} onPress={onPress}>
            <Text style={styles.buttonText}>Grab Offer</Text>
            <MaterialCommunityIcons name="chevron-right" size={16} color={colors.background} />
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 120,
    borderRadius: 16,
    padding: spacing.xl,
    marginBottom: spacing.l,
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left: {
    flex: 1,
  },
  title: {
    color: colors.background,
    fontFamily: fonts.medium,
    fontSize: 14,
    opacity: 0.9,
  },
  discount: {
    color: colors.background,
    fontFamily: fonts.bold,
    fontSize: 22,
    marginVertical: 4,
  },
  code: {
    color: colors.background,
    fontFamily: fonts.regular,
    fontSize: 12,
    opacity: 0.8,
  },
  right: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.background,
    borderRadius: 8,
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.s,
  },
  buttonText: {
    color: colors.background,
    fontFamily: fonts.bold,
    fontSize: 14,
    marginRight: 4,
  },
});
