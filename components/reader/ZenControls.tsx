/**
 * ZenControls Component
 * Minimalist playback controls for the reader
 */

import React from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { theme } from '@/constants/theme';

interface ZenControlsProps {
    isPlaying: boolean;
    onTogglePlay: () => void;
    wpm: number;
    progress: number;
    timeRemaining?: string;
    onSettingsPress?: () => void;
}

export function ZenControls({
    isPlaying,
    onTogglePlay,
    wpm,
    progress,
    timeRemaining,
    onSettingsPress,
}: ZenControlsProps) {

    const handlePlayPress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onTogglePlay();
    };

    return (
        <View style={styles.container}>
            {/* Progress Bar */}
            <View style={styles.progressContainer}>
                <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>

            {/* Control Bar */}
            <View style={styles.controlBar}>
                {/* Stats */}
                <View style={styles.stats}>
                    <Text style={styles.statText}>{wpm} wpm</Text>
                    {timeRemaining && (
                        <Text style={styles.statSub}>{timeRemaining} left</Text>
                    )}
                </View>

                {/* Play/Pause Button */}
                <Pressable
                    onPress={handlePlayPress}
                    style={({ pressed }) => [
                        styles.playButton,
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
                <Pressable
                    onPress={onSettingsPress}
                    style={styles.settingsButton}
                >
                    <Ionicons
                        name="settings-outline"
                        size={20}
                        color={theme.colors.textSecondary}
                    />
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingBottom: theme.spacing.xl,
    },
    progressContainer: {
        height: 4,
        backgroundColor: theme.colors.border,
        width: '100%',
        marginBottom: theme.spacing.m,
    },
    progressFill: {
        height: '100%',
        backgroundColor: theme.colors.primary,
    },
    controlBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: theme.spacing.m,
        paddingHorizontal: theme.spacing.l,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.l,
        marginHorizontal: theme.spacing.m,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    stats: {
        minWidth: 80,
    },
    statText: {
        fontSize: theme.typography.sizes.caption,
        fontWeight: '600',
        color: theme.colors.text,
    },
    statSub: {
        fontSize: 10,
        color: theme.colors.textMuted,
    },
    playButton: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -40,
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    playButtonPressed: {
        transform: [{ scale: 0.95 }],
        opacity: 0.9,
    },
    settingsButton: {
        padding: theme.spacing.s,
    },
});
