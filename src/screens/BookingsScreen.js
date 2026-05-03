import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, FlatList,
  ActivityIndicator, RefreshControl, TouchableOpacity,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, fonts, spacing } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { getUserBookings } from '../services/firestoreService';

const CATEGORY_META = {
  'AC Repair':    { icon: 'air-conditioner', color: '#FF8A65' },
  'Beauty':       { icon: 'face-woman',      color: '#CE93D8' },
  'Appliance':    { icon: 'washing-machine', color: '#64B5F6' },
  'Painting':     { icon: 'roller',          color: '#81C784' },
  'Cleaning':     { icon: 'spray-bottle',    color: '#4DD0E1' },
  'Plumbing':     { icon: 'pipe-wrench',     color: '#90A4AE' },
  'Electronics':  { icon: 'laptop',          color: '#7986CB' },
  'Shifting':     { icon: 'truck',           color: '#FFD54F' },
  "Men's Salon":  { icon: 'content-cut',     color: '#F48FB1' },
};

const TABS = ['Upcoming', 'History', 'Draft'];

const TAB_STATUS_MAP = {
  Upcoming: ['Confirmed', 'confirmed'],
  History:  ['Completed', 'Cancelled', 'completed', 'cancelled'],
  Draft:    ['Draft', 'draft'],
};

function formatBookingDate(dateStr) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${d.getDate()} ${months[d.getMonth()]}`;
  } catch { return ''; }
}

function generateRef(id) {
  if (!id) return '#D-000000';
  const num = id.replace(/\D/g, '').slice(0, 6).padStart(6, '0');
  return `#D-${num}`;
}

export default function BookingsScreen({ navigation }) {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('Upcoming');

  const fetchBookings = async () => {
    if (!user) return;
    try {
      const data = await getUserBookings(user.uid);
      setBookings(data);
    } catch (e) {
      console.error('Failed to fetch bookings:', e);
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

  const filteredBookings = bookings.filter(b =>
    TAB_STATUS_MAP[activeTab].includes(b.status)
  );

  const renderBooking = ({ item }) => {
    const meta = CATEGORY_META[item.category] || { icon: 'briefcase-outline', color: '#9E9E9E' };
    const isConfirmed = item.status === 'Confirmed' || item.status === 'confirmed';
    const dateLabel = formatBookingDate(item.bookingDate);
    const refCode = generateRef(item.id);

    return (
      <View style={styles.bookingCard}>
        <View style={styles.cardTop}>
          <View style={[styles.serviceIconCircle, { backgroundColor: meta.color + '25' }]}>
            <MaterialCommunityIcons name={meta.icon} size={26} color={meta.color} />
          </View>
          <View style={styles.cardTopInfo}>
            <Text style={styles.cardTitle} numberOfLines={1}>{item.serviceTitle || 'Service Booking'}</Text>
            <Text style={styles.refCode}>Reference Code: {refCode}</Text>
          </View>
        </View>

        <View style={styles.cardDivider} />

        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Status</Text>
          <View style={[styles.statusBadge, { backgroundColor: isConfirmed ? '#E8F5E9' : '#FFF3E0' }]}>
            <Text style={[styles.statusText, { color: isConfirmed ? '#2E7D32' : '#E65100' }]}>
              {item.status}
            </Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="calendar-month-outline" size={18} color={colors.textLight} />
          <View style={styles.infoTextWrap}>
            <Text style={styles.infoMain}>
              {item.bookingTime ? `${item.bookingTime},  ${dateLabel}` : dateLabel}
            </Text>
            <Text style={styles.infoSub}>Schedule</Text>
          </View>
        </View>

        <View style={styles.providerRow}>
          <View style={styles.providerIconWrap}>
            <MaterialCommunityIcons name={meta.icon} size={18} color={meta.color} />
          </View>
          <View style={styles.infoTextWrap}>
            <Text style={styles.infoMain}>{item.category} Team</Text>
            <Text style={styles.infoSub}>Service provider</Text>
          </View>
          <TouchableOpacity style={styles.callBtn}>
            <MaterialCommunityIcons name="phone" size={16} color="#fff" />
            <Text style={styles.callBtnText}>Call</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={styles.leftAccent} />
          <Text style={styles.headerTitle}>Bookings</Text>
        </View>
        <TouchableOpacity style={styles.sortBtn}>
          <Text style={styles.sortText}>Recent </Text>
          <MaterialCommunityIcons name="chevron-down" size={16} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.tabsRow}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : filteredBookings.length > 0 ? (
        <FlatList
          data={filteredBookings}
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
          <MaterialCommunityIcons name="clipboard-text-outline" size={60} color={colors.border} />
          <Text style={styles.emptyText}>No {activeTab.toLowerCase()} bookings.</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.l,
    paddingTop: spacing.m,
    paddingBottom: spacing.s,
  },
  titleRow: { flexDirection: 'row', alignItems: 'center' },
  leftAccent: {
    width: 4, height: 26, backgroundColor: colors.primary,
    borderRadius: 2, marginRight: spacing.s,
  },
  headerTitle: { fontFamily: fonts.bold, fontSize: 22, color: colors.text },
  sortBtn: { flexDirection: 'row', alignItems: 'center' },
  sortText: { fontFamily: fonts.medium, fontSize: 14, color: colors.primary },
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.l,
    marginBottom: spacing.m,
    gap: spacing.s,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.s,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: colors.surface,
  },
  tabActive: { backgroundColor: colors.primary + '18' },
  tabText: { fontFamily: fonts.medium, fontSize: 14, color: colors.textLight },
  tabTextActive: { color: colors.primary, fontFamily: fonts.semiBold },
  listContent: { paddingHorizontal: spacing.l, paddingBottom: 30 },
  bookingCard: {
    backgroundColor: colors.background,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.m,
    padding: spacing.l,
  },
  cardTop: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.m },
  serviceIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.m,
  },
  cardTopInfo: { flex: 1 },
  cardTitle: { fontFamily: fonts.semiBold, fontSize: 16, color: colors.text },
  refCode: { fontFamily: fonts.regular, fontSize: 12, color: colors.textLight, marginTop: 2 },
  cardDivider: { height: 1, backgroundColor: colors.surface, marginBottom: spacing.m },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.m,
  },
  statusLabel: { fontFamily: fonts.regular, fontSize: 13, color: colors.textLight },
  statusBadge: { paddingHorizontal: spacing.m, paddingVertical: 3, borderRadius: 20 },
  statusText: { fontFamily: fonts.semiBold, fontSize: 12 },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.m,
    gap: spacing.s,
  },
  infoTextWrap: { flex: 1 },
  infoMain: { fontFamily: fonts.medium, fontSize: 13, color: colors.text },
  infoSub: { fontFamily: fonts.regular, fontSize: 11, color: colors.textLight, marginTop: 1 },
  providerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s,
  },
  providerIconWrap: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: colors.surface,
    justifyContent: 'center', alignItems: 'center',
  },
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    borderRadius: 20,
    gap: 4,
  },
  callBtnText: { fontFamily: fonts.semiBold, fontSize: 13, color: '#fff' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xl },
  emptyText: { fontFamily: fonts.medium, fontSize: 15, color: colors.textLight, marginTop: spacing.m },
});