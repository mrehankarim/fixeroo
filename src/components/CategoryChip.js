import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, fonts } from '../constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function CategoryChip({ title, selected, onPress, isSeeAll }) {
  if (isSeeAll) {
    return (
      <TouchableOpacity
        style={[styles.chip, styles.seeAllChip]}
        onPress={onPress}
      >
        <Text style={[styles.text, styles.seeAllText]}>{title}</Text>
        <MaterialCommunityIcons name="arrow-right" size={16} color={colors.primary} style={{marginLeft: 4}} />
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[
        styles.chip,
        selected ? styles.selectedChip : styles.defaultChip
      ]}
      onPress={onPress}
    >
      <Text style={[
        styles.text,
        selected ? styles.selectedText : styles.defaultText
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  defaultChip: {
    backgroundColor: colors.primary,
  },
  selectedChip: {
    backgroundColor: colors.primary,
  },
  seeAllChip: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  text: {
    fontFamily: fonts.medium,
    fontSize: 14,
  },
  defaultText: {
    color: colors.background,
  },
  selectedText: {
    color: colors.background,
  },
  seeAllText: {
    color: colors.primary,
  },
});