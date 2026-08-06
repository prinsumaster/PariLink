// ─────────────────────────────────────────────────────────────────────────────
// PariLink Mobile — Trip Detail Screen
// Full trip control panel: start/end trip, load status, live map, actions.
// Starts GPS tracking on trip start. Stops on completion.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useCallback, useEffect, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  Alert, ActivityIndicator, Platform, useColorScheme,
} from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList, TripStatus, Load } from '../../types';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  fetchActiveTripThunk,
  updateTripStatusThunk,
  updateLoadStatusThunk,
  optimisticUpdateTripStatus,
  optimisticUpdateLoadStatus,
} from '../../store/slices/tripsSlice';
import { LocationService } from '../../services/location/LocationService';
import { LightTheme, DarkTheme, Typography, Spacing, Radius } from '../../theme';
import { TripStatusChip } from '../../components/trips/TripStatusChip';

interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList, 'TripDetail'>;
  route:      RouteProp<RootStackParamList, 'TripDetail'>;
}

const TRIP_STATUS_FLOW: Record<TripStatus, TripStatus | null> = {
  PLANNED:     'DISPATCHED',
  DISPATCHED:  'IN_PROGRESS',
  IN_PROGRESS: 'COMPLETED',
  COMPLETED:   null,
  CANCELLED:   null,
};

const STATUS_CTA: Record<TripStatus, string | null> = {
  PLANNED:     'Accept Trip',
  DISPATCHED:  '🚀  Start Trip',
  IN_PROGRESS: '✅  Complete Trip',
  COMPLETED:   null,
  CANCELLED:   null,
};

