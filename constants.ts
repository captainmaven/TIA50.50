
import { TTessDimension } from './types';

export const TTESS_DIMENSIONS: TTessDimension[] = [
  '2.1', '2.2', '2.3', '2.4', '2.5', '3.1', '3.2', '3.3'
];

export const TTESS_THRESHOLD = 3.5;
export const GROWTH_THRESHOLD = 50;

export const DIMENSION_LABELS: Record<TTessDimension, string> = {
  '2.1': 'Achieving Expectations',
  '2.2': 'Content Knowledge',
  '2.3': 'Communication',
  '2.4': 'Differentiation',
  '2.5': 'Monitor and Adjust',
  '3.1': 'Classroom Environment',
  '3.2': 'Managing Student Behavior',
  '3.3': 'Classroom Culture'
};
