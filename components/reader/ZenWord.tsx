/**
 * ZenWord Component
 * Displays the current word with optimal focus point highlighting (ORP)
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useTheme } from '@/hooks/useTheme';

interface ZenWordProps {
    word: string;
    isFocusEnabled?: boolean;
}

export function ZenWord({ word, isFocusEnabled = true }: ZenWordProps) {
    const { theme } = useTheme();

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
                key={word}
                entering={FadeIn.duration(50)}
                style={styles.wordRow}
            >
                <Text style={[styles.text, styles.leftText, { color: theme.colors.text }]}>
                    {leftPart}
                </Text>
                <Text style={[
                    styles.text,
                    { color: isFocusEnabled ? theme.colors.error : theme.colors.text },
                    isFocusEnabled && styles.pivotBold
                ]}>
                    {pivotChar}
                </Text>
                <Text style={[styles.text, styles.rightText, { color: theme.colors.text }]}>
                    {rightPart}
                </Text>
            </Animated.View>

            {isFocusEnabled && (
                <View style={styles.focusNotchWrap}>
                    <View style={[styles.focusNotch, { backgroundColor: theme.colors.border }]} />
                    <View style={[styles.focusNotch, { backgroundColor: theme.colors.border }]} />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 200,
    },
    wordRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    text: {
        fontSize: 48,
        fontWeight: '600',
        fontVariant: ['tabular-nums'],
        letterSpacing: -0.5,
    },
    leftText: {
        textAlign: 'right',
    },
    rightText: {
        textAlign: 'left',
    },
    pivotBold: {
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
        opacity: 0.5,
    },
});
