import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TaskItem, Task } from '../components/TaskItem';
import { FAB } from '../components/FAB';
import { useTasksStore } from '../stores/tasksStore';
import { colors } from '../theme/colors';

export function InboxScreen() {
  const insets = useSafeAreaInsets();
  const { tasks, isLoading, error, fetchTasks, completeTask } = useTasksStore();

  // Charge les tâches au premier affichage
  useEffect(() => {
    fetchTasks();
  }, []);

  // Convertit les tâches API au format du composant TaskItem
  const displayTasks: Task[] = tasks.filter(t => !t.isCompleted).map(t => ({
    id: t.id,
    title: t.title,
    date: t.dueDate ? new Date(t.dueDate).toLocaleDateString('fr-FR') : undefined,
    project: t.project?.name,
    isOverdue: t.dueDate ? new Date(t.dueDate) < new Date() : false,
  }));

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Boîte de réception</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="list" size={22} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="ellipsis-vertical" size={22} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {isLoading && (
        <ActivityIndicator color={colors.accent} style={{ marginTop: 40 }} />
      )}

      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}

      {!isLoading && (
        <FlatList
          data={displayTasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TaskItem task={item} onComplete={completeTask} />
          )}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Aucune tâche — bien joué !</Text>
          }
        />
      )}

      <FAB onPress={() => console.log('Add task')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: { fontSize: 22, fontWeight: '700', color: colors.text },
  headerIcons: { flexDirection: 'row', gap: 4 },
  iconBtn: { padding: 6 },
  list: { paddingBottom: 100 },
  errorText: { color: colors.accent, textAlign: 'center', marginTop: 40 },
  emptyText: { color: colors.textSecondary, textAlign: 'center', marginTop: 60, fontSize: 15 },
});
