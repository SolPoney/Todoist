import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
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

  return (
    <View>
      <TouchableOpacity
        onLongPress={() => setExpanded(!expanded)}
        activeOpacity={1}
        delayLongPress={400}
      >
        <TaskItem task={task} onComplete={onComplete} />
      </TouchableOpacity>

      {/* Actions qui apparaissent après appui long */}
      {expanded && (
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.completeBtn]}
            onPress={() => { onComplete(task.id); setExpanded(false); }}
          >
            <Ionicons name="checkmark-circle-outline" size={18} color="#fff" />
            <Text style={styles.actionText}>Terminer</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, styles.deleteBtn]}
            onPress={() => { onDelete(task.id); setExpanded(false); }}
          >
            <Ionicons name="trash-outline" size={18} color="#fff" />
            <Text style={styles.actionText}>Supprimer</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, styles.cancelBtn]}
            onPress={() => setExpanded(false)}
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
});
