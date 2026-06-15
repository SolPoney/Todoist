import React, { useState, useEffect, useMemo } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  Modal, StyleSheet, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '../theme/useColors';
import { ColorTheme } from '../theme/colors';
import { fontSize, lineHeight, letterSpacing } from '../theme/typography';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (title: string, dueDate?: string) => void;
  initialTitle: string;
  initialDueDate?: string | null;
};

function formatDateFR(date: Date): string {
  return date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
}

export function EditTaskModal({ visible, onClose, onSubmit, initialTitle, initialDueDate }: Props) {
  const [title, setTitle] = useState(initialTitle);
  const [dueDate, setDueDate] = useState<Date | null>(
    initialDueDate ? new Date(initialDueDate) : null
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const colors = useColors();

  const styles = useMemo(() => createStyles(colors), [colors]);

  // Sync with props when modal opens
  useEffect(() => {
    if (visible) {
      setTitle(initialTitle);
      setDueDate(initialDueDate ? new Date(initialDueDate) : null);
      setShowDatePicker(false);
    }
  }, [visible, initialTitle, initialDueDate]);

  function handleSubmit() {
    if (!title.trim()) return;
    onSubmit(title.trim(), dueDate?.toISOString());
    onClose();
  }

  function handleClose() {
    setShowDatePicker(false);
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

          <Text style={styles.label} accessibilityRole="header">Modifier la tâche</Text>

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
            accessibilityHint="Modifiez le nom de votre tâche"
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

          <View style={styles.actions} accessible={false}>
            <TouchableOpacity onPress={handleClose} style={styles.cancelBtn} accessibilityLabel="Annuler" accessibilityRole="button">
              <Ionicons name="close" size={22} color={colors.textSecondary} accessibilityElementsHidden />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSubmit}
              style={[styles.submitBtn, !title.trim() ? styles.submitBtnDisabled : null]}
              disabled={!title.trim()}
              accessibilityLabel="Enregistrer les modifications"
              accessibilityRole="button"
              accessibilityState={{ disabled: !title.trim() }}
            >
              <Text style={[styles.submitBtnText, !title.trim() ? styles.submitBtnTextDisabled : null]}>
                Enregistrer
              </Text>
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
      backgroundColor: colors.accent,
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 10,
    },
    submitBtnDisabled: {
      backgroundColor: colors.border,
    },
    submitBtnText: {
      color: '#fff',
      fontSize: fontSize.md,
      lineHeight: lineHeight.md,
      fontWeight: '600',
    },
    submitBtnTextDisabled: {
      color: colors.textMuted,
    },
  });
}
