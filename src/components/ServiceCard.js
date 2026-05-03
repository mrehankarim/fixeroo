import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, fonts, spacing } from '../constants/theme';

export default function ServiceCard({ service, onPress, style }) {
  return (
    <TouchableOpacity style={[styles.card, style]} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons name={service.icon || 'star'} size={24} color={colors.primary} />
      </View>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{service.title}</Text>
      </View>
      {service.discount && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{service.discount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: spacing.radius,
    padding: spacing.l,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.l,
    marginRight: spacing.l, // if used in horizontal list
    minWidth: 250,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(45, 106, 255, 0.1)', // light primary
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.m,
  },
  info: {
    flex: 1,
  },
  title: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: colors.text,
  },
  badge: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.s,
    paddingVertical: spacing.xs,
    borderRadius: 6,
    marginLeft: spacing.s,
  },
  badgeText: {
    color: colors.background,
    fontFamily: fonts.bold,
    fontSize: 10,
  },
});
