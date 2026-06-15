import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '../stores/authStore';
import { useTasksStore } from '../stores/tasksStore';
import { ImportExportModal } from '../components/ImportExportModal';
import { TutorialScreen } from './TutorialScreen';
import { useColors } from '../theme/useColors';
import { useThemeStore } from '../stores/themeStore';
import { ColorTheme } from '../theme/colors';
import { fontSize, lineHeight } from '../theme/typography';

export function BrowseScreen() {
  const insets = useSafeAreaInsets();
  const { logout, user } = useAuthStore();
  const { tasks, importTasks } = useTasksStore();
  const [importExportVisible, setImportExportVisible] = useState(false);
  const [tutorialVisible, setTutorialVisible] = useState(false);
  const colors = useColors();
  const { isDark, toggleTheme } = useThemeStore();

  const styles = useMemo(() => createStyles(colors), [colors]);

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : '?';
  const displayName = user?.name ?? user?.email ?? 'Mon espace';

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Profil */}
      <View style={styles.profileRow} accessible accessibilityLabel={`Connecté en tant que ${displayName}`}>
        <View style={styles.avatar} accessibilityElementsHidden>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.username}>{displayName}</Text>
          {user?.email && <Text style={styles.email}>{user.email}</Text>}
        </View>
      </View>

      <View style={styles.divider} accessibilityElementsHidden />

      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 32 }]}>

        {/* Outils */}
        <Text style={styles.sectionTitle} accessibilityRole="header">Outils</Text>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={toggleTheme}
          accessibilityLabel={isDark ? 'Passer au thème clair' : 'Passer au thème sombre'}
          accessibilityRole="button"
        >
          <View style={[styles.menuIconWrap, { backgroundColor: isDark ? '#F59E0B' : '#6366F1' }]} accessibilityElementsHidden>
            <Ionicons name={isDark ? 'sunny-outline' : 'moon-outline'} size={18} color="#fff" />
          </View>
          <Text style={styles.menuLabel}>{isDark ? 'Thème clair' : 'Thème sombre'}</Text>
          <Ionicons name="chevron-forward" size={18} color={colors.textMuted} accessibilityElementsHidden />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => setImportExportVisible(true)}
          accessibilityLabel="Importer ou exporter des tâches"
          accessibilityRole="button"
        >
          <View style={[styles.menuIconWrap, { backgroundColor: '#2563EB' }]} accessibilityElementsHidden>
            <Ionicons name="swap-vertical-outline" size={18} color="#fff" />
          </View>
          <Text style={styles.menuLabel}>Import / Export</Text>
          <Ionicons name="chevron-forward" size={18} color={colors.textMuted} accessibilityElementsHidden />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => setTutorialVisible(true)}
          accessibilityLabel="Ouvrir le tutoriel de l'application"
          accessibilityRole="button"
        >
          <View style={[styles.menuIconWrap, { backgroundColor: '#059669' }]} accessibilityElementsHidden>
            <Ionicons name="book-outline" size={18} color="#fff" />
          </View>
          <Text style={styles.menuLabel}>Tutoriel</Text>
          <Ionicons name="chevron-forward" size={18} color={colors.textMuted} accessibilityElementsHidden />
        </TouchableOpacity>

        <View style={styles.divider} accessibilityElementsHidden />

        {/* Compte */}
        <Text style={styles.sectionTitle} accessibilityRole="header">Compte</Text>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={logout}
          accessibilityLabel="Se déconnecter"
          accessibilityRole="button"
        >
          <View style={[styles.menuIconWrap, { backgroundColor: '#EF4444' }]} accessibilityElementsHidden>
            <Ionicons name="log-out-outline" size={18} color="#fff" />
          </View>
          <Text style={[styles.menuLabel, { color: '#EF4444' }]}>Se déconnecter</Text>
          <Ionicons name="chevron-forward" size={18} color={colors.textMuted} accessibilityElementsHidden />
        </TouchableOpacity>
      </ScrollView>

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

      <Modal
        visible={tutorialVisible}
        animationType="slide"
        onRequestClose={() => setTutorialVisible(false)}
      >
        <TutorialScreen onDone={() => setTutorialVisible(false)} />
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
    profileRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 16,
    },
    avatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.accent,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    avatarText: {
      color: '#fff',
      fontWeight: '700',
      fontSize: fontSize.xl,
    },
    profileInfo: {
      flex: 1,
    },
    username: {
      fontSize: fontSize.md,
      fontWeight: '700',
      color: colors.text,
      lineHeight: lineHeight.md,
    },
    email: {
      fontSize: fontSize.sm,
      color: colors.textSecondary,
      lineHeight: lineHeight.sm,
      marginTop: 2,
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginVertical: 4,
    },
    scroll: {
      paddingTop: 8,
      paddingHorizontal: 16,
    },
    sectionTitle: {
      fontSize: fontSize.sm,
      fontWeight: '700',
      color: colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginTop: 20,
      marginBottom: 10,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      gap: 12,
    },
    menuIconWrap: {
      width: 34,
      height: 34,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    menuLabel: {
      flex: 1,
      fontSize: fontSize.md,
      color: colors.text,
      fontWeight: '500',
      lineHeight: lineHeight.md,
    },
  });
}
