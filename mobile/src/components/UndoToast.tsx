import React, { useEffect, useRef, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useColors } from '../theme/useColors';
import { ColorTheme } from '../theme/colors';
import { fontSize, lineHeight } from '../theme/typography';

type Props = {
  message: string;
  onUndo: () => void;
  onDismiss: () => void;
};

export function UndoToast({ message, onUndo, onDismiss }: Props) {
  const opacity = useRef(new Animated.Value(0)).current;
  const colors = useColors();

  const styles = useMemo(() => createStyles(colors), [colors]);

  useEffect(() => {
    // Apparition
    Animated.timing(opacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();

    // Disparition automatique après 4 secondes
    const timer = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(onDismiss);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity }]} accessibilityLiveRegion="polite" accessibilityRole="alert">
      <Text style={styles.message}>{message}</Text>
      <TouchableOpacity
        onPress={onUndo}
        style={styles.undoBtn}
        accessibilityLabel="Annuler l'action"
        accessibilityRole="button"
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text style={styles.undoText}>Annuler</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

function createStyles(colors: ColorTheme) {
  return StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: 90,
      left: 16,
      right: 16,
      backgroundColor: '#323232',
      borderRadius: 8,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 12,
      paddingHorizontal: 16,
      elevation: 6,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
    },
    message: {
      color: '#fff',
      fontSize: fontSize.md,
      lineHeight: lineHeight.md,
      flex: 1,
    },
    undoBtn: {
      marginLeft: 16,
      paddingHorizontal: 12,
      paddingVertical: 8,
      minHeight: 44,
      justifyContent: 'center',
    },
    undoText: {
      color: colors.accent,
      fontSize: fontSize.md,
      lineHeight: lineHeight.md,
      fontWeight: '700',
    },
  });
}
