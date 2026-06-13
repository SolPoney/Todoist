import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FAB } from '../components/FAB';
import { colors } from '../theme/colors';

const projects = [
  { id: '1', name: 'Welcome 👋', count: 20 },
  { id: '2', name: 'ENA' },
];

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

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Profil utilisateur */}
      <View style={styles.profileRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>T</Text>
        </View>
        <Text style={styles.username}>thomas.soret37</Text>
        <View style={styles.profileIcons}>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="notifications-outline" size={22} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="settings-outline" size={22} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Menu principal */}
        {menuItems.map((item) => (
          <TouchableOpacity key={item.label} style={styles.menuItem}>
            <Ionicons name={item.icon} size={20} color={colors.accent} style={styles.menuIcon} />
            <Text style={styles.menuLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}

        {/* Séparateur */}
        <View style={styles.divider} />

        {/* Mes projets */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Mes projets</Text>
          <View style={styles.sectionActions}>
            <TouchableOpacity style={styles.iconBtn}>
              <Ionicons name="add" size={20} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}>
              <Ionicons name="chevron-up" size={18} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        {projects.map((project) => (
          <TouchableOpacity key={project.id} style={styles.projectItem}>
            <Ionicons name="hashtag" size={16} color={colors.accent} style={styles.menuIcon} />
            <Text style={styles.projectName}>{project.name}</Text>
            {project.count && (
              <Text style={styles.projectCount}>{project.count}</Text>
            )}
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="pencil-outline" size={18} color={colors.textSecondary} style={styles.menuIcon} />
          <Text style={[styles.menuLabel, { color: colors.textSecondary }]}>Gérer les projets</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="people-outline" size={18} color={colors.textSecondary} style={styles.menuIcon} />
          <Text style={[styles.menuLabel, { color: colors.textSecondary }]}>Ajouter une équipe</Text>
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
