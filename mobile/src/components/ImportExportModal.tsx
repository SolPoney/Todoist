import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Modal, ActivityIndicator,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { colors } from '../theme/colors';

type Props = {
  visible: boolean;
  onClose: () => void;
  onImport: (titles: string[]) => Promise<void>;
  getExportData: () => { title: string; dueDate: string; priority: number; project: string; isRecurring: string; createdAt: string }[];
};

export function ImportExportModal({ visible, onClose, onImport, getExportData }: Props) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function handleImport() {
    setMessage('');
    const result = await DocumentPicker.getDocumentAsync({ type: 'text/comma-separated-values' });
    if (result.canceled) return;

    setLoading(true);
    try {
      const content = await FileSystem.readAsStringAsync(result.assets[0].uri);
      const lines = content.split(/\r?\n/).map(line => line.trim()).filter(line => line.length > 0);

      // Détecte le séparateur (virgule ou point-virgule)
      const separator = lines[0].includes(';') ? ';' : ',';
      const firstLine = lines[0].toLowerCase();

      // Vérifie si la première ligne est un en-tête
      const hasHeader = firstLine.includes('tache') || firstLine.includes('title') || firstLine.includes('titre') || firstLine.includes('task');
      const dataLines = hasHeader ? lines.slice(1) : lines;

      // Si plusieurs colonnes, prend la 2ème (index 1) si header contient "tache"/"title", sinon la 1ère
      const titleIndex = hasHeader && (firstLine.split(separator).findIndex(h => h.includes('tache') || h.includes('title') || h.includes('titre') || h.includes('task'))) > 0
        ? firstLine.split(separator).findIndex(h => h.includes('tache') || h.includes('title') || h.includes('titre') || h.includes('task'))
        : 0;

      const titles = dataLines
        .map(line => line.split(separator)[titleIndex]?.trim())
        .filter(Boolean) as string[];

      await onImport(titles);
      setMessage(`${titles.length} tâche(s) importée(s) !`);
    } catch {
      setMessage('Erreur lors de l\'import');
    } finally {
      setLoading(false);
    }
  }

  async function handleExport() {
    setMessage('');
    setLoading(true);
    try {
      const tasks = getExportData();
      const header = 'titre;date_echeance;priorite;projet;recurrente;date_creation';
      const rows = tasks.map(t =>
        [t.title, t.dueDate, t.priority, t.project, t.isRecurring, t.createdAt].join(';')
      );
      const csv = [header, ...rows].join('\n');
      const path = FileSystem.documentDirectory + 'taches_export.csv';
      await FileSystem.writeAsStringAsync(path, csv, { encoding: 'utf8' });
      await Sharing.shareAsync(path, { mimeType: 'text/csv', dialogTitle: 'Exporter les tâches' });
    } catch (e) {
      console.error('Export error:', e);
      setMessage('Erreur lors de l\'export: ' + String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose} />
      <View style={styles.sheet}>
        <Text style={styles.title}>Import / Export CSV</Text>
        <Text style={styles.hint}>
          Format : une tâche par ligne, fichier .csv
        </Text>

        <TouchableOpacity style={styles.btn} onPress={handleImport} disabled={loading}>
          <Text style={styles.btnText}>📥 Importer un fichier CSV</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btn, styles.btnSecondary]} onPress={handleExport} disabled={loading}>
          <Text style={styles.btnText}>📤 Exporter mes tâches en CSV</Text>
        </TouchableOpacity>

        {loading && <ActivityIndicator color={colors.accent} style={{ marginTop: 16 }} />}
        {message ? <Text style={styles.message}>{message}</Text> : null}

        <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
          <Text style={styles.cancelText}>Fermer</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 24,
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  hint: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  btn: {
    backgroundColor: colors.accent,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  btnSecondary: {
    backgroundColor: '#2563EB',
  },
  btnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  message: {
    color: '#22C55E',
    textAlign: 'center',
    fontSize: 14,
    marginTop: 4,
  },
  cancelBtn: {
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 4,
  },
  cancelText: {
    color: colors.textSecondary,
    fontSize: 15,
  },
});
