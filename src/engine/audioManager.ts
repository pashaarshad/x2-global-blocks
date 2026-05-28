// X2 Global Blocks — Audio Manager
// Complete sound system using expo-av
// Handles background music and sound effects with settings integration
import { Audio } from 'expo-av';

export type MusicTrack = 'menu' | 'gameplay' | 'victory';
export type SfxSound = 'drop' | 'merge' | 'combo' | 'gameover' | 'button';

// Music tracks
const MUSIC_SOURCES: Record<MusicTrack, any | null> = {
  menu: require('../../assets/audio/bgm_menu.mp3'),
  gameplay: require('../../assets/audio/bgm_gameplay.mp3'),
  victory: require('../../assets/audio/bgm_victory.mp3'),
};

// Sound effects
const SFX_SOURCES: Record<SfxSound, any | null> = {
  drop: require('../../assets/audio/sfx_drop.mp3'),
  merge: require('../../assets/audio/sfx_merge.mp3'),
  combo: require('../../assets/audio/sfx_combo.mp3'),
  gameover: require('../../assets/audio/sfx_gameover.mp3'),
  button: require('../../assets/audio/sfx_button.mp3'),
};

// Maximum allowed duration (ms) for each sound effect
const SFX_DURATIONS: Record<SfxSound, number> = {
  button: 800,
  drop: 1000,
  merge: 1200,
  combo: 1800,
  gameover: 4000,
};

class AudioManager {
  private currentMusic: Audio.Sound | null = null;
  private currentTrack: MusicTrack | null = null;
  private targetTrack: MusicTrack | null = null;
  private musicEnabled: boolean = true;
  private sfxEnabled: boolean = true;
  private musicVolume: number = 0.4;
  private sfxVolume: number = 0.7;
  private isInitialized: boolean = false;
  private activeSfx: Set<Audio.Sound> = new Set();

  async init(): Promise<void> {
    if (this.isInitialized) return;
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });
      this.isInitialized = true;
    } catch (e) {
      console.warn('AudioManager: Failed to initialize', e);
    }
  }

  setMusicEnabled(enabled: boolean): void {
    this.musicEnabled = enabled;
    if (!enabled) {
      this.stopMusic();
    }
  }

  setSfxEnabled(enabled: boolean): void {
    this.sfxEnabled = enabled;
  }

  async playMusic(track: MusicTrack): Promise<void> {
    this.targetTrack = track;
    if (!this.musicEnabled) return;

    const source = MUSIC_SOURCES[track];
    if (!source) return;

    if (this.currentTrack === track && this.currentMusic) return;

    await this.stopMusic();

    try {
      await this.init();
      const { sound } = await Audio.Sound.createAsync(source, {
        isLooping: track !== 'victory',
        volume: 0,
        shouldPlay: true,
      });

      this.currentMusic = sound;
      this.currentTrack = track;

      // Fade in
      const steps = 10;
      for (let i = 1; i <= steps; i++) {
        setTimeout(async () => {
          try {
            if (this.currentMusic === sound) {
              await sound.setVolumeAsync((i / steps) * this.musicVolume);
            }
          } catch (_) {}
        }, i * 100);
      }
    } catch (e) {
      console.warn(`AudioManager: Failed to play music ${track}`, e);
    }
  }

  async stopMusic(): Promise<void> {
    if (!this.currentMusic) return;

    const sound = this.currentMusic;
    this.currentMusic = null;
    this.currentTrack = null;
    this.targetTrack = null;

    try {
      await sound.stopAsync();
      await sound.unloadAsync();
    } catch (_) {}
  }

  async pauseMusic(): Promise<void> {
    if (!this.currentMusic) return;
    try {
      await this.currentMusic.pauseAsync();
    } catch (e) {
      console.warn('AudioManager: Failed to pause music', e);
    }
  }

  async resumeMusic(): Promise<void> {
    if (!this.currentMusic || !this.musicEnabled) return;
    try {
      await this.currentMusic.playAsync();
    } catch (e) {
      console.warn('AudioManager: Failed to resume music', e);
    }
  }

  async playSfx(soundName: SfxSound): Promise<void> {
    // Resolve autoplay block
    if (this.musicEnabled && this.targetTrack && !this.currentMusic) {
      this.playMusic(this.targetTrack).catch(() => {});
    }

    if (!this.sfxEnabled) return;

    const source = SFX_SOURCES[soundName];
    if (!source) return;

    try {
      await this.init();
      const { sound } = await Audio.Sound.createAsync(source, {
        volume: this.sfxVolume,
        shouldPlay: true,
      });

      this.activeSfx.add(sound);
      let cleaned = false;

      const cleanup = async () => {
        if (cleaned) return;
        cleaned = true;
        this.activeSfx.delete(sound);
        try {
          await sound.stopAsync();
          await sound.unloadAsync();
        } catch (_) {}
      };

      const maxDuration = SFX_DURATIONS[soundName] || 1500;
      const timeout = setTimeout(cleanup, maxDuration);

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          clearTimeout(timeout);
          cleanup();
        }
      });
    } catch (e) {
      console.warn(`AudioManager: Failed to play sfx ${soundName}`, e);
    }
  }

  async cleanup(): Promise<void> {
    await this.stopMusic();
    for (const sound of this.activeSfx) {
      try {
        await sound.unloadAsync();
      } catch (_) {}
    }
    this.activeSfx.clear();
  }
}

export const audioManager = new AudioManager();
