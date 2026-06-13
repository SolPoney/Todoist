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

  return (
    <View style={styles.container}>
      {/* Checkbox circulaire */}
      <TouchableOpacity onPress={() => onComplete(task.id)} style={styles.checkboxArea}>
        <View style={styles.circle} />
      </TouchableOpacity>

      {/* Contenu : titre + méta */}
      <View style={styles.content}>
        <Text style={styles.title}>{task.title}</Text>

        {(task.date || task.project) && (
          <View style={styles.meta}>
            {task.date && (
              <View style={styles.dateRow}>
                <Ionicons name="calendar-outline" size={12} color={dateColor} />
                <Text style={[styles.metaText, { color: dateColor }]}> {task.date}</Text>
                {task.isRecurring && (
                  <Ionicons name="refresh-outline" size={12} color={dateColor} style={styles.recurringIcon} />
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
