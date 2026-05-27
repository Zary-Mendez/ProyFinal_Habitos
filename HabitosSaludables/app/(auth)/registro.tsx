// app/(auth)/registro.tsx

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '@/constants/theme';
import { DEFAULT_USER, useApp } from '@/context/AppContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  FlatList,
} from 'react-native';

// ─── Constantes ───────────────────────────────────────────────────────────────

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];
const DAY_NAMES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

const THIS_YEAR = new Date().getFullYear();
// Lista de años: desde 1930 hasta el año actual
const YEARS = Array.from({ length: THIS_YEAR - 1929 }, (_, i) => THIS_YEAR - i);

// ─── Calendario con selector de año/mes ──────────────────────────────────────

interface CalendarProps {
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
}

function Calendar({ selectedDate, onSelectDate }: CalendarProps) {
  const today = new Date();

  const [viewYear, setViewYear] = useState(THIS_YEAR - 18);
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  // Modo de vista: 'day' | 'month' | 'year'
  const [mode, setMode] = useState<'day' | 'month' | 'year'>('day');

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const toISO = (y: number, m: number, d: number) =>
    `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

  const todayISO = toISO(today.getFullYear(), today.getMonth(), today.getDate());

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

  // ── Vista de años ──
  if (mode === 'year') {
    return (
      <View style={calStyles.container}>
        <View style={calStyles.navRow}>
          <Text style={calStyles.monthLabel}>Selecciona el año</Text>
          <TouchableOpacity
            onPress={() => setMode('day')}
            style={calStyles.navBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="close" size={18} color={Colors.textDark} />
          </TouchableOpacity>
        </View>
        <FlatList
          data={YEARS}
          keyExtractor={(item) => String(item)}
          numColumns={4}
          style={{ maxHeight: 240 }}
          showsVerticalScrollIndicator={false}
          initialScrollIndex={Math.max(0, YEARS.indexOf(viewYear))}
          getItemLayout={(_, index) => ({ length: 52, offset: 52 * Math.floor(index / 4), index })}
          renderItem={({ item }) => {
            const isSelected = item === viewYear;
            return (
              <TouchableOpacity
                style={[calStyles.yearCell, isSelected && calStyles.yearCellSelected]}
                onPress={() => { setViewYear(item); setMode('day'); }}
                activeOpacity={0.7}
              >
                <Text style={[calStyles.yearCellText, isSelected && calStyles.yearCellTextSelected]}>
                  {item}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    );
  }

  // ── Vista de meses ──
  if (mode === 'month') {
    return (
      <View style={calStyles.container}>
        <View style={calStyles.navRow}>
          <Text style={calStyles.monthLabel}>Selecciona el mes</Text>
          <TouchableOpacity
            onPress={() => setMode('day')}
            style={calStyles.navBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="close" size={18} color={Colors.textDark} />
          </TouchableOpacity>
        </View>
        <View style={calStyles.monthGrid}>
          {MONTH_NAMES.map((name, i) => {
            const isSelected = i === viewMonth;
            return (
              <TouchableOpacity
                key={name}
                style={[calStyles.monthCell, isSelected && calStyles.monthCellSelected]}
                onPress={() => { setViewMonth(i); setMode('day'); }}
                activeOpacity={0.7}
              >
                <Text style={[calStyles.monthCellText, isSelected && calStyles.monthCellTextSelected]}>
                  {name.slice(0, 3)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  }

  // ── Vista de días (principal) ──
  return (
    <View style={calStyles.container}>
      {/* Fila de navegación */}
      <View style={calStyles.navRow}>
        <TouchableOpacity
          onPress={prevMonth}
          style={calStyles.navBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="chevron-back" size={20} color={Colors.textDark} />
        </TouchableOpacity>

        {/* Mes y año son tapeables para abrir los selectores */}
        <View style={calStyles.navCenter}>
          <TouchableOpacity
            style={calStyles.navPill}
            onPress={() => setMode('month')}
            activeOpacity={0.7}
          >
            <Text style={calStyles.monthLabel}>{MONTH_NAMES[viewMonth]}</Text>
            <Ionicons name="chevron-down" size={14} color={Colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={calStyles.navPill}
            onPress={() => setMode('year')}
            activeOpacity={0.7}
          >
            <Text style={calStyles.monthLabel}>{viewYear}</Text>
            <Ionicons name="chevron-down" size={14} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={nextMonth}
          style={calStyles.navBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="chevron-forward" size={20} color={Colors.textDark} />
        </TouchableOpacity>
      </View>

      {/* Nombres de días */}
      <View style={calStyles.daysRow}>
        {DAY_NAMES.map(d => (
          <Text key={d} style={calStyles.dayName}>{d}</Text>
        ))}
      </View>

      {/* Grilla de días */}
      <View style={calStyles.grid}>
        {cells.map((day, i) => {
          if (!day) return <View key={`e-${i}`} style={calStyles.cell} />;

          const iso = toISO(viewYear, viewMonth, day);
          const isSelected = iso === selectedDate;
          const isToday = iso === todayISO;
          const disabled = new Date(iso) > today;

          return (
            <TouchableOpacity
              key={iso}
              style={[
                calStyles.cell,
                isSelected && calStyles.cellSelected,
                isToday && !isSelected && calStyles.cellToday,
                disabled && calStyles.cellDisabled,
              ]}
              onPress={() => !disabled && onSelectDate(iso)}
              disabled={disabled}
              activeOpacity={0.7}
            >
              <Text style={[
                calStyles.cellText,
                isSelected && calStyles.cellTextSelected,
                isToday && !isSelected && calStyles.cellTextToday,
                disabled && calStyles.cellTextDisabled,
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

// ─── Pantalla de registro ─────────────────────────────────────────────────────

export default function RegisterScreen() {
  const { setUser } = useApp();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [birthdate, setBirthdate] = useState<string | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [tempDate, setTempDate] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateForm = (field: string, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const formatDate = (iso: string) => {
    const [y, m, d] = iso.split('-').map(Number);
    return `${d} de ${MONTH_NAMES[m - 1]} de ${y}`;
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!form.email) {
      newErrors.email = 'El correo es requerido';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Formato de correo incorrecto';
    }
    if (!birthdate) newErrors.birthdate = 'La fecha de nacimiento es requerida';
    if (!form.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (form.password.length < 8) {
      newErrors.password = 'Mínimo 8 caracteres';
    }
    if (!form.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (validate()) {
      await AsyncStorage.setItem('userName', form.name.trim());
      setUser({
        ...DEFAULT_USER,
        name: form.name.trim(),
        email: form.email,
        birthDate: birthdate ?? undefined,
      });
      router.replace('/onboarding/step1');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          <View style={styles.topDecoration} />

          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color={Colors.textMedium} />
            <Text style={styles.backText}>Volver</Text>
          </TouchableOpacity>

          <View style={styles.titleContainer}>
            <Text style={styles.title}>Crear cuenta</Text>
            <Text style={styles.subtitle}>
              Completa tus datos para empezar tu seguimiento de hábitos
            </Text>
          </View>

          <View style={styles.form}>

            {/* Nombre */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nombre completo</Text>
              <View style={[styles.inputWrapper, errors.name ? styles.inputError : null]}>
                <TextInput
                  style={styles.input}
                  placeholder="Tu nombre completo"
                  placeholderTextColor={Colors.textPlaceholder}
                  value={form.name}
                  onChangeText={(v) => updateForm('name', v)}
                  autoCapitalize="words"
                />
                <Ionicons name="person-outline" size={20} color={Colors.textLight} />
              </View>
              {errors.name && (
                <View style={styles.errorRow}>
                  <Ionicons name="alert-circle-outline" size={14} color={Colors.error} />
                  <Text style={styles.errorText}>{errors.name}</Text>
                </View>
              )}
            </View>

            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Correo electrónico</Text>
              <View style={[styles.inputWrapper, errors.email ? styles.inputError : null]}>
                <TextInput
                  style={styles.input}
                  placeholder="ejemplo@correo.com"
                  placeholderTextColor={Colors.textPlaceholder}
                  value={form.email}
                  onChangeText={(v) => updateForm('email', v)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <Ionicons name="mail-outline" size={20} color={Colors.textLight} />
              </View>
              {errors.email && (
                <View style={styles.errorRow}>
                  <Ionicons name="alert-circle-outline" size={14} color={Colors.error} />
                  <Text style={styles.errorText}>{errors.email}</Text>
                </View>
              )}
            </View>

            {/* Fecha de nacimiento */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Fecha de nacimiento</Text>
              <TouchableOpacity
                style={[styles.inputWrapper, errors.birthdate ? styles.inputError : null]}
                onPress={() => { setTempDate(birthdate); setShowCalendar(true); }}
                activeOpacity={0.7}
              >
                <Text style={[styles.input, !birthdate && { color: Colors.textPlaceholder }]}>
                  {birthdate ? formatDate(birthdate) : 'Selecciona tu fecha de nacimiento'}
                </Text>
                <Ionicons name="calendar-outline" size={20} color={Colors.textLight} />
              </TouchableOpacity>
              {errors.birthdate && (
                <View style={styles.errorRow}>
                  <Ionicons name="alert-circle-outline" size={14} color={Colors.error} />
                  <Text style={styles.errorText}>{errors.birthdate}</Text>
                </View>
              )}
            </View>

            {/* Contraseña */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Contraseña</Text>
              <View style={[styles.inputWrapper, errors.password ? styles.inputError : null]}>
                <TextInput
                  style={styles.input}
                  placeholder="Mínimo 8 caracteres"
                  placeholderTextColor={Colors.textPlaceholder}
                  value={form.password}
                  onChangeText={(v) => updateForm('password', v)}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={Colors.textLight}
                  />
                </TouchableOpacity>
              </View>
              {errors.password && (
                <View style={styles.errorRow}>
                  <Ionicons name="alert-circle-outline" size={14} color={Colors.error} />
                  <Text style={styles.errorText}>{errors.password}</Text>
                </View>
              )}
            </View>

            {/* Confirmar contraseña */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirmar contraseña</Text>
              <View style={[styles.inputWrapper, errors.confirmPassword ? styles.inputError : null]}>
                <TextInput
                  style={styles.input}
                  placeholder="Repite tu contraseña"
                  placeholderTextColor={Colors.textPlaceholder}
                  value={form.confirmPassword}
                  onChangeText={(v) => updateForm('confirmPassword', v)}
                  secureTextEntry={!showConfirm}
                />
                <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                  <Ionicons
                    name={showConfirm ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={Colors.textLight}
                  />
                </TouchableOpacity>
              </View>
              {errors.confirmPassword && (
                <View style={styles.errorRow}>
                  <Ionicons name="alert-circle-outline" size={14} color={Colors.error} />
                  <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                </View>
              )}
            </View>

            {/* Botón registro */}
            <TouchableOpacity style={styles.btnPrimary} onPress={handleRegister}>
              <Text style={styles.btnPrimaryText}>Crear cuenta</Text>
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>¿Ya tienes cuenta? </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                <Text style={styles.loginLink}>Iniciar sesión</Text>
              </TouchableOpacity>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>

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
              <Text style={styles.modalTitle}>¿Cuál es tu fecha de nacimiento?</Text>
              <TouchableOpacity
                onPress={() => setShowCalendar(false)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="close" size={24} color={Colors.textDark} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSub}>
              Toca el mes o el año para cambiarlos rápidamente
            </Text>

            <Calendar selectedDate={tempDate} onSelectDate={setTempDate} />

            {tempDate && (
              <View style={styles.selectedDateRow}>
                <Ionicons name="calendar" size={16} color={Colors.primary} />
                <Text style={styles.selectedDateText}>
                  Seleccionaste:{' '}
                  <Text style={{ fontWeight: '700', color: Colors.primary }}>
                    {formatDate(tempDate)}
                  </Text>
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
                onPress={() => {
                  if (tempDate) { setBirthdate(tempDate); setShowCalendar(false); }
                }}
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
  container: { paddingHorizontal: 24, paddingBottom: 8 },

  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  navCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  navPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: Colors.primaryLight,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  navBtn: {
    width: 32, height: 32, borderRadius: 8,
    backgroundColor: Colors.background,
    alignItems: 'center', justifyContent: 'center',
  },
  monthLabel: { fontSize: 15, fontWeight: '700', color: Colors.textDark },

  daysRow: { flexDirection: 'row', marginBottom: 8 },
  dayName: {
    flex: 1, textAlign: 'center', fontSize: 11,
    fontWeight: '700', color: Colors.textLight, textTransform: 'uppercase',
  },

  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  cellSelected: { backgroundColor: Colors.primary, borderRadius: 20 },
  cellToday: { borderWidth: 1.5, borderColor: Colors.primary, borderRadius: 20 },
  cellDisabled: { opacity: 0.3 },
  cellText: { fontSize: 14, color: Colors.textDark, fontWeight: '500' },
  cellTextSelected: { color: Colors.white, fontWeight: '700' },
  cellTextToday: { color: Colors.primary, fontWeight: '700' },
  cellTextDisabled: { color: Colors.textLight },

  // Selector de años
  yearCell: {
    width: '25%',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 4,
  },
  yearCellSelected: { backgroundColor: Colors.primary },
  yearCellText: { fontSize: 14, color: Colors.textDark, fontWeight: '500' },
  yearCellTextSelected: { color: Colors.white, fontWeight: '700' },

  // Selector de meses
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingBottom: 8,
  },
  monthCell: {
    width: '30%',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    flexGrow: 1,
  },
  monthCellSelected: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  monthCellText: { fontSize: 14, color: Colors.textDark, fontWeight: '500' },
  monthCellTextSelected: { color: Colors.white, fontWeight: '700' },
});

// ─── Estilos principales ──────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { flexGrow: 1, paddingBottom: 40 },

  topDecoration: {
    height: 100,
    backgroundColor: '#C8EDD4',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    overflow: 'hidden',
  },
  backBtn: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 24, paddingTop: 16, gap: 6,
  },
  backText: { fontSize: 14, color: Colors.textMedium, fontWeight: '500' },

  titleContainer: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 8 },
  title: { fontSize: 26, fontWeight: '700', color: Colors.textDark },
  subtitle: { fontSize: 14, color: Colors.textMedium, marginTop: 6, lineHeight: 20 },

  form: { paddingHorizontal: 24, paddingTop: 24, gap: 16 },
  inputGroup: { gap: 6 },
  label: { fontSize: 13, fontWeight: '600', color: Colors.textDark },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    height: 52,
  },
  inputError: { borderColor: Colors.error },
  input: { flex: 1, fontSize: 15, color: Colors.textDark },

  errorRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  errorText: { fontSize: 12, color: Colors.error },

  btnPrimary: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    elevation: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  btnPrimaryText: { color: Colors.white, fontSize: 16, fontWeight: '700' },

  loginContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 8 },
  loginText: { fontSize: 14, color: Colors.textMedium },
  loginLink: { fontSize: 14, color: Colors.primary, fontWeight: '600' },

  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    paddingTop: 12, paddingBottom: 32,
  },
  modalHandle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: Colors.border, alignSelf: 'center', marginBottom: 16,
  },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: 24, marginBottom: 6,
  },
  modalTitle: { fontSize: 18, fontWeight: '700', color: Colors.textDark },
  modalSub: { fontSize: 13, color: Colors.textMedium, paddingHorizontal: 24, marginBottom: 16 },

  selectedDateRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginHorizontal: 24, marginTop: 8, marginBottom: 4,
    backgroundColor: Colors.primaryLight, borderRadius: 10, padding: 12,
  },
  selectedDateText: { fontSize: 13, color: Colors.textMedium, flex: 1 },

  modalBtns: { flexDirection: 'row', gap: 12, paddingHorizontal: 24, marginTop: 16 },
  modalCancel: {
    flex: 1, paddingVertical: 14, borderRadius: 12,
    borderWidth: 1, borderColor: Colors.border, alignItems: 'center',
  },
  modalCancelText: { fontSize: 14, fontWeight: '600', color: Colors.textMedium },
  modalConfirm: {
    flex: 1, paddingVertical: 14, borderRadius: 12,
    backgroundColor: Colors.primary, alignItems: 'center',
    flexDirection: 'row', justifyContent: 'center', gap: 6,
  },
  modalConfirmDisabled: { backgroundColor: Colors.textLight },
  modalConfirmText: { fontSize: 14, fontWeight: '700', color: Colors.white },
});
