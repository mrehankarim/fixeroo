import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { colors, fonts, spacing } from '../constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function AppInput({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  icon,
  keyboardType = 'default',
  multiline = false,
  style,
  error,
  editable = true,
  maxLength,
}) {
  const hasError = !!error;

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[
        styles.inputContainer,
        multiline && styles.multilineContainer,
        hasError && styles.inputContainerError,
      ]}>
        {icon && (
          <MaterialCommunityIcons
            name={icon}
            size={20}
            color={hasError ? colors.error : colors.textLight}
            style={styles.icon}
          />
        )}
        <TextInput
          style={[styles.input, multiline && styles.multilineInput]}
          placeholder={placeholder}
          placeholderTextColor={colors.textLight}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          multiline={multiline}
          autoCapitalize="none"
          editable={editable}
          maxLength={maxLength}
        />
      </View>
      {hasError && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.l,
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    height: 48,
    paddingHorizontal: spacing.m,
  },
  inputContainerError: {
    borderColor: colors.error,
    backgroundColor: colors.error + '10',
  },
  multilineContainer: {
    height: 100,
    alignItems: 'flex-start',
    paddingVertical: spacing.m,
  },
  icon: {
    marginRight: spacing.s,
  },
  input: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.text,
    height: '100%',
  },
  multilineInput: {
    textAlignVertical: 'top',
  },
  errorText: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.error,
    marginTop: spacing.xs,
    marginLeft: spacing.s,
  },
});
