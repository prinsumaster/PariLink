// ─────────────────────────────────────────────────────────────────────────────
// PariLink Mobile — Root Navigation
// Stack + Bottom Tabs navigator wired to the full screen inventory.
// Handles auth-gating: unauthenticated → Auth stack; authenticated → Main tabs.
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { useColorScheme } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme as NavDarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { useAppSelector } from '../store';
import { LightTheme, DarkTheme } from '../theme';

import type { RootStackParamList, TabParamList } from '../types';

// ── Auth Screens ──────────────────────────────────────────────────────────────
import { LoginScreen }         from '../screens/auth/LoginScreen';

// ── Main Tab Screens ──────────────────────────────────────────────────────────
import { DashboardScreen }     from '../screens/dashboard/DashboardScreen';
import { TripDetailScreen }    from '../screens/trips/TripDetailScreen';
import { DocumentCameraScreen }from '../screens/documents/DocumentCameraScreen';
import { ExpenseFormScreen }   from '../screens/expenses/ExpenseFormScreen';
import { EmergencySOSScreen }  from '../screens/emergency/EmergencySOSScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab   = createBottomTabNavigator<TabParamList>();

// ─── Bottom Tab Navigator ──────────────────────────────────────────────────────
function MainTabs() {
  const scheme = useColorScheme();
  const theme  = scheme === 'dark' ? DarkTheme : LightTheme;

  const TAB_ICONS: Record<string, { active: string; inactive: string }> = {
    Dashboard: { active: '🏠', inactive: '🏚' },
    Trips:     { active: '🚛', inactive: '🚚' },
    Documents: { active: '📂', inactive: '📁' },
    Finance:   { active: '💰', inactive: '💸' },
    More:      { active: '☰',  inactive: '☰' },
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          const icons = TAB_ICONS[route.name] ?? { active: '•', inactive: '•' };
          return <>{focused ? icons.active : icons.inactive}</>;
        },
        tabBarActiveTintColor:   theme.tabBarActive,
        tabBarInactiveTintColor: theme.tabBarInactive,
        tabBarStyle: {
          backgroundColor: theme.tabBar,
          borderTopColor:  theme.tabBarBorder,
          borderTopWidth:  1,
          height:          Platform.OS === 'ios' ? 80 : 60,
          paddingBottom:   Platform.OS === 'ios' ? 20 : 8,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        headerStyle:      { backgroundColor: theme.header },
        headerTintColor:  theme.headerText,
        headerTitleStyle: { fontWeight: '700', fontSize: 18 },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Home' }} />
      <Tab.Screen name="Trips"     component={DashboardScreen} options={{ title: 'Trips' }} />
      <Tab.Screen name="Documents" component={DashboardScreen} options={{ title: 'Docs' }} />
      <Tab.Screen name="Finance"   component={DashboardScreen} options={{ title: 'Finance' }} />
      <Tab.Screen name="More"      component={DashboardScreen} options={{ title: 'More' }} />
    </Tab.Navigator>
  );
}

// ─── Root Navigator ────────────────────────────────────────────────────────────
export function AppNavigator() {
  const scheme      = useColorScheme();
  const theme       = scheme === 'dark' ? DarkTheme : LightTheme;
  const accessToken = useAppSelector((s) => s.auth.accessToken);

  const navTheme = {
    ...(scheme === 'dark' ? NavDarkTheme : DefaultTheme),
    colors: {
      ...(scheme === 'dark' ? NavDarkTheme : DefaultTheme).colors,
      background: theme.background,
      card:       theme.header,
      text:       theme.headerText,
      border:     theme.border,
    },
  };

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        screenOptions={{
          headerStyle:     { backgroundColor: theme.header },
          headerTintColor: theme.headerText,
          headerTitleStyle: { fontWeight: '700', fontSize: 18 },
          animation:       'ios_from_right',
        }}
      >
        {!accessToken ? (
          // ── Auth Stack ────────────────────────────────────────────────────
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        ) : (
          // ── Authenticated Stack ───────────────────────────────────────────
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
            <Stack.Screen name="TripDetail" component={TripDetailScreen} options={{ title: 'Trip Details' }} />
            <Stack.Screen name="DocumentCamera" component={DocumentCameraScreen} options={{ title: 'Upload Document' }} />
            <Stack.Screen name="ExpenseForm" component={ExpenseFormScreen} options={{ title: 'Log Expense' }} />
            <Stack.Screen name="EmergencySOS" component={EmergencySOSScreen} options={{ headerShown: false }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// ── Missing Platform import fix
import { Platform } from 'react-native';
