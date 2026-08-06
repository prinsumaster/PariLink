// ─────────────────────────────────────────────────────────────────────────────
// PariLink Mobile — Document Camera Screen
// Full-screen camera capture for POD, Fuel, Toll, and Expense receipts.
// After capture: runs on-device OCR, shows preview, uploads to backend.
// Supports gallery selection as fallback.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useCallback, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image, ScrollView,
  ActivityIndicator, Alert, useColorScheme,
} from 'react-native';
import { launchCamera, launchImageLibrary, Asset } from 'react-native-image-picker';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList, DocumentType } from '../../types';
import { MobileAPI } from '../../services/api/client';
import { OcrService, OcrResult } from '../../services/ocr/OcrService';
import { OfflineQueue } from '../../offline/OfflineQueue';
import { useAppDispatch } from '../../store';
import { showToast } from '../../store/slices/uiSlice';
import { LightTheme, DarkTheme, Typography, Spacing, Radius } from '../../theme';
import NetInfo from '@react-native-community/netinfo';

interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList, 'DocumentCamera'>;
  route:      RouteProp<RootStackParamList, 'DocumentCamera'>;
}

const DOC_LABELS: Record<DocumentType, string> = {
  POD:       'Proof of Delivery',
  SIGNATURE: 'Signature',
  FUEL:      'Fuel Receipt',
  EXPENSE:   'Expense Receipt',
  TOLL:      'Toll Receipt',
  INVOICE:   'Invoice',
};

const DOC_ICONS: Record<DocumentType, string> = {
  POD:       '📦',
  SIGNATURE: '✍️',
  FUEL:      '⛽',
  EXPENSE:   '🧾',
  TOLL:      '🛣️',
  INVOICE:   '📄',
};