export function TripDetailScreen({ navigation, route }: Props) {
  const scheme   = useColorScheme();
  const theme    = scheme === 'dark' ? DarkTheme : LightTheme;
  const dispatch = useAppDispatch();

  const { tripId } = route.params;
  const activeTrip = useAppSelector((s) => s.trips.activeTrip);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    dispatch(fetchActiveTripThunk());
  }, [tripId]);

  // ── Trip Status Transition ───────────────────────────────────────────────────
  const handleStatusChange = useCallback(async () => {
    if (!activeTrip) {return;}

    const nextStatus = TRIP_STATUS_FLOW[activeTrip.status];
    if (!nextStatus) {return;}

    const ctaLabel = STATUS_CTA[activeTrip.status];
    Alert.alert(
      ctaLabel ?? 'Update Trip',
      `Change trip status to ${nextStatus.replace('_', ' ')}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          style: 'default',
          onPress: async () => {
            setIsUpdating(true);
            // Optimistic update
            dispatch(optimisticUpdateTripStatus(nextStatus));

            if (nextStatus === 'IN_PROGRESS') {
              LocationService.start(tripId);
            } else if (nextStatus === 'COMPLETED') {
              LocationService.stop();
            }

            await dispatch(updateTripStatusThunk({ tripId, status: nextStatus }));
            setIsUpdating(false);
          },
        },
      ],
    );
  }, [activeTrip, tripId, dispatch]);

  // ── Load Status Update ───────────────────────────────────────────────────────
  const handleLoadDelivered = useCallback((load: Load) => {
    Alert.alert(
      'Mark as Delivered',
      `Mark load ${load.loadNo} as DELIVERED?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delivered',
          style: 'default',
          onPress: async () => {
            dispatch(optimisticUpdateLoadStatus({ loadId: load.id, status: 'DELIVERED' }));
            await dispatch(updateLoadStatusThunk({ loadId: load.id, status: 'DELIVERED', tripId }));
          },
        },
      ],
    );
  }, [tripId, dispatch]);

  const styles = makeStyles(theme);

  if (!activeTrip) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={theme.primary} size="large" />
      </View>
    );
  }

  const cta = STATUS_CTA[activeTrip.status];

  return (
    <View style={styles.container}>
      {/* ── Map ─────────────────────────────────────────────────────────────── */}
      <MapView
        style={styles.map}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        customMapStyle={theme.mapStyle as object[]}
        showsUserLocation
        showsMyLocationButton
        initialRegion={{
          latitude:       20.5937,  // India center
          longitude:      78.9629,
          latitudeDelta:  10,
          longitudeDelta: 10,
        }}
      >
        {/* Markers would be placed here via real GPS coordinates */}
      </MapView>

      {/* ── Trip Info Panel ──────────────────────────────────────────────── */}
      <View style={styles.panel}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.panelHeader}>
            <View>
              <Text style={styles.tripNo}>{activeTrip.tripNo}</Text>
              <Text style={styles.vehicleNo}>{activeTrip.vehicle.regNo} · {activeTrip.vehicle.vehicleType}</Text>
            </View>
            <TripStatusChip status={activeTrip.status} />
          </View>

          {/* Loads */}
          <Text style={styles.sectionTitle}>Loads ({activeTrip.loads.length})</Text>
          {activeTrip.loads.map((load) => (
            <View key={load.id} style={styles.loadCard}>
              <View style={styles.loadHeader}>
                <Text style={styles.loadNo}>{load.loadNo}</Text>
                <View style={[styles.loadStatusBadge, load.status === 'DELIVERED' && styles.loadStatusDelivered]}>
                  <Text style={styles.loadStatusText}>{load.status}</Text>
                </View>
              </View>
              <Text style={styles.loadCustomer}>{load.customer.name}</Text>
              <View style={styles.loadRoute}>
                <Text style={styles.loadRouteText} numberOfLines={1}>{load.origin}</Text>
                <Text style={styles.loadRouteArrow}>→</Text>
                <Text style={styles.loadRouteText} numberOfLines={1}>{load.destination}</Text>
              </View>

              {load.status === 'IN_TRANSIT' && (
                <View style={styles.loadActions}>
                  <TouchableOpacity
                    style={styles.podBtn}
                    onPress={() => navigation.navigate('DocumentCamera', { type: 'POD', referenceId: load.id })}
                  >
                    <Text style={styles.podBtnText}>📷 Upload POD</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deliverBtn}
                    onPress={() => handleLoadDelivered(load)}
                  >
                    <Text style={styles.deliverBtnText}>✓ Delivered</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}

          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.actionChip}
              onPress={() => navigation.navigate('ExpenseForm', { tripId })}
            >
              <Text style={styles.actionChipText}>⛽ Log Expense</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionChip}
              onPress={() => navigation.navigate('Inspection', {
                vehicleId: activeTrip.vehicle.id,
                tripId,
                type: 'POST_TRIP',
              })}
            >
              <Text style={styles.actionChipText}>🔍 Inspection</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* ── CTA Button ───────────────────────────────────────────────── */}
        {cta && (
          <TouchableOpacity
            style={[styles.ctaBtn, isUpdating && styles.ctaBtnDisabled]}
            onPress={handleStatusChange}
            disabled={isUpdating}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel={cta}
          >
            {isUpdating
              ? <ActivityIndicator color="#FFF" size="small" />
              : <Text style={styles.ctaBtnText}>{cta}</Text>
            }
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
function makeStyles(theme: typeof LightTheme) {
  return StyleSheet.create({
    container:       { flex: 1, backgroundColor: theme.background },
    centered:        { flex: 1, justifyContent: 'center', alignItems: 'center' },
    map:             { flex: 1 },
    panel: {
      backgroundColor: theme.surface,
      borderTopLeftRadius:  Radius.xl,
      borderTopRightRadius: Radius.xl,
      padding:         Spacing.lg,
      maxHeight:       '55%',
      shadowColor:     '#000',
      shadowOffset:    { width: 0, height: -4 },
      shadowOpacity:   0.1,
      shadowRadius:    12,
      elevation:       12,
    },
    panelHeader:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.lg },
    tripNo:          { ...Typography.headingMD, color: theme.text },
    vehicleNo:       { ...Typography.bodyMD, color: theme.textSecondary, marginTop: 2 },
    sectionTitle:    { ...Typography.labelMD, color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: Spacing.sm },
    loadCard: {
      backgroundColor: theme.surfaceElevated,
      borderRadius:    Radius.md,
      padding:         Spacing.md,
      marginBottom:    Spacing.sm,
      borderWidth:     1,
      borderColor:     theme.border,
    },
    loadHeader:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.xs },
    loadNo:          { ...Typography.headingSM, color: theme.text },
    loadStatusBadge: { backgroundColor: theme.border, borderRadius: Radius.full, paddingHorizontal: 8, paddingVertical: 2 },
    loadStatusDelivered: { backgroundColor: '#DCFCE7' },
    loadStatusText:  { ...Typography.labelSM, color: theme.textSecondary },
    loadCustomer:    { ...Typography.bodyMD, color: theme.textSecondary, marginBottom: Spacing.xs },
    loadRoute:       { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
    loadRouteText:   { ...Typography.bodySM, color: theme.text, flex: 1 },
    loadRouteArrow:  { ...Typography.bodySM, color: theme.textSecondary },
    loadActions:     { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm },
    podBtn: {
      flex: 1, paddingVertical: 8, borderRadius: Radius.sm,
      borderWidth: 1.5, borderColor: theme.primary, alignItems: 'center',
    },
    podBtnText:      { ...Typography.labelMD, color: theme.primary },
    deliverBtn: {
      flex: 1, paddingVertical: 8, borderRadius: Radius.sm,
      backgroundColor: theme.success, alignItems: 'center',
    },
    deliverBtnText:  { ...Typography.labelMD, color: '#FFF' },
    quickActions:    { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm, marginBottom: Spacing.md },
    actionChip: {
      paddingHorizontal: Spacing.md, paddingVertical: 8,
      backgroundColor: theme.primaryLight, borderRadius: Radius.full,
    },
    actionChipText:  { ...Typography.labelMD, color: theme.primary },
    ctaBtn: {
      backgroundColor:  theme.primary,
      borderRadius:     Radius.md,
      paddingVertical:  16,
      alignItems:       'center',
      marginTop:        Spacing.sm,
      shadowColor:      theme.primary,
      shadowOffset:     { width: 0, height: 4 },
      shadowOpacity:    0.4,
      shadowRadius:     8,
      elevation:        6,
    },
    ctaBtnDisabled:  { opacity: 0.6 },
    ctaBtnText:      { ...Typography.labelLG, color: '#FFF', fontSize: 16 },
  });
}
