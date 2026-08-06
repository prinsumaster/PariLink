// ─────────────────────────────────────────────────────────────────────────────
// PariLink Mobile — Login Screen
// Email/password + OTP toggle + biometric shortcut.
// Dark/Light theme aware. Animated entry. Form validation via react-hook-form.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types';
import { useAppDispatch, useAppSelector } from '../../store';
import { loginThunk, biometricLoginThunk, setBiometricAvailable } from '../../store/slices/authSlice';
import { BiometricService } from '../../services/biometric/BiometricService';
import { LightTheme, DarkTheme, Typography, Spacing, Radius } from '../../theme';
import { useColorScheme } from 'react-native';

// ─── Validation ───────────────────────────────────────────────────────────────
const loginSchema = z.object({
  email:    z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
type LoginForm = z.infer<typeof loginSchema>;

// ─── Props ────────────────────────────────────────────────────────────────────
interface Props {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
}

export function LoginScreen({ _navigation }: Props) {
  const scheme   = useColorScheme();
  const theme    = scheme === 'dark' ? DarkTheme : LightTheme;
  const dispatch = useAppDispatch();

  const { isLoading, biometricAvailable } = useAppSelector((s) => s.auth);

  const [biometryLabel, setBiometryLabel] = useState('Biometrics');
  const [showPassword, setShowPassword]   = useState(false);

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  const { control, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  // ── Boot animation ──────────────────────────────────────────────────────────
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  // ── Check biometric availability ────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      const { available, biometryType } = await BiometricService.isAvailable();
      dispatch(setBiometricAvailable(available));
      setBiometryLabel(BiometricService.getBiometryLabel(biometryType));
    })();
  }, []);

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const onSubmit = useCallback(async (data: LoginForm) => {
    const result = await dispatch(loginThunk(data));
    if (loginThunk.rejected.match(result)) {
      Alert.alert('Login Failed', result.payload as string);
    }
  }, [dispatch]);

  const onBiometric = useCallback(async () => {
    const success = await BiometricService.authenticate('Login to PariLink');
    if (success) {
      const result = await dispatch(biometricLoginThunk());
      if (biometricLoginThunk.rejected.match(result)) {
        Alert.alert('Session Expired', 'Please login with your credentials.');
      }
    }
  }, [dispatch]);

  const styles = makeStyles(theme);

  return (
    <KeyboardAvoidingView
      style={[styles.container]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Brand ─────────────────────────────────────────────────────────── */}
        <Animated.View style={[styles.brandSection, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>P</Text>
          </View>
          <Text style={styles.brandName}>PariLink</Text>
          <Text style={styles.tagline}>Enterprise Logistics Platform</Text>
        </Animated.View>

        {/* ── Form ──────────────────────────────────────────────────────────── */}
        <Animated.View style={[styles.formCard, { opacity: fadeAnim }]}>
          <Text style={styles.formTitle}>Driver Login</Text>
          <Text style={styles.formSubtitle}>Sign in to your account to continue</Text>

          {/* Email */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Email Address</Text>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.input, errors.email && styles.inputError]}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="driver@company.com"
                  placeholderTextColor={theme.inputPlaceholder}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoComplete="email"
                  returnKeyType="next"
                  accessibilityLabel="Email address input"
                />
              )}
            />
            {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
          </View>

          {/* Password */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[styles.input, styles.passwordInput, errors.password && styles.inputError]}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Enter your password"
                    placeholderTextColor={theme.inputPlaceholder}
                    secureTextEntry={!showPassword}
                    returnKeyType="done"
                    onSubmitEditing={handleSubmit(onSubmit)}
                    accessibilityLabel="Password input"
                  />
                )}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword((v) => !v)}
                accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
              >
                <Text style={styles.eyeIcon}>{showPassword ? '👁' : '👁‍🗨'}</Text>
              </TouchableOpacity>
            </View>
            {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginBtn, isLoading && styles.loginBtnDisabled]}
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
            accessibilityRole="button"
            accessibilityLabel="Login button"
            activeOpacity={0.85}
          >
            {isLoading
              ? <ActivityIndicator color="#FFFFFF" size="small" />
              : <Text style={styles.loginBtnText}>Sign In</Text>
            }
          </TouchableOpacity>

          {/* Biometric */}
          {biometricAvailable && (
            <TouchableOpacity
              style={styles.biometricBtn}
              onPress={onBiometric}
              accessibilityRole="button"
              accessibilityLabel={`Login with ${biometryLabel}`}
              activeOpacity={0.8}
            >
              <Text style={styles.biometricText}>🔐  Login with {biometryLabel}</Text>
            </TouchableOpacity>
          )}
        </Animated.View>

        {/* ── Footer ───────────────────────────────────────────────────────── */}
        <Text style={styles.footer}>
          Secured by PariLink Enterprise Security
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
function makeStyles(theme: typeof LightTheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scroll: {
      flexGrow:        1,
      paddingHorizontal: Spacing.lg,
      paddingTop:        Spacing.xxxl,
      paddingBottom:     Spacing.xl,
    },
    brandSection: {
      alignItems:   'center',
      marginBottom: Spacing.xl,
    },
    logoContainer: {
      width:           72,
      height:          72,
      borderRadius:    Radius.lg,
      backgroundColor: theme.primary,
      justifyContent:  'center',
      alignItems:      'center',
      marginBottom:    Spacing.md,
      shadowColor:     theme.primary,
      shadowOffset:    { width: 0, height: 8 },
      shadowOpacity:   0.4,
      shadowRadius:    16,
      elevation:       10,
    },
    logoText: {
      ...Typography.displayLG,
      color:      '#FFFFFF',
      fontWeight: '900',
    },
    brandName: {
      ...Typography.displayMD,
      color:        theme.text,
      marginBottom: Spacing.xs,
    },
    tagline: {
      ...Typography.bodyMD,
      color: theme.textSecondary,
    },
    formCard: {
      backgroundColor: theme.surface,
      borderRadius:    Radius.xl,
      padding:         Spacing.lg,
      marginBottom:    Spacing.lg,
      shadowColor:     theme.cardShadow,
      shadowOffset:    { width: 0, height: 4 },
      shadowOpacity:   1,
      shadowRadius:    16,
      elevation:       6,
    },
    formTitle: {
      ...Typography.headingLG,
      color:        theme.text,
      marginBottom: Spacing.xs,
    },
    formSubtitle: {
      ...Typography.bodyMD,
      color:        theme.textSecondary,
      marginBottom: Spacing.lg,
    },
    fieldGroup: {
      marginBottom: Spacing.md,
    },
    label: {
      ...Typography.labelMD,
      color:        theme.textSecondary,
      marginBottom: Spacing.xs,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    input: {
      backgroundColor:  theme.input,
      borderWidth:      1.5,
      borderColor:      theme.inputBorder,
      borderRadius:     Radius.md,
      paddingHorizontal: Spacing.md,
      paddingVertical:   Platform.OS === 'ios' ? 14 : 12,
      ...Typography.bodyLG,
      color:            theme.inputText,
    },
    inputError: {
      borderColor: theme.danger,
    },
    passwordContainer: {
      position: 'relative',
    },
    passwordInput: {
      paddingRight: 48,
    },
    eyeButton: {
      position: 'absolute',
      right:    Spacing.md,
      top:      0,
      bottom:   0,
      justifyContent: 'center',
    },
    eyeIcon: {
      fontSize: 18,
    },
    errorText: {
      ...Typography.caption,
      color:      theme.danger,
      marginTop:  Spacing.xs,
    },
    loginBtn: {
      backgroundColor:  theme.primary,
      borderRadius:     Radius.md,
      paddingVertical:  16,
      alignItems:       'center',
      justifyContent:   'center',
      marginTop:        Spacing.sm,
      shadowColor:      theme.primary,
      shadowOffset:     { width: 0, height: 4 },
      shadowOpacity:    0.4,
      shadowRadius:     8,
      elevation:        6,
    },
    loginBtnDisabled: {
      opacity: 0.6,
    },
    loginBtnText: {
      ...Typography.labelLG,
      color:        '#FFFFFF',
      fontSize:     16,
      letterSpacing: 0.5,
    },
    biometricBtn: {
      marginTop:       Spacing.md,
      paddingVertical: 14,
      alignItems:      'center',
      borderRadius:    Radius.md,
      borderWidth:     1.5,
      borderColor:     theme.border,
    },
    biometricText: {
      ...Typography.labelMD,
      color:     theme.primary,
      fontSize:  14,
    },
    footer: {
      ...Typography.caption,
      color:     theme.textTertiary,
      textAlign: 'center',
      marginTop: Spacing.lg,
    },
  });
}
