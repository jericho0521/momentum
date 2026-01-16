/**
 * Layout Component
 * Main screen wrapper with dynamic theme support
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';

interface LayoutProps {
    children: React.ReactNode;
    style?: ViewStyle;
    noPadding?: boolean;
}

export function Layout({ children, style, noPadding = false }: LayoutProps) {
    const { theme } = useTheme();

    return (
        <SafeAreaView
            style={[styles.container, { backgroundColor: theme.colors.background }]}
            edges={['top']}
        >
            <View style={[styles.content, noPadding ? null : styles.padding, style]}>
                {children}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
    },
    padding: {
        paddingHorizontal: 16,
    },
});
