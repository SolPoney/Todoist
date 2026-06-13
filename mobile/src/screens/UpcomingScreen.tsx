import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TaskItem } from '../components/TaskItem';
import { FAB } from '../components/FAB';
import { todayTasks } from '../data/mockTasks';
import { colors } from '../theme/colors';

// Génère les 7 jours de la semaine courante
function getWeekDays() {
  const days = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));

  return days.map((label, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    return {
      label,
      number: date.getDate(),
      isToday: date.toDateString() === today.toDateString(),
    };
  });
}

export function UpcomingScreen() {
  const insets = useSafeAreaInsets();
  const weekDays = getWeekDays();
  const now = new Date();
  const monthLabel = now.toLocaleString('fr-FR', { month: 'long', year: 'numeric' });
  const capitalizedMonth = monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Prochainement</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="list" size={22} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="ellipsis-vertical" size={22} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Sélecteur de mois */}
      <TouchableOpacity style={styles.monthRow}>
        <Text style={styles.monthLabel}>{capitalizedMonth}</Text>
        <Ionicons name="chevron-down" size={16} color={colors.text} style={{ marginLeft: 4 }} />
      </TouchableOpacity>

      {/* Calendrier semaine */}
      <View style={styles.weekCalendar}>
        {weekDays.map((day, i) => (
          <View key={i} style={styles.dayColumn}>
            <Text style={styles.dayLabel}>{day.label}</Text>
            <View style={[styles.dayCircle, day.isToday && styles.dayCircleToday]}>
              <Text style={[styles.dayNumber, day.isToday && styles.dayNumberToday]}>
                {day.number}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Séparateur */}
      <View style={styles.separator} />

      {/* Section En retard */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>En retard</Text>
        <View style={styles.sectionActions}>
          <TouchableOpacity>
            <Text style={styles.reporterBtn}>Reporter</Text>
          </TouchableOpacity>
          <Ionicons name="chevron-up" size={18} color={colors.text} style={{ marginLeft: 8 }} />
        </View>
      </View>

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
  headerIcons: {
    flexDirection: 'row',
    gap: 4,
  },
  iconBtn: {
    padding: 6,
  },
  monthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  monthLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  weekCalendar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    paddingBottom: 12,
  },
  dayColumn: {
    alignItems: 'center',
    gap: 6,
  },
  dayLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  dayCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCircleToday: {
    backgroundColor: colors.accent,
  },
  dayNumber: {
    fontSize: 15,
    color: colors.text,
    fontWeight: '500',
  },
  dayNumberToday: {
    color: '#fff',
    fontWeight: '700',
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: 16,
    marginBottom: 4,
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
