// ─────────────────────────────────────────────────────────────────────────────
// PariLink Mobile — Offline Banner Component
// Shows when the device is offline, with pending queue count.
// ─────────────────────────────────────────────────────────────────────────────
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Spacing, Radius } from '../../theme';

interface Props {
  queueCount: number;
}

export function OfflineBanner({ queueCount }: Props) {
  return (
    <View style={styles.banner}>
      <Text style={styles.icon}>📴</Text>
      <View style={styles.textGroup}>
        <Text style={styles.title}>You are offline</Text>
        <Text style={styles.subtitle}>
          {queueCount > 0
            ? `${queueCount} action${queueCount !== 1 ? 's' : ''} will sync when connected`
            : 'Actions will be queued until you reconnect'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection:   'row',
    alignItems:      'center',
    backgroundColor: '#FEF3C7',
    borderRadius:    Radius.md,
    padding:         Spacing.md,
    marginBottom:    Spacing.md,
    borderWidth:     1,
    borderColor:     '#FDE68A',
    gap:             Spacing.sm,
  },
  icon:      { fontSize: 20 },
  textGroup: { flex: 1 },
  title:     { ...Typography.labelMD, color: '#92400E' },
  subtitle:  { ...Typography.caption, color: '#B45309' },
});
