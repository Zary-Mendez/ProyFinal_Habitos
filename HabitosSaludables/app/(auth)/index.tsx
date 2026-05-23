import { Colors } from '@/constants/theme';
import { router } from 'expo-router';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';

export default function WelcomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Nubes decorativas arriba */}
      <View style={styles.topDecoration}>
      </View>

      {/* Logo e ícono */}
      <View style={styles.logoContainer}>
        <View style={styles.iconCircle}>
          <Text style={styles.iconEmoji}>🌿</Text>
        </View>
        <Text style={styles.appName}>HabitFlow</Text>
        <Text style={styles.tagline}>
          Tu compañero diario para construir{'\n'}hábitos saludables que duran
        </Text>
      </View>

      {/* Features */}
      <View style={styles.featuresContainer}>
        <FeatureItem emoji="🏃" text="Hábitos personalizados" sub="Actividad, sueño, nutrición y más" />
        <FeatureItem emoji="🌸" text="Salud femenina integral" sub="Ciclo y bienestar en un solo lugar" />
        <FeatureItem emoji="📊" text="Progreso y motivación" sub="Fechas, gráficas y recordatorios" />
      </View>

      {/* Botones */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.btnPrimary}
          onPress={() => router.push('/(auth)/registro')}
        >
          <Text style={styles.btnPrimaryText}>Registrarse</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnSecondary}
          onPress={() => router.push('/(auth)/login')}
        >
          <Text style={styles.btnSecondaryText}>Iniciar sesión</Text>
        </TouchableOpacity>

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Al continuar aceptas los </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/registro')}>
            <Text style={styles.registerLink}>Términos y la Política de privacidad</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

function FeatureItem({ emoji, text, sub }: { emoji: string; text: string; sub: string }) {
  return (
    <View style={styles.featureItem}>
      <View style={styles.featureIcon}>
        <Text style={styles.featureEmoji}>{emoji}</Text>
      </View>
      <View style={styles.featureText}>
        <Text style={styles.featureTitle}>{text}</Text>
        <Text style={styles.featureSub}>{sub}</Text>
      </View>
      <Text style={styles.featureCheck}>✓</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  topDecoration: {
    height: 120,
    backgroundColor: '#C8EDD4',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    overflow: 'hidden',
    position: 'relative',
  },
  logoContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  iconEmoji: {
    fontSize: 36,
  },
  appName: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textDark,
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: 14,
    color: Colors.textMedium,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  featuresContainer: {
    paddingHorizontal: 24,
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 14,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 2,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  featureEmoji: {
    fontSize: 20,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textDark,
  },
  featureSub: {
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 2,
  },
  featureCheck: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '700',
  },
  buttonsContainer: {
    paddingHorizontal: 24,
    paddingTop: 30,
    gap: 12,
  },
  btnPrimary: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  btnPrimaryText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  btnSecondary: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  btnSecondaryText: {
    color: Colors.textDark,
    fontSize: 16,
    fontWeight: '600',
  },
  termsText: {
    fontSize: 11,
    color: Colors.textLight,
    textAlign: 'center',
    marginTop: 4,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  registerText: {
    fontSize: 14,
    color: Colors.textMedium,
  },
  registerLink: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
});