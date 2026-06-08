// components/SpeakerButton.js
// Pronunciation audio controls with full PLAY / PAUSE / STOP state management,
// built on expo-audio (the modern replacement for the deprecated expo-av).
//
// Behaviour:
//   - Renders nothing when there is no audio (Activity 3 requirement).
//   - Supports MULTIPLE pronunciations: shows selectable region pills (US/UK…)
//     when more than one audio URL is available.
//   - Play  -> starts (or resumes) playback.
//   - Pause -> pauses at the current position.
//   - Stop  -> pauses AND rewinds to the start; disabled when already stopped.
//   - Auto-resets to the start when the clip finishes.
//   - Any playback failure is caught and surfaced gently (no crash).
import { Ionicons } from '@expo/vector-icons';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../constants/colors';

export default function SpeakerButton({ audios = [], variant = 'light' }) {
  // Normalize input: accept [{url,label}] and drop anything without a URL.
  const list = (Array.isArray(audios) ? audios : []).filter((a) => a && a.url);

  const [selected, setSelected] = useState(0);
  // The player is created once on the first source; we switch via replace().
  const player = useAudioPlayer(list[0]?.url || null);
  const status = useAudioPlayerStatus(player);

  const isPlaying = status?.playing ?? false;
  const position = status?.currentTime ?? 0;
  const canStop = isPlaying || position > 0.01;

  // Rewind when a clip finishes so the next Play starts cleanly.
  useEffect(() => {
    if (status?.didJustFinish) {
      try {
        player.pause();
        player.seekTo(0);
      } catch {
        /* best-effort */
      }
    }
  }, [status?.didJustFinish, player]);

  // Activity 3: hide the control entirely when no audio exists.
  if (list.length === 0) return null;

  const onPlay = () => {
    if (isPlaying) return; // already playing
    try {
      if (status?.didJustFinish) player.seekTo(0); // restart if at the end
      player.play();
    } catch (e) {
      Alert.alert('Playback error', 'Unable to play the pronunciation audio.');
    }
  };

  const onPause = () => {
    if (!isPlaying) return; // nothing to pause
    try {
      player.pause();
    } catch {
      /* best-effort */
    }
  };

  const onStop = () => {
    if (!canStop) return;
    try {
      player.pause();
      player.seekTo(0);
    } catch {
      /* best-effort */
    }
  };

  // Switch to a different pronunciation (region) and start it.
  const onSelect = (i) => {
    if (i === selected) return;
    try {
      setSelected(i);
      player.replace(list[i].url);
      player.seekTo(0);
      player.play();
    } catch (e) {
      Alert.alert('Playback error', 'Unable to load that pronunciation.');
    }
  };

  const onGradient = variant === 'light';
  const tint = onGradient ? COLORS.white : COLORS.primary;
  const softText = onGradient ? COLORS.textOnGradientSoft : COLORS.textMuted;
  const statusLabel = isPlaying
    ? 'Playing…'
    : position > 0.01
    ? 'Paused'
    : 'Tap to listen';

  return (
    <View style={styles.container}>
      {/* Region selector pills — only when multiple pronunciations exist */}
      {list.length > 1 ? (
        <View style={styles.pills}>
          {list.map((a, i) => (
            <Pressable
              key={a.url}
              onPress={() => onSelect(i)}
              style={[
                styles.pill,
                onGradient ? styles.pillLight : styles.pillDark,
                i === selected &&
                  (onGradient ? styles.pillActiveLight : styles.pillActiveDark),
              ]}
            >
              <Ionicons
                name="headset-outline"
                size={12}
                color={i === selected ? (onGradient ? COLORS.primary : COLORS.white) : tint}
              />
              <Text
                style={[
                  styles.pillText,
                  { color: i === selected ? (onGradient ? COLORS.primary : COLORS.white) : tint },
                ]}
              >
                {a.label}
              </Text>
            </Pressable>
          ))}
        </View>
      ) : null}

      <View style={styles.row}>
        {/* Play (disabled while already playing) */}
        <Pressable
          onPress={onPlay}
          disabled={isPlaying}
          accessibilityRole="button"
          accessibilityLabel="Play pronunciation"
          style={({ pressed }) => [
            styles.primaryBtn,
            onGradient ? styles.primaryBtnLight : styles.primaryBtnDark,
            isPlaying && styles.disabled,
            pressed && !isPlaying && styles.pressed,
          ]}
        >
          <Ionicons name="play" size={20} color={tint} />
        </Pressable>

        {/* Pause (middle — disabled when not playing) */}
        <Pressable
          onPress={onPause}
          disabled={!isPlaying}
          accessibilityRole="button"
          accessibilityLabel="Pause pronunciation"
          style={({ pressed }) => [
            styles.stopBtn,
            onGradient ? styles.stopBtnLight : styles.stopBtnDark,
            !isPlaying && styles.disabled,
            pressed && isPlaying && styles.pressed,
          ]}
        >
          <Ionicons name="pause" size={16} color={tint} />
        </Pressable>

        {/* Stop (disabled when nothing is playing/paused) */}
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

        {/* Speaker icon + live status label, next to the controls */}
        <View style={styles.labelWrap}>
          <Ionicons name="volume-high" size={16} color={softText} />
          <Text style={[styles.label, { color: softText }]}>{statusLabel}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  pills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
  },
  pillLight: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderColor: 'rgba(255,255,255,0.4)',
  },
  pillDark: {
    backgroundColor: COLORS.surfaceAlt,
    borderColor: COLORS.border,
  },
  pillActiveLight: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.white,
  },
  pillActiveDark: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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
    backgroundColor: COLORS.primaryTint,
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
