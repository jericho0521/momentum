export interface Document {
    id: string;
    name: string;
    type: string;
    uri: string;
    size?: number;
    wordCount?: number;
    content?: string;
    createdAt: number;
}

export interface ReadingProgress {
    documentId: string;
    currentWordIndex: number;
    totalWords: number;
    wpm: number;
    lastUpdated: number;
}

export interface ReaderSettings {
    wpm: number;
    fontSize: number;
    highlightEnabled: boolean;
    focusPointEnabled: boolean;
}

export interface Bookmark {
    id: string;
    documentId: string;
    wordIndex: number;
    label?: string;
    createdAt: number;
}
