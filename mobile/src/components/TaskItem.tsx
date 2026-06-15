import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '../theme/useColors';
import { ColorTheme } from '../theme/colors';
import { fontSize, lineHeight, letterSpacing } from '../theme/typography';

export type Task = {
  id: string;
  title: string;
  date?: string;
  project?: string;
  isRecurring?: boolean;
  isOverdue?: boolean;
  priority?: number;
};

type Props = {
  task: Task;
  onComplete: (id: string) => void;
  onTitlePress?: () => void;
};

function priorityBorderColor(priority: number | undefined, textMuted: string): string {
  switch (priority) {
    case 1: return '#EF4444';
    case 2: return '#F59E0B';
    case 3: return '#3B82F6';
    default: return textMuted;
  }
}

export function TaskItem({ task, onComplete, onTitlePress }: Props) {
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const overdueLabel = task.isOverdue ? ', en retard' : '';
  const dateLabel = task.date ? `, échéance le ${task.date}${overdueLabel}` : '';
  const projectLabel = task.project ? `, projet ${task.project}` : '';
  const recurringLabel = task.isRecurring ? ', récurrente' : '';

  const borderColor = priorityBorderColor(task.priority, colors.textMuted);

  const content = (
    <View
      style={styles.content}
      accessible={!onTitlePress}
      accessibilityLabel={onTitlePress ? undefined : `${task.title}${dateLabel}${projectLabel}${recurringLabel}`}
    >
      <Text style={styles.title}>{task.title}</Text>

      {(task.date || task.project) && (
        <View style={styles.meta} accessible={false}>
          {task.date && (
            <View style={[styles.dateChip, task.isOverdue ? styles.dateChipOverdue : styles.dateChipNormal]}>
              <Ionicons
                name={task.isOverdue ? 'time-outline' : 'calendar-outline'}
                size={12}
                color={task.isOverdue ? '#EF4444' : colors.textSecondary}
                accessibilityElementsHidden
              />
              <Text style={[styles.dateChipText, task.isOverdue ? styles.dateChipTextOverdue : null]}>
                {task.date}
                {task.isRecurring && ' ↻'}
              </Text>
            </View>
          )}
          {task.project && (
            <Text style={styles.project}>{task.project}</Text>
          )}
        </View>
      )}
    </View>
  );

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
        <View style={[styles.circle, { borderColor }]} accessibilityElementsHidden />
      </TouchableOpacity>

      {/* Contenu : titre + méta */}
      {onTitlePress ? (
        <TouchableOpacity
          onPress={onTitlePress}
          activeOpacity={0.7}
          accessibilityLabel={`${task.title}${dateLabel}${projectLabel}${recurringLabel}`}
          accessibilityRole="button"
          style={styles.content}
        >
          {content}
        </TouchableOpacity>
      ) : (
        content
      )}
    </View>
  );
}

function createStyles(colors: ColorTheme) {
  return StyleSheet.create({
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
      fontSize: fontSize.lg,
      fontWeight: '600',
      color: colors.text,
      lineHeight: lineHeight.lg,
      letterSpacing: letterSpacing.normal,
    },
    meta: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 4,
      gap: 12,
    },
    dateChip: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 6,
      gap: 4,
    },
    dateChipNormal: {
      backgroundColor: colors.border,
    },
    dateChipOverdue: {
      backgroundColor: '#EF444420',
    },
    dateChipText: {
      fontSize: fontSize.sm,
      lineHeight: lineHeight.sm,
      color: colors.textSecondary,
    },
    dateChipTextOverdue: {
      color: '#EF4444',
      fontWeight: '600',
    },
    project: {
      fontSize: fontSize.sm,
      lineHeight: lineHeight.sm,
      color: colors.textSecondary,
    },
  });
}
