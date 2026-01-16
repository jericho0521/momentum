/**
 * Layout Component
 * Main screen wrapper with consistent background and padding
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@/constants/theme';

interface LayoutProps {
    children: React.ReactNode;
    style?: ViewStyle;
    noPadding?: boolean;
}

export function Layout({ children, style, noPadding = false }: LayoutProps) {
    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={[styles.content, noPadding ? null : styles.padding, style]}>
                {children}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    content: {
        flex: 1,
    },
    padding: {
        paddingHorizontal: theme.spacing.m,
    },
});
