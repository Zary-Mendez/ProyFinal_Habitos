// context/AppContext.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useEffect, useContext, useState, useCallback, ReactNode } from 'react';

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type HabitCategory =
  | 'exercise'
  | 'hydration'
  | 'sleep'
  | 'nutrition'
  | 'meditation'
  | 'feminine';

export interface Habit {
  id: string;
  title: string;
  category: HabitCategory;
  icon: string;
  iconFamily: 'Ionicons' | 'MaterialCommunityIcons';
  color: string;
  goal: number;
  unit: string;
  frequency: 'daily' | 'weekdays' | 'weekends' | 'custom';
  reminderTime?: string;
}

export interface DailyHabit extends Habit {
  completed: boolean;
  progress: number;
  completedAt?: string;
}

export type DayKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export interface UserProfile {
  name: string;
  email: string;
  birthDate?: string;
  selectedHabits: HabitCategory[];
  frequency: 'daily' | 'weekdays' | 'weekends' | 'custom';
  reminderTime: string;
  dailyGoal: number;
  customDays?: DayKey[]; // campo agregado
}

export interface DayRecord {
  date: string;
  completed: number;
  total: number;
  habitIds: string[];
}

export interface FeminineCycleData {
  lastPeriodStart?: string;
  cycleLength: number;
  currentPhase?: 'menstrual' | 'follicular' | 'ovulatory' | 'luteal';
  symptoms: string[];
}

interface AppState {
  user: UserProfile | null;
  habits: Habit[];
  todayHabits: DailyHabit[];
  weekHistory: DayRecord[];
  streak: number;
  bestStreak: number;
  feminineData: FeminineCycleData;
  isOnboarded: boolean;
}

interface AppContextValue extends AppState {
  setUser: (user: UserProfile) => void;
  updateProfile: (partial: Partial<UserProfile>) => void;
  completeOnboarding: (data: Omit<UserProfile, 'dailyGoal'> & { dailyGoal?: number }) => void;
  logout: () => void;
  completeHabit: (habitId: string, progress?: number) => void;
  uncompleteHabit: (habitId: string) => void;
  addHabit: (habit: Omit<Habit, 'id'>) => void;
  removeHabit: (habitId: string) => void;
  updateHabit: (habitId: string, partial: Partial<Habit>) => void;
  getTodayProgress: () => number;
  getWeekProgress: () => number[];
  updateFeminineData: (data: Partial<FeminineCycleData>) => void;
}

// ─── Valores por defecto ──────────────────────────────────────────────────────

const DEFAULT_HABITS: Habit[] = [
  {
    id: 'h1',
    title: 'Tomar agua',
    category: 'hydration',
    icon: 'water',
    iconFamily: 'Ionicons',
    color: '#2196F3',
    goal: 8,
    unit: 'vasos',
    frequency: 'daily',
    reminderTime: '09:00',
  },
  {
    id: 'h2',
    title: 'Ejercicio',
    category: 'exercise',
    icon: 'fitness',
    iconFamily: 'Ionicons',
    color: '#FF5722',
    goal: 30,
    unit: 'minutos',
    frequency: 'daily',
    reminderTime: '07:00',
  },
  {
    id: 'h3',
    title: 'Meditación',
    category: 'meditation',
    icon: 'leaf',
    iconFamily: 'Ionicons',
    color: '#9C27B0',
    goal: 10,
    unit: 'minutos',
    frequency: 'daily',
    reminderTime: '08:00',
  },
  {
    id: 'h4',
    title: 'Dormir bien',
    category: 'sleep',
    icon: 'moon',
    iconFamily: 'Ionicons',
    color: '#3F51B5',
    goal: 8,
    unit: 'horas',
    frequency: 'daily',
    reminderTime: '22:00',
  },
  {
    id: 'h5',
    title: 'Nutrición saludable',
    category: 'nutrition',
    icon: 'nutrition',
    iconFamily: 'Ionicons',
    color: '#4CAF50',
    goal: 3,
    unit: 'comidas',
    frequency: 'daily',
  },
];

