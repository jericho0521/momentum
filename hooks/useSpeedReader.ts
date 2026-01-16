/**
 * useSpeedReader Hook
 * Connects RSVPEngine to React state
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import * as Haptics from 'expo-haptics';
import { RSVPEngine, RSVPState } from '@/services/rsvp-engine';
import { getSettings, saveProgress, getProgress } from '@/services/storage';
import type { ReaderSettings, ReadingProgress } from '@/types';

interface UseSpeedReaderOptions {
    documentId: string;
    content: string;
    onComplete?: () => void;
}

export function useSpeedReader({ documentId, content, onComplete }: UseSpeedReaderOptions) {
    const engineRef = useRef<RSVPEngine | null>(null);
    const [settings, setSettings] = useState<ReaderSettings | null>(null);
    const [state, setState] = useState<RSVPState>({
        currentWord: '',
        currentIndex: 0,
        totalWords: 0,
        percentage: 0,
        timeRemaining: '0s',
        wordsRemaining: 0,
        isPlaying: false,
    });

    // Reload settings from storage (call when screen gains focus)
    const reloadSettings = useCallback(async () => {
        const loadedSettings = await getSettings();
        setSettings(loadedSettings);
        if (engineRef.current) {
            engineRef.current.setWpm(loadedSettings.wpm);
            console.log('Settings reloaded, WPM:', loadedSettings.wpm);
        }
    }, []);

    // Initialize engine and load settings
    useEffect(() => {
        const init = async () => {
            const loadedSettings = await getSettings();
            setSettings(loadedSettings);

            const engine = new RSVPEngine((newState) => {
                setState(newState);
                if (loadedSettings.highlightEnabled && newState.isPlaying) {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
            });

            engine.setWpm(loadedSettings.wpm);
            engine.loadContent(content);

            const savedProgress = await getProgress(documentId);
            if (savedProgress && savedProgress.currentWordIndex > 0) {
                engine.jumpTo(savedProgress.currentWordIndex);
            }

            engineRef.current = engine;
            setState(engine.getState());
        };

        init();
        return () => { engineRef.current?.destroy(); };
    }, [documentId, content]);

    // Auto-save progress
    useEffect(() => {
        const interval = setInterval(async () => {
            if (engineRef.current && state.currentIndex > 0) {
                const progress: ReadingProgress = {
                    documentId,
                    currentWordIndex: state.currentIndex,
                    totalWords: state.totalWords,
                    wpm: engineRef.current.getWpm(),
                    lastUpdated: Date.now(),
                };
                await saveProgress(progress);
            }
        }, 10000);
        return () => clearInterval(interval);
    }, [documentId, state.currentIndex, state.totalWords]);

    // Detect completion
    useEffect(() => {
        if (state.percentage >= 100 && !state.isPlaying && state.totalWords > 0) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            onComplete?.();
        }
    }, [state.percentage, state.isPlaying, state.totalWords, onComplete]);

    const play = useCallback(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        engineRef.current?.play();
    }, []);

    const pause = useCallback(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        engineRef.current?.pause();
    }, []);

    const togglePlay = useCallback(() => {
        state.isPlaying ? pause() : play();
    }, [state.isPlaying, play, pause]);

    const skip = useCallback((count: number = 10) => {
        engineRef.current?.skip(count);
    }, []);

    const rewind = useCallback((count: number = 10) => {
        engineRef.current?.rewind(count);
    }, []);

    const setSpeed = useCallback((wpm: number) => {
        engineRef.current?.setWpm(wpm);
        setSettings(prev => prev ? { ...prev, wpm } : null);
    }, []);

    const jumpToPercent = useCallback((percent: number) => {
        if (engineRef.current) {
            const index = Math.floor((percent / 100) * state.totalWords);
            engineRef.current.jumpTo(index);
        }
    }, [state.totalWords]);

    return {
        ...state,
        settings,
        play,
        pause,
        togglePlay,
        skip,
        rewind,
        setSpeed,
        jumpToPercent,
        reloadSettings,
    };
}
