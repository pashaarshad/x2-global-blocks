// X2 Global Blocks — Audio Manager
// Complete sound system using expo-av
// Handles background music and sound effects with settings integration
import { Audio } from 'expo-av';

export type MusicTrack = 'menu' | 'gameplay' | 'victory';
export type SfxSound = 'drop' | 'merge' | 'combo' | 'gameover' | 'button';

// ============================================================
// HOW TO ADD YOUR MUSIC FILES:
// ============================================================
// 1. Download royalty-free music files (MP3/WAV)
// 2. Place them in:  assets/audio/
// 3. Name them exactly:
//    - bgm_menu.mp3      (Home & Level Select background music)
//    - bgm_gameplay.mp3   (In-game background music)
//    - bgm_victory.mp3    (Victory screen celebration)
//    - sfx_drop.mp3       (Block landing sound)
//    - sfx_merge.mp3      (Merge pop sound)
//    - sfx_combo.mp3      (Combo chain sound)
//    - sfx_gameover.mp3   (Game over sound)
//    - sfx_button.mp3     (Button tap sound)
// 4. Uncomment the corresponding require() line below
// 5. Restart the app
// ============================================================

// Music tracks — uncomment when you add the files
const MUSIC_SOURCES: Record<MusicTrack, any | null> = {
  menu: require('../../assets/audio/bgm_menu.mp3'),
  gameplay: require('../../assets/audio/bgm_gameplay.mp3'),
  victory: require('../../assets/audio/bgm_victory.mp3'),
};

// Sound effects — uncomment when you add the files
const SFX_SOURCES: Record<SfxSound, any | null> = {
  drop: require('../../assets/audio/sfx_drop.mp3'),
  merge: require('../../assets/audio/sfx_merge.mp3'),
  combo: require('../../assets/audio/sfx_combo.mp3'),
  gameover: require('../../assets/audio/sfx_gameover.mp3'),
  button: require('../../assets/audio/sfx_button.mp3'),
};

// Maximum allowed duration (in milliseconds) for each sound effect to keep them short and crisp
const SFX_DURATIONS: Record<SfxSound, number> = {
  button: 800,     // 0.8 seconds limit for quick click
  drop: 1000,      // 1.0 second limit for block drop
  merge: 1200,     // 1.2 seconds limit for merge pop
  combo: 1800,     // 1.8 seconds limit for combos
  gameover: 4000,  // 4.0 seconds limit for game over cue
};

class AudioManager {
  private currentMusic: Audio.Sound | null = null;
  private currentTrack: MusicTrack | null = null;
  private targetTrack: MusicTrack | null = null;
  private sfxPool: Map<string, Audio.Sound> = new Map();
  private musicEnabled: boolean = true;
  private sfxEnabled: boolean = true;
  private musicVolume: number = 0.4;  // Background music at 40%
  private sfxVolume: number = 0.7;    // Sound effects at 70%
  private isInitialized: boolean = false;

  /**
   * Initialize audio mode for the app
   */
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

  /**
   * Set music enabled/disabled
   */
  setMusicEnabled(enabled: boolean): void {
    this.musicEnabled = enabled;
    if (!enabled) {
      this.stopMusic();
    }
  }

  /**
   * Set sound effects enabled/disabled
   */
  setSfxEnabled(enabled: boolean): void {
    this.sfxEnabled = enabled;
  }

  /**
   * Play background music track (loops forever)
   */
  async playMusic(track: MusicTrack): Promise<void> {
    this.targetTrack = track;
    if (!this.musicEnabled) return;
    
    const source = MUSIC_SOURCES[track];
    if (!source) {
      // File not added yet — silent mode
      return;
    }

    // Don't restart same track
    if (this.currentTrack === track && this.currentMusic) return;

    // Stop current music
    await this.stopMusic();

    try {
      await this.init();
      const { sound } = await Audio.Sound.createAsync(source, {
        isLooping: track !== 'victory',
        volume: this.musicVolume,
        shouldPlay: true,
      });

      this.currentMusic = sound;
      this.currentTrack = track;

      // Fade in effect
      await sound.setVolumeAsync(0);
      const steps = 10;
      const stepDuration = 100;
      for (let i = 1; i <= steps; i++) {
        setTimeout(async () => {
          try {
            await sound.setVolumeAsync((i / steps) * this.musicVolume);
          } catch (_) {}
        }, i * stepDuration);
      }
    } catch (e) {
      console.warn(`AudioManager: Failed to play ${track}`, e);
    }
  }

  /**
   * Stop background music with fade out
   */
  async stopMusic(): Promise<void> {
    if (!this.currentMusic) return;

    try {
      // Quick fade out
      const sound = this.currentMusic;
      await sound.setVolumeAsync(this.musicVolume * 0.5);
      setTimeout(async () => {
        try {
          await sound.setVolumeAsync(0);
          setTimeout(async () => {
            try {
              await sound.stopAsync();
              await sound.unloadAsync();
            } catch (_) {}
          }, 150);
        } catch (_) {}
      }, 100);
    } catch (e) {
      console.warn('AudioManager: Failed to stop music', e);
    }

    this.currentMusic = null;
    this.currentTrack = null;
    this.targetTrack = null;
  }

  /**
   * Pause current background music
   */
  async pauseMusic(): Promise<void> {
    if (!this.currentMusic) return;
    try {
      await this.currentMusic.pauseAsync();
    } catch (e) {
      console.warn('AudioManager: Failed to pause music', e);
    }
  }

  /**
   * Resume current background music
   */
  async resumeMusic(): Promise<void> {
    if (!this.currentMusic || !this.musicEnabled) return;
    try {
      await this.currentMusic.playAsync();
    } catch (e) {
      console.warn('AudioManager: Failed to resume music', e);
    }
  }

  /**
   * Play a sound effect (fire-and-forget)
   */
  async playSfx(sound: SfxSound): Promise<void> {
    // Automatically resolve browser autoplay blocks when any sound effect/button tap occurs
    if (this.musicEnabled && this.targetTrack && !this.currentMusic) {
      this.playMusic(this.targetTrack).catch(() => {});
    }

    if (!this.sfxEnabled) return;

    const source = SFX_SOURCES[sound];
    if (!source) {
      // File not added yet — silent mode
      return;
    }

    try {
      await this.init();
      const { sound: sfx } = await Audio.Sound.createAsync(source, {
        volume: this.sfxVolume,
        shouldPlay: true,
      });

      let cleanedUp = false;
      let stopTimeout: NodeJS.Timeout | null = null;

      const cleanupSfx = async () => {
        if (cleanedUp) return;
        cleanedUp = true;
        
        if (stopTimeout) {
          clearTimeout(stopTimeout);
        }
        
        try {
          await sfx.stopAsync();
          await sfx.unloadAsync();
        } catch (_) {
          // Ignore any errors from double-cleanup or already-unloaded sounds
        }
      };

      // Cap the duration based on the type of sound effect
      const maxDuration = SFX_DURATIONS[sound] || 1500;
      stopTimeout = setTimeout(cleanupSfx, maxDuration);

      // Auto-cleanup if the audio naturally finishes before the timeout
      sfx.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          cleanupSfx();
        }
      });
    } catch (e) {
      console.warn(`AudioManager: Failed to play sfx ${sound}`, e);
    }
  }

  /**
   * Cleanup — call when app is closing
   */
  async cleanup(): Promise<void> {
    await this.stopMusic();
    for (const [_, sound] of this.sfxPool) {
      try {
        await sound.unloadAsync();
      } catch (_) {}
    }
    this.sfxPool.clear();
  }
}

// Singleton instance
export const audioManager = new AudioManager();
