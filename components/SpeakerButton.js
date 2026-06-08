// components/SpeakerButton.js
// Pronunciation audio controls with full PLAY / PAUSE / STOP state management,
// built on expo-audio (the modern replacement for the deprecated expo-av).
//
// Behaviour:
//   - Renders nothing when no audio URL is provided (Activity 3 requirement).
//   - Play  -> starts (or resumes) playback.
//   - Pause -> pauses at the current position.
//   - Stop  -> pauses AND rewinds to the start; disabled when already stopped.
//   - Auto-resets to the start when the clip finishes.
//   - Any playback failure is caught and surfaced gently (no crash).
import { Ionicons } from '@expo/vector-icons';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { useEffect } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../constants/colors';

export default function SpeakerButton({ audioUrl, variant = 'light' }) {
  // Hooks must run unconditionally. `audioUrl || null` keeps the player happy
  // even on the (guarded) edge case of an empty URL.
  const player = useAudioPlayer(audioUrl || null);
  const status = useAudioPlayerStatus(player);

  const isPlaying = status?.playing ?? false;
  const position = status?.currentTime ?? 0;
  // "Stoppable" means there is something to rewind: playing or paused mid-clip.
  const canStop = isPlaying || position > 0.01;

  // When the clip finishes, rewind so the next Play starts cleanly.
  useEffect(() => {
    if (status?.didJustFinish) {
      try {
        player.pause();
        player.seekTo(0);
      } catch {
        /* no-op: finishing cleanup is best-effort */
      }
    }
  }, [status?.didJustFinish, player]);

  // Activity 3: hide/disable the control entirely when no audio exists.
  if (!audioUrl) return null;

  const onPlayPause = () => {
    try {
      if (isPlaying) {
        player.pause();
      } else {
        // Restart from the beginning if we are at/after the end.
        if (status?.didJustFinish) player.seekTo(0);
        player.play();
      }
    } catch (e) {
      Alert.alert('Playback error', 'Unable to play the pronunciation audio.');
    }
  };

  const onStop = () => {
    if (!canStop) return;
    try {
      player.pause();
      player.seekTo(0);
    } catch {
      /* best-effort stop */
    }
  };

  const onGradient = variant === 'light';
  const tint = onGradient ? COLORS.white : COLORS.primary;
  const statusLabel = isPlaying ? 'Playing…' : position > 0.01 ? 'Paused' : 'Tap to listen';

  return (
    <View style={styles.row}>
      {/* Primary Play / Pause toggle */}
      <Pressable
        onPress={onPlayPause}
        accessibilityRole="button"
        accessibilityLabel={isPlaying ? 'Pause pronunciation' : 'Play pronunciation'}
        style={({ pressed }) => [
          styles.primaryBtn,
          onGradient ? styles.primaryBtnLight : styles.primaryBtnDark,
          pressed && styles.pressed,
        ]}
      >
        <Ionicons name={isPlaying ? 'pause' : 'play'} size={20} color={tint} />
      </Pressable>

      {/* Stop button (disabled when nothing is playing) */}
      <Pressable
        onPress={onStop}
        disabled={!canStop}
        accessibilityRole="button"
        accessibilityLabel="Stop pronunciation"
        style={({ pressed }) => [
          styles.stopBtn,
          onGradient ? styles.stopBtnLight : styles.stopBtnDark,
          !canStop && styles.disabled,
          pressed && canStop && styles.pressed,
        ]}
      >
        <Ionicons name="stop" size={16} color={tint} />
      </Pressable>

      {/* Speaker icon + live status label, placed next to the controls */}
      <View style={styles.labelWrap}>
        <Ionicons
          name="volume-high"
          size={16}
          color={onGradient ? COLORS.textOnGradientSoft : COLORS.textMuted}
        />
        <Text
          style={[
            styles.label,
            { color: onGradient ? COLORS.textOnGradientSoft : COLORS.textMuted },
          ]}
        >
          {statusLabel}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 16,
  },
  primaryBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnLight: {
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  primaryBtnDark: {
    backgroundColor: 'rgba(79,70,229,0.12)',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  stopBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopBtnLight: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  stopBtnDark: {
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  labelWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginLeft: 2,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.4,
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.96 }],
  },
});
