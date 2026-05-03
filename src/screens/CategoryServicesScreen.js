import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, FlatList,
  TouchableOpacity, TextInput,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { dummyData } from '../constants/dummyData';
import { colors, fonts, spacing } from '../constants/theme';

export default function CategoryServicesScreen({ route, navigation }) {
  const { category } = route.params || {};
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('list');

  const categoryServices = dummyData.services
    .filter(s => s.category === category)
    .filter(s =>
      searchQuery === '' ||
      s.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const renderService = ({ item }) => (
    <TouchableOpacity
      style={styles.serviceCard}
      onPress={() => navigation.navigate('BookService', { service: item })}
      activeOpacity={0.85}
    >
      <View style={styles.serviceImageBox}>
        <MaterialCommunityIcons name={item.icon || 'tools'} size={36} color="#aaa" />
      </View>
      <View style={styles.serviceInfo}>
        <View style={styles.ratingRow}>
          <MaterialCommunityIcons name="star" size={13} color="#FFA500" />
          <Text style={styles.ratingText}>{item.rating} ({item.reviews})</Text>
        </View>
        <Text style={styles.serviceTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.startsFrom}>Starts From</Text>
        <View style={styles.priceBadge}>
          <Text style={styles.priceText}>${item.price}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.moreBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <MaterialCommunityIcons name="dots-vertical" size={20} color={colors.textLight} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.searchInputWrap}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search Category"
            placeholderTextColor={colors.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.searchIconBtn}>
          <MaterialCommunityIcons name="magnify" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.categoryHeaderRow}>
        <View style={styles.categoryTitleWrap}>
          <View style={styles.leftAccent} />
          <Text style={styles.categoryTitle}>{category}</Text>
        </View>
        <View style={styles.viewToggle}>
          <TouchableOpacity
            style={[styles.toggleBtn, viewMode === 'list' && styles.toggleBtnActive]}
            onPress={() => setViewMode('list')}
          >
            <MaterialCommunityIcons
              name="format-list-bulleted"
              size={18}
              color={viewMode === 'list' ? colors.primary : colors.textLight}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, viewMode === 'grid' && styles.toggleBtnActive]}
            onPress={() => setViewMode('grid')}
          >
            <MaterialCommunityIcons
              name="view-grid-outline"
              size={18}
              color={viewMode === 'grid' ? colors.primary : colors.textLight}
            />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={categoryServices}
        keyExtractor={item => item.id.toString()}
        renderItem={renderService}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="alert-circle-outline" size={50} color={colors.textLight} />
            <Text style={styles.emptyText}>No services found.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.m,
    gap: spacing.s,
  },
  backBtn: { padding: 4 },
  searchInputWrap: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    height: 42,
    justifyContent: 'center',
    paddingHorizontal: spacing.m,
  },
  searchInput: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.text,
  },
  searchIconBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.l,
    paddingBottom: spacing.m,
  },
  categoryTitleWrap: { flexDirection: 'row', alignItems: 'center' },
  leftAccent: {
    width: 4,
    height: 22,
    backgroundColor: colors.primary,
    borderRadius: 2,
    marginRight: spacing.s,
  },
  categoryTitle: { fontFamily: fonts.bold, fontSize: 20, color: colors.text },
  viewToggle: { flexDirection: 'row', gap: 6 },
  toggleBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleBtnActive: { borderColor: colors.primary, backgroundColor: colors.primary + '18' },
  listContent: { paddingHorizontal: spacing.l, paddingBottom: 30 },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.m,
    padding: spacing.m,
  },
  serviceImageBox: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.m,
  },
  serviceInfo: { flex: 1 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 3 },
  ratingText: { fontFamily: fonts.medium, fontSize: 12, color: colors.textLight, marginLeft: 4 },
  serviceTitle: { fontFamily: fonts.semiBold, fontSize: 15, color: colors.text, marginBottom: 2 },
  startsFrom: { fontFamily: fonts.regular, fontSize: 12, color: colors.textLight, marginBottom: 5 },
  priceBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: spacing.m,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  priceText: { fontFamily: fonts.semiBold, fontSize: 13, color: '#2E7D32' },
  moreBtn: { padding: 4 },
  emptyState: { alignItems: 'center', paddingTop: 60 },
  emptyText: { fontFamily: fonts.medium, fontSize: 15, color: colors.textLight, marginTop: spacing.m },
});