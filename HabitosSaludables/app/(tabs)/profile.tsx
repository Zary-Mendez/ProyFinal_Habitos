// app/(tabs)/profile.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Switch,
  Modal,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useApp } from '@/context/AppContext';
import { Colors } from '@/constants/theme';

// ─── Tipos ────────────────────────────────────────────────────────────────────

type Frequency = 'daily' | 'weekdays' | 'weekends' | 'custom';

type DayKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

const DAYS: { key: DayKey; short: string; label: string }[] = [
  { key: 'mon', short: 'L',  label: 'Lunes' },
  { key: 'tue', short: 'M',  label: 'Martes' },
  { key: 'wed', short: 'X',  label: 'Miércoles' },
  { key: 'thu', short: 'J',  label: 'Jueves' },
  { key: 'fri', short: 'V',  label: 'Viernes' },
  { key: 'sat', short: 'S',  label: 'Sábado' },
  { key: 'sun', short: 'D',  label: 'Domingo' },
];

const FREQUENCY_OPTIONS: { value: Frequency; label: string; sub: string }[] = [
  { value: 'daily',    label: 'Diario',         sub: 'Todos los días' },
  { value: 'weekdays', label: 'Días de semana',  sub: 'Lunes a viernes' },
  { value: 'weekends', label: 'Fines de semana', sub: 'Sábado y domingo' },
  { value: 'custom',   label: 'Personalizado',   sub: 'Elige los días' },
];

const FREQUENCY_LABELS: Record<Frequency, string> = {
  daily:    'Diario',
  weekdays: 'Días de semana',
  weekends: 'Fines de semana',
  custom:   'Personalizado',
};

function formatCustomDays(days: DayKey[]): string {
  if (days.length === 0) return 'Sin días seleccionados';
  if (days.length === 7) return 'Todos los días';
  return days.map(d => DAYS.find(x => x.key === d)?.short ?? '').join(' · ');
}

// Horas para el picker: 06:00 → 23:00 cada 30 min
const TIME_OPTIONS: string[] = [];
for (let h = 6; h <= 23; h++) {
  TIME_OPTIONS.push(`${String(h).padStart(2, '0')}:00`);
  if (h < 23) TIME_OPTIONS.push(`${String(h).padStart(2, '0')}:30`);
}

