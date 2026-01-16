/**
 * GlassCard Component
 * minimalist card with soft shadows and subtle lift
 */

import React from 'react';
import { View, StyleSheet, ViewStyle, Pressable } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';
import { theme } from '@/constants/theme';

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

    return (
        <Container
            onPress={onPress}
            onPressIn={onPress ? handlePressIn : undefined}
            onPressOut={onPress ? handlePressOut : undefined}
            style={[
                styles.card,
                variant === 'default' && theme.shadows.soft,
                variant === 'flat' && styles.flat,
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
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.l,
        padding: theme.spacing.l,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.6)',
    },
    flat: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
});
