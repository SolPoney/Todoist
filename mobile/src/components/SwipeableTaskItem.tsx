import React, { useState, useRef, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TaskItem, Task } from './TaskItem';
import { useColors } from '../theme/useColors';
import { ColorTheme } from '../theme/colors';
import { fontSize } from '../theme/typography';

type Props = {
  task: Task;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit?: (id: string) => void;
  isSelecting?: boolean;
  isSelected?: boolean;
  onLongPress?: (id: string) => void;
  onTapInSelection?: (id: string) => void;
  onDrag?: () => void;
};

export function SwipeableTaskItem({ task, onComplete, onDelete, onEdit, isSelecting, isSelected, onLongPress, onTapInSelection, onDrag }: Props) {
  const [expanded, setExpanded] = useState(false);
  const flashOpacity = useRef(new Animated.Value(0)).current;
  const [flashColor, setFlashColor] = useState('#22C55E');
  const colors = useColors();

  const styles = useMemo(() => createStyles(colors), [colors]);

  function handleComplete() {
    setExpanded(false);
    setFlashColor('#22C55E');
    Animated.sequence([
      Animated.timing(flashOpacity, { toValue: 0.6, duration: 250, useNativeDriver: true }),
      Animated.timing(flashOpacity, { toValue: 0, duration: 250, useNativeDriver: true }),
    ]).start(() => onComplete(task.id));
  }

  function handleEdit() {
    setExpanded(false);
    onEdit?.(task.id);
  }

  function handleDelete() {
    setExpanded(false);
    setFlashColor('#EF4444');
    Animated.sequence([
      Animated.timing(flashOpacity, { toValue: 0.6, duration: 250, useNativeDriver: true }),
      Animated.timing(flashOpacity, { toValue: 0, duration: 250, useNativeDriver: true }),
    ]).start(() => onDelete(task.id));
  }

  function handlePress() {
    if (isSelecting) {
      onTapInSelection?.(task.id);
    }
  }

  function handleLongPress() {
    if (!isSelecting) {
      onLongPress?.(task.id);
    }
  }

  return (
    <View>
      <TouchableOpacity
        onPress={handlePress}
        onLongPress={handleLongPress}
        activeOpacity={1}
        delayLongPress={400}
        accessibilityLabel={isSelected ? `${task.title}, sélectionnée` : task.title}
        accessibilityRole="button"
        accessibilityHint={isSelecting ? 'Appuyer pour sélectionner ou désélectionner' : 'Appui long pour afficher les actions'}
        accessibilityState={{ selected: isSelected }}
      >
        <View style={isSelected ? styles.selectedOverlay : null} pointerEvents="none" />
        <TaskItem task={task} onComplete={isSelecting ? () => {} : onComplete} onTitlePress={() => { if (!isSelecting) onEdit?.(task.id); }} />
        {isSelected && (
          <View style={styles.checkOverlay} pointerEvents="none">
            <Ionicons name="checkmark-circle" size={22} color={colors.accent} />
          </View>
        )}
        {!isSelecting && onDrag && (
          <TouchableOpacity
            onLongPress={onDrag}
            delayLongPress={200}
            style={styles.dragHandle}
            accessibilityLabel="Maintenir pour déplacer la tâche"
            accessibilityRole="button"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="reorder-three-outline" size={22} color={colors.textMuted} accessibilityElementsHidden />
          </TouchableOpacity>
        )}
        <Animated.View style={[styles.flash, { opacity: flashOpacity, backgroundColor: flashColor }]} pointerEvents="none" accessibilityElementsHidden />
      </TouchableOpacity>

      {/* Actions qui apparaissent après appui long — masquées en mode sélection */}
      {expanded && !isSelecting && (
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
            style={[styles.actionBtn, styles.editBtn]}
            onPress={handleEdit}
            accessibilityLabel="Modifier la tâche"
            accessibilityRole="button"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="pencil-outline" size={18} color="#fff" accessibilityElementsHidden />
            <Text style={styles.actionText}>Modifier</Text>
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

function createStyles(colors: ColorTheme) {
  return StyleSheet.create({
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
    editBtn: { backgroundColor: '#F59E0B' },
    deleteBtn: { backgroundColor: '#EF4444' },
    cancelBtn: { backgroundColor: colors.border },
    actionText: { color: '#fff', fontSize: fontSize.sm, fontWeight: '600' },
    flash: {
      ...StyleSheet.absoluteFillObject,
      borderRadius: 4,
    },
    selectedOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: colors.accent,
      opacity: 0.12,
      zIndex: 1,
    },
    checkOverlay: {
      position: 'absolute',
      right: 16,
      top: 0,
      bottom: 0,
      justifyContent: 'center',
      zIndex: 2,
    },
    dragHandle: {
      position: 'absolute',
      right: 48,
      top: 0,
      bottom: 0,
      justifyContent: 'center',
      paddingHorizontal: 4,
    },
  });
}
