/**
 * Reader Screen (Premium)
 * With bookmark support and dark mode
 */

import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Text, StatusBar, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, Stack, router, useFocusEffect } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/hooks/useTheme';
import { Layout } from '@/components/ui/Layout';
import { ZenWord } from '@/components/reader/ZenWord';
import { ZenControls } from '@/components/reader/ZenControls';
import { ContextPreview } from '@/components/reader/ContextPreview';
import { useSpeedReader } from '@/hooks/useSpeedReader';
import { getDocument, getSettings, getBookmarks, saveBookmark, deleteBookmark } from '@/services/storage';
import type { Document, ReaderSettings, Bookmark } from '@/types';

export default function ReaderScreen() {
    const { documentId } = useLocalSearchParams<{ documentId: string }>();
    const [document, setDocument] = useState<Document | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { theme, isDark } = useTheme();

    useEffect(() => {
        const loadData = async () => {
            if (!documentId) {
                setIsLoading(false);
                return;
            }
            const doc = await getDocument(documentId);
            setDocument(doc);
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
                <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>No Document Selected</Text>
                <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                    Go to Library and select a document to start reading
                </Text>
            </Layout>
        );
    }

    return <ReaderContent document={document} />;
}

function ReaderContent({ document }: { document: Document }) {
    const { theme, isDark } = useTheme();
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

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

    // Reload settings and bookmarks when screen becomes active
    useFocusEffect(
        useCallback(() => {
            reloadSettings();
            loadBookmarks();
        }, [reloadSettings])
    );

    const loadBookmarks = async () => {
        const marks = await getBookmarks(document.id);
        setBookmarks(marks);
    };

    const handleBookmarkPress = async () => {
        const existingBookmark = bookmarks.find(b => b.wordIndex === currentIndex);

        if (existingBookmark) {
            await deleteBookmark(document.id, existingBookmark.id);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        } else {
            const newBookmark: Bookmark = {
                id: `bm_${Date.now()}`,
                documentId: document.id,
                wordIndex: currentIndex,
                createdAt: Date.now(),
            };
            await saveBookmark(newBookmark);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }

        await loadBookmarks();
    };

    const hasBookmarkAtPosition = bookmarks.some(b => b.wordIndex === currentIndex);
    const wpm = settings?.wpm ?? 300;

    return (
        <Layout style={{ backgroundColor: theme.colors.background }} noPadding>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

            <View style={[styles.topBar, { opacity: isPlaying ? 0.3 : 1 }]}>
                <Text style={[styles.docTitle, { color: theme.colors.textSecondary }]} numberOfLines={1}>
                    {document.name}
                </Text>
            </View>

            <View style={styles.readingArea}>
                <ZenWord
                    word={currentWord || 'Ready'}
                    isFocusEnabled={settings?.focusPointEnabled ?? true}
                />
            </View>

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
                    onBookmarkPress={handleBookmarkPress}
                    hasBookmarkAtPosition={hasBookmarkAtPosition}
                />
            </View>
        </Layout>
    );
}

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    topBar: {
        paddingTop: 16,
        paddingHorizontal: 24,
        alignItems: 'center',
        height: 60,
    },
    docTitle: {
        fontSize: 14,
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
        paddingHorizontal: 16,
    },
    emptyTitle: {
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 16,
        textAlign: 'center',
    },
});
