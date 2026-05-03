import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, fonts, spacing } from '../constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function AppButton({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  icon,
  style,
  textStyle,
}) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return {
          button: { backgroundColor: colors.secondary },
          text: { color: colors.background },
        };
      case 'outline':
        return {
          button: {
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: colors.primary,
          },
          text: { color: colors.primary },
        };
      case 'primary':
      default:
        return {
          button: { backgroundColor: colors.primary },
          text: { color: colors.background },
        };
    }
  };

  const variantStyles = getVariantStyles();
  const isDisabled = loading || disabled;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        variantStyles.button,
        isDisabled && styles.disabledButton,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={isDisabled ? 1 : 0.8}
    >
      {loading ? (
        <ActivityIndicator color={variantStyles.text.color} />
      ) : (
        <>
          {icon && (
            <MaterialCommunityIcons
              name={icon}
              size={20}
              color={variantStyles.text.color}
              style={styles.icon}
            />
          )}
          <Text style={[
            styles.text,
            variantStyles.text,
            isDisabled && styles.disabledText,
            textStyle,
          ]}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: spacing.radius,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.l,
  },
  disabledButton: {
    opacity: 0.5,
  },
  text: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
  },
  disabledText: {
    opacity: 0.7,
  },
  icon: {
    marginRight: spacing.s,
  },
});
