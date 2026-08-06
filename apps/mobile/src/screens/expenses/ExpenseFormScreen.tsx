// ─────────────────────────────────────────────────────────────────────────────
// PariLink Mobile — Expense Form Screen
// Smart expense logging with OCR prefill, category selection, receipt photo.
// Offline-first: queues submission if no connectivity.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useCallback, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  ScrollView, ActivityIndicator, Alert, useColorScheme,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList, ExpenseCategory } from '../../types';
import { ExpensesAPI } from '../../services/api/client';
import { OfflineQueue } from '../../offline/OfflineQueue';
import { useAppDispatch } from '../../store';
import { showToast } from '../../store/slices/uiSlice';
import { LightTheme, DarkTheme, Typography, Spacing, Radius } from '../../theme';
import NetInfo from '@react-native-community/netinfo';

interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ExpenseForm'>;
  route:      RouteProp<RootStackParamList, 'ExpenseForm'>;
}

const expenseSchema = z.object({
  amount:      z.coerce.number().positive('Amount must be positive'),
  description: z.string().min(3, 'Description is required'),
  category:    z.string().min(1, 'Select a category'),
});
type ExpenseForm = z.infer<typeof expenseSchema>;

const CATEGORIES: { key: ExpenseCategory; icon: string; label: string }[] = [
  { key: 'FUEL',        icon: '⛽', label: 'Fuel' },
  { key: 'TOLL',        icon: '🛣️', label: 'Toll' },
  { key: 'FOOD',        icon: '🍱', label: 'Food' },
  { key: 'MAINTENANCE', icon: '🔧', label: 'Maintenance' },
  { key: 'PARKING',     icon: '🅿️', label: 'Parking' },
  { key: 'OTHER',       icon: '📋', label: 'Other' },
];

export function ExpenseFormScreen({ navigation, route }: Props) {
  const scheme   = useColorScheme();
  const theme    = scheme === 'dark' ? DarkTheme : LightTheme;
  const dispatch = useAppDispatch();

  const { tripId, prefillCategory } = route.params;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm<ExpenseForm>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      category: prefillCategory ?? '',
      amount:   0,
      description: '',
    },
  });

  const selectedCategory = watch('category');

  const onSubmit = useCallback(async (data: ExpenseForm) => {
    setIsSubmitting(true);
    const netState = await NetInfo.fetch();

    if (!netState.isConnected) {
      await OfflineQueue.enqueue({
        action:    'SUBMIT_EXPENSE',
        payload:   { ...data, tripId },
        timestamp: new Date().toISOString(),
      });
      dispatch(showToast({ type: 'info', text: 'Expense queued — will sync when online' }));
      navigation.goBack();
      return;
    }

    try {
      await ExpensesAPI.create({
        tripId,
        category:    data.category,
        amount:      data.amount,
        description: data.description,
      });
      dispatch(showToast({ type: 'success', text: 'Expense submitted successfully' }));
      navigation.goBack();
    } catch {
      Alert.alert('Submission Failed', 'Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [tripId, dispatch, navigation]);

  const styles = makeStyles(theme);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Log Expense</Text>

      {/* ── Category Selector ─────────────────────────────────────────────── */}
      <Text style={styles.label}>Category</Text>
      <View style={styles.categoriesGrid}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.key}
            style={[styles.categoryChip, selectedCategory === cat.key && styles.categoryChipSelected]}
            onPress={() => setValue('category', cat.key)}
            accessibilityRole="radio"
            accessibilityState={{ checked: selectedCategory === cat.key }}
            accessibilityLabel={cat.label}
          >
            <Text style={styles.categoryIcon}>{cat.icon}</Text>
            <Text style={[styles.categoryLabel, selectedCategory === cat.key && styles.categoryLabelSelected]}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {errors.category && <Text style={styles.errorText}>{errors.category.message}</Text>}

      {/* ── Amount ───────────────────────────────────────────────────────── */}
      <Text style={styles.label}>Amount (₹)</Text>
      <Controller
        control={control}
        name="amount"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[styles.input, errors.amount && styles.inputError]}
            value={value === 0 ? '' : String(value)}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholder="0.00"
            placeholderTextColor={theme.inputPlaceholder}
            keyboardType="decimal-pad"
            accessibilityLabel="Expense amount"
          />
        )}
      />
      {errors.amount && <Text style={styles.errorText}>{errors.amount.message}</Text>}

      {/* ── Description ───────────────────────────────────────────────────── */}
      <Text style={styles.label}>Description</Text>
      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[styles.input, styles.multiline, errors.description && styles.inputError]}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholder="e.g. Diesel fill at HP Pump, NH-44"
            placeholderTextColor={theme.inputPlaceholder}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            accessibilityLabel="Expense description"
          />
        )}
      />
      {errors.description && <Text style={styles.errorText}>{errors.description.message}</Text>}

      {/* ── Attach Receipt ────────────────────────────────────────────────── */}
      <TouchableOpacity
        style={styles.attachBtn}
        onPress={() => navigation.navigate('DocumentCamera', {
          type:        (selectedCategory as ExpenseCategory) === 'FUEL' ? 'FUEL' : 'EXPENSE',
          referenceId: tripId,
        })}
        accessibilityRole="button"
        accessibilityLabel="Attach receipt photo"
      >
        <Text style={styles.attachBtnText}>📷  Attach Receipt Photo (with OCR)</Text>
      </TouchableOpacity>

      {/* ── Submit ───────────────────────────────────────────────────────── */}
      <TouchableOpacity
        style={[styles.submitBtn, isSubmitting && styles.submitBtnDisabled]}
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
        accessibilityRole="button"
        accessibilityLabel="Submit expense"
      >
        {isSubmitting
          ? <ActivityIndicator color="#FFF" />
          : <Text style={styles.submitBtnText}>Submit Expense</Text>
        }
      </TouchableOpacity>
    </ScrollView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
