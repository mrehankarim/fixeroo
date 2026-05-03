import React from 'react';
import { View, StyleSheet, SafeAreaView, FlatList, Text, TouchableOpacity } from 'react-native';
import Header from '../components/Header';
import ServiceCard from '../components/ServiceCard';
import { dummyData } from '../constants/dummyData';
import { colors, fonts, spacing } from '../constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function CategoryServicesScreen({ route, navigation }) {
  const { category } = route.params || {};


  const categoryServices = dummyData.services.filter(s => s.category === category);

  const renderService = ({ item }) => (
    <ServiceCard
      service={item}
      style={styles.serviceCard}
      onPress={() => navigation.navigate('BookService', { service: item })}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title={`${category} Services`} showBack={true} />

      <View style={styles.content}>
        {categoryServices.length > 0 ? (
          <FlatList
            data={categoryServices}
            keyExtractor={item => item.id.toString()}
            renderItem={renderService}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="alert-circle-outline" size={60} color={colors.textLight} />
            <Text style={styles.emptyText}>No services available for this category yet.</Text>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backButtonText}>Go Back</Text>
            </TouchableOpacity>
          </View>
        )}
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
    paddingTop: spacing.m,
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
  serviceCard: {
    marginRight: 0,
    width: '100%',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyText: {
    fontFamily: fonts.medium,
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    marginTop: spacing.m,
    marginBottom: spacing.l,
  },
  backButton: {
    paddingVertical: spacing.s,
    paddingHorizontal: spacing.l,
    backgroundColor: colors.primary,
    borderRadius: spacing.radius,
  },
  backButtonText: {
    color: colors.background,
    fontFamily: fonts.semiBold,
    fontSize: 14,
  },
});