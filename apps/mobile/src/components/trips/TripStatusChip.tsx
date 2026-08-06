// ─────────────────────────────────────────────────────────────────────────────
// PariLink Mobile — TripStatusChip Component
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { LightTheme, DarkTheme, Radius, Spacing } from '../../theme';
import type { TripStatus } from '../../types';

export function TripStatusChip({ status }: { status: TripStatus }) {
  const scheme = useColorScheme();
  const theme  = scheme === 'dark' ? DarkTheme : LightTheme;

  const chipKey = status === 'IN_PROGRESS' ? 'inProgress'
                : status === 'DISPATCHED'  ? 'dispatched'
                : status === 'COMPLETED'   ? 'completed'
                : status === 'CANCELLED'   ? 'cancelled'
                : 'dispatched';

  const { bg, text } = theme.chip[chipKey as keyof typeof theme.chip] ?? theme.chip.dispatched;
  const label = status === 'IN_PROGRESS' ? 'In Progress' : status.charAt(0) + status.slice(1).toLowerCase();

  return (
    <View style={[styles.chip, { backgroundColor: bg }]}>
      <Text style={[styles.chipText, { color: text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip:     { paddingHorizontal: Spacing.sm, paddingVertical: 3, borderRadius: Radius.full },
  chipText: { fontWeight: '700', fontSize: 11, letterSpacing: 0.3 },
});
