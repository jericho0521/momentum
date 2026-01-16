/**
 * Settings Screen (Premium)
 * Connected to real storage for persistent settings
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import Slider from '@react-native-community/slider';
import * as Haptics from 'expo-haptics';

import { theme } from '@/constants/theme';
import { Layout } from '@/components/ui/Layout';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { getSettings, saveSettings, clearAllData } from '@/services/storage';
import type { ReaderSettings } from '@/types';

export default function SettingsScreen() {
    const [settings, setSettings] = useState<ReaderSettings | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        const loaded = await getSettings();
        setSettings(loaded);
        setIsLoading(false);
    };

    const updateSetting = async <K extends keyof ReaderSettings>(
        key: K,
        value: ReaderSettings[K]
    ) => {
        if (!settings) return;

        const newSettings = { ...settings, [key]: value };
        setSettings(newSettings);
        await saveSettings(newSettings);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    const handleClearData = async () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        await clearAllData();
        await loadSettings();
    };

    if (isLoading || !settings) {
        return (
            <Layout style={styles.centered}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </Layout>
        );
    }

    return (
        <Layout>
            <Stack.Screen options={{ headerShown: false }} />

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.header}>Settings</Text>

                {/* Reading Speed */}
                <GlassCard style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Speed</Text>
                        <Text style={styles.valueDisplay}>{settings.wpm} wpm</Text>
                    </View>
                    <Slider
                        style={styles.slider}
                        minimumValue={100}
                        maximumValue={1000}
                        step={25}
                        value={settings.wpm}
                        onSlidingComplete={(v) => updateSetting('wpm', v)}
                        minimumTrackTintColor={theme.colors.primary}
                        maximumTrackTintColor={theme.colors.border}
                        thumbTintColor={theme.colors.primary}
                    />
                </GlassCard>

                {/* Typography */}
                <GlassCard style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Typography</Text>
                        <Text style={styles.valueDisplay}>{settings.fontSize}px</Text>
                    </View>
                    <Slider
                        style={styles.slider}
                        minimumValue={24}
                        maximumValue={64}
                        step={4}
                        value={settings.fontSize}
                        onSlidingComplete={(v) => updateSetting('fontSize', v)}
                        minimumTrackTintColor={theme.colors.primary}
                        maximumTrackTintColor={theme.colors.border}
                        thumbTintColor={theme.colors.primary}
                    />
                    <View style={styles.previewBox}>
                        <Text style={[styles.previewText, { fontSize: settings.fontSize }]}>
                            Zen Reader
                        </Text>
                    </View>
                </GlassCard>

                {/* Features Toggle */}
                <GlassCard style={styles.section}>
                    <Text style={styles.sectionTitle}>Focus</Text>

                    <View style={styles.row}>
                        <View>
                            <Text style={styles.label}>Word-by-Word Haptics</Text>
                            <Text style={styles.labelSub}>Vibrate on each word</Text>
                        </View>
                        <Switch
                            value={settings.highlightEnabled}
                            onValueChange={(v) => updateSetting('highlightEnabled', v)}
                            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                        />
                    </View>

                    <View style={[styles.row, styles.borderTop]}>
                        <View>
                            <Text style={styles.label}>Focus Point</Text>
                            <Text style={styles.labelSub}>Highlight optimal character</Text>
                        </View>
                        <Switch
                            value={settings.focusPointEnabled}
                            onValueChange={(v) => updateSetting('focusPointEnabled', v)}
                            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                        />
                    </View>
                </GlassCard>

                {/* Data Management */}
                <GlassCard style={styles.section}>
                    <Text style={styles.sectionTitle}>Data</Text>
                    <Button
                        title="Clear All Data"
                        onPress={handleClearData}
                        variant="outline"
                        size="medium"
                        style={{ marginTop: theme.spacing.m }}
                    />
                </GlassCard>

                <Text style={styles.version}>SpeedReader v2.0 (Zen)</Text>
            </ScrollView>
        </Layout>
    );
}

const styles = StyleSheet.create({
    content: {
        paddingVertical: theme.spacing.xl,
        gap: theme.spacing.l,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        fontSize: theme.typography.sizes.h1,
        fontWeight: '700',
        color: theme.colors.text,
        marginBottom: theme.spacing.m,
    },
    section: {
        padding: theme.spacing.l,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.m,
    },
    sectionTitle: {
        fontSize: theme.typography.sizes.h3,
        fontWeight: '600',
        color: theme.colors.text,
    },
    valueDisplay: {
        fontSize: theme.typography.sizes.body,
        color: theme.colors.textSecondary,
        fontVariant: ['tabular-nums'],
    },
    slider: {
        width: '100%',
        height: 40,
    },
    previewBox: {
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: theme.spacing.s,
        backgroundColor: theme.colors.background,
        borderRadius: theme.borderRadius.s,
    },
    previewText: {
        color: theme.colors.text,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: theme.spacing.m,
    },
    borderTop: {
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
    },
    label: {
        fontSize: theme.typography.sizes.body,
        color: theme.colors.text,
    },
    labelSub: {
        fontSize: theme.typography.sizes.small,
        color: theme.colors.textMuted,
        marginTop: 2,
    },
    version: {
        textAlign: 'center',
        color: theme.colors.textMuted,
        marginTop: theme.spacing.xl,
        fontSize: theme.typography.sizes.small,
    },
});
