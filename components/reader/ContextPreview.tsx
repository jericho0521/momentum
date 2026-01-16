/**
 * ContextPreview Component
 * Shows a zoomed-out view of the document with the current word highlighted
 */

import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { theme } from '@/constants/theme';

interface ContextPreviewProps {
    content: string;
    currentIndex: number;
    wordsToShow?: number; // How many words to show around the current word
}

export function ContextPreview({
    content,
    currentIndex,
    wordsToShow = 50
}: ContextPreviewProps) {
    const { before, current, after } = useMemo(() => {
        const words = content.split(/\s+/).filter(w => w.length > 0);

        // Calculate range to show
        const start = Math.max(0, currentIndex - Math.floor(wordsToShow / 2));
        const end = Math.min(words.length, currentIndex + Math.floor(wordsToShow / 2));

        const beforeWords = words.slice(start, currentIndex);
        const currentWord = words[currentIndex] || '';
        const afterWords = words.slice(currentIndex + 1, end);

        return {
            before: beforeWords.join(' '),
            current: currentWord,
            after: afterWords.join(' '),
        };
    }, [content, currentIndex, wordsToShow]);

    return (
        <View style={styles.container}>
            <View style={styles.previewBox}>
                <Text style={styles.previewText} numberOfLines={3}>
                    <Text style={styles.dimText}>{before} </Text>
                    <Text style={styles.highlightText}>{current}</Text>
                    <Text style={styles.dimText}> {after}</Text>
                </Text>
            </View>

            {/* Position indicator line */}
            <View style={styles.positionIndicator}>
                <View style={styles.indicatorLine} />
                <View style={styles.indicatorDot} />
                <View style={styles.indicatorLine} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: theme.spacing.l,
        paddingVertical: theme.spacing.s,
    },
    previewBox: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.s,
        padding: theme.spacing.m,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    previewText: {
        fontSize: 11,
        lineHeight: 16,
        textAlign: 'center',
    },
    dimText: {
        color: theme.colors.textMuted,
    },
    highlightText: {
        color: theme.colors.primary,
        fontWeight: '700',
        backgroundColor: 'rgba(17, 24, 39, 0.08)',
    },
    positionIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: theme.spacing.s,
    },
    indicatorLine: {
        height: 1,
        flex: 1,
        backgroundColor: theme.colors.border,
    },
    indicatorDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: theme.colors.primary,
        marginHorizontal: theme.spacing.s,
    },
});
