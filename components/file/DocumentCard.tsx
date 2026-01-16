/**
 * DocumentCard Component (Premium)
 * Minimalist document item using GlassCard
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
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
    const progressPercentage = progress
        ? Math.round((progress.currentWordIndex / progress.totalWords) * 100)
        : 0;

    return (
        <GlassCard onPress={() => onPress(document)} style={styles.container}>
            <View style={styles.contentRow}>
                {/* Icon */}
                <View style={styles.iconBox}>
                    <Ionicons
                        name="document-text"
                        size={24}
                        color={theme.colors.primary}
                    />
                </View>

                {/* Info */}
                <View style={styles.info}>
                    <Text style={styles.title} numberOfLines={1}>
                        {document.name}
                    </Text>
                    <View style={styles.metaRow}>
                        <Text style={styles.meta}>
                            {document.wordCount?.toLocaleString() ?? 0} words
                        </Text>
                        {progressPercentage > 0 && (
                            <>
                                <Text style={styles.metaDot}>•</Text>
                                <Text style={styles.metaHighlight}>{progressPercentage}% complete</Text>
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

            {/* Subtle Progress Bar (Bottom Border) */}
            {progressPercentage > 0 && (
                <View style={styles.progressBar}>
                    <View
                        style={[
                            styles.progressFill,
                            { width: `${progressPercentage}%` }
                        ]}
                    />
                </View>
            )}
        </GlassCard>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: theme.spacing.m,
        marginBottom: theme.spacing.m,
        overflow: 'hidden', // For progress bar
        paddingBottom: theme.spacing.m + 4,
    },
    contentRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: theme.borderRadius.m,
        backgroundColor: theme.colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: theme.spacing.m,
    },
    info: {
        flex: 1,
    },
    title: {
        fontSize: theme.typography.sizes.body,
        fontWeight: theme.typography.weights.semibold as any,
        color: theme.colors.text,
        marginBottom: 2,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    meta: {
        fontSize: theme.typography.sizes.small,
        color: theme.colors.textMuted,
    },
    metaHighlight: {
        fontSize: theme.typography.sizes.small,
        color: theme.colors.primary,
        fontWeight: '500',
    },
    metaDot: {
        marginHorizontal: 6,
        fontSize: 10,
        color: theme.colors.textMuted,
    },
    deleteBtn: {
        padding: theme.spacing.s,
    },
    progressBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 4,
        backgroundColor: theme.colors.background,
    },
    progressFill: {
        height: '100%',
        backgroundColor: theme.colors.primary,
        opacity: 0.8,
    },
});
