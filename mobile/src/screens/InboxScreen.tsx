import React, { useEffect, useState, useMemo } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator, RefreshControl, TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SwipeableTaskItem } from '../components/SwipeableTaskItem';
import { AddTaskModal } from '../components/AddTaskModal';
import { EditTaskModal } from '../components/EditTaskModal';
import { ImportExportModal } from '../components/ImportExportModal';
import { FAB } from '../components/FAB';
import { UndoToast } from '../components/UndoToast';
import { Task } from '../components/TaskItem';
import { useTasksStore } from '../stores/tasksStore';
import { useColors } from '../theme/useColors';
import { ColorTheme } from '../theme/colors';
import { fontSize, lineHeight } from '../theme/typography';

export function InboxScreen() {
  const insets = useSafeAreaInsets();
  const { tasks, isLoading, error, fetchTasks, createTask, updateTask, importTasks, completeTask, deleteTask, deleteTasksBulk, pendingAction, undoAction, confirmAction } = useTasksStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [importExportVisible, setImportExportVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const isSelecting = selectedIds.size > 0;
  const [searchQuery, setSearchQuery] = useState('');
  const colors = useColors();

  const styles = useMemo(() => createStyles(colors), [colors]);

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
    deleteTasksBulk(Array.from(selectedIds));
    setSelectedIds(new Set());
  }

  function handleCancelSelection() {
    setSelectedIds(new Set());
  }

  function handleEdit(id: string) {
    const t = tasks.find(t => t.id === id);
    if (!t) return;
    setEditingTask({ id: t.id, title: t.title, date: t.dueDate ?? undefined, project: t.project?.name, isOverdue: false });
  }

  const displayTasks: Task[] = tasks.filter(t => !t.isCompleted).map(t => ({
    id: t.id,
    title: t.title,
    date: t.dueDate ? new Date(t.dueDate).toLocaleDateString('fr-FR') : undefined,
    project: t.project?.name,
    isOverdue: t.dueDate ? new Date(t.dueDate) < new Date() : false,
  }));

  const filteredTasks = searchQuery.trim()
    ? displayTasks.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : displayTasks;

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
          <Text style={styles.title} accessibilityRole="header">Mes tâches</Text>
          <View style={styles.headerIcons} accessible={false}>
            <TouchableOpacity style={styles.iconBtn} onPress={() => setImportExportVisible(true)} accessibilityLabel="Importer ou exporter des tâches" accessibilityRole="button">
              <Ionicons name="swap-vertical-outline" size={22} color={colors.text} accessibilityElementsHidden />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {!isSelecting && (
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={18} color={colors.textMuted} style={styles.searchIcon} accessibilityElementsHidden />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher une tâche..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            clearButtonMode="while-editing"
            accessibilityLabel="Rechercher une tâche"
            accessibilityRole="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} accessibilityLabel="Effacer la recherche" accessibilityRole="button">
              <Ionicons name="close-circle" size={18} color={colors.textMuted} accessibilityElementsHidden />
            </TouchableOpacity>
          )}
        </View>
      )}

      {isLoading && !refreshing && (
        <ActivityIndicator color={colors.accent} style={{ marginTop: 40 }} accessibilityLabel="Chargement des tâches" />
      )}

      {error && <Text style={styles.errorText} accessibilityRole="alert" accessibilityLiveRegion="assertive">{error}</Text>}

      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SwipeableTaskItem
            task={item}
            onComplete={completeTask}
            onDelete={deleteTask}
            onEdit={handleEdit}
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
          message={
            pendingAction.type === 'complete' ? 'Tâche terminée' :
            pendingAction.type === 'delete_bulk' ? `${pendingAction.count} tâche(s) supprimée(s)` :
            'Tâche supprimée'
          }
          onUndo={undoAction}
          onDismiss={confirmAction}
        />
      )}

      <AddTaskModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={(title, dueDate) => createTask(title, dueDate)}
      />

      <EditTaskModal
        visible={!!editingTask}
        onClose={() => setEditingTask(null)}
        initialTitle={editingTask?.title ?? ''}
        initialDueDate={editingTask?.date}
        onSubmit={(title, dueDate) => {
          if (editingTask) {
            updateTask(editingTask.id, title, dueDate);
            setEditingTask(null);
          }
        }}
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

function createStyles(colors: ColorTheme) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    title: { fontSize: fontSize.xxl, fontWeight: '700', color: colors.text, lineHeight: lineHeight.xxl },
    headerIcons: { flexDirection: 'row', gap: 4 },
    iconBtn: { padding: 6 },
    list: { paddingBottom: 100 },
    errorText: { color: colors.accent, textAlign: 'center', marginTop: 40, fontSize: fontSize.md, lineHeight: lineHeight.md },
    emptyText: {
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: 60,
      fontSize: fontSize.md,
      lineHeight: lineHeight.md,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      marginHorizontal: 16,
      marginBottom: 8,
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    searchIcon: {
      marginRight: 8,
    },
    searchInput: {
      flex: 1,
      fontSize: fontSize.md,
      color: colors.text,
      lineHeight: lineHeight.md,
    },
  });
}
