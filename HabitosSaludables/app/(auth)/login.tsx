import AsyncStorage from '@react-native-async-storage/async-storage';
import { useApp, DEFAULT_USER } from '@/context/AppContext';
import { Colors } from '@/constants/theme';
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
} from 'react-native';

export default function LoginScreen() {
  const { setUser } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});

  const validate = () => {
    const newErrors: { name?: string; email?: string; password?: string } = {};
    if (!name || name.trim().length < 2) {
      newErrors.name = 'Ingresa tu nombre';
    }
    if (!email) {
      newErrors.email = 'El correo es requerido';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Formato de correo incorrecto';
    }
    if (!password) {
      newErrors.password = 'La contraseña es requerida';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
  if (validate()) {
    await AsyncStorage.setItem('userName', name.trim());
    setUser({ ...DEFAULT_USER, name: name.trim(), email });
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
            <Text style={styles.greeting}>¡Hola de nuevo!</Text>
            <Text style={styles.subtitle}>
              Ingresa tus datos para continuar con tus hábitos
            </Text>
          </View>

          <View style={styles.form}>

            {/* Nombre */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nombre</Text>
              <View style={[styles.inputWrapper, errors.name ? styles.inputError : null]}>
                <TextInput
                  style={styles.input}
                  placeholder="Tu nombre"
                  placeholderTextColor={Colors.textPlaceholder}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  returnKeyType="next"
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
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  returnKeyType="next"
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

            {/* Contraseña */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Contraseña</Text>
              <View style={[styles.inputWrapper, errors.password ? styles.inputError : null]}>
                <TextInput
                  style={styles.input}
                  placeholder="········"
                  placeholderTextColor={Colors.textPlaceholder}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  returnKeyType="done"
                  onSubmitEditing={handleLogin}
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

            <TouchableOpacity
              style={styles.forgotBtn}
              onPress={() => router.push('/(auth)/recuperar_contrasena')}
            >
              <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnPrimary} onPress={handleLogin}>
              <Text style={styles.btnPrimaryText}>Iniciar sesión</Text>
              <Ionicons name="arrow-forward" size={20} color={Colors.white} />
            </TouchableOpacity>

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>¿No tienes cuenta? </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/registro')}>
                <Text style={styles.registerLink}>Registrarse</Text>
              </TouchableOpacity>
            </View>

          </View>
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
  },
  topDecoration: {
    height: 100,
    backgroundColor: '#C8EDD4',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    overflow: 'hidden',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    gap: 6,
  },
  backText: {
    fontSize: 14,
    color: Colors.textMedium,
    fontWeight: '500',
  },
  titleContainer: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 8,
  },
  greeting: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.textDark,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textMedium,
    marginTop: 6,
    lineHeight: 20,
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
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  errorText: {
    fontSize: 12,
    color: Colors.error,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginTop: -8,
  },
  forgotText: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '500',
  },
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
  btnPrimaryText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
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