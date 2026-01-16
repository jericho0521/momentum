/**
 * Tab Layout (Premium)
 * Minimalist navigation bar
 */

import React from 'react';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { theme } from '@/constants/theme';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: theme.colors.primary,
                tabBarInactiveTintColor: theme.colors.textMuted,
                headerShown: false,
                tabBarButton: HapticTab,
                tabBarStyle: {
                    backgroundColor: theme.colors.surface,
                    borderTopColor: theme.colors.border,
                    height: Platform.select({ ios: 88, default: 60 }),
                    paddingBottom: Platform.select({ ios: 28, default: 8 }),
                    paddingTop: 8,
                    elevation: 0,
                    shadowOpacity: 0,
                },
                tabBarLabelStyle: {
                    fontSize: 10,
                    fontWeight: '500',
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Library',
                    tabBarIcon: ({ color }) => (
                        <IconSymbol size={24} name="book.fill" color={color} />
                    ),
                }}
            />

            {/* Reader Tab (Could handle hiding logic here) */}
            <Tabs.Screen
                name="reader"
                options={{
                    title: 'Reader',
                    tabBarIcon: ({ color }) => (
                        <IconSymbol size={24} name="eye.fill" color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Settings',
                    tabBarIcon: ({ color }) => (
                        <IconSymbol size={24} name="gearshape.fill" color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
