/**
 * ContextPreview Component
 * Shows a zoomed-out view of the document with the current word highlighted
 */

import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface ContextPreviewProps {
    content: string;
    currentIndex: number;
    wordsToShow?: number;
}

export function ContextPreview({
    content,
    currentIndex,
    wordsToShow = 50
}: ContextPreviewProps) {
    const { theme, isDark } = useTheme();

    const { before, current, after } = useMemo(() => {
        const words = content.split(/\s+/).filter(w => w.length > 0);
        const start = Math.max(0, currentIndex - Math.floor(wordsToShow / 2));
        const end = Math.min(words.length, currentIndex + Math.floor(wordsToShow / 2));

        return {
            before: words.slice(start, currentIndex).join(' '),
            current: words[currentIndex] || '',
            after: words.slice(currentIndex + 1, end).join(' '),
        };
    }, [content, currentIndex, wordsToShow]);

    return (
        <View style={styles.container}>
            <View style={[styles.previewBox, {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
            }]}>
                <Text style={styles.previewText} numberOfLines={3}>
                    <Text style={{ color: theme.colors.textMuted }}>{before} </Text>
                    <Text style={[styles.highlightText, {
                        color: theme.colors.primary,
                        backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(17,24,39,0.08)',
                    }]}>{current}</Text>
                    <Text style={{ color: theme.colors.textMuted }}> {after}</Text>
                </Text>
            </View>

            <View style={styles.positionIndicator}>
                <View style={[styles.indicatorLine, { backgroundColor: theme.colors.border }]} />
                <View style={[styles.indicatorDot, { backgroundColor: theme.colors.primary }]} />
                <View style={[styles.indicatorLine, { backgroundColor: theme.colors.border }]} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 24,
        paddingVertical: 8,
    },
    previewBox: {
        borderRadius: 8,
        padding: 16,
        borderWidth: 1,
    },
    previewText: {
        fontSize: 11,
        lineHeight: 16,
        textAlign: 'center',
    },
    highlightText: {
        fontWeight: '700',
    },
    positionIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
    },
    indicatorLine: {
        height: 1,
        flex: 1,
    },
    indicatorDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginHorizontal: 8,
    },
});
