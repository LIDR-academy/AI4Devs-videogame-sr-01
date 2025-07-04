/**
 * Audio System for Will of Persia
 * Generates 8-bit style sounds using Web Audio API
 * Follows Single Responsibility Principle
 */

class AudioManager {
  constructor() {
    this.audioContext = null;
    this.sounds = {};
    this.musicGain = null;
    this.sfxGain = null;
    this.currentMusic = null;
    this.musicVolume = 0.3;
    this.sfxVolume = 0.5;
    this.muted = false;

    // Menu music state
    this.menuMusicPlaying = false;
    this.menuMusicLoopId = null;
    this.menuMusicWasMuted = false;

    // Audio activation state
    this.audioEnabled = false;
    this.pendingMenuMusic = false;

    this.initAudioContext();
    this.createGainNodes();
    this.preloadSounds();
    this.setupUserInteractionListener();
  }

  /**
   * Initialize AudioContext with Safari-specific optimizations
   */
  initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext ||
        window.webkitAudioContext)({
        // Safari optimization: lower sample rate for better performance
        sampleRate: 22050,
        // Safari optimization: smaller buffer size
        latencyHint: "interactive",
      });
      this.createGainNodes();
    } catch (error) {
      console.warn("AudioContext initialization failed:", error);
      this.audioContext = null;
    }
  }

  /**
   * Create gain nodes for volume control
   */
  createGainNodes() {
    if (!this.audioContext) return;

    this.musicGain = this.audioContext.createGain();
    this.sfxGain = this.audioContext.createGain();

    this.musicGain.connect(this.audioContext.destination);
    this.sfxGain.connect(this.audioContext.destination);

    this.musicGain.gain.value = this.musicVolume;
    this.sfxGain.gain.value = this.sfxVolume;
  }

  /**
   * Setup user interaction listener to enable audio
   */
  setupUserInteractionListener() {
    const enableAudio = async () => {
      if (!this.audioEnabled) {
        try {
          await this.resumeAudioContext();
          this.audioEnabled = true;

          // Start pending menu music if requested
          if (this.pendingMenuMusic) {
            this.pendingMenuMusic = false;
            setTimeout(() => {
              this.startMenuMusic();
            }, 100);
          }

          // Hide audio activation hint
          this.hideAudioHint();

          // Remove listeners after first activation
          document.removeEventListener("click", enableAudio);
          document.removeEventListener("keydown", enableAudio);
          document.removeEventListener("touchstart", enableAudio);
        } catch (error) {
          console.warn("Failed to enable audio:", error);
        }
      }
    };

    // Add listeners for various user interactions
    document.addEventListener("click", enableAudio);
    document.addEventListener("keydown", enableAudio);
    document.addEventListener("touchstart", enableAudio);
  }

  /**
   * Resume audio context if suspended (required for some browsers)
   */
  async resumeAudioContext() {
    if (this.audioContext && this.audioContext.state === "suspended") {
      try {
        await this.audioContext.resume();
      } catch (error) {
        console.warn("Failed to resume audio context:", error);
      }
    }
  }

  /**
   * Preload all sound definitions
   */
  preloadSounds() {
    // No need to preload with procedural audio
  }

  /**
   * Generate 8-bit style beep sound with Safari optimizations
   */
  createBeep(frequency, duration, type = "square") {
    if (!this.audioContext || this.muted || !this.audioEnabled) return;

    // Safari optimization: use try-catch and simpler operations
    try {
      const oscillator = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();

      oscillator.connect(gain);
      gain.connect(this.sfxGain);

      oscillator.frequency.value = frequency;
      oscillator.type = type;

      // Safari optimization: simpler gain envelope (linear instead of exponential)
      const now = this.audioContext.currentTime;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.01); // Reduced volume for Safari
      gain.gain.linearRampToValueAtTime(0, now + duration); // Linear instead of exponential

      oscillator.start(now);
      oscillator.stop(now + duration);

      // Safari optimization: cleanup to prevent memory leaks
      oscillator.onended = () => {
        try {
          oscillator.disconnect();
          gain.disconnect();
        } catch (e) {
          // Ignore disconnect errors
        }
      };
    } catch (error) {
      console.warn("Audio creation failed:", error);
    }
  }

  /**
   * Generate chord progression
   */
  createChord(frequencies, duration, type = "square") {
    frequencies.forEach((freq) => {
      this.createBeep(freq, duration, type);
    });
  }

  /**
   * Play jump sound effect
   */
  playJump() {
    this.createBeep(220, 0.1, "square");
    setTimeout(() => this.createBeep(330, 0.1, "square"), 50);
  }

  /**
   * Play key collection sound
   */
  playKeyCollect() {
    this.createBeep(523, 0.1, "triangle"); // C5
    setTimeout(() => this.createBeep(659, 0.1, "triangle"), 100); // E5
    setTimeout(() => this.createBeep(784, 0.2, "triangle"), 200); // G5
  }

  /**
   * Play switch activation sound
   */
  playSwitch() {
    this.createBeep(440, 0.15, "square"); // A4
    setTimeout(() => this.createBeep(554, 0.15, "square"), 75); // C#5
  }

  /**
   * Play door opening sound
   */
  playDoorOpen() {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        this.createBeep(200 + i * 50, 0.1, "sawtooth");
      }, i * 50);
    }
  }

  /**
   * Play level complete sound
   */
  playLevelComplete() {
    const melody = [523, 659, 784, 1047]; // C-E-G-C octave
    melody.forEach((freq, index) => {
      setTimeout(() => {
        this.createBeep(freq, 0.3, "triangle");
      }, index * 200);
    });
  }

  /**
   * Play sinister death laugh
   */
  playDeathLaugh() {
    // Create a creepy descending laugh pattern
    const laughPattern = [
      { freq: 800, duration: 0.15, delay: 0 },
      { freq: 700, duration: 0.15, delay: 150 },
      { freq: 600, duration: 0.15, delay: 300 },
      { freq: 500, duration: 0.2, delay: 450 },
      { freq: 400, duration: 0.2, delay: 650 },
      { freq: 300, duration: 0.3, delay: 850 },
      { freq: 200, duration: 0.4, delay: 1150 },
    ];

    laughPattern.forEach((note) => {
      setTimeout(() => {
        if (!this.audioContext || this.muted || !this.audioEnabled) return;

        const oscillator = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();

        oscillator.connect(filter);
        filter.connect(gain);
        gain.connect(this.sfxGain);

        oscillator.frequency.value = note.freq;
        oscillator.type = "sawtooth";

        // Make it sound more sinister
        filter.type = "lowpass";
        filter.frequency.value = note.freq * 2;
        filter.Q.value = 10;

        const now = this.audioContext.currentTime;
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.4, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.01, now + note.duration);

        // Add vibrato for creepy effect
        const vibrato = this.audioContext.createOscillator();
        const vibratoGain = this.audioContext.createGain();
        vibrato.connect(vibratoGain);
        vibratoGain.connect(oscillator.frequency);
        vibrato.frequency.value = 5; // 5Hz vibrato
        vibratoGain.gain.value = 10;

        vibrato.start(now);
        vibrato.stop(now + note.duration);

        oscillator.start(now);
        oscillator.stop(now + note.duration);
      }, note.delay);
    });
  }

  /**
   * Play damage sound
   */
  playDamage() {
    this.createBeep(150, 0.3, "sawtooth");
    setTimeout(() => this.createBeep(100, 0.2, "sawtooth"), 150);
  }

  /**
   * Play warning sound for falling spike traps
   */
  playWarning() {
    if (!this.audioContext || this.muted || !this.audioEnabled) return;

    // Create urgent warning sound
    const frequencies = [800, 1000, 1200];
    frequencies.forEach((freq, index) => {
      setTimeout(() => {
        this.createBeep(freq, 0.15, "sawtooth");
      }, index * 50);
    });

    // Add second warning wave
    setTimeout(() => {
      frequencies.forEach((freq, index) => {
        setTimeout(() => {
          this.createBeep(freq, 0.15, "sawtooth");
        }, index * 50);
      });
    }, 300);
  }

  /**
   * Start background music
   */
  startBackgroundMusic() {
    if (this.currentMusic) {
      this.stopBackgroundMusic();
    }

    this.playBackgroundLoop();
  }

  /**
   * Play looping background music
   */
  playBackgroundLoop() {
    if (!this.audioContext || this.muted || !this.audioEnabled) {
      // Try again in 2 seconds
      setTimeout(() => this.playBackgroundLoop(), 2000);
      return;
    }

    // Simple 8-bit style chord progression
    const chordProgression = [
      [220, 277, 330], // Am
      [246, 311, 370], // Dm
      [196, 247, 294], // G
      [220, 277, 330], // Am
    ];

    let chordIndex = 0;
    this.musicLoopId = null;

    const playNextChord = () => {
      // Check if music should stop
      if (!this.currentMusic || this.muted) {
        if (!this.muted) {
          this.musicLoopId = setTimeout(playNextChord, 1000);
        }
        return;
      }

      const chord = chordProgression[chordIndex];
      this.createMusicChord(chord, 0.8);

      chordIndex = (chordIndex + 1) % chordProgression.length;

      // Schedule next chord
      this.musicLoopId = setTimeout(playNextChord, 1000);
    };

    playNextChord();
    this.currentMusic = true;
  }

  /**
   * Create musical chord with softer volume
   */
  createMusicChord(frequencies, duration) {
    if (!this.audioContext || this.muted || !this.audioEnabled) return;

    frequencies.forEach((freq, index) => {
      const oscillator = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();

      oscillator.connect(gain);
      gain.connect(this.musicGain);

      oscillator.frequency.value = freq;
      oscillator.type = "triangle"; // Softer than square wave

      const now = this.audioContext.currentTime;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.1, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

      oscillator.start(now);
      oscillator.stop(now + duration);
    });
  }

  /**
   * Stop background music
   */
  stopBackgroundMusic() {
    this.currentMusic = false;
    if (this.musicLoopId) {
      clearTimeout(this.musicLoopId);
      this.musicLoopId = null;
    }
  }

  /**
   * Toggle mute
   */
  toggleMute() {
    this.muted = !this.muted;

    if (this.musicGain) {
      this.musicGain.gain.value = this.muted ? 0 : this.musicVolume;
    }
    if (this.sfxGain) {
      this.sfxGain.gain.value = this.muted ? 0 : this.sfxVolume;
    }

    // Handle menu music muting
    if (this.muted && this.menuMusicPlaying) {
      this.stopMenuMusic();
      this.menuMusicWasMuted = true;
    } else if (!this.muted && this.menuMusicWasMuted) {
      this.startMenuMusic();
      this.menuMusicWasMuted = false;
    }

    return this.muted;
  }

  /**
   * Set music volume
   */
  setMusicVolume(volume) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    if (this.musicGain && !this.muted) {
      this.musicGain.gain.value = this.musicVolume;
    }
  }

  /**
   * Set SFX volume
   */
  setSFXVolume(volume) {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
    if (this.sfxGain && !this.muted) {
      this.sfxGain.gain.value = this.sfxVolume;
    }
  }

  /**
   * Check if music is currently playing
   */
  isMusicPlaying() {
    return this.currentMusic === true;
  }

  /**
   * Restart background music (useful after pause/resume)
   */
  restartBackgroundMusic() {
    this.stopBackgroundMusic();
    setTimeout(() => {
      this.startBackgroundMusic();
    }, 100);
  }

  /**
   * Play Middle Eastern Sitar melody for main menu
   */
  startMenuMusic() {
    // Check if audio is enabled by user interaction
    if (!this.audioEnabled) {
      this.pendingMenuMusic = true;
      this.showAudioHint();
      return;
    }

    if (this.menuMusicLoopId) {
      this.stopMenuMusic();
    }

    this.playMenuMelody();
  }

  /**
   * Stop menu music
   */
  stopMenuMusic() {
    this.menuMusicPlaying = false;
    if (this.menuMusicLoopId) {
      clearTimeout(this.menuMusicLoopId);
      this.menuMusicLoopId = null;
    }
  }

  /**
   * Create sitar-like sound with eastern scale
   */
  createSitarNote(frequency, duration, attack = 0.02, decay = 0.3) {
    if (!this.audioContext || this.muted || !this.audioEnabled) return;

    const now = this.audioContext.currentTime;

    // Main oscillator (sitar string)
    const oscillator = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();

    // Configure sitar-like sound
    oscillator.type = "sawtooth"; // Rich harmonics
    oscillator.frequency.value = frequency;

    // Filter for eastern timbre
    filter.type = "bandpass";
    filter.frequency.value = frequency * 2;
    filter.Q.value = 15;

    // Connect audio chain
    oscillator.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);

    // ADSR envelope for sitar attack
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.2, now + attack);
    gain.gain.exponentialRampToValueAtTime(0.1, now + attack + decay);
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

    // Add vibrato for eastern feel
    const vibrato = this.audioContext.createOscillator();
    const vibratoGain = this.audioContext.createGain();
    vibrato.frequency.value = 6; // 6Hz vibrato
    vibratoGain.gain.value = 8; // Vibrato depth

    vibrato.connect(vibratoGain);
    vibratoGain.connect(oscillator.frequency);

    // Add sympathetic resonance (drone)
    const drone = this.audioContext.createOscillator();
    const droneGain = this.audioContext.createGain();
    drone.type = "sine";
    drone.frequency.value = frequency / 2; // Octave below
    droneGain.gain.value = 0.05; // Very quiet

    drone.connect(droneGain);
    droneGain.connect(this.musicGain);

    // Start all oscillators
    vibrato.start(now);
    vibrato.stop(now + duration);
    drone.start(now);
    drone.stop(now + duration);
    oscillator.start(now);
    oscillator.stop(now + duration);
  }

  /**
   * Play eastern/persian scale melody
   */
  playMenuMelody() {
    if (!this.audioContext || this.muted || !this.audioEnabled) {
      this.menuMusicLoopId = setTimeout(() => this.playMenuMelody(), 2000);
      return;
    }

    // Persian/Arabic scale - Hijaz scale (exotic middle eastern sound)
    const baseFreq = 220; // A3
    const hijazScale = [
      1.0, // A (root)
      1.06, // A# (minor second)
      1.33, // F (augmented fourth)
      1.5, // G (perfect fifth)
      1.68, // A (minor sixth)
      1.78, // A# (minor seventh)
      2.0, // A (octave)
      2.12, // A# (octave + minor second)
    ];

    // Beautiful Persian melody pattern
    const melodyPattern = [
      { note: 0, duration: 0.8, delay: 0 }, // A
      { note: 2, duration: 0.6, delay: 0.9 }, // F
      { note: 1, duration: 0.4, delay: 1.6 }, // A#
      { note: 3, duration: 1.0, delay: 2.1 }, // G
      { note: 0, duration: 0.6, delay: 3.2 }, // A
      { note: 4, duration: 0.8, delay: 3.9 }, // A (higher)
      { note: 2, duration: 0.4, delay: 4.8 }, // F
      { note: 1, duration: 0.6, delay: 5.3 }, // A#
      { note: 0, duration: 1.2, delay: 6.0 }, // A (resolution)

      // Second phrase
      { note: 3, duration: 0.6, delay: 7.5 }, // G
      { note: 4, duration: 0.4, delay: 8.2 }, // A (higher)
      { note: 5, duration: 0.6, delay: 8.7 }, // A# (higher)
      { note: 6, duration: 0.8, delay: 9.4 }, // A (octave)
      { note: 4, duration: 0.6, delay: 10.3 }, // A (higher)
      { note: 2, duration: 0.8, delay: 11.0 }, // F
      { note: 0, duration: 1.5, delay: 11.9 }, // A (final resolution)
    ];

    this.menuMusicPlaying = true;

    // Play the melody
    melodyPattern.forEach((note) => {
      if (!this.menuMusicPlaying) return;

      setTimeout(() => {
        if (this.menuMusicPlaying) {
          const frequency = baseFreq * hijazScale[note.note];
          this.createSitarNote(frequency, note.duration);
        }
      }, note.delay * 1000);
    });

    // Schedule next iteration
    const totalDuration = 14000; // 14 seconds
    this.menuMusicLoopId = setTimeout(() => {
      if (this.menuMusicPlaying) {
        this.playMenuMelody();
      }
    }, totalDuration);
  }

  /**
   * Check if menu music is playing
   */
  isMenuMusicPlaying() {
    return this.menuMusicPlaying === true;
  }

  /**
   * Show audio activation hint
   */
  showAudioHint() {
    let audioHint = document.getElementById("audioHint");
    if (!audioHint) {
      audioHint = document.createElement("div");
      audioHint.id = "audioHint";
      audioHint.innerHTML = `
        <div class="audio-hint-content">
          <p>🔊 Click anywhere to enable audio</p>
          <p class="audio-hint-subtitle">Experience the exotic sounds of Persia!</p>
        </div>
      `;
      audioHint.className = "audio-hint";
      document.body.appendChild(audioHint);
    }
    audioHint.style.display = "flex";
  }

  /**
   * Hide audio activation hint
   */
  hideAudioHint() {
    const audioHint = document.getElementById("audioHint");
    if (audioHint) {
      audioHint.style.display = "none";
    }
  }
}

// Global audio manager instance
window.audioManager = new AudioManager();
