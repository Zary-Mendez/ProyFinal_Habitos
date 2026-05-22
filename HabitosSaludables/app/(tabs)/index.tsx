// app/(tabs)/index.tsx

import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { getDailyQuote, CATEGORIES } from '@/data/mockData';

// ─── Anillo de progreso (SVG puro con View/border) ────────────────────────────

interface ProgressRingProps {
  percent: number;
  size?: number;
}

function ProgressRing({ percent, size = 120 }: ProgressRingProps) {
  const completed = Math.round(percent);
  const radius = size / 2;

  return (
    <View style={[styles.ringContainer, { width: size, height: size }]}>
      {/* Pista de fondo */}
      <View
        style={[
          styles.ringTrack,
          { width: size, height: size, borderRadius: radius, borderColor: Colors.primaryLight },
        ]}
      />
      {/* Relleno proporcional simulado con opacidad */}
      <View
        style={[
          styles.ringFill,
          {
            width: size,
            height: size,
            borderRadius: radius,
            borderColor: Colors.primary,
            opacity: percent === 0 ? 0 : 1,
          },
        ]}
      />
      {/* Texto central */}
      <View style={styles.ringCenter}>
        <Text style={styles.ringPercent}>{completed}%</Text>
        <Text style={styles.ringLabel}>completado</Text>
      </View>
    </View>
  );
}

// ─── Tarjeta de hábito del día ────────────────────────────────────────────────

interface HabitCardProps {
  id: string;
  title: string;
  category: string;
  icon: string;
  color: string;
  goal: number;
  unit: string;
  progress: number;
  completed: boolean;
  onComplete: () => void;
  onUncomplete: () => void;
}

function HabitCard({
  title,
  category,
  icon,
  color,
  goal,
  unit,
  progress,
  completed,
  onComplete,
  onUncomplete,
}: HabitCardProps) {
  const catInfo = CATEGORIES[category as keyof typeof CATEGORIES];
  const lightColor = catInfo?.lightColor ?? Colors.primaryLight;

  return (
    <View style={[styles.habitCard, completed && styles.habitCardDone]}>
      {/* Ícono */}
      <View style={[styles.habitIcon, { backgroundColor: lightColor }]}>
        <Ionicons
          name={icon as any}
          size={22}
          color={completed ? Colors.textLight : color}
        />
      </View>

      {/* Info */}
      <View style={styles.habitInfo}>
        <Text style={[styles.habitTitle, completed && styles.habitTitleDone]}>
          {title}
        </Text>
        <Text style={styles.habitMeta}>
          Meta: {goal} {unit}
        </Text>
      </View>

      {/* Botón completar */}
      <TouchableOpacity
        style={[styles.checkBtn, completed && styles.checkBtnDone]}
        onPress={completed ? onUncomplete : onComplete}
        activeOpacity={0.7}
      >
        <Ionicons
          name={completed ? 'checkmark-circle' : 'ellipse-outline'}
          size={28}
          color={completed ? Colors.primary : Colors.textLight}
        />
      </TouchableOpacity>
    </View>
  );
}

// ─── Pantalla principal ───────────────────────────────────────────────────────

