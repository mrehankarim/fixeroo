import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList } from 'react-native';
import Header from '../components/Header';
import AppInput from '../components/AppInput';
import { colors, fonts, spacing } from '../constants/theme';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  
  const recentSearches = ['AC Repair', 'Home Cleaning', 'Plumbing Check'];

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Search" />
      <View style={styles.content}>
        <AppInput
          icon="magnify"
          placeholder="Search what you need..."
          value={query}
          onChangeText={setQuery}
        />
        
        <Text style={styles.sectionTitle}>Recent Searches</Text>
        <FlatList
          data={recentSearches}
          keyExtractor={item => item}
          renderItem={({ item }) => (
            <View style={styles.recentItem}>
              <Text style={styles.recentText}>{item}</Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.l,
    flex: 1,
  },
  sectionTitle: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: colors.text,
    marginTop: spacing.m,
    marginBottom: spacing.l,
  },
  recentItem: {
    paddingVertical: spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: colors.surface,
  },
  recentText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textLight,
  },
});
