import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  useColorScheme
} from 'react-native';
import { DriverAPI } from '../../services/api/client';
import { useAppSelector } from '../../store';
import { LightTheme, DarkTheme } from '../../theme';

export function LorryReceiptsScreen() {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? DarkTheme : LightTheme;
  const driverId = useAppSelector((state) => state.auth.user?.driverId);

  const [receipts, setReceipts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchReceipts = async () => {
    if (!driverId) {
      setLoading(false);
      return;
    }
    try {
      const response = await DriverAPI.getLorryReceipts(driverId);
      setReceipts(response.data.data || response.data || []);
    } catch (error) {
      console.error('Failed to fetch Lorry Receipts:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchReceipts();
  }, [driverId]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchReceipts();
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={styles.header}>
        <Text style={[styles.lrNo, { color: theme.text }]}>LR No: {item.lrNumber}</Text>
        <Text style={[styles.status, { color: theme.primary }]}>{item.status}</Text>
      </View>
      <View style={styles.body}>
        <Text style={[styles.label, { color: theme.textSecondary }]}>Trip: <Text style={{ color: theme.text }}>{item.tripId}</Text></Text>
        <Text style={[styles.label, { color: theme.textSecondary }]}>Origin: <Text style={{ color: theme.text }}>{item.origin || 'N/A'}</Text></Text>
        <Text style={[styles.label, { color: theme.textSecondary }]}>Destination: <Text style={{ color: theme.text }}>{item.destination || 'N/A'}</Text></Text>
        {item.freightAmount && (
          <Text style={[styles.label, { color: theme.textSecondary }]}>Freight: <Text style={{ color: theme.text }}>₹{item.freightAmount}</Text></Text>
        )}
      </View>
      <TouchableOpacity 
        style={[styles.button, { backgroundColor: theme.primary }]}
        onPress={() => console.log('View PDF', item.pdfUrl)}
      >
        <Text style={styles.buttonText}>View PDF</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  if (!driverId) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text }}>No Driver Profile Found</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={receipts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} />
        }
        ListEmptyComponent={
          <Text style={[styles.empty, { color: theme.textSecondary }]}>No Lorry Receipts found.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  lrNo: { fontSize: 16, fontWeight: '700' },
  status: { fontSize: 14, fontWeight: '600', textTransform: 'uppercase' },
  body: { marginBottom: 12 },
  label: { fontSize: 14, marginBottom: 4 },
  button: {
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: { color: '#FFF', fontWeight: '600' },
  empty: { textAlign: 'center', marginTop: 32, fontSize: 16 },
});
