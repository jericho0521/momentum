/**
 * Library Screen (Premium)
 * Minimalist entry point with masonry layout feel
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';

import { theme } from '@/constants/theme';
import { Layout } from '@/components/ui/Layout';
import { GlassCard } from '@/components/ui/GlassCard';
import { DocumentCard } from '@/components/file/DocumentCard';
import { Button } from '@/components/ui/Button';

import { createDocument } from '@/services/document-parser';
import { getDocuments, saveDocument, deleteDocument, getAllProgress } from '@/services/storage';
import type { Document, ReadingProgress } from '@/types';

export default function LibraryScreen() {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [progress, setProgress] = useState<Record<string, ReadingProgress>>({});
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const docs = await getDocuments();
        const prog = await getAllProgress();
        setDocuments(docs);
        setProgress(prog);
    };

    const handlePickDocument = async () => {
        setIsLoading(true);
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ['text/plain'],
                copyToCacheDirectory: true,
            });

            if (!result.canceled && result.assets?.[0]) {
                const file = result.assets[0];
                const doc = await createDocument(file.uri, file.name);
                await saveDocument(doc);
                setDocuments(prev => [doc, ...prev]);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Layout>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={false} onRefresh={loadData} />
                }
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Library</Text>
                    <Text style={styles.subtitle}>
                        {documents.length} {documents.length === 1 ? 'Book' : 'Books'}
                    </Text>
                </View>

                {/* Add New - Featured Card */}
                <GlassCard
                    onPress={handlePickDocument}
                    style={styles.addCard}
                >
                    <View style={styles.addContent}>
                        <View style={styles.addIcon}>
                            <Ionicons name="add" size={32} color={theme.colors.surface} />
                        </View>
                        <View>
                            <Text style={styles.addTitle}>Import Book</Text>
                            <Text style={styles.addSubtitle}>Support for .txt files</Text>
                        </View>
                    </View>
                </GlassCard>

                {/* Document List */}
                <View style={styles.list}>
                    {documents.map(doc => (
                        <DocumentCard
                            key={doc.id}
                            document={doc}
                            progress={progress[doc.id]}
                            onPress={(d) => router.push({ pathname: '/(tabs)/reader', params: { documentId: d.id } })}
                            onDelete={async (id) => {
                                await deleteDocument(id);
                                loadData();
                            }}
                        />
                    ))}
                </View>

                {/* Empty State */}
                {documents.length === 0 && (
                    <View style={styles.empty}>
                        <Text style={styles.emptyText}>Your library is empty.</Text>
                        <Text style={styles.emptySub}>Import a document to begin.</Text>
                    </View>
                )}
            </ScrollView>
        </Layout>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        paddingBottom: 100,
    },
    header: {
        marginTop: theme.spacing.xl,
        marginBottom: theme.spacing.l,
    },
    title: {
        fontSize: theme.typography.sizes.h1,
        fontWeight: '700', // Manually setting weight string to avoid TS issues
        color: theme.colors.text,
        letterSpacing: -1,
    },
    subtitle: {
        fontSize: theme.typography.sizes.body,
        color: theme.colors.textSecondary,
        marginTop: 4,
    },
    addCard: {
        backgroundColor: theme.colors.primary,
        marginBottom: theme.spacing.xl,
    },
    addContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    addIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: theme.spacing.m,
    },
    addTitle: {
        color: theme.colors.surface,
        fontSize: theme.typography.sizes.h3,
        fontWeight: '600',
    },
    addSubtitle: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: theme.typography.sizes.small,
    },
    list: {
        gap: theme.spacing.s,
    },
    empty: {
        marginTop: theme.spacing.xl,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: theme.typography.sizes.body,
        color: theme.colors.textSecondary,
        fontWeight: '500',
    },
    emptySub: {
        fontSize: theme.typography.sizes.small,
        color: theme.colors.textMuted,
        marginTop: 4,
    },
});
