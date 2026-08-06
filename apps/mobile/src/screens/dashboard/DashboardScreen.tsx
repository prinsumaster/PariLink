// ─────────────────────────────────────────────────────────────────────────────
// PariLink Mobile — Driver Dashboard Screen
// Shows: Active trip card, earnings summary, today's tasks, offline banner.
// Real-time refresh (30s interval). Offline-aware. Dark/Light theme.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  useColorScheme,
  Animated,
} from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import type { RootStackParamList } from '../../types';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchActiveTripThunk } from '../../store/slices/tripsSlice';
import { fetchNotificationsThunk } from '../../store/slices/notificationsSlice';
import { OfflineQueue } from '../../offline/OfflineQueue';
import { setPendingQueueCount } from '../../store/slices/uiSlice';
import { LightTheme, DarkTheme, Typography, Spacing, Radius } from '../../theme';
import { TripStatusChip } from '../../components/trips/TripStatusChip';
import { OfflineBanner } from '../../components/common/OfflineBanner';

interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList, 'MainTabs'>;
}

const REFRESH_INTERVAL_MS = 30_000;

export function DashboardScreen({ navigation }: Props) {
  const scheme   = useColorScheme();
  const theme    = scheme === 'dark' ? DarkTheme : LightTheme;
  const dispatch = useAppDispatch();

  const user              = useAppSelector((s) => s.auth.user);
  const activeTrip        = useAppSelector((s) => s.trips.activeTrip);
  const isOnline          = useAppSelector((s) => s.offline.isOnline);
  const pendingQueueCount = useAppSelector((s) => s.ui.pendingQueueCount);
  const unreadCount       = useAppSelector((s) => s.notifications.unreadCount);

  const [refreshing, setRefreshing] = useState(false);
  const pulseAnim  = useRef(new Animated.Value(1)).current;
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Pulse animation for active trip indicator ────────────────────────────────
  useEffect(() => {
    if (activeTrip?.status === 'IN_PROGRESS') {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.1, duration: 800, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1.0, duration: 800, useNativeDriver: true }),
        ]),
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [activeTrip?.status]);

  // ── Data refresh ─────────────────────────────────────────────────────────────
  const refresh = useCallback(async () => {
    await Promise.all([
      dispatch(fetchActiveTripThunk()),
      dispatch(fetchNotificationsThunk()),
    ]);
    const count = await OfflineQueue.count();
    dispatch(setPendingQueueCount(count));
  }, [dispatch]);

  useFocusEffect(useCallback(() => {
    refresh();
    intervalRef.current = setInterval(refresh, REFRESH_INTERVAL_MS);
    return () => {
      if (intervalRef.current) {clearInterval(intervalRef.current);}
    };
  }, [refresh]));

  const onRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  const styles = makeStyles(theme);

  // ── Greeting ─────────────────────────────────────────────────────────────────
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} />}
    >
      {/* ── Offline Banner ─────────────────────────────────────────────────── */}
      {!isOnline && <OfflineBanner queueCount={pendingQueueCount} />}

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{greeting} 👋</Text>
          <Text style={styles.driverName}>{user?.name ?? 'Driver'}</Text>
        </View>
        <TouchableOpacity
          style={styles.notifButton}
          onPress={() => navigation.navigate('Notifications')}
          accessibilityLabel={`Notifications — ${unreadCount} unread`}
        >
          <Text style={styles.notifIcon}>🔔</Text>
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {unreadCount > 9 ? '9+' : String(unreadCount)}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* ── Active Trip Card ──────────────────────────────────────────────── */}
      {activeTrip ? (
        <TouchableOpacity
          style={styles.activeTripCard}
          onPress={() => navigation.navigate('TripDetail', { tripId: activeTrip.id })}
          activeOpacity={0.92}
          accessibilityRole="button"
          accessibilityLabel={`Active trip ${activeTrip.tripNo} — tap to view details`}
        >
          <View style={styles.activeTripHeader}>
            <View>
              <Text style={styles.activeTripLabel}>ACTIVE TRIP</Text>
              <Text style={styles.activeTripNo}>{activeTrip.tripNo}</Text>
            </View>
            <Animated.View style={[styles.liveDot, { transform: [{ scale: pulseAnim }] }]} />
          </View>

          <View style={styles.routeRow}>
            <View style={styles.routePoint}>
              <View style={[styles.dot, { backgroundColor: theme.primary }]} />
              <Text style={styles.routeText} numberOfLines={1}>
                {activeTrip.loads[0]?.origin ?? '—'}
              </Text>
            </View>
            <View style={styles.routeLine} />
            <View style={styles.routePoint}>
              <View style={[styles.dot, { backgroundColor: theme.success }]} />
              <Text style={styles.routeText} numberOfLines={1}>
                {activeTrip.loads[activeTrip.loads.length - 1]?.destination ?? '—'}
              </Text>
            </View>
          </View>

          <View style={styles.activeTripFooter}>
            <TripStatusChip status={activeTrip.status} />
            <Text style={styles.vehicleText}>{activeTrip.vehicle.regNo}</Text>
          </View>
        </TouchableOpacity>
      ) : (
        <View style={styles.noTripCard}>
          <Text style={styles.noTripIcon}>🚛</Text>
          <Text style={styles.noTripTitle}>No Active Trip</Text>
          <Text style={styles.noTripSubtitle}>
            Your dispatcher will assign your next trip here.
          </Text>
        </View>
      )}

      {/* ── Today's Summary ───────────────────────────────────────────────── */}
      <Text style={styles.sectionTitle}>Today's Summary</Text>
      <View style={styles.statsRow}>
        <StatCard theme={theme} icon="📦" label="Loads" value={String(activeTrip?.loads.length ?? 0)} />
        <StatCard theme={theme} icon="📍" label="Status" value={activeTrip?.status ?? 'Idle'} />
        <StatCard theme={theme} icon="🚗" label="Vehicle" value={activeTrip?.vehicle.vehicleType ?? '—'} />
      </View>

      {/* ── Quick Actions ─────────────────────────────────────────────────── */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.actionsGrid}>
        <QuickAction
          theme={theme}
          icon="📷"
          label="Upload POD"
          onPress={() => activeTrip && navigation.navigate('DocumentCamera', {
            type: 'POD',
            referenceId: activeTrip.loads[0]?.id ?? '',
          })}
        />
        <QuickAction
          theme={theme}
          icon="⛽"
          label="Log Fuel"
          onPress={() => activeTrip && navigation.navigate('ExpenseForm', {
            tripId: activeTrip.id,
            prefillCategory: 'FUEL',
          })}
        />
        <QuickAction
          theme={theme}
          icon="🔍"
          label="Inspection"
          onPress={() => activeTrip && navigation.navigate('Inspection', {
            vehicleId: activeTrip.vehicle.id,
            tripId:    activeTrip.id,
            type:      'PRE_TRIP',
          })}
        />
        <QuickAction
          theme={theme}
          icon="🆘"
          label="SOS"
          onPress={() => navigation.navigate('EmergencySOS')}
          danger
        />
      </View>

      {/* ── Offline Queue Indicator ─────────────────────────────────────── */}
      {pendingQueueCount > 0 && (
        <View style={styles.queueCard}>
          <Text style={styles.queueIcon}>⏳</Text>
          <View>
            <Text style={styles.queueTitle}>{pendingQueueCount} actions pending sync</Text>
            <Text style={styles.queueSubtitle}>Will upload when connection is restored</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ theme, icon, label, value }: {
  theme: typeof LightTheme;
  icon: string;
  label: string;
  value: string;
}) {
  const styles = makeStyles(theme);
  return (
    <View style={styles.statCard}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={styles.statValue} numberOfLines={1}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function QuickAction({ theme, icon, label, onPress, danger }: {
  theme: typeof LightTheme;
  icon: string;
  label: string;
  onPress: () => void;
  danger?: boolean;
}) {
  const styles = makeStyles(theme);
  return (
    <TouchableOpacity
      style={[styles.quickAction, danger && styles.quickActionDanger]}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Text style={styles.quickActionIcon}>{icon}</Text>
      <Text style={[styles.quickActionLabel, danger && styles.quickActionLabelDanger]}>{label}</Text>
    </TouchableOpacity>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
function makeStyles(theme: typeof LightTheme) {
  return StyleSheet.create({
    container:         { flex: 1, backgroundColor: theme.background },
    content:           { padding: Spacing.md, paddingBottom: Spacing.xxxl },
    header:            { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.lg },
    greeting:          { ...Typography.bodyMD, color: theme.textSecondary },
    driverName:        { ...Typography.headingLG, color: theme.text },
    notifButton:       { position: 'relative', padding: Spacing.sm },
    notifIcon:         { fontSize: 24 },
    badge: {
      position: 'absolute', top: 2, right: 2,
      backgroundColor: theme.danger, borderRadius: Radius.full,
      minWidth: 18, height: 18, justifyContent: 'center', alignItems: 'center',
      paddingHorizontal: 3,
    },
    badgeText:         { ...Typography.labelSM, color: '#FFF', fontSize: 10 },

    // Active Trip
    activeTripCard: {
      backgroundColor: theme.primary,
      borderRadius:    Radius.xl,
      padding:         Spacing.lg,
      marginBottom:    Spacing.lg,
      shadowColor:     theme.primary,
      shadowOffset:    { width: 0, height: 8 },
      shadowOpacity:   0.4,
      shadowRadius:    16,
      elevation:       10,
    },
    activeTripHeader:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.md },
    activeTripLabel:   { ...Typography.labelSM, color: 'rgba(255,255,255,0.7)', letterSpacing: 1 },
    activeTripNo:      { ...Typography.headingMD, color: '#FFF' },
    liveDot:           { width: 12, height: 12, borderRadius: 6, backgroundColor: '#4ADE80', marginTop: 6 },
    routeRow:          { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.md },
    routePoint:        { flexDirection: 'row', alignItems: 'center', flex: 1 },
    dot:               { width: 8, height: 8, borderRadius: 4, marginRight: Spacing.xs },
    routeText:         { ...Typography.bodySM, color: '#FFF', flex: 1 },
    routeLine:         { width: 20, height: 1, backgroundColor: 'rgba(255,255,255,0.3)', marginHorizontal: Spacing.xs },
    activeTripFooter:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    vehicleText:       { ...Typography.labelMD, color: 'rgba(255,255,255,0.8)' },

    // No Trip
    noTripCard: {
      backgroundColor: theme.surface, borderRadius: Radius.xl,
      padding: Spacing.xl, marginBottom: Spacing.lg,
      alignItems: 'center',
      borderWidth: 1.5, borderColor: theme.border, borderStyle: 'dashed',
    },
    noTripIcon:        { fontSize: 48, marginBottom: Spacing.sm },
    noTripTitle:       { ...Typography.headingMD, color: theme.text, marginBottom: Spacing.xs },
    noTripSubtitle:    { ...Typography.bodyMD, color: theme.textSecondary, textAlign: 'center' },

    // Section
    sectionTitle:      { ...Typography.headingSM, color: theme.text, marginBottom: Spacing.sm, marginTop: Spacing.md },

    // Stats
    statsRow:          { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.md },
    statCard: {
      flex: 1, backgroundColor: theme.surface, borderRadius: Radius.lg,
      padding: Spacing.md, alignItems: 'center',
      borderWidth: 1, borderColor: theme.border,
    },
    statIcon:          { fontSize: 24, marginBottom: Spacing.xs },
    statValue:         { ...Typography.headingSM, color: theme.text, marginBottom: 2 },
    statLabel:         { ...Typography.caption, color: theme.textSecondary, textAlign: 'center' },

    // Quick Actions
    actionsGrid:       { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.md },
    quickAction: {
      width: '47%', backgroundColor: theme.surface, borderRadius: Radius.lg,
      padding: Spacing.md, alignItems: 'center',
      borderWidth: 1, borderColor: theme.border,
    },
    quickActionDanger:      { borderColor: theme.danger, backgroundColor: '#FFF1F2' },
    quickActionIcon:        { fontSize: 28, marginBottom: Spacing.xs },
    quickActionLabel:       { ...Typography.labelMD, color: theme.text },
    quickActionLabelDanger: { color: theme.danger },

    // Queue
    queueCard: {
      flexDirection: 'row', alignItems: 'center',
      backgroundColor: '#FEF3C7', borderRadius: Radius.lg,
      padding: Spacing.md, gap: Spacing.md,
      borderWidth: 1, borderColor: '#FDE68A',
    },
    queueIcon:         { fontSize: 24 },
    queueTitle:        { ...Typography.labelMD, color: '#92400E' },
    queueSubtitle:     { ...Typography.caption, color: '#B45309' },
  });
}
