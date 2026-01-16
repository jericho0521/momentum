/**
 * DocumentCard Component (Premium)
 * Minimalist document item with dark mode support
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { GlassCard } from '@/components/ui/GlassCard';
import type { Document, ReadingProgress } from '@/types';

interface DocumentCardProps {
    document: Document;
    progress?: ReadingProgress | null;
    onPress: (document: Document) => void;
    onDelete: (documentId: string) => void;
}

export function DocumentCard({
    document,
    progress,
    onPress,
    onDelete,
}: DocumentCardProps) {
    const { theme } = useTheme();

    const progressPercentage = progress
        ? Math.round((progress.currentWordIndex / progress.totalWords) * 100)
        : 0;

    return (
        <GlassCard onPress={() => onPress(document)} style={styles.container}>
            <View style={styles.contentRow}>
                {/* Icon */}
                <View style={[styles.iconBox, { backgroundColor: theme.colors.background }]}>
                    <Ionicons
                        name="document-text"
                        size={24}
                        color={theme.colors.primary}
                    />
                </View>

                {/* Info */}
                <View style={styles.info}>
                    <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={1}>
                        {document.name}
                    </Text>
                    <View style={styles.metaRow}>
                        <Text style={[styles.meta, { color: theme.colors.textMuted }]}>
                            {document.wordCount?.toLocaleString() ?? 0} words
                        </Text>
                        {progressPercentage > 0 && (
                            <>
                                <Text style={[styles.metaDot, { color: theme.colors.textMuted }]}>•</Text>
                                <Text style={[styles.metaHighlight, { color: theme.colors.primary }]}>
                                    {progressPercentage}% complete
                                </Text>
                            </>
                        )}
                    </View>
                </View>

                {/* Action */}
                <Pressable
                    onPress={() => onDelete(document.id)}
                    style={styles.deleteBtn}
                    hitSlop={12}
                >
                    <Ionicons
                        name="ellipsis-horizontal"
                        size={20}
                        color={theme.colors.textMuted}
                    />
                </Pressable>
            </View>

            {progressPercentage > 0 && (
                <View style={[styles.progressBar, { backgroundColor: theme.colors.background }]}>
                    <View
                        style={[
                            styles.progressFill,
                            { width: `${progressPercentage}%`, backgroundColor: theme.colors.primary }
                        ]}
                    />
                </View>
            )}
        </GlassCard>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        marginBottom: 16,
        overflow: 'hidden',
        paddingBottom: 20,
    },
    contentRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    info: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    meta: {
        fontSize: 12,
    },
    metaHighlight: {
        fontSize: 12,
        fontWeight: '500',
    },
    metaDot: {
        marginHorizontal: 6,
        fontSize: 10,
    },
    deleteBtn: {
        padding: 8,
    },
    progressBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 4,
    },
    progressFill: {
        height: '100%',
        opacity: 0.8,
    },
});
