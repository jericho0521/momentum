/**
 * Settings Screen (Premium)
 * With Dark Mode toggle and persistent settings
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, ActivityIndicator, Pressable } from 'react-native';
import { Stack } from 'expo-router';
import Slider from '@react-native-community/slider';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '@/hooks/useTheme';
import { Layout } from '@/components/ui/Layout';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { getSettings, saveSettings, clearAllData } from '@/services/storage';
import type { ReaderSettings } from '@/types';
import type { ThemeMode } from '@/constants/theme';

export default function SettingsScreen() {
    const { theme, themeMode, setThemeMode, isDark } = useTheme();
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

    const handleThemeChange = (mode: ThemeMode) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setThemeMode(mode);
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

            <ScrollView contentContainerStyle={[styles.content, { gap: theme.spacing.l }]}>
                <Text style={[styles.header, { color: theme.colors.text }]}>Settings</Text>

                {/* Appearance */}
                <GlassCard style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Appearance</Text>
                    <View style={styles.themeRow}>
                        {(['light', 'dark', 'system'] as ThemeMode[]).map((mode) => (
                            <Pressable
                                key={mode}
                                onPress={() => handleThemeChange(mode)}
                                style={[
                                    styles.themeOption,
                                    {
                                        borderColor: themeMode === mode ? theme.colors.primary : theme.colors.border,
                                        backgroundColor: themeMode === mode ? theme.colors.primary + '15' : 'transparent',
                                    },
                                ]}
                            >
                                <Ionicons
                                    name={mode === 'light' ? 'sunny' : mode === 'dark' ? 'moon' : 'phone-portrait'}
                                    size={20}
                                    color={themeMode === mode ? theme.colors.primary : theme.colors.textSecondary}
                                />
                                <Text style={[
                                    styles.themeLabel,
                                    { color: themeMode === mode ? theme.colors.primary : theme.colors.textSecondary }
                                ]}>
                                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                                </Text>
                            </Pressable>
                        ))}
                    </View>
                </GlassCard>

                {/* Reading Speed */}
                <GlassCard style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Speed</Text>
                        <Text style={[styles.valueDisplay, { color: theme.colors.textSecondary }]}>{settings.wpm} wpm</Text>
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
                        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Typography</Text>
                        <Text style={[styles.valueDisplay, { color: theme.colors.textSecondary }]}>{settings.fontSize}px</Text>
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
                    <View style={[styles.previewBox, { backgroundColor: theme.colors.background }]}>
                        <Text style={[styles.previewText, { fontSize: settings.fontSize, color: theme.colors.text }]}>
                            Momentum
                        </Text>
                    </View>
                </GlassCard>

                {/* Focus Features */}
                <GlassCard style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Focus</Text>

                    <View style={styles.row}>
                        <View>
                            <Text style={[styles.label, { color: theme.colors.text }]}>Word-by-Word Haptics</Text>
                            <Text style={[styles.labelSub, { color: theme.colors.textMuted }]}>Vibrate on each word</Text>
                        </View>
                        <Switch
                            value={settings.highlightEnabled}
                            onValueChange={(v) => updateSetting('highlightEnabled', v)}
                            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                        />
                    </View>

                    <View style={[styles.row, { borderTopWidth: 1, borderTopColor: theme.colors.border }]}>
                        <View>
                            <Text style={[styles.label, { color: theme.colors.text }]}>Focus Point</Text>
                            <Text style={[styles.labelSub, { color: theme.colors.textMuted }]}>Highlight optimal character</Text>
                        </View>
                        <Switch
                            value={settings.focusPointEnabled}
                            onValueChange={(v) => updateSetting('focusPointEnabled', v)}
                            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                        />
                    </View>

                    <View style={[styles.row, { borderTopWidth: 1, borderTopColor: theme.colors.border }]}>
                        <View>
                            <Text style={[styles.label, { color: theme.colors.text }]}>Natural Reading</Text>
                            <Text style={[styles.labelSub, { color: theme.colors.textMuted }]}>Pause on punctuation</Text>
                        </View>
                        <Switch
                            value={settings.naturalReadingEnabled}
                            onValueChange={(v) => updateSetting('naturalReadingEnabled', v)}
                            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                        />
                    </View>

                    {settings.naturalReadingEnabled && (
                        <>
                            <View style={[styles.sliderRow, { borderTopWidth: 1, borderTopColor: theme.colors.border }]}>
                                <View style={styles.sliderHeader}>
                                    <Text style={[styles.label, { color: theme.colors.text }]}>Period Delay</Text>
                                    <Text style={[styles.valueDisplay, { color: theme.colors.textSecondary }]}>+{Math.round(settings.periodDelay * 100)}%</Text>
                                </View>
                                <Slider
                                    style={styles.slider}
                                    minimumValue={0}
                                    maximumValue={2}
                                    step={0.1}
                                    value={settings.periodDelay}
                                    onSlidingComplete={(v) => updateSetting('periodDelay', v)}
                                    minimumTrackTintColor={theme.colors.primary}
                                    maximumTrackTintColor={theme.colors.border}
                                    thumbTintColor={theme.colors.primary}
                                />
                            </View>

                            <View style={[styles.sliderRow, { borderTopWidth: 1, borderTopColor: theme.colors.border }]}>
                                <View style={styles.sliderHeader}>
                                    <Text style={[styles.label, { color: theme.colors.text }]}>Comma Delay</Text>
                                    <Text style={[styles.valueDisplay, { color: theme.colors.textSecondary }]}>+{Math.round(settings.commaDelay * 100)}%</Text>
                                </View>
                                <Slider
                                    style={styles.slider}
                                    minimumValue={0}
                                    maximumValue={2}
                                    step={0.1}
                                    value={settings.commaDelay}
                                    onSlidingComplete={(v) => updateSetting('commaDelay', v)}
                                    minimumTrackTintColor={theme.colors.primary}
                                    maximumTrackTintColor={theme.colors.border}
                                    thumbTintColor={theme.colors.primary}
                                />
                            </View>
                        </>
                    )}
                </GlassCard>

                {/* Data */}
                <GlassCard style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Data</Text>
                    <Button
                        title="Clear All Data"
                        onPress={handleClearData}
                        variant="outline"
                        size="medium"
                        style={{ marginTop: 16 }}
                    />
                </GlassCard>

                <Text style={[styles.version, { color: theme.colors.textMuted }]}>Momentum v1.0</Text>
            </ScrollView>
        </Layout>
    );
}

const styles = StyleSheet.create({
    content: {
        paddingVertical: 32,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        fontSize: 32,
        fontWeight: '700',
        marginBottom: 16,
    },
    section: {
        padding: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
    },
    valueDisplay: {
        fontSize: 16,
        fontVariant: ['tabular-nums'],
    },
    themeRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 16,
    },
    themeOption: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 2,
        gap: 8,
    },
    themeLabel: {
        fontSize: 14,
        fontWeight: '500',
    },
    slider: {
        width: '100%',
        height: 40,
    },
    previewBox: {
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
        borderRadius: 8,
    },
    previewText: {},
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
    },
    label: {
        fontSize: 16,
    },
    labelSub: {
        fontSize: 12,
        marginTop: 2,
    },
    sliderRow: {
        paddingVertical: 16,
    },
    sliderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    version: {
        textAlign: 'center',
        marginTop: 32,
        fontSize: 12,
    },
});
