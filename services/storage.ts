import type { Document, ReadingProgress } from '@/types';

export async function getDocuments(): Promise<Document[]> {
    return [];
}

export async function saveDocument(doc: Document): Promise<void> {
    // stub
}

export async function deleteDocument(id: string): Promise<void> {
    // stub
}

export async function getAllProgress(): Promise<Record<string, ReadingProgress>> {
    return {};
}