export default function DashboardScreen() {
  const {
    user,
    todayHabits,
    streak,
    bestStreak,
    completeHabit,
    uncompleteHabit,
    getTodayProgress,
    feminineData,
  } = useApp();

  const progress = getTodayProgress();
  const quote = useMemo(() => getDailyQuote(), []);

  const today = new Date();
  const dayName = today.toLocaleDateString('es-CO', { weekday: 'long' });
  const dateStr = today.toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'long',
  });

  const completedCount = todayHabits.filter((h) => h.completed).length;
  const pendingHabits = todayHabits.filter((h) => !h.completed);
  const completedHabits = todayHabits.filter((h) => h.completed);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar + datos */}
        <View style={styles.card}>
              <View style={styles.userInfo}>
            <Text style={styles.userName}> ¡Hola, { user?.name || 'Usuario'}!</Text>
            </View>
          </View>
        
        {/* ── Frase motivacional ── */}
        <View style={styles.quoteCard}>
          <Ionicons name="sparkles" size={16} color={Colors.primary} />
          <Text style={styles.quoteText}>{quote}</Text>
        </View>

        {/* ── Progreso del día ── */}
        <View style={styles.progressCard}>
          <View style={styles.progressLeft}>
            <Text style={styles.sectionTitle}>Tu día de hoy</Text>
            <Text style={styles.progressSub}>
              {completedCount} de {todayHabits.length} hábitos completados
            </Text>

            {/* Racha */}
            <View style={styles.streakRow}>
              <View style={styles.streakBadge}>
                <Ionicons name="flame" size={14} color="#FF5722" />
                <Text style={styles.streakNum}>{streak}</Text>
                <Text style={styles.streakLabel}> días</Text>
              </View>
              <Text style={styles.streakCaption}>Racha actual</Text>
            </View>

            {/* Mejor racha */}
            <View style={styles.streakRow}>
              <View style={[styles.streakBadge, styles.streakBadgeBest]}>
                <Ionicons name="trophy" size={14} color="#FB8C00" />
                <Text style={[styles.streakNum, { color: '#FB8C00' }]}>
                  {bestStreak}
                </Text>
                <Text style={styles.streakLabel}> días</Text>
              </View>
              <Text style={styles.streakCaption}>Mejor racha</Text>
            </View>
          </View>

          <ProgressRing percent={progress} size={110} />
        </View>

        {/* ── Hábitos pendientes ── */}
        {pendingHabits.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pendientes</Text>
            {pendingHabits.map((h) => (
              <HabitCard
                key={h.id}
                {...h}
                onComplete={() => completeHabit(h.id)}
                onUncomplete={() => uncompleteHabit(h.id)}
              />
            ))}
          </View>
        )}

        {/* ── Hábitos completados ── */}
        {completedHabits.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Completados ✓</Text>
            {completedHabits.map((h) => (
              <HabitCard
                key={h.id}
                {...h}
                onComplete={() => completeHabit(h.id)}
                onUncomplete={() => uncompleteHabit(h.id)}
              />
            ))}
          </View>
        )}

        {/* ── Estado vacío ── */}
        {todayHabits.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="leaf-outline" size={48} color={Colors.textLight} />
            <Text style={styles.emptyTitle}>Sin hábitos por hoy</Text>
            <Text style={styles.emptySub}>
              Agrega hábitos en la pestaña Hábitos
            </Text>
            <TouchableOpacity
              style={styles.emptyBtn}
              onPress={() => router.push('/(tabs)/habits')}
            >
              <Text style={styles.emptyBtnText}>Agregar hábitos</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── Acceso rápido salud femenina ── */}
        <TouchableOpacity
          style={styles.feminineCard}
          activeOpacity={0.85}
          onPress={() => router.push('/(tabs)/feminine')}
        >
          <View style={styles.feminineLeft}>
            <View style={styles.feminineIconBox}>
              <Ionicons name="heart" size={20} color={Colors.feminine} />
            </View>
            <View>
              <Text style={styles.feminineTitle}>Salud Femenina</Text>
              {feminineData.currentPhase && (
                <Text style={styles.feminineSub}>
                  Fase{' '}
                  {feminineData.currentPhase === 'menstrual'
                    ? 'menstrual'
                    : feminineData.currentPhase === 'follicular'
                    ? 'folicular'
                    : feminineData.currentPhase === 'ovulatory'
                    ? 'ovulatoria'
                    : 'lútea'}
                </Text>
              )}
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.feminine} />
        </TouchableOpacity>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },

  // Encabezado
  header: {
    backgroundColor: '#C8EDD4',
    height: 110,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    marginBottom: 16,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    paddingBottom: 16,
    paddingHorizontal: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  greeting: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textDark,
  },
  dateText: {
    fontSize: 13,
    color: Colors.textMedium,
    marginTop: 2,
  },

  // Card genérica
  card: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 18,
    marginBottom: 16,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  
  userInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  userName: {
    justifyContent: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textDark,
  },
  goalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primaryLight,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
    marginTop: 6,
  },

  // Frase motivacional
  quoteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 24,
    marginBottom: 16,
    backgroundColor: Colors.primaryLight,
    borderRadius: 12,
    padding: 12,
  },
  quoteText: {
    flex: 1,
    fontSize: 13,
    color: Colors.primaryDark,
    fontStyle: 'italic',
  },

  // Card de progreso
  progressCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 24,
    marginBottom: 20,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    elevation: 3,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  progressLeft: {
    flex: 1,
    marginRight: 16,
  },
  progressSub: {
    fontSize: 13,
    color: Colors.textMedium,
    marginTop: 4,
    marginBottom: 12,
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 3,
  },
  streakBadgeBest: {
    backgroundColor: '#FFF8E1',
  },
  streakNum: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FF5722',
  },
  streakLabel: {
    fontSize: 12,
    color: Colors.textMedium,
  },
  streakCaption: {
    fontSize: 12,
    color: Colors.textLight,
  },

  // Anillo de progreso
  ringContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  ringTrack: {
    position: 'absolute',
    borderWidth: 8,
  },
  ringFill: {
    position: 'absolute',
    borderWidth: 8,
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  ringCenter: {
    alignItems: 'center',
  },
  ringPercent: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textDark,
  },
  ringLabel: {
    fontSize: 10,
    color: Colors.textLight,
    marginTop: 1,
  },

  // Secciones
  section: {
    marginHorizontal: 24,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textDark,
    marginBottom: 12,
  },

  // Tarjeta de hábito
  habitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  habitCardDone: {
    opacity: 0.7,
    backgroundColor: '#F8FDF9',
  },
  habitIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  habitInfo: {
    flex: 1,
  },
  habitTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textDark,
  },
  habitTitleDone: {
    textDecorationLine: 'line-through',
    color: Colors.textLight,
  },
  habitMeta: {
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 2,
  },
  checkBtn: {
    padding: 4,
  },
  checkBtnDone: {
    opacity: 1,
  },

  // Estado vacío
  emptyState: {
    alignItems: 'center',
    marginHorizontal: 24,
    marginVertical: 32,
    padding: 32,
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textDark,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySub: {
    fontSize: 13,
    color: Colors.textMedium,
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  emptyBtnText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 14,
  },

  // Card salud femenina
  feminineCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 24,
    backgroundColor: Colors.feminineLight,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F8BBD9',
  },
  feminineLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  feminineIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  feminineTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.feminine,
  },
  feminineSub: {
    fontSize: 12,
    color: '#C2185B',
    marginTop: 2,
    textTransform: 'capitalize',
  },
});