/**
 * ZenControls Component
 * Minimalist playback controls with bookmark support
 */

import React from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/hooks/useTheme';

interface ZenControlsProps {
    isPlaying: boolean;
    onTogglePlay: () => void;
    wpm: number;
    progress: number;
    timeRemaining?: string;
    onSettingsPress?: () => void;
    onBookmarkPress?: () => void;
    hasBookmarkAtPosition?: boolean;
}

export function ZenControls({
    isPlaying,
    onTogglePlay,
    wpm,
    progress,
    timeRemaining,
    onSettingsPress,
    onBookmarkPress,
    hasBookmarkAtPosition = false,
}: ZenControlsProps) {
    const { theme } = useTheme();

    const handlePlayPress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onTogglePlay();
    };

    const handleBookmarkPress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onBookmarkPress?.();
    };

    return (
        <View style={styles.container}>
            {/* Progress Bar */}
            <View style={[styles.progressContainer, { backgroundColor: theme.colors.border }]}>
                <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: theme.colors.primary }]} />
            </View>

            {/* Control Bar */}
            <View style={[styles.controlBar, {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
            }]}>
                {/* Stats */}
                <View style={styles.stats}>
                    <Text style={[styles.statText, { color: theme.colors.text }]}>{wpm} wpm</Text>
                    {timeRemaining && (
                        <Text style={[styles.statSub, { color: theme.colors.textMuted }]}>{timeRemaining} left</Text>
                    )}
                </View>

                {/* Bookmark Button */}
                <Pressable onPress={handleBookmarkPress} style={styles.sideButton}>
                    <Ionicons
                        name={hasBookmarkAtPosition ? 'bookmark' : 'bookmark-outline'}
                        size={20}
                        color={hasBookmarkAtPosition ? theme.colors.primary : theme.colors.textSecondary}
                    />
                </Pressable>

                {/* Play/Pause Button */}
                <Pressable
                    onPress={handlePlayPress}
                    style={({ pressed }) => [
                        styles.playButton,
                        { backgroundColor: theme.colors.primary },
                        pressed && styles.playButtonPressed,
                    ]}
                >
                    <Ionicons
                        name={isPlaying ? 'pause' : 'play'}
                        size={28}
                        color={theme.colors.surface}
                    />
                </Pressable>

                {/* Settings Button */}
                <Pressable onPress={onSettingsPress} style={styles.sideButton}>
                    <Ionicons
                        name="settings-outline"
                        size={20}
                        color={theme.colors.textSecondary}
                    />
                </Pressable>

                {/* Spacer for symmetry */}
                <View style={styles.stats} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingBottom: 32,
    },
    progressContainer: {
        height: 4,
        width: '100%',
        marginBottom: 16,
    },
    progressFill: {
        height: '100%',
    },
    controlBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 24,
        marginHorizontal: 16,
        borderWidth: 1,
    },
    stats: {
        minWidth: 60,
    },
    statText: {
        fontSize: 14,
        fontWeight: '600',
    },
    statSub: {
        fontSize: 10,
    },
    sideButton: {
        padding: 8,
    },
    playButton: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -40,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 8,
    },
    playButtonPressed: {
        transform: [{ scale: 0.95 }],
        opacity: 0.9,
    },
});
