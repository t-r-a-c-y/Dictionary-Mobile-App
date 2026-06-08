// components/ConfirmModal.js
// A nicely designed, theme-aware confirmation dialog used for destructive
// actions (e.g. clearing history). Replaces the plain native Alert with a
// branded card, icon, and animated entrance.
import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';
import { useTheme } from '../context/ThemeContext';

export default function ConfirmModal({
  visible,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = true,
  icon = 'trash-outline',
  onConfirm,
  onCancel,
}) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const accent = destructive ? colors.error : colors.primary;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onCancel}
    >
      <Animated.View entering={FadeIn.duration(160)} style={styles.backdrop}>
        {/* Tap outside to dismiss */}
        <Pressable style={StyleSheet.absoluteFill} onPress={onCancel} />

        <Animated.View entering={ZoomIn.duration(200)} style={[styles.card, colors.shadow]}>
          <View
            style={[
              styles.iconWrap,
              { backgroundColor: destructive ? colors.errorBg : colors.primaryTint },
            ]}
          >
            <Ionicons name={icon} size={30} color={accent} />
          </View>

          <Text style={styles.title}>{title}</Text>
          {message ? <Text style={styles.message}>{message}</Text> : null}

          <View style={styles.actions}>
            <Pressable
              style={({ pressed }) => [styles.btn, styles.cancelBtn, pressed && styles.pressed]}
              onPress={onCancel}
              accessibilityRole="button"
            >
              <Text style={styles.cancelText}>{cancelLabel}</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.btn,
                { backgroundColor: accent },
                pressed && styles.pressed,
              ]}
              onPress={onConfirm}
              accessibilityRole="button"
            >
              <Text style={styles.confirmText}>{confirmLabel}</Text>
            </Pressable>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const createStyles = (c) =>
  StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: c.backdrop,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 32,
    },
    card: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: c.surface,
      borderRadius: 24,
      padding: 24,
      alignItems: 'center',
    },
    iconWrap: {
      width: 64,
      height: 64,
      borderRadius: 32,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
    },
    title: {
      fontSize: 19,
      fontWeight: '800',
      color: c.text,
      textAlign: 'center',
    },
    message: {
      fontSize: 14.5,
      color: c.textMuted,
      textAlign: 'center',
      lineHeight: 21,
      marginTop: 8,
    },
    actions: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 22,
      width: '100%',
    },
    btn: {
      flex: 1,
      height: 50,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cancelBtn: {
      backgroundColor: c.surfaceAlt,
      borderWidth: 1,
      borderColor: c.border,
    },
    cancelText: {
      color: c.text,
      fontSize: 15,
      fontWeight: '700',
    },
    confirmText: {
      color: c.white,
      fontSize: 15,
      fontWeight: '800',
    },
    pressed: {
      opacity: 0.85,
      transform: [{ scale: 0.98 }],
    },
  });
