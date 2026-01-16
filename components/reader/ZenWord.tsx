/**
 * ZenWord Component
 * Displays the current word with optimal focus point highlighting (ORP)
 * Features large typography and smooth transitions
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { theme } from '@/constants/theme';

interface ZenWordProps {
    word: string;
    isFocusEnabled?: boolean;
}

export function ZenWord({ word, isFocusEnabled = true }: ZenWordProps) {
    // Simple ORP calculation
    // For words length 0-1: no pivot
    // For words > 1: roughly 25-30% into the word
    const getPivotIndex = (w: string) => {
        const len = w.length;
        if (len <= 1) return 0;
        if (len >= 2 && len <= 5) return 1;
        if (len >= 6 && len <= 9) return 2;
        if (len >= 10 && len <= 13) return 3;
        return 4;
    };

    const pivot = getPivotIndex(word);
    const leftPart = word.slice(0, pivot);
    const pivotChar = word[pivot];
    const rightPart = word.slice(pivot + 1);

    return (
        <View style={styles.container}>
            <Animated.View
                key={word} // Triggers animation on change
                entering={FadeIn.duration(50)}
                style={styles.wordRow}
            >
                <Text style={[styles.text, styles.leftText]}>{leftPart}</Text>
                <Text style={[
                    styles.text,
                    isFocusEnabled ? styles.pivotHighlight : null
                ]}>
                    {pivotChar}
                </Text>
                <Text style={[styles.text, styles.rightText]}>{rightPart}</Text>
            </Animated.View>

            {/* Focus Guides (Optional visual aid) */}
            {isFocusEnabled && (
                <View style={styles.focusNotchWrap}>
                    <View style={styles.focusNotch} />
                    <View style={[styles.focusNotch, styles.focusNotchBottom]} />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 200, // Fixed height to prevent layout shifts
    },
    wordRow: {
        flexDirection: 'row',
        alignItems: 'baseline', // Align by text baseline
    },
    text: {
        fontSize: 48, // theme.typography.sizes.xxl equivalent
        fontWeight: '600',
        color: theme.colors.text,
        fontVariant: ['tabular-nums'], // Helps with number stability
        letterSpacing: -0.5,
    },
    leftText: {
        textAlign: 'right',
    },
    rightText: {
        textAlign: 'left',
    },
    pivotHighlight: {
        color: theme.colors.error, // Red highlight
        fontWeight: '700',
    },
    focusNotchWrap: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 40,
    },
    focusNotch: {
        width: 2,
        height: 12,
        backgroundColor: theme.colors.border,
        opacity: 0.5,
    },
    focusNotchBottom: {
        backgroundColor: theme.colors.border,
    },
});
