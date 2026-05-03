import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import Header from '../components/Header';
import AppInput from '../components/AppInput';
import AppButton from '../components/AppButton';
import CategoryChip from '../components/CategoryChip';
import { dummyData } from '../constants/dummyData';
import { colors, fonts, spacing } from '../constants/theme';

export default function BookServiceScreen({ route, navigation }) {
  const { service, offer } = route.params || {};
  
  const initialCategory = service ? service.title : (offer ? offer.title : dummyData.categories[0]);
  
  const [selectedService, setSelectedService] = useState(initialCategory);
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [promoCode, setPromoCode] = useState(offer ? offer.code : '');

  const handleNext = () => {
    navigation.navigate('SelectDateTime', {
      service: selectedService,
      description,
      address,
      promoCode
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Book Service" />
      <KeyboardAvoidingView 
        style={styles.keyboardView} 
        behavior={Platform.OS === 'ios' ? 'padding' : null}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <Text style={styles.sectionLabel}>Select Service Type</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScroll}>
            {dummyData.categories.map((cat, index) => (
              <CategoryChip 
                key={index}
                title={cat}
                selected={selectedService === cat}
                onPress={() => setSelectedService(cat)}
              />
            ))}
          </ScrollView>

          <View style={styles.form}>
            <AppInput
              label="Description"
              placeholder="Describe your issue..."
              value={description}
              onChangeText={setDescription}
              multiline={true}
            />
            
            <AppInput
              label="Address"
              icon="map-marker-outline"
              placeholder="Your address"
              value={address}
              onChangeText={setAddress}
            />
            
            <AppInput
              label="Promo Code (Optional)"
              icon="ticket-percent-outline"
              placeholder="Enter code"
              value={promoCode}
              onChangeText={setPromoCode}
            />
          </View>

          <View style={styles.summaryBox}>
            <Text style={styles.summaryTitle}>Booking Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Service:</Text>
              <Text style={styles.summaryValue}>{selectedService}</Text>
            </View>
            {promoCode !== '' && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Promo Code:</Text>
                <Text style={styles.summaryValue}>{promoCode}</Text>
              </View>
            )}
          </View>

        </ScrollView>
        <View style={styles.footer}>
          <AppButton 
            title="Select Date & Time" 
            onPress={handleNext} 
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  sectionLabel: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.text,
    marginHorizontal: spacing.l,
    marginTop: spacing.m,
    marginBottom: spacing.s,
  },
  chipsScroll: {
    paddingHorizontal: spacing.l,
    marginBottom: spacing.l,
  },
  form: {
    paddingHorizontal: spacing.l,
  },
  summaryBox: {
    marginHorizontal: spacing.l,
    marginTop: spacing.m,
    padding: spacing.l,
    backgroundColor: colors.surface,
    borderRadius: 12,
  },
  summaryTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: colors.text,
    marginBottom: spacing.m,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.s,
  },
  summaryLabel: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textLight,
  },
  summaryValue: {
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
