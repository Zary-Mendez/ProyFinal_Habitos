import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';

const FREQUENCIES = [
  { id: 'daily', label: 'Todos los días', icon: 'calendar' as const },
  { id: 'weekdays', label: 'Lunes a viernes', icon: 'briefcase-outline' as const },
  { id: 'custom', label: 'Personalizado', icon: 'options-outline' as const },
];

const TIMES = [
  { id: 'morning', label: 'Mañana', sub: '6:00 - 9:00 am', icon: 'sunny-outline' as const },
  { id: 'afternoon', label: 'Tarde', sub: '12:00 - 3:00 pm', icon: 'partly-sunny-outline' as const },
  { id: 'evening', label: 'Noche', sub: '7:00 - 9:00 pm', icon: 'moon-outline' as const },
];

const GOALS = [
  { id: '1', label: '1 hábito', sub: 'Empezar suave' },
  { id: '3', label: '3 hábitos', sub: 'Ritmo moderado' },
  { id: '5', label: '5 hábitos', sub: 'Modo intenso' },
];

export default function OnboardingStep3() {
  const [frequency, setFrequency] = useState('daily');
  const [time, setTime] = useState('morning');
  const [goal, setGoal] = useState('3');

  const handleFinish = () => {
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>

      {/* Indicador de pasos */}
      <View style={styles.stepsIndicator}>
        <View style={styles.step} />
        <View style={styles.step} />
        <View style={[styles.step, styles.stepActive]} />
      </View>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={Colors.textMedium} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.title}>Últimos detalles</Text>
          <Text style={styles.subtitle}>
            Configura tus preferencias para recibir recordatorios en el momento ideal.
          </Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Frecuencia */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>¿Con qué frecuencia?</Text>
          <View style={styles.optionsRow}>
            {FREQUENCIES.map((f) => (
              <TouchableOpacity
                key={f.id}
                style={[styles.optionPill, frequency === f.id && styles.optionPillSelected]}
                onPress={() => setFrequency(f.id)}
              >
                <Ionicons
                  name={f.icon}
                  size={16}
                  color={frequency === f.id ? Colors.white : Colors.textMedium}
                />
                <Text style={[styles.optionPillText, frequency === f.id && styles.optionPillTextSelected]}>
                  {f.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Hora preferida */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>¿A qué hora prefieres recordatorios?</Text>
          <View style={styles.timeCards}>
            {TIMES.map((t) => (
              <TouchableOpacity
                key={t.id}
                style={[styles.timeCard, time === t.id && styles.timeCardSelected]}
                onPress={() => setTime(t.id)}
              >
                <Ionicons
                  name={t.icon}
                  size={28}
                  color={time === t.id ? Colors.primary : Colors.textLight}
                />
                <Text style={[styles.timeLabel, time === t.id && styles.timeLabelSelected]}>
                  {t.label}
                </Text>
                <Text style={styles.timeSub}>{t.sub}</Text>
                {time === t.id && (
                  <View style={styles.timeCheck}>
                    <Ionicons name="checkmark" size={12} color={Colors.white} />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Meta diaria */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Meta de hábitos diarios</Text>
          <View style={styles.goalCards}>
            {GOALS.map((g) => (
              <TouchableOpacity
                key={g.id}
                style={[styles.goalCard, goal === g.id && styles.goalCardSelected]}
                onPress={() => setGoal(g.id)}
              >
                <Text style={[styles.goalNumber, goal === g.id && styles.goalNumberSelected]}>
                  {g.label}
                </Text>
                <Text style={styles.goalSub}>{g.sub}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Resumen */}
        <View style={styles.summaryBox}>
          <Ionicons name="sparkles" size={20} color={Colors.primary} />
          <Text style={styles.summaryText}>
            Recibirás recordatorios{' '}
            <Text style={styles.summaryBold}>
              {FREQUENCIES.find((f) => f.id === frequency)?.label.toLowerCase()}
            </Text>{' '}
            en la{' '}
            <Text style={styles.summaryBold}>
              {TIMES.find((t) => t.id === time)?.label.toLowerCase()}
            </Text>{' '}
            con una meta de{' '}
            <Text style={styles.summaryBold}>
              {GOALS.find((g) => g.id === goal)?.label.toLowerCase()}
            </Text>.
          </Text>
        </View>

      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.btnPrimary} onPress={handleFinish}>
          <Ionicons name="checkmark-circle-outline" size={22} color={Colors.white} />
          <Text style={styles.btnPrimaryText}>¡Comenzar HabitFlow!</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  stepsIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingTop: 20,
    paddingBottom: 10,
  },
  step: {
    width: 32,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.border,
  },
  stepActive: {
    backgroundColor: Colors.primary,
    width: 48,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  backBtn: {
    marginTop: 4,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textDark,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textMedium,
    marginTop: 6,
    lineHeight: 18,
  },
  scroll: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    gap: 24,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textDark,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  optionPillSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  optionPillText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textMedium,
  },
  optionPillTextSelected: {
    color: Colors.white,
  },
  timeCards: {
    flexDirection: 'row',
    gap: 10,
  },
  timeCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    borderColor: Colors.border,
    gap: 6,
    position: 'relative',
  },
  timeCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  timeLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textDark,
  },
  timeLabelSelected: {
    color: Colors.primaryDark,
  },
  timeSub: {
    fontSize: 11,
    color: Colors.textLight,
    textAlign: 'center',
  },
  timeCheck: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalCards: {
    flexDirection: 'row',
    gap: 10,
  },
  goalCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    borderColor: Colors.border,
    gap: 4,
  },
  goalCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  goalNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textDark,
    textAlign: 'center',
  },
  goalNumberSelected: {
    color: Colors.primaryDark,
  },
  goalSub: {
    fontSize: 11,
    color: Colors.textLight,
    textAlign: 'center',
  },
  summaryBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: Colors.primaryLight,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  summaryText: {
    flex: 1,
    fontSize: 13,
    color: Colors.textMedium,
    lineHeight: 20,
  },
  summaryBold: {
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 24,
  },
  btnPrimary: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    elevation: 4,
  },
  btnPrimaryText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
});