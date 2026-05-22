// app/(tabs)/feminine.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useApp } from '@/context/AppContext';
import { Colors } from '@/constants/theme';
import { CYCLE_PHASES } from '@/data/mockData';

const SYMPTOMS = [
  'Fatiga', 'Sensibilidad', 'Dolor abdominal', 'Hinchazón',
  'Cambios de humor', 'Antojos', 'Insomnio', 'Dolor de cabeza',
  'Náuseas', 'Acné', 'Ansiedad', 'Irritabilidad',
];

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

const DAY_NAMES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

// ─── Calendario mensual ───────────────────────────────────────────────────────

interface CalendarProps {
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
}

function Calendar({ selectedDate, onSelectDate }: CalendarProps) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const toISO = (y: number, m: number, d: number) =>
    `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <View style={calStyles.container}>
      {/* Navegación mes */}
      <View style={calStyles.navRow}>
        <TouchableOpacity onPress={prevMonth} style={calStyles.navBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="chevron-back" size={20} color={Colors.textDark} />
        </TouchableOpacity>
        <Text style={calStyles.monthLabel}>
          {MONTH_NAMES[viewMonth]} {viewYear}
        </Text>
        <TouchableOpacity
          onPress={nextMonth}
          style={calStyles.navBtn}
          disabled={viewYear === today.getFullYear() && viewMonth === today.getMonth()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons
            name="chevron-forward"
            size={20}
            color={viewYear === today.getFullYear() && viewMonth === today.getMonth()
              ? Colors.textLight : Colors.textDark}
          />
        </TouchableOpacity>
      </View>

      {/* Nombres de días */}
      <View style={calStyles.daysRow}>
        {DAY_NAMES.map(d => (
          <Text key={d} style={calStyles.dayName}>{d}</Text>
        ))}
      </View>

      {/* Grilla */}
      <View style={calStyles.grid}>
        {cells.map((day, i) => {
          if (!day) return <View key={`e-${i}`} style={calStyles.cell} />;

          const iso = toISO(viewYear, viewMonth, day);
          const isSelected = iso === selectedDate;
          const isToday = iso === toISO(today.getFullYear(), today.getMonth(), today.getDate());
          const isFuture = new Date(iso) > today;

          return (
            <TouchableOpacity
              key={iso}
              style={[
                calStyles.cell,
                isSelected && calStyles.cellSelected,
                isToday && !isSelected && calStyles.cellToday,
                isFuture && calStyles.cellDisabled,
              ]}
              onPress={() => !isFuture && onSelectDate(iso)}
              disabled={isFuture}
              activeOpacity={0.7}
            >
              <Text style={[
                calStyles.cellText,
                isSelected && calStyles.cellTextSelected,
                isToday && !isSelected && calStyles.cellTextToday,
                isFuture && calStyles.cellTextDisabled,
              ]}>
                {day}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

// ─── Pantalla principal ───────────────────────────────────────────────────────

export default function FeminineScreen() {
  const { feminineData, updateFeminineData } = useApp();

  const phase = feminineData?.currentPhase ?? 'follicular';
  const phaseData = CYCLE_PHASES[phase];
  const cycleLength = feminineData?.cycleLength ?? 28;
  const lastPeriodStart = feminineData?.lastPeriodStart;

  const [showCalendar, setShowCalendar] = useState(false);
  const [tempDate, setTempDate] = useState<string | null>(lastPeriodStart ?? null);

  // Día actual del ciclo
  const currentDay = lastPeriodStart
    ? Math.min(
        Math.floor((Date.now() - new Date(lastPeriodStart).getTime()) / (1000 * 60 * 60 * 24)) + 1,
        cycleLength
      )
    : 1;

  const cycleProgress = Math.round((currentDay / cycleLength) * 100);

  // Calcular fase según día del ciclo
  const getPhaseFromDay = (day: number): 'menstrual' | 'follicular' | 'ovulatory' | 'luteal' => {
    if (day <= 5) return 'menstrual';
    if (day <= 13) return 'follicular';
    if (day <= 16) return 'ovulatory';
    return 'luteal';
  };

  const handleConfirmDate = () => {
    if (!tempDate) return;
    const dayOfCycle = Math.min(
      Math.floor((Date.now() - new Date(tempDate).getTime()) / (1000 * 60 * 60 * 24)) + 1,
      cycleLength
    );
    const newPhase = getPhaseFromDay(dayOfCycle);
    updateFeminineData({
      lastPeriodStart: tempDate,
      currentPhase: newPhase,
    });
    setShowCalendar(false);
  };

  // Formato fecha legible
  const formatDate = (iso: string) => {
    const [y, m, d] = iso.split('-').map(Number);
    return `${d} de ${MONTH_NAMES[m - 1]} de ${y}`;
  };

  // Próxima menstruación estimada
  const nextPeriod = lastPeriodStart
    ? (() => {
        const next = new Date(lastPeriodStart);
        next.setDate(next.getDate() + cycleLength);
        return formatDate(next.toISOString().split('T')[0]);
      })()
    : null;

  // Síntomas
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(
    (feminineData?.symptoms ?? []).map(s => s.charAt(0).toUpperCase() + s.slice(1))
  );

  const toggleSymptom = (symptom: string) => {
    const updated = selectedSymptoms.includes(symptom)
      ? selectedSymptoms.filter(s => s !== symptom)
      : [...selectedSymptoms, symptom];
    setSelectedSymptoms(updated);
    updateFeminineData({ symptoms: updated.map(s => s.toLowerCase()) });
  };

  const renderStars = (value: number, color: string) => (
    <View style={styles.starsRow}>
      {[1, 2, 3, 4, 5].map(i => (
        <Ionicons
          key={i}
          name={i <= value ? 'star' : 'star-outline'}
          size={18}
          color={i <= value ? color : Colors.border}
        />
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Encabezado */}
        <View style={[styles.header, { backgroundColor: phaseData.lightColor }]}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <View style={[styles.phaseIconCircle, { backgroundColor: phaseData.color }]}>
              <Ionicons name={phaseData.icon as any} size={28} color="#fff" />
            </View>
            <Text style={styles.headerTitle}>Salud Femenina</Text>
            <Text style={styles.headerSub}>{phaseData.label}</Text>
          </View>
        </View>

        <View style={styles.content}>

          {/* ── Registro de ciclo ── */}
          <View style={styles.card}>
            <View style={styles.cycleRegisterTop}>
              <View>
                <Text style={styles.sectionTitle}>Mi ciclo</Text>
                <Text style={styles.sectionSub}>
                  {lastPeriodStart
                    ? `Inició el ${formatDate(lastPeriodStart)}`
                    : 'Registra el inicio de tu período'}
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.registerBtn, { backgroundColor: Colors.feminine }]}
                onPress={() => { setTempDate(lastPeriodStart ?? null); setShowCalendar(true); }}
                activeOpacity={0.8}
              >
                <Ionicons name="calendar" size={16} color={Colors.white} />
                <Text style={styles.registerBtnText}>
                  {lastPeriodStart ? 'Editar' : 'Registrar'}
                </Text>
              </TouchableOpacity>
            </View>

            {lastPeriodStart && (
              <View style={styles.cycleInfoRow}>
                <View style={styles.cycleInfoItem}>
                  <View style={[styles.cycleInfoIcon, { backgroundColor: Colors.feminineLight }]}>
                    <Ionicons name="today" size={16} color={Colors.feminine} />
                  </View>
                  <Text style={styles.cycleInfoLabel}>Día actual</Text>
                  <Text style={[styles.cycleInfoValue, { color: Colors.feminine }]}>
                    {currentDay}/{cycleLength}
                  </Text>
                </View>

                <View style={styles.cycleInfoDivider} />

                <View style={styles.cycleInfoItem}>
                  <View style={[styles.cycleInfoIcon, { backgroundColor: '#FFF3E0' }]}>
                    <Ionicons name="time" size={16} color={Colors.warning} />
                  </View>
                  <Text style={styles.cycleInfoLabel}>Días restantes</Text>
                  <Text style={[styles.cycleInfoValue, { color: Colors.warning }]}>
                    {Math.max(0, cycleLength - currentDay)}
                  </Text>
                </View>

                <View style={styles.cycleInfoDivider} />

                <View style={styles.cycleInfoItem}>
                  <View style={[styles.cycleInfoIcon, { backgroundColor: Colors.primaryLight }]}>
                    <Ionicons name="calendar-outline" size={16} color={Colors.primary} />
                  </View>
                  <Text style={styles.cycleInfoLabel}>Próximo</Text>
                  <Text style={[styles.cycleInfoValue, { color: Colors.primary }]} numberOfLines={2}>
                    {nextPeriod?.split(' de ')[0]} {nextPeriod?.split(' de ')[1]}
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* ── Fase actual ── */}
          <View style={[styles.phaseCard, { borderLeftColor: phaseData.color, borderLeftWidth: 4 }]}>
            <View style={styles.phaseCardTop}>
              <View>
                <Text style={styles.phaseCardTitle}>{phaseData.label}</Text>
                <Text style={styles.phaseCardDays}>Días {phaseData.days} del ciclo</Text>
              </View>
              <View style={[styles.phaseBadge, { backgroundColor: phaseData.lightColor }]}>
                <Text style={[styles.phaseBadgeText, { color: phaseData.color }]}>
                  Día {currentDay}
                </Text>
              </View>
            </View>
            <Text style={styles.phaseDescription}>{phaseData.description}</Text>
          </View>

          {/* ── Barra de progreso ── */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Progreso del ciclo</Text>
            <Text style={styles.sectionSub}>Día {currentDay} de {cycleLength}</Text>

            <View style={styles.cycleBarBg}>
              <View style={[styles.cycleBarFill, { width: `${cycleProgress}%`, backgroundColor: phaseData.color }]} />
            </View>

            <View style={styles.phaseMarkers}>
              {[
                { pct: 0, color: CYCLE_PHASES.menstrual.color, label: 'M' },
                { pct: (5 / cycleLength) * 100, color: CYCLE_PHASES.follicular.color, label: 'F' },
                { pct: (13 / cycleLength) * 100, color: CYCLE_PHASES.ovulatory.color, label: 'O' },
                { pct: (16 / cycleLength) * 100, color: CYCLE_PHASES.luteal.color, label: 'L' },
              ].map((marker, i) => (
                <View key={i} style={[styles.phaseMarker, { left: `${marker.pct}%` as any }]}>
                  <View style={[styles.markerDot, { backgroundColor: marker.color }]} />
                  <Text style={[styles.markerLabel, { color: marker.color }]}>{marker.label}</Text>
                </View>
              ))}
            </View>

            <View style={styles.legendRow}>
              {Object.entries(CYCLE_PHASES).map(([key, p]) => (
                <View key={key} style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: p.color }]} />
                  <Text style={styles.legendText}>{p.label.split(' ')[1] ?? p.label.split(' ')[0]}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* ── Energía y ánimo ── */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Cómo te sientes hoy</Text>
            <Text style={styles.sectionSub}>Estimado según tu fase actual</Text>
            <View style={styles.moodRow}>
              <View style={styles.moodItem}>
                <View style={[styles.moodIcon, { backgroundColor: '#FFF3E0' }]}>
                  <Ionicons name="flash" size={20} color={Colors.warning} />
                </View>
                <Text style={styles.moodLabel}>Energía</Text>
                {renderStars(phaseData.energy, Colors.warning)}
              </View>
              <View style={styles.moodDivider} />
              <View style={styles.moodItem}>
                <View style={[styles.moodIcon, { backgroundColor: phaseData.lightColor }]}>
                  <Ionicons name="happy" size={20} color={phaseData.color} />
                </View>
                <Text style={styles.moodLabel}>Ánimo</Text>
                {renderStars(phaseData.mood, phaseData.color)}
              </View>
            </View>
          </View>

          {/* ── Recomendaciones ── */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Recomendaciones</Text>
            <Text style={styles.sectionSub}>Para tu fase {phaseData.label.toLowerCase()}</Text>
            {phaseData.recommendations.map((rec, i) => (
              <View key={i} style={styles.recRow}>
                <View style={[styles.recDot, { backgroundColor: phaseData.color }]} />
                <Text style={styles.recText}>{rec}</Text>
              </View>
            ))}
          </View>

          {/* ── Síntomas ── */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Síntomas de hoy</Text>
            <Text style={styles.sectionSub}>Toca para registrar cómo te sientes</Text>
            <View style={styles.symptomsWrap}>
              {SYMPTOMS.map(symptom => {
                const active = selectedSymptoms.includes(symptom);
                return (
                  <TouchableOpacity
                    key={symptom}
                    style={[
                      styles.symptomChip,
                      active && { backgroundColor: phaseData.color, borderColor: phaseData.color },
                    ]}
                    onPress={() => toggleSymptom(symptom)}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: active }}
                    accessibilityLabel={symptom}
                  >
                    <Text style={[styles.symptomText, active && styles.symptomTextActive]}>
                      {symptom}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            {selectedSymptoms.length > 0 && (
              <View style={styles.symptomsCount}>
                <Ionicons name="checkmark-circle" size={16} color={phaseData.color} />
                <Text style={[styles.symptomsCountText, { color: phaseData.color }]}>
                  {selectedSymptoms.length} síntoma{selectedSymptoms.length > 1 ? 's' : ''} registrado{selectedSymptoms.length > 1 ? 's' : ''}
                </Text>
              </View>
            )}
          </View>

          {/* ── Fases de referencia ── */}
          <Text style={styles.sectionLabel}>Las 4 fases del ciclo</Text>
          {Object.entries(CYCLE_PHASES).map(([key, p]) => (
            <View
              key={key}
              style={[styles.phaseRefCard, key === phase && { borderColor: p.color, borderWidth: 2 }]}
            >
              <View style={[styles.phaseRefIcon, { backgroundColor: p.lightColor }]}>
                <Ionicons name={p.icon as any} size={20} color={p.color} />
              </View>
              <View style={styles.phaseRefInfo}>
                <View style={styles.phaseRefTop}>
                  <Text style={styles.phaseRefTitle}>{p.label}</Text>
                  <Text style={[styles.phaseRefDays, { color: p.color }]}>Días {p.days}</Text>
                </View>
                <Text style={styles.phaseRefDesc} numberOfLines={2}>{p.description}</Text>
              </View>
              {key === phase && (
                <View style={[styles.activeTag, { backgroundColor: p.color }]}>
                  <Text style={styles.activeTagText}>Ahora</Text>
                </View>
              )}
            </View>
          ))}

        </View>
      </ScrollView>

      {/* ── Modal calendario ── */}
      <Modal
        visible={showCalendar}
        animationType="slide"
        transparent
        onRequestClose={() => setShowCalendar(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />

            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>¿Cuándo inició tu período?</Text>
              <TouchableOpacity onPress={() => setShowCalendar(false)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Ionicons name="close" size={24} color={Colors.textDark} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSub}>
              Selecciona el primer día de tu menstruación más reciente
            </Text>

            <Calendar
              selectedDate={tempDate}
              onSelectDate={setTempDate}
            />

            {tempDate && (
              <View style={styles.selectedDateRow}>
                <Ionicons name="calendar" size={16} color={Colors.feminine} />
                <Text style={styles.selectedDateText}>
                  Seleccionaste: <Text style={{ fontWeight: '700', color: Colors.feminine }}>{formatDate(tempDate)}</Text>
                </Text>
              </View>
            )}

            <View style={styles.modalBtns}>
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => setShowCalendar(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalConfirm, !tempDate && styles.modalConfirmDisabled]}
                onPress={handleConfirmDate}
                disabled={!tempDate}
                activeOpacity={0.8}
              >
                <Text style={styles.modalConfirmText}>Confirmar</Text>
                <Ionicons name="checkmark" size={18} color={Colors.white} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

// ─── Estilos del calendario ───────────────────────────────────────────────────

const calStyles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  navBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textDark,
  },
  daysRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  dayName: {
    flex: 1,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textLight,
    textTransform: 'uppercase',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  cellSelected: {
    backgroundColor: Colors.feminine,
    borderRadius: 20,
  },
  cellToday: {
    borderWidth: 1.5,
    borderColor: Colors.feminine,
    borderRadius: 20,
  },
  cellDisabled: {
    opacity: 0.3,
  },
  cellText: {
    fontSize: 14,
    color: Colors.textDark,
    fontWeight: '500',
  },
  cellTextSelected: {
    color: Colors.white,
    fontWeight: '700',
  },
  cellTextToday: {
    color: Colors.feminine,
    fontWeight: '700',
  },
  cellTextDisabled: {
    color: Colors.textLight,
  },
});

// ─── Estilos principales ──────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingBottom: 40 },

  // Encabezado
  header: {
    minHeight: 160,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    overflow: 'hidden',
    position: 'relative',
    paddingBottom: 20,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
    zIndex: 1,
  },
  backText: { fontSize: 14, color: Colors.textDark, fontWeight: '600' },
  headerContent: { alignItems: 'center', paddingTop: 4 },
  phaseIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  headerTitle: { fontSize: 20, fontWeight: '700', color: Colors.textDark },
  headerSub: { fontSize: 13, color: Colors.textMedium, marginTop: 2 },

  content: { paddingHorizontal: 24, paddingTop: 20 },

  // Card registro ciclo
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
  cycleRegisterTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  registerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  registerBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.white,
  },
  cycleInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  cycleInfoItem: { flex: 1, alignItems: 'center', gap: 4 },
  cycleInfoIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cycleInfoLabel: { fontSize: 10, color: Colors.textLight, textAlign: 'center' },
  cycleInfoValue: { fontSize: 13, fontWeight: '800', textAlign: 'center' },
  cycleInfoDivider: { width: 1, height: 50, backgroundColor: Colors.border },

  // Fase actual
  phaseCard: {
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
  phaseCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  phaseCardTitle: { fontSize: 16, fontWeight: '700', color: Colors.textDark },
  phaseCardDays: { fontSize: 12, color: Colors.textLight, marginTop: 2 },
  phaseBadge: { borderRadius: 20, paddingHorizontal: 12, paddingVertical: 4 },
  phaseBadgeText: { fontSize: 13, fontWeight: '700' },
  phaseDescription: { fontSize: 13, color: Colors.textMedium, lineHeight: 19 },

  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.textDark },
  sectionSub: { fontSize: 12, color: Colors.textLight, marginTop: 2, marginBottom: 14 },
  sectionLabel: {
    fontSize: 13, fontWeight: '700', color: Colors.textMedium,
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8, marginTop: 4,
  },

  // Barra ciclo
  cycleBarBg: {
    height: 12, backgroundColor: Colors.primaryLight,
    borderRadius: 6, overflow: 'hidden', marginBottom: 12,
  },
  cycleBarFill: { height: '100%', borderRadius: 6 },
  phaseMarkers: { flexDirection: 'row', position: 'relative', height: 24, marginBottom: 8 },
  phaseMarker: { position: 'absolute', alignItems: 'center' },
  markerDot: { width: 8, height: 8, borderRadius: 4 },
  markerLabel: { fontSize: 9, fontWeight: '700', marginTop: 2 },
  legendRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 11, color: Colors.textMedium },

  // Mood
  moodRow: { flexDirection: 'row', alignItems: 'center' },
  moodItem: { flex: 1, alignItems: 'center', gap: 6 },
  moodIcon: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  moodLabel: { fontSize: 13, fontWeight: '600', color: Colors.textDark },
  moodDivider: { width: 1, height: 70, backgroundColor: Colors.border },
  starsRow: { flexDirection: 'row', gap: 2 },

  // Recomendaciones
  recRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 10 },
  recDot: { width: 8, height: 8, borderRadius: 4, marginTop: 5, flexShrink: 0 },
  recText: { flex: 1, fontSize: 13, color: Colors.textMedium, lineHeight: 20 },

  // Síntomas
  symptomsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  symptomChip: {
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6,
    borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.white,
  },
  symptomText: { fontSize: 12, color: Colors.textMedium, fontWeight: '500' },
  symptomTextActive: { color: Colors.white, fontWeight: '700' },
  symptomsCount: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12 },
  symptomsCountText: { fontSize: 12, fontWeight: '600' },

  // Fases referencia
  phaseRefCard: {
    backgroundColor: Colors.white, borderRadius: 14, borderWidth: 1,
    borderColor: Colors.border, padding: 14, marginBottom: 10,
    flexDirection: 'row', alignItems: 'center', gap: 12,
    elevation: 1, shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 }, shadowOpacity: 1, shadowRadius: 2,
  },
  phaseRefIcon: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  phaseRefInfo: { flex: 1 },
  phaseRefTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 },
  phaseRefTitle: { fontSize: 14, fontWeight: '700', color: Colors.textDark },
  phaseRefDays: { fontSize: 11, fontWeight: '600' },
  phaseRefDesc: { fontSize: 12, color: Colors.textLight, lineHeight: 17 },
  activeTag: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start' },
  activeTagText: { fontSize: 10, fontWeight: '700', color: Colors.white },

  // Modal calendario
  modalOverlay: {
    flex: 1, backgroundColor: Colors.overlay, justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: Colors.white, borderTopLeftRadius: 28,
    borderTopRightRadius: 28, paddingTop: 12, paddingBottom: 32,
  },
  modalHandle: {
    width: 40, height: 4, borderRadius: 2, backgroundColor: Colors.border,
    alignSelf: 'center', marginBottom: 16,
  },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: 24, marginBottom: 6,
  },
  modalTitle: { fontSize: 18, fontWeight: '700', color: Colors.textDark },
  modalSub: {
    fontSize: 13, color: Colors.textMedium, paddingHorizontal: 24, marginBottom: 16,
  },
  selectedDateRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginHorizontal: 24, marginTop: 8, marginBottom: 4,
    backgroundColor: Colors.feminineLight, borderRadius: 10,
    padding: 12,
  },
  selectedDateText: { fontSize: 13, color: Colors.textMedium, flex: 1 },
  modalBtns: {
    flexDirection: 'row', gap: 12, paddingHorizontal: 24, marginTop: 16,
  },
  modalCancel: {
    flex: 1, paddingVertical: 14, borderRadius: 12,
    borderWidth: 1, borderColor: Colors.border, alignItems: 'center',
  },
  modalCancelText: { fontSize: 14, fontWeight: '600', color: Colors.textMedium },
  modalConfirm: {
    flex: 1, paddingVertical: 14, borderRadius: 12,
    backgroundColor: Colors.feminine, alignItems: 'center',
    flexDirection: 'row', justifyContent: 'center', gap: 6,
  },
  modalConfirmDisabled: { backgroundColor: Colors.textLight },
  modalConfirmText: { fontSize: 14, fontWeight: '700', color: Colors.white },
});