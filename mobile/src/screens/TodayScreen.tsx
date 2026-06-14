import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TaskItem } from '../components/TaskItem';
import { FAB } from '../components/FAB';
import { todayTasks } from '../data/mockTasks';
import { colors } from '../theme/colors';

export function TodayScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header} accessibilityRole="header">
        <View accessible accessibilityLabel={`Aujourd'hui, ${todayTasks.length} tâches`}>
          <Text style={styles.title} accessibilityRole="header">Aujourd'hui</Text>
          <Text style={styles.subtitle}>{todayTasks.length} tâches</Text>
        </View>
        <View style={styles.headerIcons} accessible={false}>
          <TouchableOpacity style={styles.iconBtn} accessibilityLabel="Changer la vue" accessibilityRole="button">
            <Ionicons name="list" size={22} color={colors.text} accessibilityElementsHidden />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} accessibilityLabel="Plus d'options" accessibilityRole="button">
            <Ionicons name="ellipsis-vertical" size={22} color={colors.text} accessibilityElementsHidden />
          </TouchableOpacity>
        </View>
      </View>

      {/* Section "En retard" */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>En retard</Text>
        <View style={styles.sectionActions}>
          <TouchableOpacity accessibilityLabel="Reporter les tâches en retard" accessibilityRole="button">
            <Text style={styles.reporterBtn}>Reporter</Text>
          </TouchableOpacity>
          <Ionicons name="chevron-up" size={18} color={colors.text} style={{ marginLeft: 8 }} accessibilityElementsHidden />
        </View>
      </View>

      {/* Liste des tâches */}
      <FlatList
        data={todayTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskItem task={item} onComplete={(id) => console.log('Complete:', id)} />
        )}
        contentContainerStyle={styles.list}
      />

      <FAB onPress={() => console.log('Add task')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 4,
  },
  iconBtn: {
    padding: 6,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  sectionActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reporterBtn: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.accent,
  },
  list: {
    paddingBottom: 100,
  },
});
