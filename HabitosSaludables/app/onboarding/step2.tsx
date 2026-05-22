import { Colors } from '@/constants/theme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
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

const HABITS = [
  {
    id: 'exercise',
    icon: <MaterialCommunityIcons name="run" size={26} color={Colors.primary} />,
    title: 'Ejercicio',
    sub: 'Actividad física diaria',
  },
  {
    id: 'water',
    icon: <Ionicons name="water-outline" size={26} color="#2196F3" />,
    title: 'Hidratación',
    sub: 'Tomar suficiente agua',
  },
  {
    id: 'sleep',
    icon: <Ionicons name="moon-outline" size={26} color="#7C4DFF" />,
    title: 'Sueño',
    sub: 'Dormir bien cada noche',
  },
  {
    id: 'nutrition',
    icon: <MaterialCommunityIcons name="food-apple-outline" size={26} color="#FF7043" />,
    title: 'Nutrición',
    sub: 'Alimentación balanceada',
  },
  {
    id: 'meditation',
    icon: <MaterialCommunityIcons name="meditation" size={26} color="#00BCD4" />,
    title: 'Meditación',
    sub: 'Mindfulness y bienestar mental',
  },
  {
    id: 'reading',
    icon: <Ionicons name="book-outline" size={26} color="#FF9800" />,
    title: 'Lectura',
    sub: 'Aprender algo nuevo cada día',
  },
  {
    id: 'feminine',
    icon: <MaterialCommunityIcons name="flower" size={26} color={Colors.feminine} />,
    title: 'Salud femenina',
    sub: 'Ciclo y bienestar integral',
  },
  {
    id: 'steps',
    icon: <MaterialCommunityIcons name="shoe-print" size={26} color="#4CAF50" />,
    title: 'Pasos diarios',
    sub: 'Meta de pasos por día',
  },
];

export default function OnboardingStep2() {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    router.push('/onboarding/step3');
  };

  return (
    <SafeAreaView style={styles.container}>

      {/* Indicador de pasos */}
      <View style={styles.stepsIndicator}>
        <View style={styles.step} />
        <View style={[styles.step, styles.stepActive]} />
        <View style={styles.step} />
      </View>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={Colors.textMedium} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.title}>¿Qué hábitos quieres{'\n'}trabajar? 🎯</Text>
          <Text style={styles.subtitle}>
            Selecciona uno o más. Puedes cambiarlos después.
          </Text>
        </View>
      </View>

      {/* Contador */}
      {selected.length > 0 && (
        <View style={styles.counterBadge}>
          <Ionicons name="checkmark-circle" size={16} color={Colors.primary} />
          <Text style={styles.counterText}>
            {selected.length} seleccionado{selected.length > 1 ? 's' : ''}
          </Text>
        </View>
      )}

      {/* Lista de hábitos */}
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.grid}
      >
        {HABITS.map((habit) => {
          const isSelected = selected.includes(habit.id);
          return (
            <TouchableOpacity
              key={habit.id}
              style={[styles.habitCard, isSelected && styles.habitCardSelected]}
              onPress={() => toggle(habit.id)}
              activeOpacity={0.8}
            >
              <View style={[styles.habitIcon, isSelected && styles.habitIconSelected]}>
                {habit.icon}
              </View>
              <View style={styles.habitText}>
                <Text style={[styles.habitTitle, isSelected && styles.habitTitleSelected]}>
                  {habit.title}
                </Text>
                <Text style={styles.habitSub}>{habit.sub}</Text>
              </View>
              <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                {isSelected && (
                  <Ionicons name="checkmark" size={14} color={Colors.white} />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.btnPrimary, selected.length === 0 && styles.btnDisabled]}
          onPress={handleNext}
          disabled={selected.length === 0}
        >
          <Text style={styles.btnPrimaryText}>Continuar</Text>
          <Ionicons name="arrow-forward" size={20} color={Colors.white} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnSkip} onPress={() => router.push('/onboarding/step3')}>
          <Text style={styles.btnSkipText}>Omitir este paso</Text>
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
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textMedium,
    marginTop: 6,
    lineHeight: 18,
  },
  counterBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginHorizontal: 24,
    marginBottom: 8,
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  counterText: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '600',
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 24,
  },
  grid: {
    gap: 10,
    paddingBottom: 16,
  },
  habitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    borderColor: Colors.border,
    gap: 12,
  },
  habitCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  habitIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  habitIconSelected: {
    backgroundColor: Colors.white,
  },
  habitText: {
    flex: 1,
  },
  habitTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textDark,
  },
  habitTitleSelected: {
    color: Colors.primaryDark,
  },
  habitSub: {
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 24,
    gap: 10,
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
  btnDisabled: {
    backgroundColor: Colors.border,
    elevation: 0,
  },
  btnPrimaryText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  btnSkip: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  btnSkipText: {
    fontSize: 14,
    color: Colors.textLight,
  },
});