const DEFAULT_FEMININE: FeminineCycleData = {
  cycleLength: 28,
  symptoms: [],
  currentPhase: 'follicular',
};

export const DEFAULT_USER: UserProfile = {
  name: '',
  email: '',
  selectedHabits: ['hydration', 'exercise', 'sleep'],
  frequency: 'daily',
  reminderTime: '08:00',
  dailyGoal: 3,
  customDays: [],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toISO(date: Date): string {
  return date.toISOString().split('T')[0];
}

function habitsToDailyHabits(habits: Habit[]): DailyHabit[] {
  return habits.map((h) => ({
    ...h,
    completed: false,
    progress: 0,
  }));
}

function generateMockHistory(): DayRecord[] {
  const records: DayRecord[] = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const total = 5;
    const completed = i === 0 ? 0 : Math.floor(Math.random() * (total + 1));
    records.push({
      date: toISO(d),
      completed,
      total,
      habitIds: [],
    });
  }
  return records;
}

function calculateStreak(history: DayRecord[]): { streak: number; bestStreak: number } {
  let streak = 0;
  let bestStreak = 0;
  let current = 0;

  const past = history.slice(0, -1);

  for (let i = past.length - 1; i >= 0; i--) {
    const r = past[i];
    if (r.completed > 0 && r.completed >= r.total) {
      current++;
      if (i === past.length - 1) streak = current;
    } else {
      if (i === past.length - 1) streak = 0;
      if (current > bestStreak) bestStreak = current;
      current = 0;
    }
  }
  if (current > bestStreak) bestStreak = current;
  return { streak, bestStreak };
}

