/**
 * Document Parser
 * Extracts text content from document files
 */

import * as FileSystem from 'expo-file-system';
import type { Document } from '@/types';

export type SupportedFormat = 'txt' | 'pdf' | 'docx' | 'doc';

export function isSupportedFormat(filename: string): boolean {
    const ext = getFileExtension(filename).toLowerCase();
    return ['txt'].includes(ext); // Only TXT for Phase 3
}

export function getFileExtension(filename: string): string {
    return filename.split('.').pop() || '';
}

export async function parseDocument(uri: string, type: SupportedFormat): Promise<string> {
    switch (type) {
        case 'txt':
            return parseTxtFile(uri);
        case 'pdf':
        case 'docx':
        case 'doc':
            throw new Error(`${type.toUpperCase()} parsing not yet implemented`);
        default:
            throw new Error(`Unsupported file format: ${type}`);
    }
}

async function parseTxtFile(uri: string): Promise<string> {
    try {
        // On web, expo-document-picker returns blob URLs that need to be fetched
        if (uri.startsWith('blob:') || uri.startsWith('http://') || uri.startsWith('https://')) {
            console.log('Reading file via fetch (web):', uri);
            const response = await fetch(uri);
            const content = await response.text();
            return cleanText(content);
        }

        // On native, use expo-file-system
        console.log('Reading file via FileSystem (native):', uri);
        const content = await FileSystem.readAsStringAsync(uri);
        return cleanText(content);
    } catch (error) {
        console.error('Error reading TXT file:', error);
        throw new Error('Failed to read text file');
    }
}

function cleanText(text: string): string {
    return text
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n')
        .replace(/\n{3,}/g, '\n\n')
        .replace(/[ \t]+/g, ' ')
        .trim();
}

export function countWords(text: string): number {
    return text
        .split(/\s+/)
        .filter(word => word.length > 0)
        .length;
}

export async function createDocument(uri: string, name: string): Promise<Document> {
    const ext = getFileExtension(name).toLowerCase() as SupportedFormat;

    if (!isSupportedFormat(name)) {
        throw new Error(`Unsupported file format: ${ext}`);
    }

    const content = await parseDocument(uri, ext);
    const wordCount = countWords(content);

    return {
        id: generateId(),
        name: name.replace(/\.[^/.]+$/, ''), // Remove extension for display
        type: ext,
        uri,
        content,
        wordCount,
        createdAt: Date.now(),
    };
}

function generateId(): string {
    return `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
