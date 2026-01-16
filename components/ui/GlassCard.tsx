/**
 * GlassCard Component
 * Minimalist card with dynamic theme support
 */

import React from 'react';
import { View, StyleSheet, ViewStyle, Pressable } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';
import { useTheme } from '@/hooks/useTheme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface GlassCardProps {
    children: React.ReactNode;
    style?: ViewStyle;
    onPress?: () => void;
    variant?: 'default' | 'flat';
}

export function GlassCard({
    children,
    style,
    onPress,
    variant = 'default'
}: GlassCardProps) {
    const { theme, isDark } = useTheme();
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => {
        if (onPress) scale.value = withSpring(0.98);
    };

    const handlePressOut = () => {
        if (onPress) scale.value = withSpring(1);
    };

    const Container = onPress ? AnimatedPressable : View;

    const dynamicCardStyle = {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.l,
        borderWidth: 1,
        borderColor: isDark ? theme.colors.border : 'rgba(255,255,255,0.6)',
        ...theme.shadows.soft,
    };

    const flatStyle = {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: theme.colors.border,
    };

    return (
        <Container
            onPress={onPress}
            onPressIn={onPress ? handlePressIn : undefined}
            onPressOut={onPress ? handlePressOut : undefined}
            style={[
                styles.card,
                dynamicCardStyle,
                variant === 'flat' && flatStyle,
                style,
                onPress ? animatedStyle : null,
            ]}
        >
            {children}
        </Container>
    );
}

const styles = StyleSheet.create({
    card: {
        padding: 24,
    },
});
