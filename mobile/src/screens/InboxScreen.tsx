import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator, RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SwipeableTaskItem } from '../components/SwipeableTaskItem';
import { AddTaskModal } from '../components/AddTaskModal';
import { ImportExportModal } from '../components/ImportExportModal';
import { FAB } from '../components/FAB';
import { UndoToast } from '../components/UndoToast';
import { Task } from '../components/TaskItem';
import { useTasksStore } from '../stores/tasksStore';
import { colors } from '../theme/colors';

export function InboxScreen() {
  const insets = useSafeAreaInsets();
  const { tasks, isLoading, error, fetchTasks, createTask, importTasks, completeTask, deleteTask, pendingAction, undoAction, confirmAction } = useTasksStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [importExportVisible, setImportExportVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const isSelecting = selectedIds.size > 0;

  useEffect(() => {
    fetchTasks();
  }, []);

  async function handleRefresh() {
    setRefreshing(true);
    await fetchTasks();
    setRefreshing(false);
  }

  function handleLongPress(id: string) {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }

  function handleTapInSelection(id: string) {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function handleDeleteSelected() {
    selectedIds.forEach(id => deleteTask(id));
    setSelectedIds(new Set());
  }

  function handleCancelSelection() {
    setSelectedIds(new Set());
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
      {isSelecting ? (
        <View style={styles.header} accessibilityRole="header">
          <TouchableOpacity onPress={handleCancelSelection} accessibilityLabel="Annuler la sélection" accessibilityRole="button">
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>{selectedIds.size} sélectionnée(s)</Text>
          <TouchableOpacity onPress={handleDeleteSelected} accessibilityLabel={`Supprimer ${selectedIds.size} tâches`} accessibilityRole="button">
            <Ionicons name="trash-outline" size={24} color="#EF4444" />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.header} accessibilityRole="header">
          <Text style={styles.title} accessibilityRole="header">Boîte de réception</Text>
          <View style={styles.headerIcons} accessible={false}>
            <TouchableOpacity style={styles.iconBtn} accessibilityLabel="Changer la vue" accessibilityRole="button">
              <Ionicons name="list" size={22} color={colors.text} accessibilityElementsHidden />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} onPress={() => setImportExportVisible(true)} accessibilityLabel="Importer ou exporter des tâches" accessibilityRole="button">
              <Ionicons name="swap-vertical-outline" size={22} color={colors.text} accessibilityElementsHidden />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {isLoading && !refreshing && (
        <ActivityIndicator color={colors.accent} style={{ marginTop: 40 }} accessibilityLabel="Chargement des tâches" />
      )}

      {error && <Text style={styles.errorText} accessibilityRole="alert" accessibilityLiveRegion="assertive">{error}</Text>}

      <FlatList
        data={displayTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SwipeableTaskItem
            task={item}
            onComplete={completeTask}
            onDelete={deleteTask}
            isSelecting={isSelecting}
            isSelected={selectedIds.has(item.id)}
            onLongPress={handleLongPress}
            onTapInSelection={handleTapInSelection}
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

      {!isSelecting && <FAB onPress={() => setModalVisible(true)} />}

      {pendingAction && (
        <UndoToast
          message={pendingAction.type === 'delete' ? 'Tâche supprimée' : 'Tâche terminée'}
          onUndo={undoAction}
          onDismiss={confirmAction}
        />
      )}

      <AddTaskModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={createTask}
      />

      <ImportExportModal
        visible={importExportVisible}
        onClose={() => setImportExportVisible(false)}
        onImport={importTasks}
        getExportData={() => tasks.filter(t => !t.isCompleted).map(t => ({
          title: t.title,
          dueDate: t.dueDate ? new Date(t.dueDate).toLocaleDateString('fr-FR') : '',
          priority: t.priority,
          project: t.project?.name ?? '',
          isRecurring: t.isRecurring ? 'oui' : 'non',
          createdAt: new Date(t.createdAt).toLocaleDateString('fr-FR'),
        }))}
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
