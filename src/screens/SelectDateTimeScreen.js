import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import Header from '../components/Header';
import AppButton from '../components/AppButton';
import { colors, fonts, spacing } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { createBooking } from '../services/firestoreService';

export default function SelectDateTimeScreen({ route, navigation }) {

  const generateDates = () => {
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
        fullDate: d
      });
    }
    return dates;
  };

  const dates = generateDates();
  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'
  ];

  const [selectedDate, setSelectedDate] = useState(dates[0].id);
  const [selectedTime, setSelectedTime] = useState(timeSlots[0]);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const { service, description, address, promoCode } = route.params || {};

  const handleConfirm = async () => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to book a service');
      return;
    }

    const selectedDateObj = dates.find(d => d.id === selectedDate);

    try {
      setLoading(true);
      await createBooking({
        userId: user.uid,
        serviceTitle: service?.title,
        serviceId: service?.id,
        category: service?.category,
        price: service?.price,
        description,
        address,
        promoCode,
        bookingDate: selectedDateObj?.fullDate.toISOString(),
        bookingTime: selectedTime,
      });


      navigation.reset({
        index: 0,
        routes: [{ name: 'MainTabs' }],
      });
      navigation.navigate('Bookings');
    } catch (error) {
      Alert.alert('Booking Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderDateItem = ({ item }) => {
    const isSelected = selectedDate === item.id;
    return (
      <TouchableOpacity
        style={[styles.dateCard, isSelected && styles.dateCardSelected]}
        onPress={() => setSelectedDate(item.id)}
      >
        <Text style={[styles.dayName, isSelected && styles.textSelected]}>{item.dayName}</Text>
        <View style={[styles.dateNumContainer, isSelected && styles.dateNumContainerSelected]}>
          <Text style={[styles.dateNum, isSelected && styles.textSelected]}>{item.dateNum}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Select Date & Time" />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Select Date</Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={dates}
          keyExtractor={item => item.id}
          renderItem={renderDateItem}
          contentContainerStyle={styles.dateList}
        />

        <Text style={styles.sectionTitle}>Available Slots</Text>
        <View style={styles.slotsGrid}>
          {timeSlots.map((time, index) => {
            const isSelected = selectedTime === time;
            return (
              <TouchableOpacity
                key={index}
                style={[styles.slotChip, isSelected && styles.slotChipSelected]}
                onPress={() => setSelectedTime(time)}
              >
                <Text style={[styles.slotText, isSelected && styles.textSelected]}>{time}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <AppButton title="Confirm Booking" onPress={handleConfirm} loading={loading} />
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
    paddingVertical: spacing.l,
  },
  sectionTitle: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: colors.text,
    marginHorizontal: spacing.l,
    marginBottom: spacing.m,
    marginTop: spacing.s,
  },
  dateList: {
    paddingHorizontal: spacing.l,
    paddingBottom: spacing.xl,
  },
  dateCard: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 80,
    borderRadius: 12,
    backgroundColor: colors.surface,
    marginRight: spacing.m,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  dateCardSelected: {
    backgroundColor: colors.primary,
  },
  dayName: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.textLight,
    marginBottom: spacing.xs,
  },
  dateNumContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateNumContainerSelected: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  dateNum: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.text,
  },
  textSelected: {
    color: colors.background,
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.l,
    gap: spacing.m,
  },
  slotChip: {
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.l,
    backgroundColor: colors.surface,
    borderRadius: 8,
    width: '30%',
    alignItems: 'center',
  },
  slotChipSelected: {
    backgroundColor: colors.primary,
  },
  slotText: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.text,
  },
  footer: {
    padding: spacing.l,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});