function formatTime(time: string) {
  const [h, m] = time.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hour = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${hour}:${String(m).padStart(2, '0')} ${suffix}`;
}

// ─── Modal de frecuencia ──────────────────────────────────────────────────────

interface FrequencyModalProps {
  visible: boolean;
  current: Frequency;
  currentCustomDays: DayKey[];
  onClose: () => void;
  onSelect: (v: Frequency, customDays: DayKey[]) => void;
}

function FrequencyModal({ visible, current, currentCustomDays, onClose, onSelect }: FrequencyModalProps) {
  const [selected, setSelected] = useState<Frequency>(current);
  const [customDays, setCustomDays] = useState<DayKey[]>(currentCustomDays);

  // Sync when modal opens
  React.useEffect(() => {
    if (visible) {
      setSelected(current);
      setCustomDays(currentCustomDays);
    }
  }, [visible]);

  const toggleDay = (day: DayKey) => {
    setCustomDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const canSave = selected !== 'custom' || customDays.length > 0;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={modalStyles.overlay}>
        <View style={modalStyles.sheet}>
          <View style={modalStyles.handle} />

          <View style={modalStyles.header}>
            <Text style={modalStyles.title}>Frecuencia de hábitos</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close" size={24} color={Colors.textDark} />
            </TouchableOpacity>
          </View>
          <Text style={modalStyles.sub}>¿Con qué frecuencia quieres trabajar tus hábitos?</Text>

          <View style={modalStyles.optionsList}>
            {FREQUENCY_OPTIONS.map((opt) => {
              const isActive = selected === opt.value;
              return (
                <TouchableOpacity
                  key={opt.value}
                  style={[modalStyles.optionRow, isActive && modalStyles.optionRowActive]}
                  onPress={() => setSelected(opt.value)}
                  activeOpacity={0.7}
                >
                  <View style={modalStyles.optionInfo}>
                    <Text style={[modalStyles.optionLabel, isActive && modalStyles.optionLabelActive]}>
                      {opt.label}
                    </Text>
                    <Text style={[modalStyles.optionSub, isActive && modalStyles.optionSubActive]}>
                      {opt.value === 'custom' && isActive && customDays.length > 0
                        ? formatCustomDays(customDays)
                        : opt.sub}
                    </Text>
                  </View>
                  <View style={[modalStyles.radio, isActive && modalStyles.radioActive]}>
                    {isActive && <View style={modalStyles.radioDot} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Selector de días personalizados */}
          {selected === 'custom' && (
            <View style={modalStyles.customDaysSection}>
              <Text style={modalStyles.customDaysTitle}>Selecciona los días</Text>
              <View style={modalStyles.daysRow}>
                {DAYS.map((day) => {
                  const active = customDays.includes(day.key);
                  return (
                    <TouchableOpacity
                      key={day.key}
                      style={[modalStyles.dayBtn, active && modalStyles.dayBtnActive]}
                      onPress={() => toggleDay(day.key)}
                      activeOpacity={0.7}
                    >
                      <Text style={[modalStyles.dayBtnText, active && modalStyles.dayBtnTextActive]}>
                        {day.short}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              {customDays.length === 0 && (
                <Text style={modalStyles.customDaysWarning}>
                  Selecciona al menos un día
                </Text>
              )}
            </View>
          )}

          <View style={modalStyles.btns}>
            <TouchableOpacity style={modalStyles.btnCancel} onPress={onClose} activeOpacity={0.7}>
              <Text style={modalStyles.btnCancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[modalStyles.btnConfirm, !canSave && { opacity: 0.5 }]}
              onPress={() => { if (canSave) { onSelect(selected, customDays); onClose(); } }}
              activeOpacity={0.8}
              disabled={!canSave}
            >
              <Text style={modalStyles.btnConfirmText}>Guardar</Text>
              <Ionicons name="checkmark" size={18} color={Colors.white} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ─── Modal de hora ────────────────────────────────────────────────────────────

interface TimeModalProps {
  visible: boolean;
  current: string;
  onClose: () => void;
  onSelect: (v: string) => void;
}

function TimeModal({ visible, current, onClose, onSelect }: TimeModalProps) {
  const [selected, setSelected] = useState(current);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={modalStyles.overlay}>
        <View style={modalStyles.sheet}>
          <View style={modalStyles.handle} />

          <View style={modalStyles.header}>
            <Text style={modalStyles.title}>Hora de recordatorio</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close" size={24} color={Colors.textDark} />
            </TouchableOpacity>
          </View>
          <Text style={modalStyles.sub}>¿A qué hora quieres recibir tu recordatorio diario?</Text>

          {/* Lista scrolleable de horas */}
          <ScrollView
            style={{ maxHeight: 300 }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 8 }}
          >
            {TIME_OPTIONS.map((t) => {
              const isActive = selected === t;
              return (
                <TouchableOpacity
                  key={t}
                  style={[modalStyles.timeRow, isActive && modalStyles.timeRowActive]}
                  onPress={() => setSelected(t)}
                  activeOpacity={0.7}
                >
                  <View style={[modalStyles.timeIconBox, isActive && { backgroundColor: Colors.primary }]}>
                    <Ionicons name="time" size={16} color={isActive ? Colors.white : Colors.primary} />
                  </View>
                  <Text style={[modalStyles.timeLabel, isActive && modalStyles.timeLabelActive]}>
                    {formatTime(t)}
                  </Text>
                  {isActive && (
                    <Ionicons name="checkmark-circle" size={20} color={Colors.primary} />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <View style={[modalStyles.btns, { marginTop: 12 }]}>
            <TouchableOpacity style={modalStyles.btnCancel} onPress={onClose} activeOpacity={0.7}>
              <Text style={modalStyles.btnCancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={modalStyles.btnConfirm}
              onPress={() => { onSelect(selected); onClose(); }}
              activeOpacity={0.8}
            >
              <Text style={modalStyles.btnConfirmText}>Guardar</Text>
              <Ionicons name="checkmark" size={18} color={Colors.white} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ─── Pantalla de perfil ───────────────────────────────────────────────────────

export default function ProfileScreen() {
  const { user, streak, bestStreak, weekHistory, logout, updateProfile } = useApp();

  const [remindersOn, setRemindersOn] = useState(true);
  const [showLogoutModal, setShowLogoutModal]       = useState(false);
  const [showFrequencyModal, setShowFrequencyModal] = useState(false);
  const [showTimeModal, setShowTimeModal]           = useState(false);

  const currentFrequency: Frequency = (user?.frequency as Frequency) ?? 'daily';
  const currentCustomDays: DayKey[] = (user?.customDays as DayKey[]) ?? [];

  const totalCompleted = weekHistory.reduce((acc, d) => acc + d.completed, 0);

  const initials = user?.name
    ? user.name.trim().split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  const currentTime: string = user?.reminderTime ?? '08:00';

  const confirmLogout = () => {
    setShowLogoutModal(false);
    logout();
    router.replace('/(auth)' as any);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.content}>

          {/* ── Avatar + datos ── */}
          <View style={styles.card}>
            <View style={styles.avatarRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{user?.name || 'Usuario'}</Text>
                <Text style={styles.userEmail}>{user?.email || ''}</Text>
                <View style={styles.goalBadge}>
                  <Ionicons name="flag" size={12} color={Colors.primary} />
                  <Text style={styles.goalText}>
                    Meta: {user?.dailyGoal ?? 3} hábitos/día
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* ── Estadísticas ── */}
          <Text style={styles.sectionLabel}>Estadísticas</Text>
          <View style={styles.card}>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <View style={[styles.statIcon, { backgroundColor: '#FFF3E0' }]}>
                  <Ionicons name="flame" size={20} color={Colors.warning} />
                </View>
                <Text style={styles.statNumber}>{streak}</Text>
                <Text style={styles.statLabel}>Racha{'\n'}actual</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <View style={[styles.statIcon, { backgroundColor: '#FFFDE7' }]}>
                  <Ionicons name="trophy" size={20} color="#F4B942" />
                </View>
                <Text style={styles.statNumber}>{bestStreak}</Text>
                <Text style={styles.statLabel}>Mejor{'\n'}racha</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <View style={[styles.statIcon, { backgroundColor: Colors.primaryLight }]}>
                  <Ionicons name="checkmark-done" size={20} color={Colors.primary} />
                </View>
                <Text style={styles.statNumber}>{totalCompleted}</Text>
                <Text style={styles.statLabel}>Esta{'\n'}semana</Text>
              </View>
            </View>
          </View>

          {/* ── Módulos activos ── */}
          {(user?.selectedHabits?.length ?? 0) > 0 && (
            <>
              <Text style={styles.sectionLabel}>Mis módulos activos</Text>
              <View style={styles.card}>
                <View style={styles.habitsWrap}>
                  {user!.selectedHabits.map((h: string) => (
                    <View key={h} style={styles.habitChip}>
                      <Ionicons name="leaf" size={12} color={Colors.primary} />
                      <Text style={styles.habitChipText}>{h}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </>
          )}

          {/* ── Configuración ── */}
          <Text style={styles.sectionLabel}>Configuración</Text>
          <View style={styles.card}>

            {/* Recordatorios toggle */}
            <View style={styles.configRow}>
              <View style={styles.configLeft}>
                <View style={[styles.configIcon, { backgroundColor: Colors.primaryLight }]}>
                  <Ionicons name="notifications" size={18} color={Colors.primary} />
                </View>
                <View>
                  <Text style={styles.configTitle}>Recordatorios</Text>
                  <Text style={styles.configSub}>Recibir notificaciones diarias</Text>
                </View>
              </View>
              <Switch
                value={remindersOn}
                onValueChange={setRemindersOn}
                trackColor={{ false: Colors.border, true: Colors.primary }}
                thumbColor={Colors.white}
              />
            </View>

            <View style={styles.divider} />

            {/* Hora de recordatorio */}
            <TouchableOpacity
              style={styles.configRow}
              onPress={() => setShowTimeModal(true)}
              activeOpacity={0.7}
              disabled={!remindersOn}
            >
              <View style={styles.configLeft}>
                <View style={[styles.configIcon, { backgroundColor: '#E8F4FD' }]}>
                  <Ionicons
                    name="time"
                    size={18}
                    color={remindersOn ? '#1976D2' : Colors.textLight}
                  />
                </View>
                <View>
                  <Text style={[styles.configTitle, !remindersOn && { color: Colors.textLight }]}>
                    Hora de recordatorio
                  </Text>
                  <Text style={styles.configSub}>
                    {formatTime(currentTime)}
                  </Text>
                </View>
              </View>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={remindersOn ? Colors.textLight : Colors.border}
              />
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* Frecuencia */}
            <TouchableOpacity
              style={styles.configRow}
              onPress={() => setShowFrequencyModal(true)}
              activeOpacity={0.7}
            >
              <View style={styles.configLeft}>
                <View style={[styles.configIcon, { backgroundColor: '#F3E5F5' }]}>
                  <Ionicons name="calendar" size={18} color="#7B1FA2" />
                </View>
                <View>
                  <Text style={styles.configTitle}>Frecuencia</Text>
                  <Text style={styles.configSub}>
                    {currentFrequency === 'custom' && currentCustomDays.length > 0
                      ? formatCustomDays(currentCustomDays)
                      : FREQUENCY_LABELS[currentFrequency]}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Colors.textLight} />
            </TouchableOpacity>

          </View>

          {/* ── Acerca de ── */}
          <Text style={styles.sectionLabel}>Acerca de</Text>
          <View style={styles.card}>
            <View style={styles.configRow}>
              <View style={styles.configLeft}>
                <View style={[styles.configIcon, { backgroundColor: Colors.primaryLight }]}>
                  <Ionicons name="information-circle" size={18} color={Colors.primary} />
                </View>
                <Text style={styles.configTitle}>HabitFlow</Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.configRow}>
              <View style={styles.configLeft}>
                <View style={[styles.configIcon, { backgroundColor: '#FFF3E0' }]}>
                  <Ionicons name="shield-checkmark" size={18} color={Colors.warning} />
                </View>
                <Text style={styles.configTitle}>Privacidad y términos</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Colors.textLight} />
            </View>
          </View>

          {/* ── Cerrar sesión ── */}
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={() => setShowLogoutModal(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="log-out-outline" size={20} color={Colors.error} />
            <Text style={styles.logoutText}>Cerrar sesión</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>

      {/* ── Modal frecuencia ── */}
      <FrequencyModal
        visible={showFrequencyModal}
        current={currentFrequency}
        currentCustomDays={currentCustomDays}
        onClose={() => setShowFrequencyModal(false)}
        onSelect={(v, days) => updateProfile({ frequency: v, customDays: days })}
      />

      {/* ── Modal hora ── */}
      <TimeModal
        visible={showTimeModal}
        current={currentTime}
        onClose={() => setShowTimeModal(false)}
        onSelect={(v) => updateProfile({ reminderTime: v })}
      />

      {/* ── Modal confirmar cierre de sesión ── */}
      <Modal
        visible={showLogoutModal}
        animationType="fade"
        transparent
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.confirmOverlay}>
          <View style={styles.confirmSheet}>
            <View style={styles.confirmIconBox}>
              <Ionicons name="log-out-outline" size={28} color={Colors.error} />
            </View>
            <Text style={styles.confirmTitle}>Cerrar sesión</Text>
            <Text style={styles.confirmMsg}>
              ¿Estás seguro de que quieres salir de tu cuenta?
            </Text>
            <View style={styles.confirmBtns}>
              <TouchableOpacity
                style={styles.confirmCancel}
                onPress={() => setShowLogoutModal(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.confirmCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmLogout}
                onPress={confirmLogout}
                activeOpacity={0.7}
              >
                <Text style={styles.confirmLogoutText}>Salir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

// ─── Estilos de modales ───────────────────────────────────────────────────────

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 12,
    paddingBottom: 32,
  },
  handle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: Colors.border,
    alignSelf: 'center', marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 6,
  },
  title: { fontSize: 18, fontWeight: '700', color: Colors.textDark },
  sub: {
    fontSize: 13, color: Colors.textMedium,
    paddingHorizontal: 24, marginBottom: 20,
  },

  // Opciones de frecuencia
  optionsList: { paddingHorizontal: 24, gap: 10, marginBottom: 8 },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: Colors.white,
  },
  optionRowActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  optionInfo: { flex: 1 },
  optionLabel: { fontSize: 15, fontWeight: '600', color: Colors.textDark },
  optionLabelActive: { color: Colors.primaryDark },
  optionSub: { fontSize: 12, color: Colors.textLight, marginTop: 2 },
  optionSubActive: { color: Colors.primary },
  radio: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 2, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  radioActive: { borderColor: Colors.primary },
  radioDot: {
    width: 11, height: 11, borderRadius: 6,
    backgroundColor: Colors.primary,
  },

  // Opciones de hora
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  timeRowActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  timeIconBox: {
    width: 30, height: 30, borderRadius: 8,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  timeLabel: { flex: 1, fontSize: 15, fontWeight: '500', color: Colors.textDark },
  timeLabelActive: { color: Colors.primaryDark, fontWeight: '700' },

  // Días personalizados
  customDaysSection: {
    paddingHorizontal: 24,
    marginTop: 4,
    marginBottom: 8,
  },
  customDaysTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textMedium,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  dayBtn: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayBtnActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  dayBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textMedium,
  },
  dayBtnTextActive: {
    color: Colors.white,
  },
  customDaysWarning: {
    fontSize: 12,
    color: Colors.error ?? '#D32F2F',
    marginTop: 8,
    textAlign: 'center',
  },

  // Botones
  btns: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 24,
    marginTop: 20,
  },
  btnCancel: {
    flex: 1, paddingVertical: 14, borderRadius: 12,
    borderWidth: 1, borderColor: Colors.border, alignItems: 'center',
  },
  btnCancelText: { fontSize: 14, fontWeight: '600', color: Colors.textMedium },
  btnConfirm: {
    flex: 1, paddingVertical: 14, borderRadius: 12,
    backgroundColor: Colors.primary,
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 6,
  },
  btnConfirmText: { fontSize: 14, fontWeight: '700', color: Colors.white },
});

// ─── Estilos principales ──────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingBottom: 40 },
  content: { paddingHorizontal: 24, paddingTop: 20 },

  sectionLabel: {
    fontSize: 13, fontWeight: '700', color: Colors.textMedium,
    textTransform: 'uppercase', letterSpacing: 0.8,
    marginBottom: 8, marginTop: 4,
  },

  card: {
    backgroundColor: Colors.white,
    borderRadius: 14, borderWidth: 1, borderColor: Colors.border,
    padding: 18, marginBottom: 16,
    elevation: 2, shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 4,
  },

  avatarRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  avatar: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 24, fontWeight: '800', color: Colors.white },
  userInfo: { flex: 1 },
  userName: { fontSize: 18, fontWeight: '700', color: Colors.textDark },
  userEmail: { fontSize: 13, color: Colors.textLight, marginTop: 2 },
  goalBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.primaryLight, borderRadius: 8,
    paddingHorizontal: 8, paddingVertical: 3,
    alignSelf: 'flex-start', marginTop: 6,
  },
  goalText: { fontSize: 11, color: Colors.primaryDark, fontWeight: '600' },

  statsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  statItem: { alignItems: 'center', flex: 1 },
  statIcon: {
    width: 40, height: 40, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center', marginBottom: 6,
  },
  statNumber: { fontSize: 22, fontWeight: '800', color: Colors.textDark },
  statLabel: { fontSize: 11, color: Colors.textLight, textAlign: 'center', marginTop: 2, lineHeight: 15 },
  statDivider: { width: 1, height: 55, backgroundColor: Colors.border },

  habitsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  habitChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.primaryLight, borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 5,
  },
  habitChipText: { fontSize: 12, color: Colors.primaryDark, fontWeight: '600', textTransform: 'capitalize' },

  configRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingVertical: 4,
  },
  configLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  configIcon: {
    width: 36, height: 36, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  configTitle: { fontSize: 14, fontWeight: '600', color: Colors.textDark },
  configSub: { fontSize: 12, color: Colors.textLight, marginTop: 1 },
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: 12 },

  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, backgroundColor: Colors.errorLight,
    borderRadius: 14, paddingVertical: 16,
    marginTop: 4, marginBottom: 8,
    borderWidth: 1, borderColor: '#FFCDD2',
  },
  logoutText: { fontSize: 15, fontWeight: '700', color: Colors.error },

  confirmOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32,
  },
  confirmSheet: {
    backgroundColor: Colors.white, borderRadius: 20,
    paddingHorizontal: 24, paddingTop: 32, paddingBottom: 24,
    width: '100%', alignItems: 'center',
    elevation: 8, shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12,
  },
  confirmIconBox: {
    width: 60, height: 60, borderRadius: 18,
    backgroundColor: Colors.errorLight,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 16, borderWidth: 1, borderColor: '#FFCDD2',
  },
  confirmTitle: { fontSize: 18, fontWeight: '800', color: Colors.textDark, marginBottom: 8 },
  confirmMsg: { fontSize: 14, color: Colors.textMedium, textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  confirmBtns: { flexDirection: 'row', gap: 12, width: '100%' },
  confirmCancel: {
    flex: 1, paddingVertical: 14, borderRadius: 12,
    backgroundColor: Colors.background,
    borderWidth: 1, borderColor: Colors.border, alignItems: 'center',
  },
  confirmCancelText: { fontSize: 15, fontWeight: '600', color: Colors.textMedium },
  confirmLogout: {
    flex: 1, paddingVertical: 14, borderRadius: 12,
    backgroundColor: Colors.error, alignItems: 'center',
  },
  confirmLogoutText: { fontSize: 15, fontWeight: '700', color: Colors.white },
});
