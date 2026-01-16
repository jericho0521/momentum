import type { Document } from '@/types';
import * as FileSystem from 'expo-file-system';

export async function createDocument(uri: string, name: string): Promise<Document> {
    // stub implementation
    return {
        id: Math.random().toString(36).substr(2, 9),
        name,
        type: 'txt',
        uri,
        createdAt: Date.now(),
    };
}
