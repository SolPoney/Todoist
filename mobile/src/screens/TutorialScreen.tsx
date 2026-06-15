import React, { useRef, useState, useMemo } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
  StyleSheet, Dimensions, NativeSyntheticEvent, NativeScrollEvent,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '../theme/useColors';
import { ColorTheme } from '../theme/colors';
import { fontSize, lineHeight, letterSpacing } from '../theme/typography';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type Slide = {
  icon: string;
  iconColor: string;
  title: string;
  body: string;
  tips?: string[];
  accessibilityNote?: string;
};

const SLIDES: Slide[] = [
  {
    icon: 'checkmark-circle-outline',
    iconColor: '#E8534A',
    title: 'Bienvenue dans Todoist',
    body: 'Ton assistant personnel pour gérer tes tâches et tes grands objectifs de vie. Simple, rapide, et accessible.',
    tips: [
      'Glisse vers la gauche ou appuie sur Suivant pour parcourir ce tutoriel.',
      'Tu pourras le relire à tout moment depuis Parcourir → Tutoriel.',
    ],
  },
  {
    icon: 'list-outline',
    iconColor: '#2563EB',
    title: 'Mes tâches',
    body: "L'onglet Tâches est ta liste principale. Toutes tes tâches actives y apparaissent, triées par date d'ajout.",
    tips: [
      "Appuie sur le bouton + en bas à droite pour ajouter une tâche.",
      'Appuie sur le titre d\'une tâche pour la modifier.',
      'Tire vers le bas pour rafraîchir la liste.',
      'Appuie sur la loupe pour rechercher une tâche par mot-clé.',
    ],
    accessibilityNote: 'Chaque tâche est annoncée avec son titre, sa date et son état (en retard ou non) par les lecteurs d\'écran.',
  },
  {
    icon: 'calendar-outline',
    iconColor: '#059669',
    title: 'Dates d\'échéance',
    body: 'Associe une date à chaque tâche pour ne jamais oublier un rendez-vous ou une deadline.',
    tips: [
      "Lors de l'ajout ou de la modification, appuie sur Ajouter une date.",
      "Choisis Aujourd'hui, Demain, Dans 7 jours — ou efface la date.",
      'Les tâches en retard apparaissent avec un badge rouge.',
    ],
    accessibilityNote: 'La date sélectionnée est lue par les lecteurs d\'écran dans le format "Date d\'échéance : jeu. 19 juin".',
  },
  {
    icon: 'hand-right-outline',
    iconColor: '#F59E0B',
    title: 'Gestes de glissement',
    body: 'Chaque tâche supporte des gestes rapides pour agir sans ouvrir de menu.',
    tips: [
      '← Glisse à gauche pour supprimer (rouge).',
      '→ Glisse à droite pour marquer comme terminée (vert).',
      '✏️ Le bouton Modifier (orange) apparaît aussi au glissement gauche.',
      'Appuie longtemps pour sélectionner plusieurs tâches et les supprimer ensemble.',
    ],
    accessibilityNote: 'Les actions Terminer, Modifier et Supprimer sont aussi accessibles via le menu contextuel des lecteurs d\'écran (appui double + maintien sur iOS, ou menu d\'accessibilité sur Android).',
  },
  {
    icon: 'star-outline',
    iconColor: '#8B5CF6',
    title: 'Bucket List',
    body: "L'onglet Bucket est ton espace pour tes grands rêves et objectifs de vie — pas de dates, juste des ambitions.",
    tips: [
      'Appuie sur + pour ajouter un objectif.',
      'Appuie sur le cercle pour le marquer comme accompli.',
      'Les objectifs accomplis descendent en bas de la liste.',
      'Appuie sur la poubelle pour supprimer un objectif.',
    ],
    accessibilityNote: 'Chaque objectif est annoncé comme une case à cocher (cochée ou non) pour les utilisateurs de VoiceOver et TalkBack.',
  },
  {
    icon: 'settings-outline',
    iconColor: '#6B7280',
    title: 'Parcourir & Réglages',
    body: "L'onglet Parcourir regroupe les paramètres de l'application et les outils.",
    tips: [
      '🌙 / ☀️ Bascule entre thème sombre et clair.',
      '⇅ Import / Export : transfère tes tâches via CSV.',
      '📖 Tutoriel : relis ce guide à tout moment.',
      '🚪 Déconnexion : quitte ton compte.',
    ],
    accessibilityNote: 'Tous les éléments ont un label d\'accessibilité explicite pour les lecteurs d\'écran.',
  },
  {
    icon: 'accessibility-outline',
    iconColor: '#E8534A',
    title: 'Accessibilité',
    body: "L'application est conçue pour être utilisable avec les outils d'accessibilité d'iOS et Android.",
    tips: [
      '✅ Tous les boutons ont des labels VoiceOver / TalkBack.',
      '✅ Les rôles sont définis (bouton, case à cocher, en-tête, recherche…).',
      '✅ Les états sont annoncés (désactivé, coché, occupé…).',
      '✅ Les modales bloquent le focus sur leur contenu.',
      '✅ Les zones de toucher sont agrandies (hitSlop) pour faciliter le tap.',
    ],
  },
];

type Props = {
  onDone: () => void;
};

