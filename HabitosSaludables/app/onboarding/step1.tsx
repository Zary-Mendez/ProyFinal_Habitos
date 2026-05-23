import { Colors } from '@/constants/theme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';

export default function OnboardingStep1() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Indicador de pasos */}
        <View style={styles.stepsIndicator}>
          <View style={[styles.step, styles.stepActive]} />
          <View style={styles.step} />
          <View style={styles.step} />
        </View>

        {/* Ilustración central */}
        <View style={styles.illustrationContainer}>
          <View style={styles.bigCircle}>
            <View style={styles.innerCircle}>
              <MaterialCommunityIcons name="leaf" size={64} color={Colors.primary} />
            </View>
          </View>
          </View>
        

        {/* Texto */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>¡Bienvenido a{'\n'}HabitFlow!</Text>
          <Text style={styles.subtitle}>
            Estás a punto de comenzar un camino hacia una vida más saludable y equilibrada.
            Vamos a personalizar tu experiencia en solo 2 pasos.
          </Text>
        </View>

        {/* Tarjetas de beneficios */}
        <View style={styles.benefitsContainer}>
          <BenefitCard
            icon={<Ionicons name="checkmark-circle" size={22} color={Colors.primary} />}
            text="Hábitos adaptados a ti"
          />
          <BenefitCard
            icon={<Ionicons name="notifications-outline" size={22} color={Colors.primary} />}
            text="Recordatorios inteligentes"
          />
          <BenefitCard
            icon={<Ionicons name="trending-up-outline" size={22} color={Colors.primary} />}
            text="Seguimiento de tu progreso"
          />
        </View>

        {/* Botones */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={() => router.push('/onboarding/step2')}
          >
            <Text style={styles.btnPrimaryText}>Empezar personalización</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnSkip}
            onPress={() => router.replace('/(tabs)')}
          >
            <Text style={styles.btnSkipText}>Omitir por ahora</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

function BenefitCard({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <View style={styles.benefitCard}>
      <View style={styles.benefitIcon}>{icon}</View>
      <Text style={styles.benefitText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 32,
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
  illustrationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
    position: 'relative',
    marginVertical: 8,
  },
  bigCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
  },
  innerCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubble: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  bubble1: { top: 20, right: 40 },
  bubble2: { bottom: 20, right: 30 },
  bubble3: { top: 30, left: 40 },
  textContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textDark,
    textAlign: 'center',
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textMedium,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 22,
  },
  benefitsContainer: {
    gap: 10,
  },
  benefitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  benefitIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefitText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textDark,
  },
  footer: {
    paddingTop: 24,
    gap: 12,
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
  btnSkip: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  btnSkipText: {
    fontSize: 14,
    color: Colors.textLight,
  },
});