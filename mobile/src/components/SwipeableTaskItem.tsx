import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TaskItem, Task } from './TaskItem';
import { colors } from '../theme/colors';

type Props = {
  task: Task;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
};

export function SwipeableTaskItem({ task, onComplete, onDelete }: Props) {
  const [expanded, setExpanded] = useState(false);
  const flashOpacity = useRef(new Animated.Value(0)).current;
  const [flashColor, setFlashColor] = useState('#22C55E');

  function handleComplete() {
    setExpanded(false);
    setFlashColor('#22C55E');
    Animated.sequence([
      Animated.timing(flashOpacity, { toValue: 0.6, duration: 250, useNativeDriver: true }),
      Animated.timing(flashOpacity, { toValue: 0, duration: 250, useNativeDriver: true }),
    ]).start(() => onComplete(task.id));
  }

  function handleDelete() {
    setExpanded(false);
    setFlashColor('#EF4444');
    Animated.sequence([
      Animated.timing(flashOpacity, { toValue: 0.6, duration: 250, useNativeDriver: true }),
      Animated.timing(flashOpacity, { toValue: 0, duration: 250, useNativeDriver: true }),
    ]).start(() => onDelete(task.id));
  }

  return (
    <View>
      <TouchableOpacity
        onLongPress={() => setExpanded(!expanded)}
        activeOpacity={1}
        delayLongPress={400}
        accessibilityLabel={task.title}
        accessibilityRole="button"
        accessibilityHint="Appui long pour afficher les actions"
        accessibilityState={{ expanded }}
      >
        <TaskItem task={task} onComplete={onComplete} />
        <Animated.View style={[styles.flash, { opacity: flashOpacity, backgroundColor: flashColor }]} pointerEvents="none" accessibilityElementsHidden />
      </TouchableOpacity>

      {/* Actions qui apparaissent après appui long */}
      {expanded && (
        <View style={styles.actions} accessibilityRole="toolbar" accessibilityLabel="Actions sur la tâche">
          <TouchableOpacity
            style={[styles.actionBtn, styles.completeBtn]}
            onPress={handleComplete}
            accessibilityLabel="Terminer la tâche"
            accessibilityRole="button"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="checkmark-circle-outline" size={18} color="#fff" accessibilityElementsHidden />
            <Text style={styles.actionText}>Terminer</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, styles.deleteBtn]}
            onPress={handleDelete}
            accessibilityLabel="Supprimer la tâche"
            accessibilityRole="button"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="trash-outline" size={18} color="#fff" accessibilityElementsHidden />
            <Text style={styles.actionText}>Supprimer</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, styles.cancelBtn]}
            onPress={() => setExpanded(false)}
            accessibilityLabel="Annuler"
            accessibilityRole="button"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.actionText}>Annuler</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  completeBtn: { backgroundColor: '#22C55E' },
  deleteBtn: { backgroundColor: '#EF4444' },
  cancelBtn: { backgroundColor: colors.border },
  actionText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  flash: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 4,
  },
});
