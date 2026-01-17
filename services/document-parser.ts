/**
 * Document Parser
 * Extracts text content from TXT, PDF, and EPUB files
 */

import * as FileSystem from 'expo-file-system/legacy';
import { Platform } from 'react-native';
import type { Document } from '@/types';

export type SupportedFormat = 'txt' | 'pdf' | 'epub';

export function isSupportedFormat(filename: string): boolean {
    const ext = getFileExtension(filename).toLowerCase();
    return ['txt', 'pdf', 'epub'].includes(ext);
}

export function getFileExtension(filename: string): string {
    return filename.split('.').pop() || '';
}

export async function parseDocument(uri: string, type: SupportedFormat): Promise<string> {
    switch (type) {
        case 'txt':
            return parseTxtFile(uri);
        case 'pdf':
            return parsePdfFile(uri);
        case 'epub':
            return parseEpubFile(uri);
        default:
            throw new Error(`Unsupported file format: ${type}`);
    }
}

async function parseTxtFile(uri: string): Promise<string> {
    try {
        if (uri.startsWith('blob:') || uri.startsWith('http://') || uri.startsWith('https://')) {
            console.log('Reading TXT via fetch (web):', uri);
            const response = await fetch(uri);
            const content = await response.text();
            return cleanText(content);
        }
        console.log('Reading TXT via FileSystem (native):', uri);
        const content = await FileSystem.readAsStringAsync(uri);
        return cleanText(content);
    } catch (error) {
        console.error('Error reading TXT file:', error);
        throw new Error('Failed to read text file');
    }
}

// Load PDF.js from local assets (offline-capable)
async function loadPdfJs(): Promise<any> {
    // Check if already loaded
    if ((window as any).pdfjsLib) {
        return (window as any).pdfjsLib;
    }

    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        // Load from public folder (served at root URL for web)
        script.src = '/pdfjs/pdf.min.js';
        script.onload = () => {
            const pdfjsLib = (window as any).pdfjsLib;
            // Worker also loaded from public folder
            pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdfjs/pdf.worker.min.js';
            console.log('PDF.js loaded from local assets');
            resolve(pdfjsLib);
        };
        script.onerror = () => reject(new Error('Failed to load PDF.js from local assets'));
        document.head.appendChild(script);
    });
}

async function parsePdfFile(uri: string): Promise<string> {
    try {
        console.log('Parsing PDF:', uri);

        if (Platform.OS === 'web') {
            // Load PDF.js from local assets
            const pdfjsLib = await loadPdfJs();

            // Fetch the PDF file
            let pdfData: ArrayBuffer;
            if (uri.startsWith('blob:') || uri.startsWith('http://') || uri.startsWith('https://')) {
                const response = await fetch(uri);
                pdfData = await response.arrayBuffer();
            } else {
                throw new Error('Invalid PDF URI for web platform');
            }

            const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
            console.log(`PDF loaded: ${pdf.numPages} pages`);

            const textParts: string[] = [];
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items
                    .map((item: any) => item.str)
                    .join(' ');
                textParts.push(pageText);
            }

            const fullText = textParts.join('\n\n');
            console.log(`Extracted ${countWords(fullText)} words from PDF`);
            return cleanText(fullText);
        }

        throw new Error('PDF parsing on mobile requires a development build. Please use web or import TXT files.');

    } catch (error: any) {
        console.error('Error parsing PDF:', error);
        throw new Error(error.message || 'Failed to parse PDF file');
    }
}

async function parseEpubFile(uri: string): Promise<string> {
    try {
        console.log('Parsing EPUB:', uri);

        if (Platform.OS === 'web') {
            const ePub = (await import('epubjs')).default;

            // Fetch the EPUB file
            let epubData: ArrayBuffer;
            if (uri.startsWith('blob:') || uri.startsWith('http://') || uri.startsWith('https://')) {
                const response = await fetch(uri);
                epubData = await response.arrayBuffer();
            } else {
                throw new Error('Invalid EPUB URI for web platform');
            }

            // Load the book
            const book = ePub(epubData);
            await book.ready;

            // Get spine (list of chapters)
            const spine = book.spine as any;
            console.log(`EPUB loaded: ${spine.items?.length || 0} sections`);

            const textParts: string[] = [];

            // Extract text from each section
            for (const item of spine.items || []) {
                try {
                    const contents = await book.load(item.href);
                    // Create a temporary DOM to extract text
                    const parser = new DOMParser();
                    const htmlContent = typeof contents === 'string' ? contents : String(contents);
                    const doc = parser.parseFromString(htmlContent, 'text/html');
                    const text = doc.body?.textContent || '';
                    if (text.trim()) {
                        textParts.push(text.trim());
                    }
                } catch (e) {
                    console.warn('Failed to parse EPUB section:', item.href, e);
                }
            }

            const fullText = textParts.join('\n\n');
            console.log(`Extracted ${countWords(fullText)} words from EPUB`);
            return cleanText(fullText);
        }

        throw new Error('EPUB parsing on mobile requires a development build. Please use web or import TXT files.');

    } catch (error: any) {
        console.error('Error parsing EPUB:', error);
        throw new Error(error.message || 'Failed to parse EPUB file');
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
        throw new Error(`Unsupported file format: ${ext}. Please use .txt, .pdf, or .epub files.`);
    }

    const content = await parseDocument(uri, ext);
    const wordCount = countWords(content);

    return {
        id: generateId(),
        name: name.replace(/\.[^/.]+$/, ''),
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
