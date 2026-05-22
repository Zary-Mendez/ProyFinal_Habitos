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
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useApp } from '@/context/AppContext';
import { Colors } from '@/constants/theme';

export default function ProfileScreen() {
  const { user, streak, bestStreak, weekHistory, logout } = useApp();
  const [remindersOn, setRemindersOn] = useState(true);

  const totalCompleted = weekHistory.reduce((acc, d) => acc + d.completed, 0);

  const initials = user?.name
    ? user.name.trim().split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  const handleLogout = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro de que quieres salir?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Salir',
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/(auth)');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Encabezado decorativo */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mi Perfil</Text>
          <Text style={styles.headerSub}>Tu información y configuración</Text>
        </View>

        <View style={styles.content}>

          {/* Avatar + datos */}
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

          {/* Estadísticas */}
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

          {/* Hábitos seleccionados */}
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
          {/* Configuración */}
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
            <View style={styles.configRow}>
              <View style={styles.configLeft}>
                <View style={[styles.configIcon, { backgroundColor: '#E8F4FD' }]}>
                  <Ionicons name="time" size={18} color="#1976D2" />
                </View>
                <View>
                  <Text style={styles.configTitle}>Hora de recordatorio</Text>
                  <Text style={styles.configSub}>
                    {user?.reminderTime || '08:00 AM'}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Colors.textLight} />
            </View>

            <View style={styles.divider} />

            {/* Frecuencia */}
            <View style={styles.configRow}>
              <View style={styles.configLeft}>
                <View style={[styles.configIcon, { backgroundColor: '#F3E5F5' }]}>
                  <Ionicons name="calendar" size={18} color="#7B1FA2" />
                </View>
                <View>
                  <Text style={styles.configTitle}>Frecuencia</Text>
                  <Text style={styles.configSub}>
                    {user?.frequency || 'Diario'}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Colors.textLight} />
            </View>
          </View>

          {/* Acerca de */}
          <Text style={styles.sectionLabel}>Acerca de</Text>
          <View style={styles.card}>
            <View style={styles.configRow}>
              <View style={styles.configLeft}>
                <View style={[styles.configIcon, { backgroundColor: Colors.primaryLight }]}>
                  <Ionicons name="information-circle" size={18} color={Colors.primary} />
                </View>
                <Text style={styles.configTitle}>HabitFlow v1.0.0</Text>
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

          {/* Botón cerrar sesión */}
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
            <Ionicons name="log-out-outline" size={20} color={Colors.error} />
            <Text style={styles.logoutText}>Cerrar sesión</Text>
          </TouchableOpacity>

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
    paddingBottom: 40,
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

  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textMedium,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginTop: 4,
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

  // Avatar
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.white,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textDark,
  },
  userEmail: {
    fontSize: 13,
    color: Colors.textLight,
    marginTop: 2,
  },
  goalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primaryLight,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  goalText: {
    fontSize: 11,
    color: Colors.primaryDark,
    fontWeight: '600',
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textDark,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.textLight,
    textAlign: 'center',
    marginTop: 2,
    lineHeight: 15,
  },
  statDivider: {
    width: 1,
    height: 55,
    backgroundColor: Colors.border,
  },

  // Hábitos activos
  habitsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  habitChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primaryLight,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  habitChipText: {
    fontSize: 12,
    color: Colors.primaryDark,
    fontWeight: '600',
    textTransform: 'capitalize',
  },

  // Configuración
  configRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  configLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  configIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  configTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textDark,
  },
  configSub: {
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 1,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 12,
  },

  // Logout
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.errorLight,
    borderRadius: 14,
    paddingVertical: 16,
    marginTop: 4,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.error,
  },
});