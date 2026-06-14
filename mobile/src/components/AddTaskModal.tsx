import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  Modal, StyleSheet, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fontSize, lineHeight, letterSpacing } from '../theme/typography';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (title: string) => void;
};

export function AddTaskModal({ visible, onClose, onSubmit }: Props) {
  const [title, setTitle] = useState('');

  function handleSubmit() {
    if (!title.trim()) return;
    onSubmit(title.trim());
    setTitle('');
    onClose();
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} accessibilityLabel="Fermer le formulaire" accessibilityRole="button" />

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

          <View style={styles.actions} accessible={false}>
            <TouchableOpacity onPress={onClose} style={styles.cancelBtn} accessibilityLabel="Annuler" accessibilityRole="button">
              <Ionicons name="close" size={22} color={colors.textSecondary} accessibilityElementsHidden />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  cancelBtn: {
    padding: 8,
  },
});
