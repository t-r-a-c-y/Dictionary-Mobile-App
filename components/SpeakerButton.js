// components/SpeakerButton.js
// Plays the word's pronunciation using expo-audio (the modern replacement for
// the deprecated expo-av). Rendered ONLY when an audio URL exists.
import { Ionicons } from '@expo/vector-icons';
import { useAudioPlayer } from 'expo-audio';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text } from 'react-native';
import { COLORS } from '../constants/colors';

export default function SpeakerButton({ audioUrl }) {
  // The hook is always called (Rules of Hooks); the parent guarantees a URL.
  const player = useAudioPlayer(audioUrl);
  const [playing, setPlaying] = useState(false);

  // Safety net: if somehow rendered without audio, render nothing.
  if (!audioUrl) return null;

  const onPlay = async () => {
    try {
      player.seekTo(0);     // restart from the beginning on each tap
      player.play();
      setPlaying(true);
      // Reset the icon shortly after; clips are ~1s. Keeps UI honest if the
      // status listener isn't wired up.
      setTimeout(() => setPlaying(false), 1500);
    } catch (e) {
      // Handle playback errors gracefully — never crash the screen.
      setPlaying(false);
      Alert.alert('Playback error', 'Unable to play the pronunciation audio.');
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
      onPress={onPlay}
      accessibilityRole="button"
      accessibilityLabel="Play pronunciation"
    >
      <Ionicons
        name={playing ? 'volume-high' : 'volume-medium-outline'}
        size={20}
        color={COLORS.primary}
      />
      <Text style={styles.text}>Listen</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(59,130,246,0.08)',
  },
  buttonPressed: {
    backgroundColor: 'rgba(59,130,246,0.18)',
  },
  text: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});
