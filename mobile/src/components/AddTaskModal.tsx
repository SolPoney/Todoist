import React, { useState, useMemo, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  Modal, StyleSheet, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '../theme/useColors';
import { ColorTheme } from '../theme/colors';
import { fontSize, lineHeight, letterSpacing } from '../theme/typography';
import { useProjectsStore } from '../stores/projectsStore';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (title: string, dueDate?: string, priority?: number, projectId?: string | null, recurrenceRule?: string) => void;
};

const PRIORITY_OPTIONS = [
  { value: 1, label: 'P1', color: '#EF4444' },
  { value: 2, label: 'P2', color: '#F59E0B' },
  { value: 3, label: 'P3', color: '#3B82F6' },
  { value: 4, label: 'P4', color: null }, // uses textMuted
];

const RECURRENCE_OPTIONS = [
  { value: 'none', label: 'Jamais' },
  { value: 'daily', label: 'Quotidien' },
  { value: 'weekly', label: 'Hebdo' },
  { value: 'monthly', label: 'Mensuel' },
];

function formatDateFR(date: Date): string {
  return date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
}

export function AddTaskModal({ visible, onClose, onSubmit }: Props) {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [priority, setPriority] = useState(4);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [recurrenceRule, setRecurrenceRule] = useState('none');
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const { projects, fetchProjects } = useProjectsStore();

  useEffect(() => {
    if (visible) {
      fetchProjects().catch(() => {});
    }
  }, [visible]);

  function handleSubmit() {
    if (!title.trim()) return;
    onSubmit(title.trim(), dueDate?.toISOString(), priority, selectedProjectId, recurrenceRule);
    setTitle('');
    setDueDate(null);
    setShowDatePicker(false);
    setPriority(4);
    setSelectedProjectId(null);
    setRecurrenceRule('none');
    onClose();
  }

  function handleClose() {
    setTitle('');
    setDueDate(null);
    setShowDatePicker(false);
    setPriority(4);
    setSelectedProjectId(null);
    setRecurrenceRule('none');
    onClose();
  }

  function selectDate(offset: number | null) {
    if (offset === null) {
      setDueDate(null);
    } else {
      const d = new Date();
      d.setDate(d.getDate() + offset);
      d.setHours(0, 0, 0, 0);
      setDueDate(d);
    }
    setShowDatePicker(false);
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableOpacity style={styles.backdrop} onPress={handleClose} activeOpacity={1} accessibilityLabel="Fermer le formulaire" accessibilityRole="button" />

        <View style={styles.sheet} accessibilityViewIsModal>
          <View style={styles.handle} accessibilityElementsHidden />

          <Text style={styles.label} accessibilityRole="header">Nom de la tâche</Text>

          <TextInput
            style={styles.input}
            placeholder="ex: Appeler le médecin"
            placeholderTextColor={colors.textMuted}
            value={title}
            onChangeText={setTitle}
            autoFocus
            onSubmitEditing={handleSubmit}
            returnKeyType="done"
            color={colors.text}
            accessibilityLabel="Nom de la tâche"
            accessibilityHint="Entrez le nom de votre tâche puis appuyez sur Entrée"
          />

          {/* Bouton date ou date sélectionnée */}
          <TouchableOpacity
            style={styles.dateBtn}
            onPress={() => setShowDatePicker(v => !v)}
            accessibilityLabel={dueDate ? `Date d'échéance : ${formatDateFR(dueDate)}` : "Ajouter une date d'échéance"}
            accessibilityRole="button"
          >
            <Ionicons name="calendar-outline" size={16} color={dueDate ? colors.accent : colors.textSecondary} accessibilityElementsHidden />
            <Text style={[styles.dateBtnText, dueDate ? styles.dateBtnTextActive : null]}>
              {dueDate ? formatDateFR(dueDate) : 'Ajouter une date'}
            </Text>
          </TouchableOpacity>

          {/* Sélecteur de date inline */}
          {showDatePicker && (
            <View style={styles.dateOptions} accessibilityRole="toolbar" accessibilityLabel="Choisir une date">
              <View style={styles.dateOptionsRow}>
                <TouchableOpacity style={styles.dateOption} onPress={() => selectDate(0)} accessibilityRole="button" accessibilityLabel="Aujourd'hui">
                  <Text style={styles.dateOptionText}>Aujourd'hui</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.dateOption} onPress={() => selectDate(1)} accessibilityRole="button" accessibilityLabel="Demain">
                  <Text style={styles.dateOptionText}>Demain</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.dateOptionsRow}>
                <TouchableOpacity style={styles.dateOption} onPress={() => selectDate(7)} accessibilityRole="button" accessibilityLabel="Dans 7 jours">
                  <Text style={styles.dateOptionText}>Dans 7 jours</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.dateOption, styles.dateOptionClear]} onPress={() => selectDate(null)} accessibilityRole="button" accessibilityLabel="Effacer la date">
                  <Text style={[styles.dateOptionText, styles.dateOptionClearText]}>Effacer</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Priorité */}
          <View style={styles.sectionRow} accessible={false}>
            <Text style={styles.sectionLabel}>Priorité</Text>
            <View style={styles.chipRow} accessible={false}>
              {PRIORITY_OPTIONS.map(opt => {
                const chipColor = opt.color ?? colors.textMuted;
                const isSelected = priority === opt.value;
                return (
                  <TouchableOpacity
                    key={opt.value}
                    onPress={() => setPriority(opt.value)}
                    style={[
                      styles.priorityChip,
                      { borderColor: chipColor },
                      isSelected && { backgroundColor: chipColor },
                    ]}
                    accessibilityLabel={`Priorité ${opt.label}`}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                  >
                    <Text style={[styles.priorityChipText, { color: isSelected ? '#fff' : chipColor }]}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Projet */}
          <View style={styles.sectionRow} accessible={false}>
            <Text style={styles.sectionLabel}>Projet</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll} contentContainerStyle={styles.chipRow}>
              <TouchableOpacity
                onPress={() => setSelectedProjectId(null)}
                style={[styles.projectChip, selectedProjectId === null && styles.projectChipSelected]}
                accessibilityLabel="Aucun projet"
                accessibilityRole="button"
                accessibilityState={{ selected: selectedProjectId === null }}
              >
                <Text style={[styles.projectChipText, selectedProjectId === null && styles.projectChipTextSelected]}>
                  Aucun
                </Text>
              </TouchableOpacity>
              {projects.map(p => {
                const isSelected = selectedProjectId === p.id;
                return (
                  <TouchableOpacity
                    key={p.id}
                    onPress={() => setSelectedProjectId(p.id)}
                    style={[styles.projectChip, isSelected && { backgroundColor: p.color, borderColor: p.color }]}
                    accessibilityLabel={`Projet ${p.name}`}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                  >
                    <View style={[styles.projectDot, { backgroundColor: p.color }]} accessibilityElementsHidden />
                    <Text style={[styles.projectChipText, isSelected && styles.projectChipTextSelected]}>
                      {p.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Récurrence */}
          <View style={styles.sectionRow} accessible={false}>
            <Text style={styles.sectionLabel}>Récurrence</Text>
            <View style={styles.chipRow} accessible={false}>
              {RECURRENCE_OPTIONS.map(opt => {
                const isSelected = recurrenceRule === opt.value;
                return (
                  <TouchableOpacity
                    key={opt.value}
                    onPress={() => setRecurrenceRule(opt.value)}
                    style={[styles.recurrenceChip, isSelected && styles.recurrenceChipSelected]}
                    accessibilityLabel={opt.label}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                  >
                    <Text style={[styles.recurrenceChipText, isSelected && styles.recurrenceChipTextSelected]}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.actions} accessible={false}>
            <TouchableOpacity onPress={handleClose} style={styles.cancelBtn} accessibilityLabel="Annuler" accessibilityRole="button">
              <Ionicons name="close" size={22} color={colors.textSecondary} accessibilityElementsHidden />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSubmit}
              style={[styles.submitBtn, !title.trim() ? styles.submitBtnDisabled : null]}
              disabled={!title.trim()}
              accessibilityLabel="Enregistrer la tâche"
              accessibilityRole="button"
              accessibilityState={{ disabled: !title.trim() }}
            >
              <Ionicons name="arrow-up-circle" size={32} color={title.trim() ? colors.accent : colors.border} accessibilityElementsHidden />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function createStyles(colors: ColorTheme) {
  return StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    backdrop: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    sheet: {
      backgroundColor: colors.surface,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      padding: 20,
      paddingBottom: 36,
      gap: 12,
    },
    handle: {
      width: 36,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.border,
      alignSelf: 'center',
      marginBottom: 8,
    },
    label: {
      fontSize: fontSize.sm,
      lineHeight: lineHeight.sm,
      color: colors.textSecondary,
      fontWeight: '500',
      textTransform: 'uppercase',
      letterSpacing: letterSpacing.wide,
    },
    input: {
      fontSize: fontSize.lg,
      lineHeight: lineHeight.lg,
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    dateBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingVertical: 6,
    },
    dateBtnText: {
      fontSize: fontSize.sm,
      lineHeight: lineHeight.sm,
      color: colors.textSecondary,
      flex: 1,
    },
    dateBtnTextActive: {
      color: colors.accent,
      fontWeight: '500',
    },
    dateOptions: {
      flexDirection: 'column',
      gap: 8,
    },
    dateOptionsRow: {
      flexDirection: 'row',
      gap: 8,
    },
    dateOption: {
      flex: 1,
      backgroundColor: colors.border,
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: 8,
      justifyContent: 'center',
    },
    dateOptionText: {
      color: colors.text,
      fontSize: fontSize.sm,
      lineHeight: lineHeight.sm,
      textAlign: 'center',
    },
    dateOptionClear: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: colors.border,
    },
    dateOptionClearText: {
      color: colors.textMuted,
    },
    sectionRow: {
      gap: 8,
    },
    sectionLabel: {
      fontSize: fontSize.sm,
      lineHeight: lineHeight.sm,
      color: colors.textSecondary,
      fontWeight: '500',
      textTransform: 'uppercase',
      letterSpacing: letterSpacing.wide,
    },
    chipRow: {
      flexDirection: 'row',
      gap: 8,
      flexWrap: 'wrap',
    },
    horizontalScroll: {
      flexGrow: 0,
    },
    priorityChip: {
      paddingHorizontal: 14,
      paddingVertical: 6,
      borderRadius: 20,
      borderWidth: 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    priorityChipText: {
      fontSize: fontSize.sm,
      lineHeight: lineHeight.sm,
      fontWeight: '600',
    },
    projectChip: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.border,
      gap: 6,
    },
    projectChipSelected: {
      borderColor: colors.accent,
      backgroundColor: colors.accent,
    },
    projectChipText: {
      fontSize: fontSize.sm,
      lineHeight: lineHeight.sm,
      color: colors.text,
    },
    projectChipTextSelected: {
      color: '#fff',
      fontWeight: '600',
    },
    projectDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    recurrenceChip: {
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.border,
    },
    recurrenceChipSelected: {
      borderColor: colors.accent,
      backgroundColor: colors.accent,
    },
    recurrenceChipText: {
      fontSize: fontSize.sm,
      lineHeight: lineHeight.sm,
      color: colors.text,
    },
    recurrenceChipTextSelected: {
      color: '#fff',
      fontWeight: '600',
    },
    actions: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 4,
    },
    cancelBtn: {
      padding: 8,
    },
    submitBtn: {
      padding: 4,
    },
    submitBtnDisabled: {
      opacity: 0.5,
    },
  });
}
