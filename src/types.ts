export interface DailyRecord {
  date: string; // YYYY-MM-DD
  hygiene: 'Fácil' | 'Com Resistência' | 'Não Conseguiu' | '';
  symptomHalito: boolean;
  symptomGastro: boolean;
  symptomSeletividade: boolean;
  behavior: 'Calmo' | 'Agitado' | 'Crise/Meltdown' | '';
  intProbiotico: boolean;
  intXilitol: boolean;
  intMedicacao: boolean;
  notes?: string;
  updatedAt: number;
}

export type HygieneStatus = 'Fácil' | 'Com Resistência' | 'Não Conseguiu' | '';
export type BehaviorStatus = 'Calmo' | 'Agitado' | 'Crise/Meltdown' | '';
