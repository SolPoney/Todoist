import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export type Task = {
  id: string;
  title: string;
  date?: string;
  project?: string;
  isRecurring?: boolean;
  isOverdue?: boolean;
};

type Props = {
  task: Task;
  onComplete: (id: string) => void;
};

export function TaskItem({ task, onComplete }: Props) {
  const dateColor = task.isOverdue ? colors.accent : colors.textSecondary;

  const overdueLabel = task.isOverdue ? ', en retard' : '';
  const dateLabel = task.date ? `, échéance le ${task.date}${overdueLabel}` : '';
  const projectLabel = task.project ? `, projet ${task.project}` : '';
  const recurringLabel = task.isRecurring ? ', récurrente' : '';

  return (
    <View style={styles.container} accessible={false}>
      {/* Checkbox circulaire */}
      <TouchableOpacity
        onPress={() => onComplete(task.id)}
        style={styles.checkboxArea}
        accessibilityLabel={`Marquer comme terminée : ${task.title}`}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: false }}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <View style={styles.circle} accessibilityElementsHidden />
      </TouchableOpacity>

      {/* Contenu : titre + méta */}
      <View
        style={styles.content}
        accessible
        accessibilityLabel={`${task.title}${dateLabel}${projectLabel}${recurringLabel}`}
      >
        <Text style={styles.title}>{task.title}</Text>

        {(task.date || task.project) && (
          <View style={styles.meta} accessible={false}>
            {task.date && (
              <View style={styles.dateRow}>
                <Ionicons name="calendar-outline" size={12} color={dateColor} accessibilityElementsHidden />
                <Text style={[styles.metaText, { color: dateColor }]}> {task.date}</Text>
                {task.isRecurring && (
                  <Ionicons name="refresh-outline" size={12} color={dateColor} style={styles.recurringIcon} accessibilityElementsHidden />
                )}
              </View>
            )}
            {task.project && (
              <Text style={styles.project}>{task.project}</Text>
            )}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  checkboxArea: {
    marginTop: 2,
    marginRight: 14,
  },
  circle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.textMuted,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    lineHeight: 22,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 12,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
  },
  recurringIcon: {
    marginLeft: 4,
  },
  project: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});
