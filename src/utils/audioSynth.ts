let audioCtx: AudioContext | null = null;
let oscillatorInterval: any = null;
let activeSourceNodes: AudioNode[] = [];

export function startWeddingMusic(trackId: string) {
  try {
    // Initialize AudioContext lazily
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    // Clear any previous running sequence
    stopWeddingMusic();

    const playTone = (freq: number, startTime: number, duration: number, type: OscillatorType = 'sine') => {
      if (!audioCtx) return;
      
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);
      
      // Soothing fade-in and fade-out envelope
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.12, startTime + 0.1);
      gain.gain.setValueAtTime(0.12, startTime + duration - 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.start(startTime);
      osc.stop(startTime + duration);
      
      activeSourceNodes.push(osc);
    };

    let step = 0;
    const playNextStep = () => {
      if (!audioCtx) return;
      const now = audioCtx.currentTime;
      
      // Define music sequences matching the selected track
      if (trackId === 'piano') {
        // Royal Love - Classic Elegant Piano Arpeggios (C major7 -> G major -> Am7 -> F major7)
        const chords = [
          [261.63, 329.63, 392.00, 493.88], // Cmaj7 (C4, E4, G4, B4)
          [293.66, 392.00, 493.88, 587.33], // Gmaj  (D4, G4, B4, D5)
          [220.00, 261.63, 329.63, 392.00], // Am7   (A3, C4, E4, G4)
          [174.61, 261.63, 349.23, 440.00], // Fmaj7 (F3, C4, F4, A4)
        ];
        
        const currentChord = chords[step % chords.length];
        // Play arpeggiated piano notes in sequence
        currentChord.forEach((freq, idx) => {
          playTone(freq, now + idx * 0.2, 1.2, 'triangle');
        });
      } else if (trackId === 'shehnai') {
        // Traditional Indian Shehnai - Raga Bhairavi signature waves
        // Melodic notes: C, Db, Eb, G, Ab
        const notes = [261.63, 277.18, 311.13, 392.00, 415.30, 392.00, 311.13, 277.18];
        const pitch = notes[step % notes.length];
        
        // Shehnai has a double reed, simulated with a slightly modulated sawtooth or sine wave
        playTone(pitch, now, 0.4, 'sine');
        playTone(pitch * 1.005, now + 0.05, 0.38, 'triangle'); // Rich chorus effect
      } else if (trackId === 'flute') {
        // Divine Bansuri Melody - Gentle pentatonic flute arpeggios
        // Notes: G, A, B, D, E
        const notes = [392.00, 440.00, 493.88, 587.33, 659.25, 587.33, 493.88, 440.00];
        const pitch = notes[step % notes.length];
        
        // Gentle vibrato and slide using standard sine oscillator
        playTone(pitch, now, 0.8, 'sine');
      } else {
        // Acoustic Guitar - Simple ambient folk chords
        const chords = [
          [196.00, 293.66, 392.00, 493.88], // G Major
          [164.81, 246.94, 329.63, 392.00], // E Minor
          [220.00, 293.66, 349.23, 440.00], // D Suspended
        ];
        const currentChord = chords[step % chords.length];
        currentChord.forEach((freq, idx) => {
          playTone(freq, now + idx * 0.15, 1.5, 'sine');
        });
      }
      
      step++;
    };

    // Trigger first step
    playNextStep();
    
    // Repeat sequence every 1.6 seconds
    oscillatorInterval = setInterval(playNextStep, 1600);

  } catch (err) {
    console.warn('Web Audio API not fully supported or blocked by user guest policy:', err);
  }
}

export function stopWeddingMusic() {
  if (oscillatorInterval) {
    clearInterval(oscillatorInterval);
    oscillatorInterval = null;
  }
  
  activeSourceNodes.forEach((node) => {
    try {
      (node as any).stop();
    } catch (e) {
      // already stopped
    }
  });
  activeSourceNodes = [];
}
