// X2 Global Blocks — Settings Screen
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Switch,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, GRADIENTS } from '../constants/colors';
import { useProgressStore } from '../store/progressStore';

interface SettingsScreenProps {
  navigation: any;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const settings = useProgressStore((s) => s.settings);
  const updateSettings = useProgressStore((s) => s.updateSettings);
  const resetAllProgress = useProgressStore((s) => s.resetAllProgress);
  const globalHighScore = useProgressStore((s) => s.globalHighScore);
  const levelsCompleted = useProgressStore((s) => s.levelsCompleted);

  const handleReset = () => {
    Alert.alert(
      'Reset Progress',
      'This will delete ALL your progress, scores, and stars. This cannot be undone!',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset Everything',
          style: 'destructive',
          onPress: () => {
            resetAllProgress();
            Alert.alert('Done', 'All progress has been reset.');
          },
        },
      ]
    );
  };

  return (
    <LinearGradient
      colors={GRADIENTS.splash as [string, string]}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>SETTINGS</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Sound & Vibration */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔊 AUDIO & HAPTICS</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Sound Effects</Text>
              <Text style={styles.settingDescription}>
                Merge, drop, and combo sounds
              </Text>
            </View>
            <Switch
              value={settings.soundEnabled}
              onValueChange={(v) => updateSettings({ soundEnabled: v })}
              trackColor={{ false: COLORS.gridBorder, true: COLORS.neonBlue }}
              thumbColor={settings.soundEnabled ? '#fff' : COLORS.textMuted}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Background Music</Text>
              <Text style={styles.settingDescription}>
                Ambient game music
              </Text>
            </View>
            <Switch
              value={settings.musicEnabled}
              onValueChange={(v) => updateSettings({ musicEnabled: v })}
              trackColor={{ false: COLORS.gridBorder, true: COLORS.neonBlue }}
              thumbColor={settings.musicEnabled ? '#fff' : COLORS.textMuted}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Vibration</Text>
              <Text style={styles.settingDescription}>
                Haptic feedback on merges
              </Text>
            </View>
            <Switch
              value={settings.hapticsEnabled}
              onValueChange={(v) => updateSettings({ hapticsEnabled: v })}
              trackColor={{ false: COLORS.gridBorder, true: COLORS.neonBlue }}
              thumbColor={settings.hapticsEnabled ? '#fff' : COLORS.textMuted}
            />
          </View>
        </View>

        {/* Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 YOUR STATS</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>
                {levelsCompleted.length}
              </Text>
              <Text style={styles.statLabel}>Levels Done</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>
                {globalHighScore.toLocaleString()}
              </Text>
              <Text style={styles.statLabel}>High Score</Text>
            </View>
          </View>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚠️ DATA</Text>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={handleReset}
            activeOpacity={0.7}
          >
            <Text style={styles.resetButtonText}>🗑️  Reset All Progress</Text>
          </TouchableOpacity>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ℹ️ ABOUT</Text>
          <View style={styles.aboutCard}>
            <Text style={styles.aboutTitle}>X2 Global Blocks</Text>
            <Text style={styles.aboutVersion}>Version 1.0.0</Text>
            <View style={styles.aboutDivider} />
            <Text style={styles.aboutStudio}>AP Programming Tech</Text>
            <Text style={styles.aboutTagline}>Reach New Goals ✨</Text>
            <View style={styles.aboutDivider} />
            <Text style={styles.aboutCopy}>
              © 2025 AP Programming Tech{'\n'}
              All rights reserved.
            </Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.bgCard,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.gridBorder,
  },
  backButtonText: {
    color: COLORS.textPrimary,
    fontSize: 22,
    fontWeight: '700',
  },
  headerTitle: {
    color: COLORS.textPrimary,
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 3,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 12,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.bgCard,
    borderRadius: 14,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.gridBorder,
  },
  settingInfo: {
    flex: 1,
    marginRight: 12,
  },
  settingLabel: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  settingDescription: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.bgCard,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.gridBorder,
  },
  statValue: {
    color: COLORS.gold,
    fontSize: 24,
    fontWeight: '900',
  },
  statLabel: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
    letterSpacing: 0.5,
  },
  resetButton: {
    backgroundColor: 'rgba(231, 76, 60, 0.15)',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(231, 76, 60, 0.3)',
  },
  resetButtonText: {
    color: COLORS.danger,
    fontSize: 14,
    fontWeight: '700',
  },
  aboutCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.gridBorder,
  },
  aboutTitle: {
    color: COLORS.gold,
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 1,
  },
  aboutVersion: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 4,
  },
  aboutDivider: {
    width: 60,
    height: 1,
    backgroundColor: COLORS.gridBorder,
    marginVertical: 12,
  },
  aboutStudio: {
    color: COLORS.neonBlue,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
  aboutTagline: {
    color: COLORS.neonGreen,
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  aboutCopy: {
    color: COLORS.textMuted,
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 18,
  },
});