export function TutorialScreen({ onDone }: Props) {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const scrollRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  function handleScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setCurrentIndex(index);
  }

  function goToNext() {
    if (currentIndex < SLIDES.length - 1) {
      scrollRef.current?.scrollTo({ x: (currentIndex + 1) * SCREEN_WIDTH, animated: true });
    } else {
      onDone();
    }
  }

  function goToPrev() {
    if (currentIndex > 0) {
      scrollRef.current?.scrollTo({ x: (currentIndex - 1) * SCREEN_WIDTH, animated: true });
    }
  }

  const slide = SLIDES[currentIndex];
  const isLast = currentIndex === SLIDES.length - 1;

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Skip button */}
      {!isLast && (
        <TouchableOpacity
          style={styles.skipBtn}
          onPress={onDone}
          accessibilityLabel="Passer le tutoriel"
          accessibilityRole="button"
        >
          <Text style={styles.skipText}>Passer</Text>
        </TouchableOpacity>
      )}

      {/* Slides */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
        accessibilityLabel={`Tutoriel, diapositive ${currentIndex + 1} sur ${SLIDES.length}`}
      >
        {SLIDES.map((s, i) => (
          <View key={i} style={styles.slide} accessible accessibilityLabel={`${s.title}. ${s.body}`}>
            {/* Icon */}
            <View style={[styles.iconWrap, { backgroundColor: s.iconColor + '22' }]} accessibilityElementsHidden>
              <Ionicons name={s.icon as any} size={64} color={s.iconColor} />
            </View>

            <Text style={styles.slideTitle} accessibilityRole="header">{s.title}</Text>
            <Text style={styles.slideBody}>{s.body}</Text>

            {s.tips && s.tips.length > 0 && (
              <View style={styles.tipsBox} accessibilityLabel="Conseils">
                {s.tips.map((tip, j) => (
                  <View key={j} style={styles.tipRow} accessible accessibilityLabel={tip}>
                    <View style={[styles.tipDot, { backgroundColor: s.iconColor }]} accessibilityElementsHidden />
                    <Text style={styles.tipText}>{tip}</Text>
                  </View>
                ))}
              </View>
            )}

            {s.accessibilityNote && (
              <View style={styles.a11yBox} accessibilityLabel={`Note accessibilité : ${s.accessibilityNote}`}>
                <Ionicons name="eye-outline" size={14} color={colors.textSecondary} accessibilityElementsHidden />
                <Text style={styles.a11yText}>{s.accessibilityNote}</Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {/* Dots */}
      <View style={styles.dotsRow} accessibilityElementsHidden>
        {SLIDES.map((_, i) => (
          <View key={i} style={[styles.dot, i === currentIndex && styles.dotActive]} />
        ))}
      </View>

      {/* Navigation */}
      <View style={styles.navRow}>
        <TouchableOpacity
          style={[styles.navBtn, currentIndex === 0 && styles.navBtnDisabled]}
          onPress={goToPrev}
          disabled={currentIndex === 0}
          accessibilityLabel="Diapositive précédente"
          accessibilityRole="button"
          accessibilityState={{ disabled: currentIndex === 0 }}
        >
          <Ionicons name="arrow-back" size={20} color={currentIndex === 0 ? colors.textMuted : colors.text} />
          <Text style={[styles.navBtnText, currentIndex === 0 && styles.navBtnTextDisabled]}>Précédent</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.nextBtn, { backgroundColor: slide.iconColor }]}
          onPress={goToNext}
          accessibilityLabel={isLast ? "Terminer le tutoriel" : "Diapositive suivante"}
          accessibilityRole="button"
        >
          <Text style={styles.nextBtnText}>{isLast ? "C'est parti !" : 'Suivant'}</Text>
          {!isLast && <Ionicons name="arrow-forward" size={20} color="#fff" accessibilityElementsHidden />}
        </TouchableOpacity>
      </View>
    </View>
  );
}

function createStyles(colors: ColorTheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    skipBtn: {
      position: 'absolute',
      top: 16,
      right: 20,
      zIndex: 10,
      padding: 8,
    },
    skipText: {
      fontSize: fontSize.sm,
      color: colors.textSecondary,
      lineHeight: lineHeight.sm,
    },
    scrollView: {
      flex: 1,
    },
    slide: {
      width: SCREEN_WIDTH,
      paddingHorizontal: 28,
      paddingTop: 60,
      paddingBottom: 16,
      alignItems: 'center',
    },
    iconWrap: {
      width: 120,
      height: 120,
      borderRadius: 32,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 28,
    },
    slideTitle: {
      fontSize: fontSize.xxl,
      fontWeight: '700',
      color: colors.text,
      lineHeight: lineHeight.xxl,
      textAlign: 'center',
      marginBottom: 12,
    },
    slideBody: {
      fontSize: fontSize.md,
      color: colors.textSecondary,
      lineHeight: lineHeight.md,
      textAlign: 'center',
      marginBottom: 24,
    },
    tipsBox: {
      width: '100%',
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      gap: 10,
      marginBottom: 16,
    },
    tipRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 10,
    },
    tipDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      marginTop: 6,
      flexShrink: 0,
    },
    tipText: {
      flex: 1,
      fontSize: fontSize.sm,
      color: colors.text,
      lineHeight: lineHeight.sm,
    },
    a11yBox: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 8,
      backgroundColor: colors.border,
      borderRadius: 8,
      padding: 12,
    },
    a11yText: {
      flex: 1,
      fontSize: 12,
      color: colors.textSecondary,
      lineHeight: 18,
      letterSpacing: letterSpacing.normal,
    },
    dotsRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 6,
      paddingVertical: 16,
    },
    dot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: colors.border,
    },
    dotActive: {
      width: 20,
      backgroundColor: colors.accent,
    },
    navRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingBottom: 8,
    },
    navBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      padding: 10,
    },
    navBtnDisabled: {
      opacity: 0,
    },
    navBtnText: {
      fontSize: fontSize.md,
      color: colors.text,
      lineHeight: lineHeight.md,
    },
    navBtnTextDisabled: {
      color: colors.textMuted,
    },
    nextBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 12,
    },
    nextBtnText: {
      fontSize: fontSize.md,
      fontWeight: '600',
      color: '#fff',
      lineHeight: lineHeight.md,
    },
  });
}
