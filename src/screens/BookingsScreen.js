import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Header from '../components/Header';
import { colors, fonts, spacing } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { getUserBookings } from '../services/firestoreService';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function BookingsScreen({ navigation }) {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBookings = async () => {
    if (!user) return;
    try {
      const userBookings = await getUserBookings(user.uid);
      setBookings(userBookings);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchBookings();
    }, [user])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchBookings();
  };

  const renderBooking = ({ item }) => {
    const bookingDate = new Date(item.bookingDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });

    return (
      <View style={styles.bookingCard}>
        <View style={styles.bookingHeader}>
          <Text style={styles.serviceTitle}>{item.serviceTitle || 'Service Booking'}</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>

        <View style={styles.bookingDetails}>
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="calendar" size={16} color={colors.textLight} />
            <Text style={styles.detailText}>{bookingDate} at {item.bookingTime}</Text>
          </View>

          {item.price && (
            <View style={styles.detailRow}>
              <MaterialCommunityIcons name="currency-usd" size={16} color={colors.textLight} />
              <Text style={styles.detailText}>Est. Price: ${item.price}</Text>
            </View>
          )}

          {item.address ? (
            <View style={styles.detailRow}>
              <MaterialCommunityIcons name="map-marker" size={16} color={colors.textLight} />
              <Text style={styles.detailText}>{item.address}</Text>
            </View>
          ) : null}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="My Bookings" showBack={false} />

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : bookings.length > 0 ? (
        <FlatList
          data={bookings}
          keyExtractor={item => item.id}
          renderItem={renderBooking}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
          }
        />
      ) : (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="clipboard-text-outline" size={60} color={colors.textLight} />
          <Text style={styles.emptyText}>You don't have any bookings yet.</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: spacing.l,
    paddingBottom: spacing.xxl,
  },
  bookingCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.l,
    marginBottom: spacing.m,
    borderWidth: 1,
    borderColor: colors.border,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.m,
  },
  serviceTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: colors.text,
    flex: 1,
    marginRight: spacing.s,
  },
  statusBadge: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    paddingHorizontal: spacing.s,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    color: '#4CAF50',
    fontFamily: fonts.medium,
    fontSize: 12,
  },
  bookingDetails: {
    gap: spacing.s,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textLight,
    marginLeft: spacing.s,
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
    marginTop: spacing.m,
    textAlign: 'center',
  },
});