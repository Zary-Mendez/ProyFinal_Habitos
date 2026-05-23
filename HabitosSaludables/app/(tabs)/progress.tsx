// app/(tabs)/progress.tsx
import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '@/context/AppContext';
import { Colors } from '@/constants/theme';
import { CATEGORIES } from '@/data/mockData';

const { width } = Dimensions.get('window');
const BAR_AREA_WIDTH = width - 48; // paddingHorizontal 24 * 2

const DAYS_ES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MONTHS_ES = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];

export default function ProgressScreen() {
  const { weekHistory, streak, bestStreak, habits, todayHabits, getWeekProgress } = useApp();

  const weekProgress = getWeekProgress(); // array de 7 números 0-100

  const maxBar = Math.max(...weekProgress, 1);

  // Estadísticas del mes (simuladas con weekHistory * ~4 semanas)
  const totalCompletedMonth = useMemo(() => {
    return weekHistory.reduce((acc, day) => acc + day.completed, 0) * 4;
  }, [weekHistory]);

  const avgDaily = useMemo(() => {
    const vals = weekHistory.map(d => d.completed);
    const sum = vals.reduce((a, b) => a + b, 0);
    return vals.length ? (sum / vals.length).toFixed(1) : '0';
  }, [weekHistory]);

  // Progreso por categoría
const categoryProgress = useMemo(() => {
  return Object.entries(CATEGORIES).map(([id, cat]) => {
    const catHabits = todayHabits.filter(h => h.category === id);
    if (!catHabits.length) return null;
    const completed = catHabits.filter(h => h.completed).length;
    const pct = Math.round((completed / catHabits.length) * 100);
    return { id, ...cat, completed, total: catHabits.length, pct };
  }).filter(Boolean);
}, [todayHabits]);

  const todayIndex = new Date().getDay(); // 0=Dom

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Encabezado decorativo */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mi Progreso</Text>
          <Text style={styles.headerSub}>Últimos 7 días</Text>
        </View>

        <View style={styles.content}>

          {/* Rachas */}
          <View style={styles.streakRow}>
            <View style={[styles.streakCard, { flex: 1, marginRight: 8 }]}>
              <Ionicons name="flame" size={28} color={Colors.warning} />
              <Text style={styles.streakNumber}>{streak}</Text>
              <Text style={styles.streakLabel}>Racha actual</Text>
            </View>
            <View style={[styles.streakCard, { flex: 1, marginLeft: 8 }]}>
              <Ionicons name="trophy" size={28} color="#F4B942" />
              <Text style={styles.streakNumber}>{bestStreak}</Text>
              <Text style={styles.streakLabel}>Mejor racha</Text>
            </View>
          </View>

          {/* Gráfica de barras — últimos 7 días */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Cumplimiento semanal</Text>
            <Text style={styles.sectionSub}>% de hábitos completados por día</Text>

            <View style={styles.chartContainer}>
              {weekProgress.map((pct, i) => {
                const dayOffset = (todayIndex - (6 - i) + 7) % 7;
                const dayName = DAYS_ES[(todayIndex - (6 - i) + 7) % 7];
                const isToday = i === 6;
                const barHeight = Math.max((pct / maxBar) * 120, 4);

                return (
                  <View key={i} style={styles.barCol}>
                    <Text style={styles.barPct}>{pct > 0 ? `${pct}%` : ''}</Text>
                    <View style={styles.barTrack}>
                      <View
                        style={[
                          styles.bar,
                          {
                            height: barHeight,
                            backgroundColor: isToday ? Colors.primary : Colors.primaryLight,
                            borderWidth: isToday ? 0 : 1,
                            borderColor: Colors.border,
                          },
                        ]}
                      />
                    </View>
                    <Text style={[styles.barDay, isToday && styles.barDayActive]}>
                      {dayName}
                    </Text>
                    {isToday && <View style={styles.todayDot} />}
                  </View>
                );
              })}
            </View>
          </View>

          {/* Progreso por categoría */}
          {categoryProgress.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Por categoría hoy</Text>
              <Text style={styles.sectionSub}>Avance de cada módulo activo</Text>

              {categoryProgress.map((cat: any) => (
                <View key={cat.id} style={styles.catRow}>
                  <View style={[styles.catIcon, { backgroundColor: cat.lightColor }]}>
                    <Ionicons name={cat.icon as any} size={16} color={cat.color} />
                </View>
                  <View style={styles.catInfo}>
                    <View style={styles.catLabelRow}>
                      <Text style={styles.catLabel}>{cat.label}</Text>
                      <Text style={styles.catFraction}>{cat.completed}/{cat.total}</Text>
                    </View>
                    <View style={styles.barBg}>
                      <View
                        style={[
                          styles.barFill,
                          { width: `${cat.pct}%`, backgroundColor: cat.color },
                        ]}
                      />
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Resumen del mes */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Resumen del mes</Text>
            <Text style={styles.sectionSub}>Estimado basado en tu semana actual</Text>

            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <View style={[styles.summaryIcon, { backgroundColor: Colors.primaryLight }]}>
                  <Ionicons name="checkmark-done" size={22} color={Colors.primary} />
                </View>
                <Text style={styles.summaryNumber}>{totalCompletedMonth}</Text>
                <Text style={styles.summaryLabel}>Hábitos{'\n'}completados</Text>
              </View>

              <View style={styles.summaryDivider} />

              <View style={styles.summaryItem}>
                <View style={[styles.summaryIcon, { backgroundColor: '#FFF3E0' }]}>
                  <Ionicons name="stats-chart" size={22} color={Colors.warning} />
                </View>
                <Text style={styles.summaryNumber}>{avgDaily}</Text>
                <Text style={styles.summaryLabel}>Promedio{'\n'}diario</Text>
              </View>

              <View style={styles.summaryDivider} />

              <View style={styles.summaryItem}>
                <View style={[styles.summaryIcon, { backgroundColor: '#E8F4FD' }]}>
                  <Ionicons name="calendar" size={22} color="#1976D2" />
                </View>
                <Text style={styles.summaryNumber}>
                  {new Date().getDate()}
                </Text>
                <Text style={styles.summaryLabel}>Días del{'\n'}mes activos</Text>
              </View>
            </View>
          </View>

          {/* Mensaje motivacional */}
          <View style={styles.motivCard}>
            <Ionicons name="sparkles" size={20} color={Colors.primary} />
            <Text style={styles.motivText}>
              {streak >= 7
                ? '¡Increíble! Llevas más de una semana sin parar. ¡Sigue así!'
                : streak >= 3
                ? `¡${streak} días seguidos! Estás construyendo un hábito real.`
                : '¡Cada día cuenta! Pequeños pasos crean grandes cambios.'}
            </Text>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    paddingBottom: 32,
  },

  // Encabezado
  header: {
    height: 110,
    backgroundColor: '#C8EDD4',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textDark,
    zIndex: 1,
  },
  headerSub: {
    fontSize: 13,
    color: Colors.textMedium,
    marginTop: 2,
    zIndex: 1,
  },

  content: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },

  // Rachas
  streakRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  streakCard: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    paddingVertical: 18,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  streakNumber: {
    fontSize: 30,
    fontWeight: '800',
    color: Colors.textDark,
    marginTop: 4,
  },
  streakLabel: {
    fontSize: 12,
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textDark,
  },
  sectionSub: {
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 2,
    marginBottom: 16,
  },

  // Gráfica de barras
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 160,
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  barPct: {
    fontSize: 9,
    color: Colors.textLight,
    marginBottom: 2,
    fontWeight: '600',
  },
  barTrack: {
    width: '70%',
    height: 120,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bar: {
    width: '100%',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    minHeight: 4,
  },
  barDay: {
    fontSize: 10,
    color: Colors.textLight,
    marginTop: 6,
  },
  barDayActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  todayDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: Colors.primary,
    marginTop: 2,
  },

  // Categorías
  catRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  catIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  catInfo: {
    flex: 1,
  },
  catLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  catLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textDark,
  },
  catFraction: {
    fontSize: 12,
    color: Colors.textLight,
  },
  barBg: {
    height: 7,
    backgroundColor: Colors.primaryLight,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },

  // Resumen mes
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 4,
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  summaryNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textDark,
  },
  summaryLabel: {
    fontSize: 11,
    color: Colors.textLight,
    textAlign: 'center',
    marginTop: 2,
    lineHeight: 15,
  },
  summaryDivider: {
    width: 1,
    height: 60,
    backgroundColor: Colors.border,
  },

  // Motivacional
  motivCard: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  motivText: {
    flex: 1,
    fontSize: 13,
    color: Colors.primaryDark,
    fontWeight: '500',
    lineHeight: 19,
  },
});