function makeStyles(theme: typeof LightTheme) {
  return StyleSheet.create({
    container:              { flex: 1, backgroundColor: theme.background },
    content:                { padding: Spacing.lg, paddingBottom: Spacing.xxxl },
    title:                  { ...Typography.headingLG, color: theme.text, marginBottom: Spacing.lg },
    label: {
      ...Typography.labelMD,
      color:        theme.textSecondary,
      marginBottom: Spacing.xs,
      marginTop:    Spacing.md,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    categoriesGrid:         { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
    categoryChip: {
      width:          '30%',
      paddingVertical: Spacing.sm,
      borderRadius:   Radius.md,
      alignItems:     'center',
      borderWidth:    1.5,
      borderColor:    theme.border,
      backgroundColor: theme.surface,
    },
    categoryChipSelected:   { borderColor: theme.primary, backgroundColor: theme.primaryLight },
    categoryIcon:           { fontSize: 24, marginBottom: 2 },
    categoryLabel:          { ...Typography.labelSM, color: theme.textSecondary, fontSize: 11 },
    categoryLabelSelected:  { color: theme.primary },
    input: {
      backgroundColor:   theme.input,
      borderWidth:       1.5,
      borderColor:       theme.inputBorder,
      borderRadius:      Radius.md,
      paddingHorizontal: Spacing.md,
      paddingVertical:   14,
      ...Typography.bodyLG,
      color:             theme.inputText,
    },
    multiline:              { minHeight: 80, paddingTop: 14 },
    inputError:             { borderColor: theme.danger },
    errorText:              { ...Typography.caption, color: theme.danger, marginTop: Spacing.xs },
    attachBtn: {
      paddingVertical: 14, borderRadius: Radius.md,
      borderWidth: 1.5, borderColor: theme.primary,
      alignItems: 'center', marginTop: Spacing.md,
    },
    attachBtnText:          { ...Typography.labelMD, color: theme.primary, fontSize: 14 },
    submitBtn: {
      backgroundColor:  theme.primary,
      borderRadius:     Radius.md,
      paddingVertical:  16,
      alignItems:       'center',
      marginTop:        Spacing.lg,
      shadowColor:      theme.primary,
      shadowOffset:     { width: 0, height: 4 },
      shadowOpacity:    0.4,
      shadowRadius:     8,
      elevation:        6,
    },
    submitBtnDisabled:      { opacity: 0.6 },
    submitBtnText:          { ...Typography.labelLG, color: '#FFF', fontSize: 16 },
  });
}
