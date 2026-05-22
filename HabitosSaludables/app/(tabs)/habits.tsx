// app/(tabs)/habits.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useApp } from '@/context/AppContext';
import { ALL_HABITS, CATEGORIES } from '@/data/mockData';
import { Habit, HabitCategory } from '@/context/AppContext';

type FilterCategory = 'all' | HabitCategory;

// ─── Tarjeta de hábito ────────────────────────────────────────────────────────

interface HabitListCardProps {
  habit: Habit & { completed: boolean; progress: number };
  onComplete: () => void;
  onUncomplete: () => void;
  onDelete: () => void;
}

function HabitListCard({ habit, onComplete, onUncomplete, onDelete }: HabitListCardProps) {
  const catInfo = CATEGORIES[habit.category as keyof typeof CATEGORIES];
  const lightColor = catInfo?.lightColor ?? Colors.primaryLight;

  return (
    <View style={[styles.habitCard, habit.completed && styles.habitCardDone]}>
      <View style={[styles.habitIcon, { backgroundColor: lightColor }]}>
        {habit.iconFamily === 'Ionicons' ? (
          <Ionicons name={habit.icon as any} size={22} color={habit.completed ? Colors.textLight : habit.color} />
        ) : (
          <MaterialCommunityIcons name={habit.icon as any} size={22} color={habit.completed ? Colors.textLight : habit.color} />
        )}
      </View>

      <View style={styles.habitInfo}>
        <Text style={[styles.habitTitle, habit.completed && styles.habitTitleDone]}>
          {habit.title}
        </Text>
        <Text style={styles.habitMeta}>
          Meta: {habit.goal} {habit.unit} · {habit.frequency === 'daily' ? 'Diario' : habit.frequency === 'weekdays' ? 'L-V' : 'Fines de semana'}
        </Text>
      </View>

      <View style={styles.habitActions}>
        <TouchableOpacity
          onPress={habit.completed ? onUncomplete : onComplete}
          activeOpacity={0.7}
          style={styles.actionBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name={habit.completed ? 'checkmark-circle' : 'ellipse-outline'}
            size={28}
            color={habit.completed ? Colors.primary : Colors.textLight}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          activeOpacity={0.7}
          style={styles.actionBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="trash-outline" size={20} color={Colors.textLight} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Pantalla principal ───────────────────────────────────────────────────────

export default function HabitsScreen() {
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const { todayHabits, habits, addHabit, removeHabit, completeHabit, uncompleteHabit } = useApp();

  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTab, setModalTab] = useState<'catalog' | 'custom'>('catalog');
  const [customName, setCustomName] = useState('');
  const [customCategory, setCustomCategory] = useState<HabitCategory>('exercise');

  const completedCount = todayHabits.filter(h => h.completed).length;

  const filteredHabits = activeFilter === 'all'
    ? todayHabits
    : todayHabits.filter(h => h.category === activeFilter);

  const availableCatalog = ALL_HABITS.filter(
    ah => !habits.some(h => h.id === ah.id)
  );

  const handleAddFromCatalog = (habit: Habit) => {
    addHabit(habit);
    setModalVisible(false);
  };

  const handleAddCustom = () => {
    if (!customName.trim()) return;
    const catInfo = CATEGORIES[customCategory];
    const newHabit: Habit = {
      id: `custom_${Date.now()}`,
      title: customName.trim(),
      category: customCategory,
      icon: catInfo.icon,
      iconFamily: 'Ionicons',
      color: catInfo.color,
      goal: 1,
      unit: 'vez',
      frequency: 'daily',
    };
    addHabit(newHabit);
    setCustomName('');
    setModalVisible(false);
  };

  const handleDelete = (id: string, title: string) => {
    setDeleteTarget({ id, title });
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      removeHabit(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  const filters: { key: FilterCategory; label: string }[] = [
    { key: 'all', label: 'Todos' },
    ...Object.entries(CATEGORIES).map(([key, val]) => ({
      key: key as HabitCategory,
      label: val.label,
    })),
  ];

  return (
    <SafeAreaView style={styles.safe}>

      {/* ── Encabezado decorativo ── */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Mis Hábitos</Text>
            <Text style={styles.headerSub}>
              {completedCount} de {todayHabits.length} completados
            </Text>
          </View>
          
        </View>
      </View>

      {/* ── Filtros por categoría ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContainer}
        style={styles.filtersScroll}
      >
        {filters.map(f => {
          const isActive = activeFilter === f.key;
          const catColor = f.key !== 'all'
            ? CATEGORIES[f.key as HabitCategory]?.color
            : Colors.primary;

          return (
            <TouchableOpacity
              key={f.key}
              style={[
                styles.filterChip,
                isActive && { backgroundColor: catColor, borderColor: catColor },
              ]}
              onPress={() => setActiveFilter(f.key)}
              activeOpacity={0.7}
            >
              <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* ── Lista de hábitos ── */}
      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredHabits.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="leaf-outline" size={44} color={Colors.textLight} />
            <Text style={styles.emptyTitle}>
              {activeFilter === 'all' ? 'Sin hábitos aún' : 'Sin hábitos en esta categoría'}
            </Text>
            <Text style={styles.emptySub}>
              Toca el botón + para agregar hábitos
            </Text>
          </View>
        ) : (
          filteredHabits.map(h => (
            <HabitListCard
              key={h.id}
              habit={h}
              onComplete={() => completeHabit(h.id)}
              onUncomplete={() => uncompleteHabit(h.id)}
              onDelete={() => handleDelete(h.id, h.title)}
            />
          ))
        )}
        <View style={{ height: 24 }} />
      </ScrollView>

      <TouchableOpacity
            style={styles.addBtn}
            onPress={() => setModalVisible(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={24} color={Colors.white} />
      </TouchableOpacity>

      {/* ── Modal agregar hábito ── */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>

            <View style={styles.modalHandle} />

            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Agregar hábito</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={Colors.textDark} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalTabs}>
              <TouchableOpacity
                style={[styles.modalTab, modalTab === 'catalog' && styles.modalTabActive]}
                onPress={() => setModalTab('catalog')}
              >
                <Text style={[styles.modalTabText, modalTab === 'catalog' && styles.modalTabTextActive]}>
                  Catálogo
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalTab, modalTab === 'custom' && styles.modalTabActive]}
                onPress={() => setModalTab('custom')}
              >
                <Text style={[styles.modalTabText, modalTab === 'custom' && styles.modalTabTextActive]}>
                  Personalizado
                </Text>
              </TouchableOpacity>
            </View>

            {modalTab === 'catalog' ? (
              <ScrollView style={styles.catalogList} showsVerticalScrollIndicator={false}>
                {availableCatalog.length === 0 ? (
                  <View style={styles.catalogEmpty}>
                    <Ionicons name="checkmark-done-circle" size={40} color={Colors.primary} />
                    <Text style={styles.catalogEmptyText}>
                      Ya tienes todos los hábitos del catálogo
                    </Text>
                  </View>
                ) : (
                  availableCatalog.map(habit => {
                    const catInfo = CATEGORIES[habit.category];
                    return (
                      <TouchableOpacity
                        key={habit.id}
                        style={styles.catalogItem}
                        onPress={() => handleAddFromCatalog(habit)}
                        activeOpacity={0.7}
                      >
                        <View style={[styles.catalogIcon, { backgroundColor: catInfo.lightColor }]}>
                          {habit.iconFamily === 'Ionicons' ? (
                            <Ionicons name={habit.icon as any} size={20} color={habit.color} />
                          ) : (
                            <MaterialCommunityIcons name={habit.icon as any} size={20} color={habit.color} />
                          )}
                        </View>
                        <View style={styles.catalogInfo}>
                          <Text style={styles.catalogName}>{habit.title}</Text>
                          <Text style={styles.catalogMeta}>
                            {catInfo.label} · {habit.goal} {habit.unit}
                          </Text>
                        </View>
                        <Ionicons name="add-circle-outline" size={24} color={Colors.primary} />
                      </TouchableOpacity>
                    );
                  })
                )}
                <View style={{ height: 24 }} />
              </ScrollView>
            ) : (
              <View style={styles.customForm}>
                <Text style={styles.customLabel}>Nombre del hábito</Text>
                <TextInput
                  style={styles.customInput}
                  placeholder="Ej: Leer 20 minutos"
                  placeholderTextColor={Colors.textPlaceholder}
                  value={customName}
                  onChangeText={setCustomName}
                  maxLength={40}
                />

                <Text style={styles.customLabel}>Categoría</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.catSelector}
                >
                  {Object.entries(CATEGORIES).map(([key, cat]) => {
                    const isActive = customCategory === key;
                    return (
                      <TouchableOpacity
                        key={key}
                        style={[
                          styles.catChip,
                          isActive && { backgroundColor: cat.color, borderColor: cat.color },
                        ]}
                        onPress={() => setCustomCategory(key as HabitCategory)}
                      >
                        <Ionicons
                          name={cat.icon as any}
                          size={14}
                          color={isActive ? Colors.white : cat.color}
                        />
                        <Text style={[styles.catChipText, isActive && { color: Colors.white }]}>
                          {cat.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>

                <TouchableOpacity
                  style={[styles.addCustomBtn, !customName.trim() && styles.addCustomBtnDisabled]}
                  onPress={handleAddCustom}
                  disabled={!customName.trim()}
                  activeOpacity={0.8}
                >
                  <Text style={styles.addCustomBtnText}>Agregar hábito</Text>
                  <Ionicons name="arrow-forward" size={18} color={Colors.white} />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* ── Modal confirmar eliminación ── */}
      <Modal
        visible={!!deleteTarget}
        animationType="fade"
        transparent
        onRequestClose={() => setDeleteTarget(null)}
      >
        <View style={styles.confirmOverlay}>
          <View style={styles.confirmSheet}>
            <View style={styles.confirmIconBox}>
              <Ionicons name="trash" size={28} color={Colors.error} />
            </View>
            <Text style={styles.confirmTitle}>Eliminar hábito</Text>
            <Text style={styles.confirmMsg}>
              ¿Eliminar "{deleteTarget?.title}" de tu lista?
            </Text>
            <View style={styles.confirmBtns}>
              <TouchableOpacity
                style={styles.confirmCancel}
                onPress={() => setDeleteTarget(null)}
                activeOpacity={0.7}
              >
                <Text style={styles.confirmCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmDelete}
                onPress={confirmDelete}
                activeOpacity={0.7}
              >
                <Text style={styles.confirmDeleteText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>


    </SafeAreaView>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  // Encabezado
  header: {
    height: 110,
    backgroundColor: '#C8EDD4',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    paddingBottom: 16,
    paddingHorizontal: 24,
    position: 'relative',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textDark,
  },
  headerSub: {
    fontSize: 13,
    color: Colors.textMedium,
    marginTop: 2,
  },
  addBtn: {
    left: 350,
    bottom: 20,
    width: 50,
    height: 50,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },

  // Filtros
  filtersScroll: {
    maxHeight: 52,
    marginTop: 14,
  },
  filtersContainer: {
    paddingHorizontal: 24,
    gap: 8,
    alignItems: 'center',
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  filterText: {
    fontSize: 13,
    color: Colors.textMedium,
    fontWeight: '500',
  },
  filterTextActive: {
    color: Colors.white,
    fontWeight: '700',
  },

  // Lista
  list: {
    flex: 1,
    marginTop: 14,
  },
  listContent: {
    paddingHorizontal: 24,
  },

  // Tarjeta hábito
  habitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  habitCardDone: {
    opacity: 0.65,
    backgroundColor: '#F8FDF9',
  },
  habitIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  habitInfo: {
    flex: 1,
  },
  habitTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textDark,
  },
  habitTitleDone: {
    textDecorationLine: 'line-through',
    color: Colors.textLight,
  },
  habitMeta: {
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 3,
  },
  habitActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionBtn: {
    padding: 8,
  },

  // Estado vacío
  emptyState: {
    alignItems: 'center',
    marginTop: 60,
    gap: 10,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textDark,
  },
  emptySub: {
    fontSize: 13,
    color: Colors.textLight,
    textAlign: 'center',
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 12,
    maxHeight: '85%',
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textDark,
  },

  // Tabs modal
  modalTabs: {
    flexDirection: 'row',
    marginHorizontal: 24,
    backgroundColor: Colors.primaryLight,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  modalTab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTabActive: {
    backgroundColor: Colors.white,
    elevation: 2,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
  },
  modalTabText: {
    fontSize: 14,
    color: Colors.textMedium,
    fontWeight: '500',
  },
  modalTabTextActive: {
    color: Colors.primary,
    fontWeight: '700',
  },

  // Catálogo
  catalogList: {
    paddingHorizontal: 24,
  },
  catalogItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 12,
  },
  catalogIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  catalogInfo: {
    flex: 1,
  },
  catalogName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textDark,
  },
  catalogMeta: {
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 2,
  },
  catalogEmpty: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  catalogEmptyText: {
    fontSize: 14,
    color: Colors.textMedium,
    textAlign: 'center',
  },

  // Formulario personalizado
  customForm: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  customLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textMedium,
    marginBottom: 8,
    marginTop: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  customInput: {
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 16,
    fontSize: 15,
    color: Colors.textDark,
    backgroundColor: Colors.background,
  },
  catSelector: {
    flexGrow: 0,
  },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    marginRight: 8,
  },
  catChipText: {
    fontSize: 12,
    color: Colors.textMedium,
    fontWeight: '500',
  },
  addCustomBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    marginTop: 24,
    elevation: 4,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 6,
  },
  addCustomBtnDisabled: {
    backgroundColor: Colors.textLight,
    elevation: 0,
  },
  addCustomBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.white,
  },
  confirmOverlay: {
  flex: 1,
  backgroundColor: Colors.overlay,
  justifyContent: 'center',
  alignItems: 'center',
  paddingHorizontal: 32,
},
confirmSheet: {
  backgroundColor: Colors.white,
  borderRadius: 20,
  padding: 24,
  alignItems: 'center',
  width: '100%',
  elevation: 8,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.15,
  shadowRadius: 12,
},
confirmIconBox: {
  width: 56,
  height: 56,
  borderRadius: 28,
  backgroundColor: Colors.errorLight,
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 16,
},
confirmTitle: {
  fontSize: 18,
  fontWeight: '700',
  color: Colors.textDark,
  marginBottom: 8,
},
confirmMsg: {
  fontSize: 14,
  color: Colors.textMedium,
  textAlign: 'center',
  lineHeight: 20,
  marginBottom: 24,
},
confirmBtns: {
  flexDirection: 'row',
  gap: 12,
  width: '100%',
},
confirmCancel: {
  flex: 1,
  paddingVertical: 14,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: Colors.border,
  alignItems: 'center',
},
confirmCancelText: {
  fontSize: 14,
  fontWeight: '600',
  color: Colors.textMedium,
},
confirmDelete: {
  flex: 1,
  paddingVertical: 14,
  borderRadius: 12,
  backgroundColor: Colors.error,
  alignItems: 'center',
},
confirmDeleteText: {
  fontSize: 14,
  fontWeight: '700',
  color: Colors.white,
},
});