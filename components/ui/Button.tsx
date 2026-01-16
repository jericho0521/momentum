/**
 * Button Component
 * Minimalist button with outline and text variants
 */

import React from 'react';
import { Text, StyleSheet, Pressable, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';
import { theme } from '@/constants/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'outline' | 'ghost';
    size?: 'small' | 'medium' | 'large';
    isLoading?: boolean;
    style?: ViewStyle;
}

export function Button({
    title,
    onPress,
    variant = 'primary',
    size = 'medium',
    isLoading = false,
    style
}: ButtonProps) {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => {
        scale.value = withSpring(0.96);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    const handlePressOut = () => {
        scale.value = withSpring(1);
    };

    return (
        <AnimatedPressable
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={isLoading}
            style={[
                styles.base,
                styles[variant],
                styles[size],
                style,
                animatedStyle,
            ]}
        >
            {isLoading ? (
                <ActivityIndicator color={variant === 'primary' ? theme.colors.surface : theme.colors.primary} />
            ) : (
                <Text style={[
                    styles.textBase,
                    styles[`${variant}Text`],
                    styles[`${size}Text`],
                ]}>
                    {title}
                </Text>
            )}
        </AnimatedPressable>
    );
}

const styles = StyleSheet.create({
    base: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: theme.borderRadius.full,
    },
    // Variants
    primary: {
        backgroundColor: theme.colors.primary,
        ...theme.shadows.soft,
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: theme.colors.border,
    },
    ghost: {
        backgroundColor: 'transparent',
    },
    // Sizes
    small: {
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    medium: {
        paddingVertical: 12,
        paddingHorizontal: 24,
    },
    large: {
        paddingVertical: 16,
        paddingHorizontal: 32,
    },
    // Text Styles
    textBase: {
        fontWeight: '600',
        textAlign: 'center',
    },
    primaryText: {
        color: theme.colors.surface,
    },
    outlineText: {
        color: theme.colors.text,
    },
    ghostText: {
        color: theme.colors.textSecondary,
    },
    smallText: {
        fontSize: 14,
    },
    mediumText: {
        fontSize: 16,
    },
    largeText: {
        fontSize: 18,
    },
});
