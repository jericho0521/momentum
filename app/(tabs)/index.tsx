/**
 * Library Screen (Premium)
 * With dark mode support
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';

import { useTheme } from '@/hooks/useTheme';
import { Layout } from '@/components/ui/Layout';
import { GlassCard } from '@/components/ui/GlassCard';
import { DocumentCard } from '@/components/file/DocumentCard';

import { createDocument } from '@/services/document-parser';
import { getDocuments, saveDocument, deleteDocument, getAllProgress } from '@/services/storage';
import type { Document, ReadingProgress } from '@/types';

export default function LibraryScreen() {
    const { theme, isDark } = useTheme();
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
        console.log('Starting document picker...');
        setIsLoading(true);
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ['text/plain'],
                copyToCacheDirectory: true,
            });

            console.log('Document picker result:', result);

            if (!result.canceled && result.assets?.[0]) {
                const file = result.assets[0];
                console.log('Selected file:', file.name, file.uri);

                const doc = await createDocument(file.uri, file.name);
                console.log('Created document:', doc.id, doc.wordCount, 'words');

                await saveDocument(doc);
                setDocuments(prev => [doc, ...prev]);

                Alert.alert('Success', `Imported "${doc.name}" (${doc.wordCount} words)`);
            } else {
                console.log('User canceled or no assets');
            }
        } catch (e: any) {
            console.error('Import error:', e);
            Alert.alert('Import Error', e.message || 'Failed to import document');
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
                    <Text style={[styles.title, { color: theme.colors.text }]}>Library</Text>
                    <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                        {documents.length} {documents.length === 1 ? 'Book' : 'Books'}
                    </Text>
                </View>

                {/* Add New - Featured Card */}
                <GlassCard
                    onPress={handlePickDocument}
                    style={[styles.addCard, { backgroundColor: theme.colors.primary }]}
                >
                    <View style={styles.addContent}>
                        <View style={styles.addIcon}>
                            <Ionicons name="add" size={32} color={isDark ? theme.colors.primary : '#FFFFFF'} />
                        </View>
                        <View>
                            <Text style={[styles.addTitle, { color: isDark ? theme.colors.primary : '#FFFFFF' }]}>
                                Import Book
                            </Text>
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
                        <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                            Your library is empty.
                        </Text>
                        <Text style={[styles.emptySub, { color: theme.colors.textMuted }]}>
                            Import a document to begin.
                        </Text>
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
        marginTop: 32,
        marginBottom: 24,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        letterSpacing: -1,
    },
    subtitle: {
        fontSize: 16,
        marginTop: 4,
    },
    addCard: {
        marginBottom: 32,
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
        marginRight: 16,
    },
    addTitle: {
        fontSize: 20,
        fontWeight: '600',
    },
    addSubtitle: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 12,
    },
    list: {
        gap: 8,
    },
    empty: {
        marginTop: 32,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        fontWeight: '500',
    },
    emptySub: {
        fontSize: 12,
        marginTop: 4,
    },
});