// ─── Contexto ─────────────────────────────────────────────────────────────────

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<UserProfile | null>(null);
  const [habits, setHabits] = useState<Habit[]>(DEFAULT_HABITS);
  const [todayHabits, setTodayHabits] = useState<DailyHabit[]>(
    habitsToDailyHabits(DEFAULT_HABITS)
  );
  const [weekHistory, setWeekHistory] = useState<DayRecord[]>(generateMockHistory());
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [feminineData, setFeminineData] = useState<FeminineCycleData>(DEFAULT_FEMININE);
  const [isOnboarded, setIsOnboarded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('userName').then((savedName) => {
      if (savedName) {
        setUserState({ ...DEFAULT_USER, name: savedName });
      }
    });
  }, []);

  // ── Usuario ──────────────────────────────────────────────────────────────

  const setUser = useCallback((u: UserProfile) => {
    setUserState(u);
  }, []);

  const updateProfile = useCallback((partial: Partial<UserProfile>) => {
    setUserState((prev) => (prev ? { ...prev, ...partial } : prev));
  }, []);

  const completeOnboarding = useCallback(
    (data: Omit<UserProfile, 'dailyGoal'> & { dailyGoal?: number }) => {
      const profile: UserProfile = { dailyGoal: 3, ...data };
      setUserState(profile);
      setIsOnboarded(true);

      const filtered = DEFAULT_HABITS.filter((h) =>
        profile.selectedHabits.includes(h.category)
      );
      setHabits(filtered);
      setTodayHabits(habitsToDailyHabits(filtered));

      const history = generateMockHistory().map((r) => ({
        ...r,
        total: filtered.length,
      }));
      setWeekHistory(history);
      const { streak: s, bestStreak: b } = calculateStreak(history);
      setStreak(s);
      setBestStreak(b);
    },
    []
  );

  const logout = useCallback(() => {
    setUserState(null);
    setIsOnboarded(false);
    setHabits(DEFAULT_HABITS);
    setTodayHabits(habitsToDailyHabits(DEFAULT_HABITS));
    setWeekHistory(generateMockHistory());
    setStreak(0);
    setBestStreak(0);
  }, []);

  // ── Hábitos ──────────────────────────────────────────────────────────────

  const completeHabit = useCallback(
    (habitId: string, progress?: number) => {
      setTodayHabits((prev) =>
        prev.map((h) => {
          if (h.id !== habitId) return h;
          const newProgress = progress ?? h.goal;
          const completed = newProgress >= h.goal;
          return {
            ...h,
            progress: newProgress,
            completed,
            completedAt: completed ? new Date().toISOString() : h.completedAt,
          };
        })
      );

      setWeekHistory((prev) => {
        const today = toISO(new Date());
        return prev.map((r) => {
          if (r.date !== today) return r;
          const newCompleted = Math.min(r.completed + 1, r.total);
          return { ...r, completed: newCompleted };
        });
      });
    },
    []
  );

  const uncompleteHabit = useCallback((habitId: string) => {
    setTodayHabits((prev) =>
      prev.map((h) =>
        h.id !== habitId
          ? h
          : { ...h, completed: false, progress: 0, completedAt: undefined }
      )
    );

    setWeekHistory((prev) => {
      const today = toISO(new Date());
      return prev.map((r) => {
        if (r.date !== today) return r;
        return { ...r, completed: Math.max(0, r.completed - 1) };
      });
    });
  }, []);

  const addHabit = useCallback((habit: Omit<Habit, 'id'>) => {
    const newHabit: Habit = {
      ...habit,
      id: `h_${Date.now()}`,
    };
    setHabits((prev) => [...prev, newHabit]);
    setTodayHabits((prev) => [
      ...prev,
      { ...newHabit, completed: false, progress: 0 },
    ]);
    setWeekHistory((prev) =>
      prev.map((r) => ({ ...r, total: r.total + 1 }))
    );
  }, []);

  const removeHabit = useCallback((habitId: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== habitId));
    setTodayHabits((prev) => prev.filter((h) => h.id !== habitId));
    setWeekHistory((prev) =>
      prev.map((r) => ({
        ...r,
        total: Math.max(0, r.total - 1),
        completed: r.completed > r.total - 1 ? r.total - 1 : r.completed,
      }))
    );
  }, []);

  const updateHabit = useCallback(
    (habitId: string, partial: Partial<Habit>) => {
      setHabits((prev) =>
        prev.map((h) => (h.id === habitId ? { ...h, ...partial } : h))
      );
      setTodayHabits((prev) =>
        prev.map((h) => (h.id === habitId ? { ...h, ...partial } : h))
      );
    },
    []
  );

  // ── Progreso ─────────────────────────────────────────────────────────────

  const getTodayProgress = useCallback((): number => {
    if (todayHabits.length === 0) return 0;
    const done = todayHabits.filter((h) => h.completed).length;
    return Math.round((done / todayHabits.length) * 100);
  }, [todayHabits]);

  const getWeekProgress = useCallback((): number[] => {
    return weekHistory.map((r) =>
      r.total === 0 ? 0 : Math.round((r.completed / r.total) * 100)
    );
  }, [weekHistory]);

  // ── Salud femenina ───────────────────────────────────────────────────────

  const updateFeminineData = useCallback(
    (data: Partial<FeminineCycleData>) => {
      setFeminineData((prev) => ({ ...prev, ...data }));
    },
    []
  );

  // ── Valor del contexto ───────────────────────────────────────────────────

  const value: AppContextValue = {
    user,
    habits,
    todayHabits,
    weekHistory,
    streak,
    bestStreak,
    feminineData,
    isOnboarded,
    setUser,
    updateProfile,
    completeOnboarding,
    logout,
    completeHabit,
    uncompleteHabit,
    addHabit,
    removeHabit,
    updateHabit,
    getTodayProgress,
    getWeekProgress,
    updateFeminineData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// ─── Hook de acceso ───────────────────────────────────────────────────────────

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp debe usarse dentro de <AppProvider>');
  }
  return ctx;
}
