/**
 * Storage Service
 * Persistent storage for documents and reading progress
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Document, ReadingProgress, ReaderSettings } from '@/types';

const STORAGE_KEYS = {
    DOCUMENTS: '@speedreader/documents',
    PROGRESS: '@speedreader/progress',
    SETTINGS: '@speedreader/settings',
};

// ============ Documents ============

export async function saveDocument(document: Document): Promise<void> {
    try {
        const documents = await getDocuments();
        const existingIndex = documents.findIndex(d => d.id === document.id);

        if (existingIndex >= 0) {
            documents[existingIndex] = document;
        } else {
            documents.unshift(document);
        }

        await AsyncStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(documents));
    } catch (error) {
        console.error('Error saving document:', error);
        throw error;
    }
}

export async function getDocuments(): Promise<Document[]> {
    try {
        const data = await AsyncStorage.getItem(STORAGE_KEYS.DOCUMENTS);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error getting documents:', error);
        return [];
    }
}

export async function getDocument(id: string): Promise<Document | null> {
    const documents = await getDocuments();
    return documents.find(d => d.id === id) ?? null;
}

export async function deleteDocument(id: string): Promise<void> {
    try {
        const documents = await getDocuments();
        const filtered = documents.filter(d => d.id !== id);
        await AsyncStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(filtered));
        await deleteProgress(id);
    } catch (error) {
        console.error('Error deleting document:', error);
        throw error;
    }
}

// ============ Progress ============

export async function saveProgress(progress: ReadingProgress): Promise<void> {
    try {
        const allProgress = await getAllProgress();
        allProgress[progress.documentId] = progress;
        await AsyncStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(allProgress));
    } catch (error) {
        console.error('Error saving progress:', error);
        throw error;
    }
}

export async function getProgress(documentId: string): Promise<ReadingProgress | null> {
    const allProgress = await getAllProgress();
    return allProgress[documentId] ?? null;
}

export async function getAllProgress(): Promise<Record<string, ReadingProgress>> {
    try {
        const data = await AsyncStorage.getItem(STORAGE_KEYS.PROGRESS);
        return data ? JSON.parse(data) : {};
    } catch (error) {
        console.error('Error getting all progress:', error);
        return {};
    }
}

export async function deleteProgress(documentId: string): Promise<void> {
    try {
        const allProgress = await getAllProgress();
        delete allProgress[documentId];
        await AsyncStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(allProgress));
    } catch (error) {
        console.error('Error deleting progress:', error);
    }
}

// ============ Settings ============

const DEFAULT_SETTINGS: ReaderSettings = {
    wpm: 300,
    fontSize: 48,
    highlightEnabled: true,
    focusPointEnabled: true,
};

export async function saveSettings(settings: ReaderSettings): Promise<void> {
    try {
        await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
        console.error('Error saving settings:', error);
        throw error;
    }
}

export async function getSettings(): Promise<ReaderSettings> {
    try {
        const data = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
        return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
    } catch (error) {
        console.error('Error getting settings:', error);
        return DEFAULT_SETTINGS;
    }
}

// ============ Utilities ============

export async function clearAllData(): Promise<void> {
    try {
        await AsyncStorage.multiRemove([
            STORAGE_KEYS.DOCUMENTS,
            STORAGE_KEYS.PROGRESS,
            STORAGE_KEYS.SETTINGS,
        ]);
    } catch (error) {
        console.error('Error clearing all data:', error);
        throw error;
    }
}
