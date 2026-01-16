/**
 * Reader Screen (Premium)
 * Distraction-free reading environment connected to real logic
 */

import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Text, StatusBar, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, Stack, router, useFocusEffect } from 'expo-router';
import { theme } from '@/constants/theme';
import { Layout } from '@/components/ui/Layout';
import { ZenWord } from '@/components/reader/ZenWord';
import { ZenControls } from '@/components/reader/ZenControls';
import { ContextPreview } from '@/components/reader/ContextPreview';
import { useSpeedReader } from '@/hooks/useSpeedReader';
import { getDocument, getSettings } from '@/services/storage';
import type { Document, ReaderSettings } from '@/types';

export default function ReaderScreen() {
    const { documentId } = useLocalSearchParams<{ documentId: string }>();
    const [document, setDocument] = useState<Document | null>(null);
    const [initialSettings, setInitialSettings] = useState<ReaderSettings | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            if (!documentId) {
                setIsLoading(false);
                return;
            }
            const [doc, loadedSettings] = await Promise.all([
                getDocument(documentId),
                getSettings(),
            ]);
            setDocument(doc);
            setInitialSettings(loadedSettings);
            setIsLoading(false);
        };
        loadData();
    }, [documentId]);

    if (isLoading) {
        return (
            <Layout style={styles.centered}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </Layout>
        );
    }

    if (!document || !document.content) {
        return (
            <Layout style={styles.centered}>
                <Stack.Screen options={{ headerShown: false }} />
                <Text style={styles.emptyTitle}>No Document Selected</Text>
                <Text style={styles.emptyText}>Go to Library and select a document to start reading</Text>
            </Layout>
        );
    }

    return <ReaderContent document={document} />;
}

function ReaderContent({ document }: { document: Document }) {
    const {
        currentWord,
        currentIndex,
        isPlaying,
        percentage,
        timeRemaining,
        togglePlay,
        reloadSettings,
        settings,
    } = useSpeedReader({
        documentId: document.id,
        content: document.content!,
        onComplete: () => { },
    });

    // Reload settings when screen becomes active
    useFocusEffect(
        useCallback(() => {
            reloadSettings();
        }, [reloadSettings])
    );

    const wpm = settings?.wpm ?? 300;

    return (
        <Layout style={styles.container} noPadding>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar barStyle="dark-content" />

            <View style={[styles.topBar, { opacity: isPlaying ? 0.3 : 1 }]}>
                <Text style={styles.docTitle} numberOfLines={1}>
                    {document.name}
                </Text>
            </View>

            <View style={styles.readingArea}>
                <ZenWord
                    word={currentWord || 'Ready'}
                    isFocusEnabled={settings?.focusPointEnabled ?? true}
                />
            </View>

            {/* Context Preview - zoomed out view */}
            <ContextPreview
                content={document.content!}
                currentIndex={currentIndex}
                wordsToShow={60}
            />

            <View style={styles.controlsArea}>
                <ZenControls
                    isPlaying={isPlaying}
                    onTogglePlay={togglePlay}
                    wpm={wpm}
                    progress={percentage}
                    timeRemaining={timeRemaining}
                    onSettingsPress={() => router.push('/(tabs)/settings')}
                />
            </View>
        </Layout>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.background,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.xl,
    },
    topBar: {
        paddingTop: theme.spacing.m,
        paddingHorizontal: theme.spacing.l,
        alignItems: 'center',
        height: 60,
    },
    docTitle: {
        fontSize: theme.typography.sizes.caption,
        color: theme.colors.textSecondary,
        fontWeight: '500',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    readingArea: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    controlsArea: {
        paddingHorizontal: theme.spacing.m,
    },
    emptyTitle: {
        fontSize: theme.typography.sizes.h2,
        fontWeight: '600',
        color: theme.colors.text,
        marginBottom: theme.spacing.s,
    },
    emptyText: {
        fontSize: theme.typography.sizes.body,
        color: theme.colors.textSecondary,
        textAlign: 'center',
    },
});
