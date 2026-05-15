import { Colors } from '@/constants/theme';
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
} from 'react-native';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const validate = () => {
    if (!email) {
      setError('El correo es requerido');
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Formato de correo incorrecto');
      return false;
    }
    setError('');
    return true;
  };

  const handleSend = () => {
    if (validate()) {
      setSent(true);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          {/* Header */}
          <View style={styles.topDecoration}>
            <View style={styles.cloud1} />
            <View style={styles.cloud2} />
          </View>

          {/* Botón volver */}
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backText}>← Volver</Text>
          </TouchableOpacity>

          {/* Ícono */}
          <View style={styles.iconContainer}>
            <View style={styles.iconCircle}>
              <Text style={styles.iconEmoji}>🔑</Text>
            </View>
          </View>

          {/* Título */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>¿Olvidaste tu contraseña?</Text>
            <Text style={styles.subtitle}>
              No te preocupes, te enviaremos un enlace a tu correo para restablecerla.
            </Text>
          </View>

          {!sent ? (
            <View style={styles.form}>

              {/* Email */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Correo electrónico registrado</Text>
                <View style={[styles.inputWrapper, error ? styles.inputError : null]}>
                  <TextInput
                    style={styles.input}
                    placeholder="ejemplo@correo.com"
                    placeholderTextColor={Colors.textPlaceholder}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  <Text style={styles.inputIcon}>✉️</Text>
                </View>
                {error ? (
                  <Text style={styles.errorText}>{error}</Text>
                ) : (
                  <Text style={styles.hintText}>
                    Ingresa el correo con el que te registraste
                  </Text>
                )}
              </View>

              {/* Info 24h */}
              <View style={styles.infoBox}>
                <Text style={styles.infoIcon}>ℹ️</Text>
                <Text style={styles.infoText}>
                  Recibirás un enlace válido por <Text style={styles.infoBold}>24 horas</Text>. Si no lo ves en tu bandeja, revisa la carpeta de spam.
                </Text>
              </View>

              {/* Botón enviar */}
              <TouchableOpacity style={styles.btnPrimary} onPress={handleSend}>
                <Text style={styles.btnPrimaryText}>Enviar enlace</Text>
              </TouchableOpacity>

              {/* Volver al login */}
              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>¿Recordaste tu contraseña? </Text>
                <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                  <Text style={styles.loginLink}>Iniciar sesión</Text>
                </TouchableOpacity>
              </View>

            </View>
          ) : (
            // Pantalla de éxito
            <View style={styles.successContainer}>
              <View style={styles.successIcon}>
                <Text style={styles.successEmoji}>✅</Text>
              </View>
              <Text style={styles.successTitle}>¡Enlace enviado!</Text>
              <Text style={styles.successText}>
                Revisa tu correo <Text style={styles.successEmail}>{email}</Text> y sigue las instrucciones para restablecer tu contraseña.
              </Text>
              <TouchableOpacity
                style={styles.btnPrimary}
                onPress={() => router.push('/(auth)/login')}
              >
                <Text style={styles.btnPrimaryText}>Volver al inicio de sesión</Text>
              </TouchableOpacity>
            </View>
          )}

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  topDecoration: {
    height: 100,
    backgroundColor: '#C8EDD4',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    overflow: 'hidden',
  },
  cloud1: {
    position: 'absolute',
    width: 100,
    height: 50,
    backgroundColor: Colors.white,
    borderRadius: 25,
    top: 20,
    left: 30,
    opacity: 0.7,
  },
  cloud2: {
    position: 'absolute',
    width: 80,
    height: 40,
    backgroundColor: Colors.white,
    borderRadius: 20,
    top: 35,
    right: 40,
    opacity: 0.6,
  },
  backBtn: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  backText: {
    fontSize: 14,
    color: Colors.textMedium,
    fontWeight: '500',
  },
  iconContainer: {
    alignItems: 'center',
    paddingTop: 30,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
  },
  iconEmoji: {
    fontSize: 36,
  },
  titleContainer: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 8,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textDark,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textMedium,
    marginTop: 8,
    lineHeight: 20,
    textAlign: 'center',
  },
  form: {
    paddingHorizontal: 24,
    paddingTop: 24,
    gap: 16,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textDark,
  },
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
  inputError: {
    borderColor: Colors.error,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: Colors.textDark,
  },
  inputIcon: {
    fontSize: 16,
    marginLeft: 8,
  },
  errorText: {
    fontSize: 12,
    color: Colors.error,
    marginTop: 2,
  },
  hintText: {
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 2,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: Colors.primaryLight,
    borderRadius: 12,
    padding: 14,
    gap: 10,
    alignItems: 'flex-start',
  },
  infoIcon: {
    fontSize: 16,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: Colors.textMedium,
    lineHeight: 18,
  },
  infoBold: {
    fontWeight: '700',
    color: Colors.textDark,
  },
  btnPrimary: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
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
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  loginText: {
    fontSize: 14,
    color: Colors.textMedium,
  },
  loginLink: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  successContainer: {
    paddingHorizontal: 24,
    paddingTop: 30,
    alignItems: 'center',
    gap: 16,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successEmoji: {
    fontSize: 36,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textDark,
  },
  successText: {
    fontSize: 14,
    color: Colors.textMedium,
    textAlign: 'center',
    lineHeight: 22,
  },
  successEmail: {
    fontWeight: '700',
    color: Colors.primary,
  },
});