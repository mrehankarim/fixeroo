import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Header from '../components/Header';
import { dummyData } from '../constants/dummyData';
import { colors, fonts, spacing } from '../constants/theme';

const iconMap = {
  'AC Repair': 'air-conditioner',
  'Beauty': 'face-woman',
  'Appliance': 'washing-machine',
  'Painting': 'roller',
  'Cleaning': 'spray-bottle',
  'Plumbing': 'pipe-wrench',
  'Electronics': 'television',
  'Shifting': 'truck',
  "Men's Salon": 'hair-dryer'
};

export default function CategoriesScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = dummyData.categories.filter(cat =>
    cat.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={styles.categoryCard}
      onPress={() => {
        navigation.navigate('CategoryServices', { category: item });
      }}
    >
      <MaterialCommunityIcons
        name={iconMap[item] || 'view-grid'}
        size={32}
        color={colors.primary}
      />
      <Text style={styles.categoryText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Search Category" />

      <View style={styles.content}>
        <View style={styles.searchContainer}>
          <MaterialCommunityIcons name="magnify" size={20} color={colors.textLight} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search Category"
            placeholderTextColor={colors.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <Text style={styles.sectionTitle}>All Categories</Text>

        <FlatList
          data={filteredCategories}
          keyExtractor={(item) => item}
          numColumns={3}
          renderItem={renderCategory}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={styles.columnWrapper}
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
    flex: 1,
    paddingHorizontal: spacing.l,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    height: 48,
    marginTop: spacing.m,
    marginBottom: spacing.l,
    paddingHorizontal: spacing.m,
  },
  searchIcon: {
    marginRight: spacing.s,
  },
  searchInput: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.text,
  },
  sectionTitle: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: colors.text,
    marginBottom: spacing.l,
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: spacing.l,
  },
  categoryCard: {
    width: '31%',
    aspectRatio: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.s,
  },
  categoryText: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.text,
    textAlign: 'center',
    marginTop: spacing.s,
  },
});