import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CategoryChip from '../components/CategoryChip';
import ServiceCard from '../components/ServiceCard';
import OfferCard from '../components/OfferCard';
import { dummyData } from '../constants/dummyData';
import { colors, fonts, spacing } from '../constants/theme';
import { useAuth } from '../context/AuthContext';

export default function HomeScreen({ navigation }) {
  const { user, userData } = useAuth();
  const firstName = (userData?.name || user?.displayName || 'there').split(' ')[0];
  const topCategories = dummyData.categories.slice(0, 3);
  const cleaningServices = dummyData.services.filter(s => s.category === 'Cleaning');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <Text style={styles.greeting}>Hello, {firstName}!</Text>
          <TouchableOpacity style={styles.bellIcon}>
            <MaterialCommunityIcons name="bell-outline" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.searchBar}
          onPress={() => navigation.navigate('Search')}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="magnify" size={20} color={colors.textLight} />
          <Text style={styles.searchText}>Search what you need...</Text>
        </TouchableOpacity>

        <View style={styles.categoriesContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScroll}>
            {topCategories.map((cat, index) => (
              <CategoryChip
                key={index}
                title={cat}
                selected={false}
                onPress={() => navigation.navigate('CategoryServices', { category: cat })}
              />
            ))}
            <CategoryChip
              title="See All"
              isSeeAll
              onPress={() => navigation.navigate('Categories')}
            />
          </ScrollView>
        </View>

        {}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Cleaning Services</Text>
          <View style={styles.discountBadge}>
            <Text style={styles.discountBadgeText}>10% OFF</Text>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.servicesScroll}>
          {cleaningServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onPress={() => navigation.navigate('BookService', { service })}
            />
          ))}
        </ScrollView>

        <View style={[styles.sectionHeader, { marginTop: spacing.m }]}>
          <Text style={styles.sectionTitle}>Special Offers</Text>
        </View>

        <View style={styles.offersContainer}>
          {dummyData.offers.map((offer) => (
            <OfferCard
              key={offer.id}
              offer={offer}
              onPress={() => navigation.navigate('BookService', { offer })}
            />
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.l,
    paddingTop: spacing.m,
    paddingBottom: spacing.s,
  },
  greeting: {
    fontFamily: fonts.semiBold,
    fontSize: 20,
    color: colors.text,
  },
  bellIcon: {
    padding: spacing.xs,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 22,
    height: 44,
    marginHorizontal: spacing.l,
    marginVertical: spacing.m,
    paddingHorizontal: spacing.l,
  },
  searchText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textLight,
    marginLeft: spacing.s,
  },
  categoriesContainer: {
    marginBottom: spacing.xl,
  },
  categoriesScroll: {
    paddingHorizontal: spacing.l,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.l,
    marginBottom: spacing.m,
  },
  sectionTitle: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: colors.text,
  },
  discountBadge: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.s,
    paddingVertical: spacing.xs,
    borderRadius: 6,
    marginLeft: spacing.s,
  },
  discountBadgeText: {
    color: colors.background,
    fontFamily: fonts.bold,
    fontSize: 10,
  },
  servicesScroll: {
    paddingHorizontal: spacing.l,
    paddingBottom: spacing.m,
  },
  offersContainer: {
    paddingHorizontal: spacing.l,
  },
});