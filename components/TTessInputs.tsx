
import React from 'react';
import { TTESS_DIMENSIONS, DIMENSION_LABELS } from '../constants';
import { TTessDimension } from '../types';

interface TTessInputsProps {
  ratings: Record<TTessDimension, number>;
  onRatingChange: (dim: TTessDimension, val: number) => void;
}

export const TTessInputs: React.FC<TTessInputsProps> = ({ ratings, onRatingChange }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {TTESS_DIMENSIONS.map((dim) => (
        <div key={dim} className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-r2-navy">
            Dimension {dim}
            <span className="block text-[10px] text-gray-500 font-normal uppercase">{DIMENSION_LABELS[dim]}</span>
          </label>
          <input
            type="number"
            min="1"
            max="5"
            step="1"
            value={ratings[dim]}
            onChange={(e) => onRatingChange(dim, parseInt(e.target.value) || 1)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-r2-teal focus:outline-none text-r2-navy font-medium"
          />
        </div>
      ))}
    </div>
  );
};
