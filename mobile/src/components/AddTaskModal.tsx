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

type ActivePicker = 'date' | 'priority' | 'project' | 'recurrence' | null;

type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (title: string, dueDate?: string, priority?: number, projectId?: string | null, recurrenceRule?: string) => void;
};

const PRIORITY_OPTIONS = [
  { value: 1, label: 'P1', color: '#EF4444' },
  { value: 2, label: 'P2', color: '#F59E0B' },
  { value: 3, label: 'P3', color: '#3B82F6' },
  { value: 4, label: 'P4', color: null },
];

const RECURRENCE_OPTIONS = [
  { value: 'none', label: 'Jamais' },
  { value: 'daily', label: 'Quotidien' },
  { value: 'weekly', label: 'Hebdomadaire' },
  { value: 'monthly', label: 'Mensuel' },
];

function formatDateFR(date: Date): string {
  return date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
}

export function AddTaskModal({ visible, onClose, onSubmit }: Props) {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [priority, setPriority] = useState(4);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [recurrenceRule, setRecurrenceRule] = useState('none');
  const [activePicker, setActivePicker] = useState<ActivePicker>(null);
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { projects, fetchProjects } = useProjectsStore();

  useEffect(() => {
    if (visible) fetchProjects().catch(() => {});
  }, [visible]);

  function reset() {
    setTitle('');
    setDueDate(null);
    setPriority(4);
    setSelectedProjectId(null);
    setRecurrenceRule('none');
    setActivePicker(null);
  }

  function handleSubmit() {
    if (!title.trim()) return;
    onSubmit(title.trim(), dueDate?.toISOString(), priority, selectedProjectId, recurrenceRule);
    reset();
    onClose();
  }

  function handleClose() {
    reset();
    onClose();
  }

  function togglePicker(picker: ActivePicker) {
    setActivePicker(prev => prev === picker ? null : picker);
  }

  function selectDate(offset: number | null) {
    if (offset === null) { setDueDate(null); }
    else {
      const d = new Date();
      d.setDate(d.getDate() + offset);
      d.setHours(0, 0, 0, 0);
      setDueDate(d);
    }
    setActivePicker(null);
  }

  const priorityColor = PRIORITY_OPTIONS.find(p => p.value === priority)?.color ?? colors.textMuted;
  const selectedProject = projects.find(p => p.id === selectedProjectId);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
      <KeyboardAvoidingView style={styles.overlay} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <TouchableOpacity style={styles.backdrop} onPress={handleClose} activeOpacity={1} accessibilityLabel="Fermer" accessibilityRole="button" />

        <View style={styles.sheet} accessibilityViewIsModal>
          <View style={styles.handle} accessibilityElementsHidden />

          <TextInput
            style={styles.input}
            placeholder="Nom de la tâche"
            placeholderTextColor={colors.textMuted}
            value={title}
            onChangeText={setTitle}
            autoFocus
            onSubmitEditing={handleSubmit}
            returnKeyType="done"
            color={colors.text}
            accessibilityLabel="Nom de la tâche"
            accessibilityHint="Entrez le nom de votre tâche"
          />

          {/* Picker inline */}
          {activePicker === 'date' && (
            <View style={styles.pickerBox} accessibilityLabel="Choisir une date">
              <View style={styles.dateRow}>
                <TouchableOpacity style={styles.dateOption} onPress={() => selectDate(0)} accessibilityRole="button" accessibilityLabel="Aujourd'hui">
                  <Ionicons name="today-outline" size={16} color={colors.text} accessibilityElementsHidden />
                  <Text style={styles.dateOptionText}>Aujourd'hui</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.dateOption} onPress={() => selectDate(1)} accessibilityRole="button" accessibilityLabel="Demain">
                  <Ionicons name="calendar-outline" size={16} color={colors.text} accessibilityElementsHidden />
                  <Text style={styles.dateOptionText}>Demain</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.dateRow}>
                <TouchableOpacity style={styles.dateOption} onPress={() => selectDate(7)} accessibilityRole="button" accessibilityLabel="Dans 7 jours">
                  <Ionicons name="calendar-outline" size={16} color={colors.text} accessibilityElementsHidden />
                  <Text style={styles.dateOptionText}>Dans 7 jours</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.dateOption, styles.dateOptionClear]} onPress={() => selectDate(null)} accessibilityRole="button" accessibilityLabel="Effacer la date">
                  <Ionicons name="close-circle-outline" size={16} color={colors.textMuted} accessibilityElementsHidden />
                  <Text style={[styles.dateOptionText, { color: colors.textMuted }]}>Effacer</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {activePicker === 'priority' && (
            <View style={styles.pickerBox} accessibilityLabel="Choisir une priorité">
              <View style={styles.priorityRow}>
                {PRIORITY_OPTIONS.map(opt => {
                  const c = opt.color ?? colors.textMuted;
                  const sel = priority === opt.value;
                  return (
                    <TouchableOpacity
                      key={opt.value}
                      onPress={() => { setPriority(opt.value); setActivePicker(null); }}
                      style={[styles.priorityBtn, { borderColor: c }, sel && { backgroundColor: c }]}
                      accessibilityLabel={`Priorité ${opt.label}`}
                      accessibilityRole="button"
                      accessibilityState={{ selected: sel }}
                    >
                      <Ionicons name="flag" size={14} color={sel ? '#fff' : c} accessibilityElementsHidden />
                      <Text style={[styles.priorityBtnText, { color: sel ? '#fff' : c }]}>{opt.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {activePicker === 'project' && (
            <View style={styles.pickerBox} accessibilityLabel="Choisir un projet">
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.projectRow}>
                <TouchableOpacity
                  onPress={() => { setSelectedProjectId(null); setActivePicker(null); }}
                  style={[styles.projectBtn, selectedProjectId === null && styles.projectBtnSelected]}
                  accessibilityLabel="Boîte de réception"
                  accessibilityRole="button"
                >
                  <Ionicons name="inbox-outline" size={14} color={selectedProjectId === null ? '#fff' : colors.text} accessibilityElementsHidden />
                  <Text style={[styles.projectBtnText, selectedProjectId === null && { color: '#fff' }]}>Boîte de réception</Text>
                </TouchableOpacity>
                {projects.map(p => {
                  const sel = selectedProjectId === p.id;
                  return (
                    <TouchableOpacity
                      key={p.id}
                      onPress={() => { setSelectedProjectId(p.id); setActivePicker(null); }}
                      style={[styles.projectBtn, sel && { backgroundColor: p.color, borderColor: p.color }]}
                      accessibilityLabel={`Projet ${p.name}`}
                      accessibilityRole="button"
                      accessibilityState={{ selected: sel }}
                    >
                      <View style={[styles.projectDot, { backgroundColor: p.color }]} accessibilityElementsHidden />
                      <Text style={[styles.projectBtnText, sel && { color: '#fff' }]}>{p.name}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          )}

          {activePicker === 'recurrence' && (
            <View style={styles.pickerBox} accessibilityLabel="Choisir la récurrence">
              <View style={styles.recurrenceRow}>
                {RECURRENCE_OPTIONS.map(opt => {
                  const sel = recurrenceRule === opt.value;
                  return (
                    <TouchableOpacity
                      key={opt.value}
                      onPress={() => { setRecurrenceRule(opt.value); setActivePicker(null); }}
                      style={[styles.recurrenceBtn, sel && styles.recurrenceBtnSelected]}
                      accessibilityLabel={opt.label}
                      accessibilityRole="button"
                      accessibilityState={{ selected: sel }}
                    >
                      <Text style={[styles.recurrenceBtnText, sel && { color: '#fff' }]}>{opt.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* Barre d'actions */}
          <View style={styles.actionBar}>
            <View style={styles.actionChips}>
              {/* Date */}
              <TouchableOpacity
                style={[styles.chip, dueDate && styles.chipActive, activePicker === 'date' && styles.chipOpen]}
                onPress={() => togglePicker('date')}
                accessibilityLabel={dueDate ? `Date : ${formatDateFR(dueDate)}` : "Ajouter une date"}
                accessibilityRole="button"
              >
                <Ionicons name="calendar-outline" size={15} color={dueDate ? colors.accent : colors.textSecondary} accessibilityElementsHidden />
                {dueDate && <Text style={styles.chipText}>{formatDateFR(dueDate)}</Text>}
              </TouchableOpacity>

              {/* Priorité */}
              <TouchableOpacity
                style={[styles.chip, priority !== 4 && styles.chipActive, activePicker === 'priority' && styles.chipOpen]}
                onPress={() => togglePicker('priority')}
                accessibilityLabel={`Priorité ${PRIORITY_OPTIONS.find(p => p.value === priority)?.label}`}
                accessibilityRole="button"
              >
                <Ionicons name="flag-outline" size={15} color={priority !== 4 ? priorityColor : colors.textSecondary} accessibilityElementsHidden />
                {priority !== 4 && <Text style={[styles.chipText, { color: priorityColor }]}>{PRIORITY_OPTIONS.find(p => p.value === priority)?.label}</Text>}
              </TouchableOpacity>

              {/* Projet */}
              <TouchableOpacity
                style={[styles.chip, selectedProjectId && styles.chipActive, activePicker === 'project' && styles.chipOpen]}
                onPress={() => togglePicker('project')}
                accessibilityLabel={selectedProject ? `Projet : ${selectedProject.name}` : "Boîte de réception"}
                accessibilityRole="button"
              >
                <Ionicons name="folder-outline" size={15} color={selectedProject ? selectedProject.color : colors.textSecondary} accessibilityElementsHidden />
                {selectedProject && <Text style={[styles.chipText, { color: selectedProject.color }]}>{selectedProject.name}</Text>}
              </TouchableOpacity>

              {/* Récurrence */}
              <TouchableOpacity
                style={[styles.chip, recurrenceRule !== 'none' && styles.chipActive, activePicker === 'recurrence' && styles.chipOpen]}
                onPress={() => togglePicker('recurrence')}
                accessibilityLabel={`Récurrence : ${RECURRENCE_OPTIONS.find(r => r.value === recurrenceRule)?.label}`}
                accessibilityRole="button"
              >
                <Ionicons name="repeat-outline" size={15} color={recurrenceRule !== 'none' ? colors.accent : colors.textSecondary} accessibilityElementsHidden />
                {recurrenceRule !== 'none' && <Text style={styles.chipText}>{RECURRENCE_OPTIONS.find(r => r.value === recurrenceRule)?.label}</Text>}
              </TouchableOpacity>
            </View>

            {/* Bouton envoyer */}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={!title.trim()}
              style={[styles.submitBtn, !title.trim() && styles.submitBtnDisabled]}
              accessibilityLabel="Enregistrer la tâche"
              accessibilityRole="button"
              accessibilityState={{ disabled: !title.trim() }}
            >
              <Ionicons name="arrow-up" size={18} color="#fff" accessibilityElementsHidden />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function createStyles(colors: ColorTheme) {
  return StyleSheet.create({
    overlay: { flex: 1, justifyContent: 'flex-end' },
    backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
    sheet: {
      backgroundColor: colors.surface,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 16,
      paddingBottom: 32,
      gap: 12,
    },
    handle: {
      width: 36, height: 4, borderRadius: 2,
      backgroundColor: colors.border,
      alignSelf: 'center', marginBottom: 4,
    },
    input: {
      fontSize: fontSize.lg,
      lineHeight: lineHeight.lg,
      color: colors.text,
      paddingVertical: 4,
      minHeight: 40,
    },
    pickerBox: {
      backgroundColor: colors.background,
      borderRadius: 12,
      padding: 12,
      gap: 8,
    },
    dateRow: { flexDirection: 'row', gap: 8 },
    dateOption: {
      flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6,
      backgroundColor: colors.surface,
      paddingHorizontal: 12, paddingVertical: 10,
      borderRadius: 8,
    },
    dateOptionText: {
      color: colors.text, fontSize: fontSize.sm, lineHeight: lineHeight.sm,
    },
    dateOptionClear: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.border },
    priorityRow: { flexDirection: 'row', gap: 8 },
    priorityBtn: {
      flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
      gap: 6, paddingVertical: 8, borderRadius: 8, borderWidth: 2,
    },
    priorityBtnText: { fontSize: fontSize.sm, fontWeight: '700', lineHeight: lineHeight.sm },
    projectRow: { flexDirection: 'row', gap: 8, paddingVertical: 2 },
    projectBtn: {
      flexDirection: 'row', alignItems: 'center', gap: 6,
      paddingHorizontal: 12, paddingVertical: 8,
      borderRadius: 20, borderWidth: 1,
      borderColor: colors.border, backgroundColor: colors.surface,
    },
    projectBtnSelected: { backgroundColor: colors.accent, borderColor: colors.accent },
    projectBtnText: { fontSize: fontSize.sm, color: colors.text, lineHeight: lineHeight.sm },
    projectDot: { width: 8, height: 8, borderRadius: 4 },
    recurrenceRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    recurrenceBtn: {
      paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
      borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface,
    },
    recurrenceBtnSelected: { backgroundColor: colors.accent, borderColor: colors.accent },
    recurrenceBtnText: { fontSize: fontSize.sm, color: colors.text, lineHeight: lineHeight.sm },
    actionBar: {
      flexDirection: 'row', alignItems: 'center',
      justifyContent: 'space-between', marginTop: 4,
    },
    actionChips: { flexDirection: 'row', gap: 4, flex: 1 },
    chip: {
      flexDirection: 'row', alignItems: 'center', gap: 4,
      paddingHorizontal: 8, paddingVertical: 6, borderRadius: 8,
    },
    chipActive: { backgroundColor: colors.background },
    chipOpen: { backgroundColor: colors.border },
    chipText: {
      fontSize: fontSize.sm, color: colors.accent,
      lineHeight: lineHeight.sm, letterSpacing: letterSpacing.normal,
    },
    submitBtn: {
      width: 36, height: 36, borderRadius: 18,
      backgroundColor: colors.accent,
      alignItems: 'center', justifyContent: 'center',
    },
    submitBtnDisabled: { backgroundColor: colors.border },
  });
}
