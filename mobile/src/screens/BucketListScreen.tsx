import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, Modal, TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FAB } from '../components/FAB';
import { useColors } from '../theme/useColors';
import { ColorTheme } from '../theme/colors';
import { fontSize, lineHeight, letterSpacing } from '../theme/typography';

type BucketItem = {
  id: string;
  text: string;
  done: boolean;
  createdAt: string;
};

const STORAGE_KEY = 'bucketlist';

export function BucketListScreen() {
  const insets = useSafeAreaInsets();
  const [items, setItems] = useState<BucketItem[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newText, setNewText] = useState('');
  const colors = useColors();

  const styles = useMemo(() => createStyles(colors), [colors]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(raw => {
      if (raw) {
        try {
          const parsed = JSON.parse(raw) as BucketItem[];
          setItems(parsed);
        } catch {
          // ignore parse errors
        }
      }
    });
  }, []);

  async function saveItems(updated: BucketItem[]) {
    setItems(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

  async function handleToggle(id: string) {
    const updated = items.map(item =>
      item.id === id ? { ...item, done: !item.done } : item
    );
    await saveItems(updated);
  }

  async function handleDelete(id: string) {
    const updated = items.filter(item => item.id !== id);
    await saveItems(updated);
  }

  async function handleAdd() {
    if (!newText.trim()) return;
    const newItem: BucketItem = {
      id: Date.now().toString(),
      text: newText.trim(),
      done: false,
      createdAt: new Date().toISOString(),
    };
    await saveItems([newItem, ...items]);
    setNewText('');
    setModalVisible(false);
  }

  function handleCloseModal() {
    setNewText('');
    setModalVisible(false);
  }

  // Active items first, done items last
  const sortedItems = [
    ...items.filter(i => !i.done),
    ...items.filter(i => i.done),
  ];

  const renderItem = useCallback(({ item }: { item: BucketItem }) => (
    <View style={styles.itemRow}>
      <TouchableOpacity
        onPress={() => handleToggle(item.id)}
        style={styles.checkboxArea}
        accessibilityLabel={item.done ? `Marquer comme non terminé : ${item.text}` : `Marquer comme terminé : ${item.text}`}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: item.done }}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <View style={[styles.circle, item.done && styles.circleDone]}>
          {item.done && (
            <Ionicons name="checkmark" size={13} color="#fff" accessibilityElementsHidden />
          )}
        </View>
      </TouchableOpacity>

      <Text
        style={[styles.itemText, item.done && styles.itemTextDone]}
        accessibilityLabel={item.text + (item.done ? ', terminé' : '')}
      >
        {item.text}
      </Text>

      <TouchableOpacity
        onPress={() => handleDelete(item.id)}
        style={styles.deleteBtn}
        accessibilityLabel={`Supprimer : ${item.text}`}
        accessibilityRole="button"
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons name="trash-outline" size={18} color={colors.textMuted} accessibilityElementsHidden />
      </TouchableOpacity>
    </View>
  ), [items, styles, colors]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header} accessibilityRole="header">
        <View style={{ flex: 1 }}>
          <Text style={styles.title} accessibilityRole="header">Bucket List</Text>
          <Text style={styles.subtitle}>Tes objectifs de vie</Text>
        </View>
        <Text style={styles.counter} accessibilityLabel={`${items.filter(i => i.done).length} sur ${items.length} accomplis`}>
          {items.filter(i => i.done).length}/{items.length}
        </Text>
      </View>

      <FlatList
        data={sortedItems}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Aucun objectif pour l'instant — ose rêver grand !</Text>
        }
      />

      <FAB onPress={() => setModalVisible(true)} />

      {/* Modal ajout */}
      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={handleCloseModal}>
        <KeyboardAvoidingView
          style={styles.overlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <TouchableOpacity style={styles.backdrop} onPress={handleCloseModal} activeOpacity={1} accessibilityLabel="Fermer" accessibilityRole="button" />
          <View style={styles.sheet} accessibilityViewIsModal>
            <View style={styles.handle} accessibilityElementsHidden />

            <Text style={styles.modalLabel} accessibilityRole="header">Nouvel objectif</Text>

            <TextInput
              style={styles.modalInput}
              placeholder="ex: Escalader le Mont-Blanc"
              placeholderTextColor={colors.textMuted}
              value={newText}
              onChangeText={setNewText}
              autoFocus
              onSubmitEditing={handleAdd}
              returnKeyType="done"
              color={colors.text}
              accessibilityLabel="Nom de l'objectif"
              accessibilityHint="Entrez votre objectif de vie"
            />

            <View style={styles.modalActions}>
              <TouchableOpacity onPress={handleCloseModal} style={styles.cancelBtn} accessibilityLabel="Annuler" accessibilityRole="button">
                <Ionicons name="close" size={22} color={colors.textSecondary} accessibilityElementsHidden />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleAdd}
                style={[styles.submitBtn, !newText.trim() ? styles.submitBtnDisabled : null]}
                disabled={!newText.trim()}
                accessibilityLabel="Ajouter l'objectif"
                accessibilityRole="button"
                accessibilityState={{ disabled: !newText.trim() }}
              >
                <Ionicons name="arrow-up-circle" size={32} color={newText.trim() ? colors.accent : colors.border} accessibilityElementsHidden />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

function createStyles(colors: ColorTheme) {
  return StyleSheet.create({
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
      fontSize: fontSize.xxl,
      fontWeight: '700',
      color: colors.text,
      lineHeight: lineHeight.xxl,
    },
    subtitle: {
      fontSize: fontSize.sm,
      lineHeight: lineHeight.sm,
      color: colors.textSecondary,
      marginTop: 2,
      letterSpacing: letterSpacing.normal,
    },
    counter: {
      fontSize: fontSize.md,
      lineHeight: lineHeight.md,
      color: colors.textSecondary,
      fontWeight: '500',
    },
    list: {
      paddingBottom: 100,
    },
    itemRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    checkboxArea: {
      marginRight: 14,
    },
    circle: {
      width: 22,
      height: 22,
      borderRadius: 11,
      borderWidth: 2,
      borderColor: colors.textMuted,
      alignItems: 'center',
      justifyContent: 'center',
    },
    circleDone: {
      backgroundColor: colors.accent,
      borderColor: colors.accent,
    },
    itemText: {
      flex: 1,
      fontSize: fontSize.lg,
      fontWeight: '600',
      color: colors.text,
      lineHeight: lineHeight.lg,
      letterSpacing: letterSpacing.normal,
    },
    itemTextDone: {
      textDecorationLine: 'line-through',
      color: colors.textMuted,
    },
    deleteBtn: {
      padding: 4,
      marginLeft: 8,
    },
    emptyText: {
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: 60,
      fontSize: fontSize.md,
      lineHeight: lineHeight.md,
      paddingHorizontal: 32,
    },
    // Modal styles
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
    modalLabel: {
      fontSize: fontSize.sm,
      lineHeight: lineHeight.sm,
      color: colors.textSecondary,
      fontWeight: '500',
      textTransform: 'uppercase',
      letterSpacing: letterSpacing.wide,
    },
    modalInput: {
      fontSize: fontSize.lg,
      lineHeight: lineHeight.lg,
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    modalActions: {
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