export function DocumentCameraScreen({ navigation, route }: Props) {
  const scheme = useColorScheme();
  const theme  = scheme === 'dark' ? DarkTheme : LightTheme;
  const dispatch = useAppDispatch();

  const { type, referenceId } = route.params;

  const [capturedAsset, setCapturedAsset] = useState<Asset | null>(null);
  const [ocrResult,     setOcrResult]     = useState<OcrResult | null>(null);
  const [isUploading,   setIsUploading]   = useState(false);
  const [isProcessing,  setIsProcessing]  = useState(false);

  const processAndSetImage = useCallback(async (asset: Asset) => {
    setCapturedAsset(asset);
    setOcrResult(null);

    // Run OCR for receipt-type documents
    if (['FUEL', 'TOLL', 'EXPENSE', 'INVOICE'].includes(type) && asset.uri) {
      setIsProcessing(true);
      const result = await OcrService.recognise(asset.uri);
      setOcrResult(result);
      setIsProcessing(false);
    }
  }, [type]);

  const handleCamera = useCallback(async () => {
    const result = await launchCamera({
      mediaType: 'photo',
      quality:   0.85,
      saveToPhotos: false,
    });
    if (result.assets?.[0]) {
      await processAndSetImage(result.assets[0]);
    }
  }, [processAndSetImage]);

  const handleGallery = useCallback(async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality:   0.85,
    });
    if (result.assets?.[0]) {
      await processAndSetImage(result.assets[0]);
    }
  }, [processAndSetImage]);

  const handleUpload = useCallback(async () => {
    if (!capturedAsset?.uri) {return;}
    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', {
      uri:  capturedAsset.uri,
      name: capturedAsset.fileName ?? `${type}_${Date.now()}.jpg`,
      type: capturedAsset.type ?? 'image/jpeg',
    } as unknown as Blob);
    formData.append('referenceId', referenceId);

    const netState = await NetInfo.fetch();

    if (!netState.isConnected) {
      await OfflineQueue.enqueue({
        action:    'UPLOAD_DOCUMENT',
        payload:   {
          type,
          referenceId,
          fileUri:  capturedAsset.uri,
          mimeType: capturedAsset.type ?? 'image/jpeg',
          fileName: capturedAsset.fileName ?? `${type}_${Date.now()}.jpg`,
        },
        timestamp: new Date().toISOString(),
      });
      dispatch(showToast({ type: 'info', text: 'Document queued — will upload when online' }));
      navigation.goBack();
      return;
    }

    try {
      await MobileAPI.uploadDocument(type, referenceId, formData);
      dispatch(showToast({ type: 'success', text: `${DOC_LABELS[type]} uploaded successfully` }));
      navigation.goBack();
    } catch {
      Alert.alert('Upload Failed', 'Please try again or check your connection.');
    } finally {
      setIsUploading(false);
    }
  }, [capturedAsset, type, referenceId, navigation, dispatch]);

  const styles = makeStyles(theme);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* ── Header ────────────────────────────────────────────────────────── */}
        <View style={styles.header}>
          <Text style={styles.docIcon}>{DOC_ICONS[type]}</Text>
          <Text style={styles.title}>{DOC_LABELS[type]}</Text>
          <Text style={styles.subtitle}>
            {capturedAsset ? 'Review and upload document' : 'Capture or select a photo'}
          </Text>
        </View>

        {/* ── Preview / Placeholder ─────────────────────────────────────────── */}
        {capturedAsset?.uri ? (
          <View style={styles.previewContainer}>
            <Image
              source={{ uri: capturedAsset.uri }}
              style={styles.preview}
              resizeMode="cover"
            />
          </View>
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderIcon}>📷</Text>
            <Text style={styles.placeholderText}>No image captured</Text>
          </View>
        )}

        {/* ── OCR Results ───────────────────────────────────────────────────── */}
        {isProcessing && (
          <View style={styles.ocrCard}>
            <ActivityIndicator color={theme.primary} />
            <Text style={styles.ocrProcessingText}>Scanning document…</Text>
          </View>
        )}

        {ocrResult && !isProcessing && ocrResult.confidence > 0 && (
          <View style={styles.ocrCard}>
            <Text style={styles.ocrTitle}>✨ Extracted Information</Text>
            {ocrResult.extracted.amount !== undefined && (
              <View style={styles.ocrRow}>
                <Text style={styles.ocrLabel}>Amount</Text>
                <Text style={styles.ocrValue}>₹{ocrResult.extracted.amount.toLocaleString('en-IN')}</Text>
              </View>
            )}
            {ocrResult.extracted.date && (
              <View style={styles.ocrRow}>
                <Text style={styles.ocrLabel}>Date</Text>
                <Text style={styles.ocrValue}>{ocrResult.extracted.date}</Text>
              </View>
            )}
            {ocrResult.extracted.fuelLitres && (
              <View style={styles.ocrRow}>
                <Text style={styles.ocrLabel}>Fuel (Litres)</Text>
                <Text style={styles.ocrValue}>{ocrResult.extracted.fuelLitres}L</Text>
              </View>
            )}
            {ocrResult.extracted.invoiceNo && (
              <View style={styles.ocrRow}>
                <Text style={styles.ocrLabel}>Invoice No.</Text>
                <Text style={styles.ocrValue}>{ocrResult.extracted.invoiceNo}</Text>
              </View>
            )}
          </View>
        )}

        {/* ── Actions ───────────────────────────────────────────────────────── */}
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.cameraBtn}
            onPress={handleCamera}
            accessibilityRole="button"
            accessibilityLabel="Open camera"
          >
            <Text style={styles.cameraBtnText}>📷  Take Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.galleryBtn}
            onPress={handleGallery}
            accessibilityRole="button"
            accessibilityLabel="Select from gallery"
          >
            <Text style={styles.galleryBtnText}>🖼  Select from Gallery</Text>
          </TouchableOpacity>
        </View>

        {capturedAsset && (
          <TouchableOpacity
            style={[styles.uploadBtn, isUploading && styles.uploadBtnDisabled]}
            onPress={handleUpload}
            disabled={isUploading}
            accessibilityRole="button"
            accessibilityLabel="Upload document"
          >
            {isUploading
              ? <ActivityIndicator color="#FFF" />
              : <Text style={styles.uploadBtnText}>⬆️  Upload {DOC_LABELS[type]}</Text>
            }
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
function makeStyles(theme: typeof LightTheme) {
  return StyleSheet.create({
    container:          { flex: 1, backgroundColor: theme.background },
    content:            { padding: Spacing.lg, paddingBottom: Spacing.xxxl },
    header:             { alignItems: 'center', marginBottom: Spacing.lg },
    docIcon:            { fontSize: 48, marginBottom: Spacing.sm },
    title:              { ...Typography.headingLG, color: theme.text, marginBottom: Spacing.xs },
    subtitle:           { ...Typography.bodyMD, color: theme.textSecondary, textAlign: 'center' },
    previewContainer:   { borderRadius: Radius.lg, overflow: 'hidden', marginBottom: Spacing.md, aspectRatio: 4 / 3 },
    preview:            { width: '100%', height: '100%' },
    placeholder: {
      height:          240,
      backgroundColor: theme.surface,
      borderRadius:    Radius.lg,
      borderWidth:     2,
      borderColor:     theme.border,
      borderStyle:     'dashed',
      justifyContent:  'center',
      alignItems:      'center',
      marginBottom:    Spacing.md,
    },
    placeholderIcon:    { fontSize: 40, marginBottom: Spacing.sm },
    placeholderText:    { ...Typography.bodyMD, color: theme.textTertiary },
    ocrCard: {
      backgroundColor: theme.surface,
      borderRadius:    Radius.lg,
      padding:         Spacing.md,
      marginBottom:    Spacing.md,
      borderWidth:     1,
      borderColor:     theme.border,
      gap:             Spacing.xs,
    },
    ocrTitle:           { ...Typography.headingSM, color: theme.primary, marginBottom: Spacing.sm },
    ocrProcessingText:  { ...Typography.bodyMD, color: theme.textSecondary, marginLeft: Spacing.sm },
    ocrRow:             { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: Spacing.xs, borderBottomWidth: 1, borderBottomColor: theme.divider },
    ocrLabel:           { ...Typography.bodyMD, color: theme.textSecondary },
    ocrValue:           { ...Typography.labelMD, color: theme.text },
    buttonGroup:        { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.md },
    cameraBtn: {
      flex: 1, paddingVertical: 14, borderRadius: Radius.md,
      backgroundColor: theme.primary, alignItems: 'center',
    },
    cameraBtnText:      { ...Typography.labelMD, color: '#FFF', fontSize: 14 },
    galleryBtn: {
      flex: 1, paddingVertical: 14, borderRadius: Radius.md,
      borderWidth: 1.5, borderColor: theme.border, alignItems: 'center',
    },
    galleryBtnText:     { ...Typography.labelMD, color: theme.text, fontSize: 14 },
    uploadBtn: {
      backgroundColor:  theme.success,
      borderRadius:     Radius.md,
      paddingVertical:  16,
      alignItems:       'center',
      shadowColor:      theme.success,
      shadowOffset:     { width: 0, height: 4 },
      shadowOpacity:    0.4,
      shadowRadius:     8,
      elevation:        6,
    },
    uploadBtnDisabled:  { opacity: 0.6 },
    uploadBtnText:      { ...Typography.labelLG, color: '#FFF', fontSize: 16 },
  });
}
