
export interface ClassData {
  id: string;
  size: number;
  met: number;
}

export type TTessDimension = '2.1' | '2.2' | '2.3' | '2.4' | '2.5' | '3.1' | '3.2' | '3.3';

export interface CalculatedResults {
  ttessAvg: number;
  growthPct: number;
  totalPoints: number;
  designation: string;
  meetsTTessThreshold: boolean;
  meetsGrowthThreshold: boolean;
  overallEligible: boolean;
}

export enum DesignationLevel {
  MASTER = 'Master',
  EXEMPLARY = 'Exemplary',
  RECOGNIZED = 'Recognized',
  NONE = 'No Designation'
}
