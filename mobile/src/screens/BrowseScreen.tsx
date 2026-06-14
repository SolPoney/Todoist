import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FAB } from '../components/FAB';
import { useAuthStore } from '../stores/authStore';
import { colors } from '../theme/colors';

const projects: { id: string; name: string; count?: number }[] = [];

type MenuItem = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
};

const menuItems: MenuItem[] = [
  { icon: 'search-outline', label: 'Rechercher' },
  { icon: 'grid-outline', label: 'Filtres et étiquettes' },
  { icon: 'bar-chart-outline', label: 'Rapports' },
];

export function BrowseScreen() {
  const insets = useSafeAreaInsets();
  const logout = useAuthStore((s) => s.logout);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Profil utilisateur */}
      <View style={styles.profileRow} accessible accessibilityLabel="Mon espace">
        <View style={styles.avatar} accessibilityElementsHidden>
          <Text style={styles.avatarText}>T</Text>
        </View>
        <Text style={styles.username}>Mon espace</Text>
        <View style={styles.profileIcons} accessible={false}>
          <TouchableOpacity style={styles.iconBtn} accessibilityLabel="Notifications" accessibilityRole="button">
            <Ionicons name="notifications-outline" size={22} color={colors.text} accessibilityElementsHidden />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} accessibilityLabel="Paramètres" accessibilityRole="button">
            <Ionicons name="settings-outline" size={22} color={colors.text} accessibilityElementsHidden />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Menu principal */}
        {menuItems.map((item) => (
          <TouchableOpacity key={item.label} style={styles.menuItem} accessibilityLabel={item.label} accessibilityRole="button">
            <Ionicons name={item.icon} size={20} color={colors.accent} style={styles.menuIcon} accessibilityElementsHidden />
            <Text style={styles.menuLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}

        {/* Séparateur */}
        <View style={styles.divider} accessibilityElementsHidden />

        {/* Mes projets */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle} accessibilityRole="header">Mes projets</Text>
          <View style={styles.sectionActions} accessible={false}>
            <TouchableOpacity style={styles.iconBtn} accessibilityLabel="Ajouter un projet" accessibilityRole="button">
              <Ionicons name="add" size={20} color={colors.text} accessibilityElementsHidden />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} accessibilityLabel="Réduire la section projets" accessibilityRole="button">
              <Ionicons name="chevron-up" size={18} color={colors.text} accessibilityElementsHidden />
            </TouchableOpacity>
          </View>
        </View>

        {projects.map((project) => (
          <TouchableOpacity key={project.id} style={styles.projectItem} accessibilityLabel={`Projet ${project.name}${project.count ? `, ${project.count} tâches` : ''}`} accessibilityRole="button">
            <Ionicons name="hashtag" size={16} color={colors.accent} style={styles.menuIcon} accessibilityElementsHidden />
            <Text style={styles.projectName}>{project.name}</Text>
            {project.count && (
              <Text style={styles.projectCount}>{project.count}</Text>
            )}
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.menuItem} accessibilityLabel="Gérer les projets" accessibilityRole="button">
          <Ionicons name="pencil-outline" size={18} color={colors.textSecondary} style={styles.menuIcon} accessibilityElementsHidden />
          <Text style={[styles.menuLabel, { color: colors.textSecondary }]}>Gérer les projets</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} accessibilityLabel="Ajouter une équipe" accessibilityRole="button">
          <Ionicons name="people-outline" size={18} color={colors.textSecondary} style={styles.menuIcon} accessibilityElementsHidden />
          <Text style={[styles.menuLabel, { color: colors.textSecondary }]}>Ajouter une équipe</Text>
        </TouchableOpacity>

        <View style={styles.divider} accessibilityElementsHidden />

        <TouchableOpacity style={styles.menuItem} onPress={logout} accessibilityLabel="Se déconnecter" accessibilityRole="button">
          <Ionicons name="log-out-outline" size={20} color="#EF4444" style={styles.menuIcon} accessibilityElementsHidden />
          <Text style={[styles.menuLabel, { color: '#EF4444' }]}>Se déconnecter</Text>
        </TouchableOpacity>
      </ScrollView>

      <FAB onPress={() => console.log('Add task')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4A90E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  username: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  profileIcons: {
    flexDirection: 'row',
  },
  iconBtn: {
    padding: 6,
  },
  scroll: {
    paddingBottom: 100,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  menuIcon: {
    marginRight: 14,
    width: 22,
  },
  menuLabel: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  sectionActions: {
    flexDirection: 'row',
  },
  projectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  projectName: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    fontWeight: '500',
  },
  projectCount: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});
