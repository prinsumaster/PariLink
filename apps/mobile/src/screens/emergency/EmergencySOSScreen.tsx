// ─────────────────────────────────────────────────────────────────────────────
// PariLink Mobile — Emergency SOS Screen
// One-tap emergency alert to dispatcher with live GPS coordinates.
// Sends SMS/Push notification to fleet manager with driver location.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated,
  Alert, ActivityIndicator, useColorScheme, Vibration,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types';
import { useAppSelector } from '../../store';
import { LightTheme, DarkTheme, Typography, Spacing, Radius } from '../../theme';
import apiClient from '../../services/api/client';

interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList, 'EmergencySOS'>;
}

const SOS_HOLD_MS = 2000; // 2-second press to confirm SOS

export function EmergencySOSScreen({ navigation }: Props) {
  const scheme = useColorScheme();
  const theme  = scheme === 'dark' ? DarkTheme : LightTheme;
  const user   = useAppSelector((s) => s.auth.user);

  const [isSending,   setIsSending]   = useState(false);
  const [sosSent,     setSosSent]     = useState(false);
  const [coords,      setCoords]      = useState<{ lat: number; lng: number } | null>(null);
  const [holdProgress, setHoldProgress] = useState(0);

  const pulseAnim  = useRef(new Animated.Value(1)).current;
  const holdTimer  = useRef<ReturnType<typeof setInterval> | null>(null);
  const holdStart  = useRef<number | null>(null);

  // ── Get location on mount ────────────────────────────────────────────────────
  useEffect(() => {
    Geolocation.getCurrentPosition(
      (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {},
      { enableHighAccuracy: true, timeout: 5000 },
    );
  }, []);

  // ── Pulse animation ─────────────────────────────────────────────────────────
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.15, duration: 700, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1.00, duration: 700, useNativeDriver: true }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  // ── Press-and-hold SOS logic ─────────────────────────────────────────────────
  const onPressIn = useCallback(() => {
    Vibration.vibrate(50);
    holdStart.current = Date.now();
    holdTimer.current = setInterval(() => {
      const elapsed = Date.now() - (holdStart.current ?? Date.now());
      const progress = Math.min(elapsed / SOS_HOLD_MS, 1);
      setHoldProgress(progress);
      if (progress >= 1) {
        if (holdTimer.current) {clearInterval(holdTimer.current);}
        sendSOS();
      }
    }, 50);
  }, [coords]);

  const onPressOut = useCallback(() => {
    if (holdTimer.current) {clearInterval(holdTimer.current);}
    setHoldProgress(0);
  }, []);

  const sendSOS = useCallback(async () => {
    Vibration.vibrate([100, 50, 100, 50, 200]);
    setIsSending(true);
    try {
      await apiClient.post('/mobile/sos', {
        driverId:  user?.driverId,
        latitude:  coords?.lat,
        longitude: coords?.lng,
        message:   'DRIVER SOS — Immediate assistance required',
        timestamp: new Date().toISOString(),
      });
      setSosSent(true);
    } catch {
      Alert.alert(
        'SOS Sending Failed',
        'Call your dispatcher immediately: 1800-PARILINK',
      );
    } finally {
      setIsSending(false);
    }
  }, [coords, user]);

  const styles = makeStyles(theme);

  if (sosSent) {
    return (
      <View style={styles.container}>
        <View style={styles.successContainer}>
          <Text style={styles.successIcon}>✅</Text>
          <Text style={styles.successTitle}>SOS Alert Sent!</Text>
          <Text style={styles.successBody}>
            Your dispatcher and fleet manager have been notified of your location and emergency.
          </Text>
          {coords && (
            <Text style={styles.coordsText}>
              📍 {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
            </Text>
          )}
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backBtnText}>Return to Dashboard</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.heading}>Emergency SOS</Text>
        <Text style={styles.instructions}>
          Press and hold the button for 2 seconds to send an SOS alert to your dispatcher.
        </Text>

        {/* ── SOS Button ───────────────────────────────────────────────────── */}
        <View style={styles.sosWrapper}>
          {/* Outer pulse ring */}
          <Animated.View style={[styles.sosRing, { transform: [{ scale: pulseAnim }] }]} />
          {/* Hold progress arc (visual feedback) */}
          <View style={[styles.sosProgressRing, { opacity: holdProgress > 0 ? 1 : 0 }]} />

          <TouchableOpacity
            style={styles.sosButton}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            disabled={isSending}
            activeOpacity={0.9}
            accessibilityRole="button"
            accessibilityLabel="Emergency SOS — press and hold for 2 seconds"
          >
            {isSending
              ? <ActivityIndicator color="#FFF" size="large" />
              : (
                <>
                  <Text style={styles.sosText}>SOS</Text>
                  <Text style={styles.sosSubtext}>Hold 2s</Text>
                </>
              )
            }
          </TouchableOpacity>
        </View>

        {/* Hold progress */}
        {holdProgress > 0 && (
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${holdProgress * 100}%` }]} />
          </View>
        )}

        {coords && (
          <Text style={styles.locationText}>
            📍 Location acquired: {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
          </Text>
        )}

        <Text style={styles.emergencyNumber}>
          Emergency Helpline: 1800-PARILINK
        </Text>

        <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
function makeStyles(_theme: typeof LightTheme) {
  return StyleSheet.create({
    container:       { flex: 1, backgroundColor: '#1A0000' },
    inner: {
      flex: 1, justifyContent: 'center', alignItems: 'center',
      padding: Spacing.xl,
    },
    heading:         { ...Typography.displayMD, color: '#FFF', marginBottom: Spacing.md, textAlign: 'center' },
    instructions:    { ...Typography.bodyMD, color: 'rgba(255,255,255,0.7)', textAlign: 'center', marginBottom: Spacing.xxxl },
    sosWrapper:      { position: 'relative', width: 200, height: 200, justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.xl },
    sosRing: {
      position:        'absolute',
      width:           200,
      height:          200,
      borderRadius:    100,
      backgroundColor: 'rgba(239,68,68,0.2)',
    },
    sosProgressRing: {
      position:     'absolute',
      width:         200,
      height:        200,
      borderRadius:  100,
      borderWidth:   4,
      borderColor:   '#FFF',
    },
    sosButton: {
      width:           160,
      height:          160,
      borderRadius:    80,
      backgroundColor: '#DC2626',
      justifyContent:  'center',
      alignItems:      'center',
      shadowColor:     '#DC2626',
      shadowOffset:    { width: 0, height: 0 },
      shadowOpacity:   0.8,
      shadowRadius:    24,
      elevation:       20,
    },
    sosText:         { ...Typography.displayMD, color: '#FFF', fontWeight: '900' },
    sosSubtext:      { ...Typography.bodyMD, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
    progressBarContainer: {
      width: '80%', height: 4, backgroundColor: 'rgba(255,255,255,0.2)',
      borderRadius: 2, marginBottom: Spacing.lg, overflow: 'hidden',
    },
    progressBar:     { height: '100%', backgroundColor: '#FFF', borderRadius: 2 },
    locationText:    { ...Typography.bodyMD, color: 'rgba(255,255,255,0.6)', marginBottom: Spacing.md, textAlign: 'center' },
    emergencyNumber: { ...Typography.headingSM, color: '#FCA5A5', marginBottom: Spacing.xl, textAlign: 'center' },
    cancelBtn:       { paddingVertical: Spacing.md, paddingHorizontal: Spacing.xl },
    cancelText:      { ...Typography.labelLG, color: 'rgba(255,255,255,0.5)' },

    // Success state
    successContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl },
    successIcon:      { fontSize: 64, marginBottom: Spacing.md },
    successTitle:     { ...Typography.displayMD, color: '#FFF', marginBottom: Spacing.md },
    successBody:      { ...Typography.bodyLG, color: 'rgba(255,255,255,0.7)', textAlign: 'center', marginBottom: Spacing.lg },
    coordsText:       { ...Typography.bodyMD, color: 'rgba(255,255,255,0.5)', marginBottom: Spacing.xl },
    backBtn: {
      paddingVertical: 14, paddingHorizontal: Spacing.xl,
      backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: Radius.md,
      borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
    },
    backBtnText:      { ...Typography.labelLG, color: '#FFF' },
  });
}
