/**
 * RSVP Engine
 * Core speed reading logic with word-by-word playback
 */

type RSVPCallback = (state: RSVPState) => void;

export interface RSVPState {
    currentWord: string;
    currentIndex: number;
    totalWords: number;
    percentage: number;
    timeRemaining: string;
    wordsRemaining: number;
    isPlaying: boolean;
}

export class RSVPEngine {
    private words: string[] = [];
    private currentIndex: number = 0;
    private wpm: number = 300;
    private isPlaying: boolean = false;
    private timerId: NodeJS.Timeout | null = null;
    private onStateChange: RSVPCallback | null = null;

    constructor(onStateChange?: RSVPCallback) {
        this.onStateChange = onStateChange ?? null;
    }

    loadContent(text: string): void {
        this.words = text
            .replace(/[\r\n]+/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .split(' ')
            .filter(word => word.length > 0);

        this.currentIndex = 0;
        this.stop();
        this.emitState();
    }

    play(): void {
        if (this.isPlaying || this.words.length === 0) return;
        if (this.currentIndex >= this.words.length) {
            this.currentIndex = 0;
        }

        this.isPlaying = true;
        this.scheduleNextWord();
        this.emitState();
    }

    pause(): void {
        this.isPlaying = false;
        if (this.timerId) {
            clearTimeout(this.timerId);
            this.timerId = null;
        }
        this.emitState();
    }

    stop(): void {
        this.pause();
        this.currentIndex = 0;
        this.emitState();
    }

    skip(count: number = 1): void {
        const newIndex = Math.min(this.currentIndex + count, this.words.length - 1);
        this.currentIndex = Math.max(0, newIndex);
        this.emitState();
    }

    rewind(count: number = 1): void {
        this.currentIndex = Math.max(0, this.currentIndex - count);
        this.emitState();
    }

    jumpTo(index: number): void {
        this.currentIndex = Math.max(0, Math.min(index, this.words.length - 1));
        this.emitState();
    }

    setWpm(wpm: number): void {
        this.wpm = Math.max(100, Math.min(1000, wpm));
    }

    getWpm(): number {
        return this.wpm;
    }

    getCurrentIndex(): number {
        return this.currentIndex;
    }

    getTotalWords(): number {
        return this.words.length;
    }

    getState(): RSVPState {
        const wordsRemaining = Math.max(0, this.words.length - this.currentIndex);
        const secondsRemaining = (wordsRemaining / this.wpm) * 60;

        return {
            currentWord: this.words[this.currentIndex] ?? '',
            currentIndex: this.currentIndex,
            totalWords: this.words.length,
            percentage: this.words.length > 0
                ? Math.round((this.currentIndex / this.words.length) * 100)
                : 0,
            timeRemaining: this.formatTime(secondsRemaining),
            wordsRemaining,
            isPlaying: this.isPlaying,
        };
    }

    private scheduleNextWord(): void {
        if (!this.isPlaying) return;

        const word = this.words[this.currentIndex];
        const delay = this.calculateDelay(word);

        this.timerId = setTimeout(() => {
            this.currentIndex++;

            if (this.currentIndex >= this.words.length) {
                this.stop();
                return;
            }

            this.emitState();
            this.scheduleNextWord();
        }, delay);
    }

    private calculateDelay(word: string): number {
        const baseDelay = (60 / this.wpm) * 1000;

        // Add extra time for longer words or punctuation
        let multiplier = 1;
        if (word.length > 8) multiplier += 0.2;
        if (/[.!?]$/.test(word)) multiplier += 0.5;
        if (/[,;:]$/.test(word)) multiplier += 0.25;

        return baseDelay * multiplier;
    }

    private formatTime(seconds: number): string {
        if (seconds < 60) return `${Math.round(seconds)}s`;
        const mins = Math.floor(seconds / 60);
        const secs = Math.round(seconds % 60);
        return `${mins}m ${secs}s`;
    }

    private emitState(): void {
        if (this.onStateChange) {
            this.onStateChange(this.getState());
        }
    }

    destroy(): void {
        this.stop();
        this.onStateChange = null;
    }
}
