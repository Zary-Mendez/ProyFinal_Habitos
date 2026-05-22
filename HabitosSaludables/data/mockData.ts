// data/mockData.ts

import { Habit, DayRecord, FeminineCycleData } from '@/context/AppContext';

// ─── Catálogo completo de hábitos disponibles ─────────────────────────────────

export const ALL_HABITS: Habit[] = [
  // Hidratación
  {
    id: 'h_water',
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
  // Ejercicio
  {
    id: 'h_walk',
    title: 'Caminar',
    category: 'exercise',
    icon: 'walk',
    iconFamily: 'MaterialCommunityIcons',
    color: '#FF5722',
    goal: 30,
    unit: 'minutos',
    frequency: 'daily',
    reminderTime: '07:00',
  },
  {
    id: 'h_gym',
    title: 'Ir al gimnasio',
    category: 'exercise',
    icon: 'barbell',
    iconFamily: 'Ionicons',
    color: '#F44336',
    goal: 60,
    unit: 'minutos',
    frequency: 'weekdays',
    reminderTime: '06:30',
  },
  {
    id: 'h_stretch',
    title: 'Estiramientos',
    category: 'exercise',
    icon: 'body',
    iconFamily: 'Ionicons',
    color: '#FF9800',
    goal: 15,
    unit: 'minutos',
    frequency: 'daily',
  },
  // Sueño
  {
    id: 'h_sleep',
    title: 'Dormir 8 horas',
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
    id: 'h_nap',
    title: 'Siesta reparadora',
    category: 'sleep',
    icon: 'bed',
    iconFamily: 'Ionicons',
    color: '#673AB7',
    goal: 20,
    unit: 'minutos',
    frequency: 'daily',
  },
  // Nutrición
  {
    id: 'h_fruits',
    title: 'Comer frutas',
    category: 'nutrition',
    icon: 'nutrition',
    iconFamily: 'Ionicons',
    color: '#4CAF50',
    goal: 3,
    unit: 'porciones',
    frequency: 'daily',
  },
  {
    id: 'h_veggies',
    title: 'Comer verduras',
    category: 'nutrition',
    icon: 'leaf',
    iconFamily: 'Ionicons',
    color: '#8BC34A',
    goal: 2,
    unit: 'porciones',
    frequency: 'daily',
  },
  {
    id: 'h_no_sugar',
    title: 'Evitar azúcar',
    category: 'nutrition',
    icon: 'close-circle',
    iconFamily: 'Ionicons',
    color: '#009688',
    goal: 1,
    unit: 'día',
    frequency: 'daily',
  },
  // Meditación
  {
    id: 'h_meditate',
    title: 'Meditar',
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
    id: 'h_breathe',
    title: 'Respiración consciente',
    category: 'meditation',
    icon: 'cloud',
    iconFamily: 'Ionicons',
    color: '#00BCD4',
    goal: 5,
    unit: 'minutos',
    frequency: 'daily',
  },
  {
    id: 'h_journal',
    title: 'Escribir diario',
    category: 'meditation',
    icon: 'journal',
    iconFamily: 'Ionicons',
    color: '#795548',
    goal: 1,
    unit: 'entrada',
    frequency: 'daily',
    reminderTime: '21:00',
  },
  // Salud femenina
  {
    id: 'h_cycle',
    title: 'Registrar ciclo',
    category: 'feminine',
    icon: 'heart',
    iconFamily: 'Ionicons',
    color: '#E91E8C',
    goal: 1,
    unit: 'registro',
    frequency: 'daily',
  },
  {
    id: 'h_selfcare',
    title: 'Autocuidado',
    category: 'feminine',
    icon: 'sparkles',
    iconFamily: 'Ionicons',
    color: '#F06292',
    goal: 15,
    unit: 'minutos',
    frequency: 'daily',
  },
];

// ─── Historial simulado de los últimos 7 días ─────────────────────────────────

function getDateStr(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
}

export const MOCK_WEEK_HISTORY: DayRecord[] = [
  { date: getDateStr(6), completed: 4, total: 5, habitIds: ['h_water', 'h_walk', 'h_sleep', 'h_meditate'] },
  { date: getDateStr(5), completed: 5, total: 5, habitIds: ['h_water', 'h_walk', 'h_sleep', 'h_meditate', 'h_fruits'] },
  { date: getDateStr(4), completed: 3, total: 5, habitIds: ['h_water', 'h_sleep', 'h_fruits'] },
  { date: getDateStr(3), completed: 5, total: 5, habitIds: ['h_water', 'h_walk', 'h_sleep', 'h_meditate', 'h_fruits'] },
  { date: getDateStr(2), completed: 2, total: 5, habitIds: ['h_water', 'h_meditate'] },
  { date: getDateStr(1), completed: 4, total: 5, habitIds: ['h_water', 'h_walk', 'h_sleep', 'h_fruits'] },
  { date: getDateStr(0), completed: 0, total: 5, habitIds: [] }, // hoy, empieza en 0
];

// ─── Datos de ciclo femenino simulados ────────────────────────────────────────

export const MOCK_FEMININE_DATA: FeminineCycleData = {
  lastPeriodStart: getDateStr(14),
  cycleLength: 28,
  currentPhase: 'ovulatory',
  symptoms: ['fatiga', 'sensibilidad'],
};

// ─── Información por fase del ciclo ──────────────────────────────────────────

export const CYCLE_PHASES = {
  menstrual: {
    label: 'Fase Menstrual',
    days: '1-5',
    color: '#E91E8C',
    lightColor: '#FCE4F3',
    icon: 'water',
    description: 'Tu cuerpo se renueva. Es momento de descanso y autocuidado.',
    recommendations: [
      'Descansa más de lo habitual',
      'Aplica calor en el abdomen',
      'Evita el ejercicio intenso',
      'Toma más hierro: espinacas, lentejas',
    ],
    energy: 2,   // 1-5
    mood: 2,
  },
  follicular: {
    label: 'Fase Folicular',
    days: '6-13',
    color: '#FF9800',
    lightColor: '#FFF3E0',
    icon: 'sunny',
    description: 'Energía en aumento. Ideal para nuevos proyectos y socializar.',
    recommendations: [
      'Aprovecha para ejercicio moderado',
      'Incluye proteínas y carbohidratos',
      'Es un buen momento para aprender cosas nuevas',
      'Hidrátate bien',
    ],
    energy: 4,
    mood: 4,
  },
  ovulatory: {
    label: 'Fase Ovulatoria',
    days: '14-16',
    color: '#4CAF50',
    lightColor: '#E8F5E9',
    icon: 'star',
    description: 'Pico de energía y sociabilidad. Tu momento más radiante.',
    recommendations: [
      'Haz tu entrenamiento más intenso',
      'Aprovecha reuniones importantes',
      'Incluye antioxidantes en tu dieta',
      'Cuida tu digestión',
    ],
    energy: 5,
    mood: 5,
  },
  luteal: {
    label: 'Fase Lútea',
    days: '17-28',
    color: '#9C27B0',
    lightColor: '#F3E5F5',
    icon: 'moon',
    description: 'Tu cuerpo se prepara. Momento de introspección y calma.',
    recommendations: [
      'Reduce cafeína y sal',
      'Yoga o ejercicio suave',
      'Aumenta el magnesio: nueces, chocolate negro',
      'Prioriza el descanso',
    ],
    energy: 3,
    mood: 3,
  },
} as const;

// ─── Categorías con metadata visual ──────────────────────────────────────────

export const CATEGORIES = {
  exercise: {
    label: 'Ejercicio',
    icon: 'fitness',
    iconFamily: 'Ionicons' as const,
    color: '#FF5722',
    lightColor: '#FBE9E7',
  },
  hydration: {
    label: 'Hidratación',
    icon: 'water',
    iconFamily: 'Ionicons' as const,
    color: '#2196F3',
    lightColor: '#E3F2FD',
  },
  sleep: {
    label: 'Sueño',
    icon: 'moon',
    iconFamily: 'Ionicons' as const,
    color: '#3F51B5',
    lightColor: '#E8EAF6',
  },
  nutrition: {
    label: 'Nutrición',
    icon: 'nutrition',
    iconFamily: 'Ionicons' as const,
    color: '#4CAF50',
    lightColor: '#E8F5E9',
  },
  meditation: {
    label: 'Meditación',
    icon: 'leaf',
    iconFamily: 'Ionicons' as const,
    color: '#9C27B0',
    lightColor: '#F3E5F5',
  },
  feminine: {
    label: 'Salud Femenina',
    icon: 'heart',
    iconFamily: 'Ionicons' as const,
    color: '#E91E8C',
    lightColor: '#FCE4F3',
  },
} as const;

// ─── Frases motivacionales ────────────────────────────────────────────────────

export const MOTIVATIONAL_QUOTES = [
  'Tu mejor versión se construye con lo que haces hoy.',
  'No necesitas hacerlo perfecto, necesitas empezar.',
  'Cada hábito saludable es una victoria contra tu antiguo yo.',
  'Hoy eliges cuidarte, mañana tu cuerpo te lo agradecerá.',
  'La disciplina de hoy será la energía de mañana.',
  'No estás cambiando tu rutina, estás transformando tu vida.',
  'Un pequeño avance diario crea resultados extraordinarios.',
];

export function getDailyQuote(): string {
  const day = new Date().getDay();
  return MOTIVATIONAL_QUOTES[day % MOTIVATIONAL_QUOTES.length];
}