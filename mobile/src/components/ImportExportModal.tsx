import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Modal, ActivityIndicator,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { colors } from '../theme/colors';

type TaskExport = {
  title: string;
  dueDate: string;
  priority: number;
  project: string;
  isRecurring: string;
  createdAt: string;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  onImport: (titles: string[]) => Promise<void>;
  getExportData: () => TaskExport[];
};

export function ImportExportModal({ visible, onClose, onImport, getExportData }: Props) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function handleImportCSV() {
    setMessage('');
    const result = await DocumentPicker.getDocumentAsync({ type: 'text/comma-separated-values' });
    if (result.canceled) return;

    setLoading(true);
    try {
      const content = await FileSystem.readAsStringAsync(result.assets[0].uri);
      const lines = content.split(/\r?\n/).map(line => line.trim()).filter(line => line.length > 0);

      const separator = lines[0].includes(';') ? ';' : ',';
      const firstLine = lines[0].toLowerCase();
      const hasHeader = firstLine.includes('tache') || firstLine.includes('title') || firstLine.includes('titre') || firstLine.includes('task');
      const dataLines = hasHeader ? lines.slice(1) : lines;

      const titleIndex = hasHeader && (firstLine.split(separator).findIndex(h => h.includes('tache') || h.includes('title') || h.includes('titre') || h.includes('task'))) > 0
        ? firstLine.split(separator).findIndex(h => h.includes('tache') || h.includes('title') || h.includes('titre') || h.includes('task'))
        : 0;

      const titles = dataLines
        .map(line => line.split(separator)[titleIndex]?.trim())
        .filter(Boolean) as string[];

      await onImport(titles);
      setMessage(`${titles.length} tâche(s) importée(s) !`);
    } catch {
      setMessage('Erreur lors de l\'import CSV');
    } finally {
      setLoading(false);
    }
  }

  async function handleImportJSON() {
    setMessage('');
    const result = await DocumentPicker.getDocumentAsync({ type: 'application/json' });
    if (result.canceled) return;

    setLoading(true);
    try {
      const content = await FileSystem.readAsStringAsync(result.assets[0].uri);
      const data = JSON.parse(content);
      const tasks = Array.isArray(data) ? data : data.taches ?? data.tasks ?? [];
      const titles = tasks.map((t: { title?: string; titre?: string }) => t.title ?? t.titre).filter(Boolean) as string[];
      await onImport(titles);
      setMessage(`${titles.length} tâche(s) importée(s) !`);
    } catch {
      setMessage('Erreur lors de l\'import JSON');
    } finally {
      setLoading(false);
    }
  }

  async function handleExportCSV() {
    setMessage('');
    setLoading(true);
    try {
      const tasks = getExportData();
      const header = 'titre;date_echeance;priorite;projet;recurrente;date_creation';
      const rows = tasks.map(t =>
        [t.title, t.dueDate, t.priority, t.project, t.isRecurring, t.createdAt].join(';')
      );
      const csv = '\uFEFF' + [header, ...rows].join('\n');
      const path = FileSystem.documentDirectory + 'taches_export.csv';
      await FileSystem.writeAsStringAsync(path, csv, { encoding: 'utf8' });
      await Sharing.shareAsync(path, { mimeType: 'text/csv', dialogTitle: 'Exporter en CSV' });
    } catch (e) {
      setMessage('Erreur lors de l\'export CSV: ' + String(e));
    } finally {
      setLoading(false);
    }
  }

  async function handleExportJSON() {
    setMessage('');
    setLoading(true);
    try {
      const tasks = getExportData();
      const json = JSON.stringify({ taches: tasks }, null, 2);
      const path = FileSystem.documentDirectory + 'taches_export.json';
      await FileSystem.writeAsStringAsync(path, json, { encoding: 'utf8' });
      await Sharing.shareAsync(path, { mimeType: 'application/json', dialogTitle: 'Exporter en JSON' });
    } catch (e) {
      setMessage('Erreur lors de l\'export JSON: ' + String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose} accessibilityLabel="Fermer" accessibilityRole="button" />
      <View style={styles.sheet} accessibilityViewIsModal>
        <Text style={styles.title} accessibilityRole="header">Import / Export</Text>

        <Text style={styles.sectionLabel}>Importer</Text>
        <TouchableOpacity style={styles.btn} onPress={handleImportCSV} disabled={loading} accessibilityLabel="Importer un fichier CSV" accessibilityRole="button">
          <Text style={styles.btnText}>📥 Importer CSV</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.btnJSON]} onPress={handleImportJSON} disabled={loading} accessibilityLabel="Importer un fichier JSON" accessibilityRole="button">
          <Text style={styles.btnText}>📥 Importer JSON</Text>
        </TouchableOpacity>

        <Text style={styles.sectionLabel}>Exporter</Text>
        <TouchableOpacity style={[styles.btn, styles.btnSecondary]} onPress={handleExportCSV} disabled={loading} accessibilityLabel="Exporter mes tâches en CSV" accessibilityRole="button">
          <Text style={styles.btnText}>📤 Exporter CSV</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.btnSecondaryJSON]} onPress={handleExportJSON} disabled={loading} accessibilityLabel="Exporter mes tâches en JSON" accessibilityRole="button">
          <Text style={styles.btnText}>📤 Exporter JSON</Text>
        </TouchableOpacity>

        {loading && <ActivityIndicator color={colors.accent} style={{ marginTop: 8 }} accessibilityLabel="Chargement" />}
        {message ? <Text style={styles.message} accessibilityLiveRegion="polite">{message}</Text> : null}

        <TouchableOpacity style={styles.cancelBtn} onPress={onClose} accessibilityLabel="Fermer" accessibilityRole="button">
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
    gap: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 4,
  },
  btn: {
    backgroundColor: colors.accent,
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
  },
  btnJSON: {
    backgroundColor: '#7C3AED',
  },
  btnSecondary: {
    backgroundColor: '#2563EB',
  },
  btnSecondaryJSON: {
    backgroundColor: '#0F766E',
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
