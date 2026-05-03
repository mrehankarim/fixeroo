import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TouchableOpacity, TextInput, Modal, FlatList, Alert,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, fonts, spacing } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { createBooking } from '../services/firestoreService';
import { dummyData } from '../constants/dummyData';

const PROPERTY_TYPES = [
  { id: 'home',   label: 'Home',   icon: 'home-outline' },
  { id: 'office', label: 'Office', icon: 'office-building-outline' },
  { id: 'villa',  label: 'Vila',   icon: 'domain' },
];

const TIME_SLOTS = [
  '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM',  '2:00 PM',  '3:00 PM',  '4:00 PM',
  '5:00 PM',  '6:00 PM',
];

function generateDates() {
  const dates = [];
  const today = new Date();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push({
      id: i.toString(),
      dayName: dayNames[d.getDay()],
      dateNum: d.getDate().toString(),
      fullDate: d,
    });
  }
  return dates;
}

export default function BookServiceScreen({ route, navigation }) {
  const { service, offer } = route.params || {};
  const { user } = useAuth();

  const serviceObj = service ||
    (offer ? { title: offer.title, category: offer.category, code: offer.code, price: 0, rating: 4.5 } :
      dummyData.services[0]);

  const [propertyType, setPropertyType] = useState('home');
  const [units, setUnits]               = useState(1);
  const [bedrooms, setBedrooms]         = useState(0);
  const [description, setDescription]   = useState('');
  const [showModal, setShowModal]       = useState(false);
  const [showBillDetails, setShowBillDetails] = useState(false);

  const dates = useMemo(() => generateDates(), []);
  const [selectedDate, setSelectedDate] = useState(dates[0].id);
  const [selectedTime, setSelectedTime] = useState(TIME_SLOTS[0]);
  const [bookingLoading, setBookingLoading] = useState(false);

  const basePrice = serviceObj?.price || 0;
  const total = basePrice * Math.max(units, 1);

  const handleSaveDraft = async () => {
    if (!user) { Alert.alert('Error', 'You must be logged in.'); return; }
    try {
      await createBooking({
        userId: user.uid,
        serviceTitle: serviceObj?.title,
        serviceId: serviceObj?.id,
        category: serviceObj?.category,
        price: total,
        propertyType, units, bedrooms, description,
        status: 'Draft',
        bookingDate: null, bookingTime: null,
      });
      Alert.alert('Saved', 'Your booking has been saved as a draft.');
      navigation.navigate('Bookings');
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  };

  const handleConfirm = async () => {
    if (!user) { Alert.alert('Error', 'You must be logged in.'); return; }
    const dateObj = dates.find(d => d.id === selectedDate);
    setBookingLoading(true);
    try {
      await createBooking({
        userId: user.uid,
        serviceTitle: serviceObj?.title,
        serviceId: serviceObj?.id,
        category: serviceObj?.category,
        price: total,
        propertyType, units, bedrooms, description,
        bookingDate: dateObj?.fullDate.toISOString(),
        bookingTime: selectedTime,
        status: 'Confirmed',
      });
      setShowModal(false);
      navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
      navigation.navigate('Bookings');
    } catch (e) {
      Alert.alert('Booking Failed', e.message);
    } finally {
      setBookingLoading(false);
    }
  };

  const renderDateChip = ({ item }) => {
    const active = selectedDate === item.id;
    return (
      <TouchableOpacity
        style={[styles.dateChip, active && styles.dateChipActive]}
        onPress={() => setSelectedDate(item.id)}
      >
        <Text style={[styles.dateChipDay, active && styles.dateChipTextActive]}>{item.dayName}</Text>
        <Text style={[styles.dateChipNum, active && styles.dateChipTextActive]}>{item.dateNum}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Grey header hero area */}
      <View style={styles.heroArea}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.heroContent}>
          <View style={styles.ratingBadge}>
            <MaterialCommunityIcons name="star" size={12} color="#fff" />
            <Text style={styles.ratingBadgeText}>{serviceObj?.rating || '4.5'}</Text>
          </View>
          <View style={styles.heroRow}>
            <Text style={styles.heroTitle}>{serviceObj?.title || 'Service'}</Text>
            <View style={styles.heroRight}>
              <Text style={styles.startsFromLabel}>Starts From</Text>
              <View style={styles.priceTag}>
                <Text style={styles.priceTagText}>${serviceObj?.price || 0}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* White card content */}
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : null}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

          <View style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <View style={styles.sectionAccent} />
              <Text style={styles.sectionTitle}>Type of Property</Text>
            </View>
            <View style={styles.propertyRow}>
              {PROPERTY_TYPES.map(pt => (
                <TouchableOpacity
                  key={pt.id}
                  style={[styles.propertyBtn, propertyType === pt.id && styles.propertyBtnActive]}
                  onPress={() => setPropertyType(pt.id)}
                >
                  <MaterialCommunityIcons
                    name={pt.icon}
                    size={26}
                    color={propertyType === pt.id ? '#fff' : colors.textLight}
                  />
                  <Text style={[styles.propertyLabel, propertyType === pt.id && styles.propertyLabelActive]}>
                    {pt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.counterSection}>
            <Text style={styles.counterLabel}>Number of Units</Text>
            <View style={styles.counterRow}>
              <TouchableOpacity
                style={styles.counterBtn}
                onPress={() => setUnits(u => Math.max(1, u - 1))}
              >
                <MaterialCommunityIcons name="minus" size={18} color={colors.textLight} />
              </TouchableOpacity>
              <Text style={styles.counterValue}>{units}</Text>
              <TouchableOpacity
                style={[styles.counterBtn, styles.counterBtnPlus]}
                onPress={() => setUnits(u => u + 1)}
              >
                <MaterialCommunityIcons name="plus" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.counterSection}>
            <Text style={styles.counterLabel}>Number of Bedrooms</Text>
            <View style={styles.counterRow}>
              <TouchableOpacity
                style={styles.counterBtn}
                onPress={() => setBedrooms(b => Math.max(0, b - 1))}
              >
                <MaterialCommunityIcons name="minus" size={18} color={colors.textLight} />
              </TouchableOpacity>
              <Text style={styles.counterValue}>{bedrooms}</Text>
              <TouchableOpacity
                style={[styles.counterBtn, styles.counterBtnPlus]}
                onPress={() => setBedrooms(b => b + 1)}
              >
                <MaterialCommunityIcons name="plus" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <View style={styles.sectionAccent} />
              <Text style={styles.sectionTitle}>Description</Text>
            </View>
            <TextInput
              style={styles.descInput}
              placeholder="Describe your requirements..."
              placeholderTextColor={colors.textLight}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {showBillDetails && (
            <View style={styles.billDetails}>
              <View style={styles.billRow}>
                <Text style={styles.billLabel}>Service price</Text>
                <Text style={styles.billValue}>${basePrice}</Text>
              </View>
              <View style={styles.billRow}>
                <Text style={styles.billLabel}>Units</Text>
                <Text style={styles.billValue}>× {units}</Text>
              </View>
              <View style={[styles.billRow, styles.billTotalRow]}>
                <Text style={styles.billTotalLabel}>Total</Text>
                <Text style={styles.billTotalValue}>USD {total.toFixed(2)}</Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Bottom bar */}
        <View style={styles.bottomBar}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total: </Text>
            <Text style={styles.totalAmount}>USD {total.toFixed(2)}</Text>
            <TouchableOpacity onPress={() => setShowBillDetails(v => !v)} style={styles.billDetailsBtn}>
              <Text style={styles.billDetailsText}>Bill Details </Text>
              <MaterialCommunityIcons
                name={showBillDetails ? 'chevron-down' : 'chevron-up'}
                size={14}
                color={colors.secondary}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.draftBtn} onPress={handleSaveDraft}>
              <Text style={styles.draftBtnText}>Save Draft</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.bookBtn} onPress={() => setShowModal(true)}>
              <Text style={styles.bookBtnText}>Book Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* Date & Time Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <View style={styles.sectionAccentLg} />
              <Text style={styles.modalTitle}>Select your Date & Time?</Text>
              <TouchableOpacity onPress={() => setShowModal(false)} style={styles.closeBtn}>
                <MaterialCommunityIcons name="close" size={20} color={colors.text} />
              </TouchableOpacity>
            </View>

            <FlatList
              horizontal
              data={dates}
              keyExtractor={item => item.id}
              renderItem={renderDateChip}
              contentContainerStyle={styles.datePicker}
              showsHorizontalScrollIndicator={false}
            />

            <Text style={styles.modalSubtitle}>Select Time</Text>
            <View style={styles.timeGrid}>
              {TIME_SLOTS.map(t => (
                <TouchableOpacity
                  key={t}
                  style={[styles.timeChip, selectedTime === t && styles.timeChipActive]}
                  onPress={() => setSelectedTime(t)}
                >
                  <Text style={[styles.timeChipText, selectedTime === t && styles.timeChipTextActive]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalFooter}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total: </Text>
                <Text style={styles.totalAmount}>USD {total.toFixed(2)}</Text>
                <TouchableOpacity style={styles.billDetailsBtn}>
                  <Text style={styles.billDetailsText}>View Details </Text>
                  <MaterialCommunityIcons name="chevron-up" size={14} color={colors.secondary} />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={[styles.continueBtn, bookingLoading && { opacity: 0.6 }]}
                onPress={handleConfirm}
                disabled={bookingLoading}
              >
                <Text style={styles.continueBtnText}>{bookingLoading ? 'Booking...' : 'Continue'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E0E0E0' },

  heroArea: {
    height: 160,
    backgroundColor: '#BDBDBD',
    paddingHorizontal: spacing.l,
    paddingTop: spacing.m,
    justifyContent: 'space-between',
    paddingBottom: spacing.l,
  },
  backBtn: { alignSelf: 'flex-start', padding: 4 },
  heroContent: { flex: 1, justifyContent: 'flex-end' },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.s,
    paddingVertical: 3,
    borderRadius: 20,
    gap: 3,
    marginBottom: spacing.s,
  },
  ratingBadgeText: { fontFamily: fonts.semiBold, fontSize: 12, color: '#fff' },
  heroRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  heroTitle: { fontFamily: fonts.bold, fontSize: 22, color: '#fff', flex: 1, marginRight: spacing.s },
  heroRight: { alignItems: 'flex-end' },
  startsFromLabel: { fontFamily: fonts.regular, fontSize: 11, color: '#fff', marginBottom: 3 },
  priceTag: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: spacing.m,
    paddingVertical: 4,
    borderRadius: 20,
  },
  priceTagText: { fontFamily: fonts.semiBold, fontSize: 13, color: '#fff' },

  scrollContent: { backgroundColor: colors.background, paddingBottom: 20 },
  section: { paddingHorizontal: spacing.l, paddingTop: spacing.l },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.m },
  sectionAccent: { width: 4, height: 18, backgroundColor: colors.primary, borderRadius: 2, marginRight: spacing.s },
  sectionAccentLg: { width: 4, height: 22, backgroundColor: colors.primary, borderRadius: 2, marginRight: spacing.s },
  sectionTitle: { fontFamily: fonts.semiBold, fontSize: 16, color: colors.text },

  propertyRow: { flexDirection: 'row', gap: spacing.m },
  propertyBtn: {
    flex: 1, alignItems: 'center', paddingVertical: spacing.m,
    borderRadius: 12, borderWidth: 1, borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  propertyBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  propertyLabel: { fontFamily: fonts.medium, fontSize: 12, color: colors.textLight, marginTop: 6 },
  propertyLabelActive: { color: '#fff' },

  counterSection: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.l, paddingVertical: spacing.m },
  counterLabel: { fontFamily: fonts.medium, fontSize: 14, color: colors.text },
  counterRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.s },
  counterBtn: {
    width: 32, height: 32, borderRadius: 16,
    borderWidth: 1, borderColor: colors.border,
    justifyContent: 'center', alignItems: 'center',
  },
  counterBtnPlus: { backgroundColor: colors.primary, borderColor: colors.primary },
  counterValue: { fontFamily: fonts.semiBold, fontSize: 16, color: colors.text, minWidth: 24, textAlign: 'center' },

  divider: { height: 1, backgroundColor: colors.surface, marginHorizontal: spacing.l },

  descInput: {
    backgroundColor: colors.surface, borderRadius: 10,
    padding: spacing.m, fontFamily: fonts.regular,
    fontSize: 14, color: colors.text, minHeight: 100,
  },

  billDetails: {
    marginHorizontal: spacing.l, marginTop: spacing.m,
    padding: spacing.m, backgroundColor: colors.surface, borderRadius: 10,
  },
  billRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.s },
  billTotalRow: { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.s, marginTop: spacing.xs },
  billLabel: { fontFamily: fonts.regular, fontSize: 13, color: colors.textLight },
  billValue: { fontFamily: fonts.medium, fontSize: 13, color: colors.text },
  billTotalLabel: { fontFamily: fonts.semiBold, fontSize: 14, color: colors.text },
  billTotalValue: { fontFamily: fonts.bold, fontSize: 14, color: colors.primary },

  bottomBar: {
    backgroundColor: colors.background,
    borderTopWidth: 1, borderTopColor: colors.border,
    paddingHorizontal: spacing.l, paddingVertical: spacing.m,
  },
  totalRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.m },
  totalLabel: { fontFamily: fonts.regular, fontSize: 14, color: colors.text },
  totalAmount: { fontFamily: fonts.bold, fontSize: 15, color: colors.text },
  billDetailsBtn: { flexDirection: 'row', alignItems: 'center', marginLeft: 'auto' },
  billDetailsText: { fontFamily: fonts.medium, fontSize: 13, color: colors.secondary },
  actionRow: { flexDirection: 'row', gap: spacing.m },
  draftBtn: {
    flex: 1, paddingVertical: spacing.m,
    borderRadius: 12, borderWidth: 1, borderColor: colors.border,
    alignItems: 'center',
  },
  draftBtnText: { fontFamily: fonts.semiBold, fontSize: 15, color: colors.text },
  bookBtn: {
    flex: 1, paddingVertical: spacing.m,
    borderRadius: 12, backgroundColor: colors.primary, alignItems: 'center',
  },
  bookBtnText: { fontFamily: fonts.semiBold, fontSize: 15, color: '#fff' },

  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' },
  modalSheet: {
    backgroundColor: colors.background, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingTop: spacing.l, paddingBottom: spacing.xxl,
  },
  modalHeader: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: spacing.l, marginBottom: spacing.m,
  },
  modalTitle: { flex: 1, fontFamily: fonts.semiBold, fontSize: 16, color: colors.text },
  closeBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: colors.surface, justifyContent: 'center', alignItems: 'center',
  },
  datePicker: { paddingHorizontal: spacing.l, gap: spacing.s, marginBottom: spacing.m },
  dateChip: {
    width: 52, height: 68, borderRadius: 12,
    backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center',
    gap: 4,
  },
  dateChipActive: { backgroundColor: colors.primary },
  dateChipDay: { fontFamily: fonts.medium, fontSize: 12, color: colors.textLight },
  dateChipNum: { fontFamily: fonts.bold, fontSize: 18, color: colors.text },
  dateChipTextActive: { color: '#fff' },
  modalSubtitle: { fontFamily: fonts.semiBold, fontSize: 14, color: colors.text, paddingHorizontal: spacing.l, marginBottom: spacing.s },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: spacing.l, gap: spacing.s, marginBottom: spacing.m },
  timeChip: {
    paddingVertical: spacing.s, paddingHorizontal: spacing.m,
    borderRadius: 20, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
  },
  timeChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  timeChipText: { fontFamily: fonts.medium, fontSize: 13, color: colors.text },
  timeChipTextActive: { color: '#fff' },
  modalFooter: { paddingHorizontal: spacing.l },
  continueBtn: {
    backgroundColor: colors.text, borderRadius: 14,
    paddingVertical: spacing.m, alignItems: 'center', marginTop: spacing.s,
  },
  continueBtnText: { fontFamily: fonts.semiBold, fontSize: 16, color: '#fff' },
});