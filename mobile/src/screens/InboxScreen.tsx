import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator, RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SwipeableTaskItem } from '../components/SwipeableTaskItem';
import { AddTaskModal } from '../components/AddTaskModal';
import { FAB } from '../components/FAB';
import { Task } from '../components/TaskItem';
import { useTasksStore } from '../stores/tasksStore';
import { colors } from '../theme/colors';

export function InboxScreen() {
  const insets = useSafeAreaInsets();
  const { tasks, isLoading, error, fetchTasks, createTask, completeTask, deleteTask } = useTasksStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  async function handleRefresh() {
    setRefreshing(true);
    await fetchTasks();
    setRefreshing(false);
  }

  const displayTasks: Task[] = tasks.filter(t => !t.isCompleted).map(t => ({
    id: t.id,
    title: t.title,
    date: t.dueDate ? new Date(t.dueDate).toLocaleDateString('fr-FR') : undefined,
    project: t.project?.name,
    isOverdue: t.dueDate ? new Date(t.dueDate) < new Date() : false,
  }));

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Header */}
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

        {isLoading && !refreshing && (
          <ActivityIndicator color={colors.accent} style={{ marginTop: 40 }} />
        )}

        {error && <Text style={styles.errorText}>{error}</Text>}

        <FlatList
          data={displayTasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SwipeableTaskItem
              task={item}
              onComplete={completeTask}
              onDelete={deleteTask}
            />
          )}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.accent}
            />
          }
          ListEmptyComponent={
            !isLoading ? (
              <Text style={styles.emptyText}>Aucune tâche — bien joué !</Text>
            ) : null
          }
        />

        <FAB onPress={() => setModalVisible(true)} />

        <AddTaskModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSubmit={createTask}
        />
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
  emptyText: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 60,
    fontSize: 15,
  },
});
