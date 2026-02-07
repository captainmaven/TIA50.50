
import React from 'react';
import { ClassData } from '../types';

interface GrowthInputsProps {
  classes: ClassData[];
  onAddClass: () => void;
  onRemoveClass: (id: string) => void;
  onUpdateClass: (id: string, field: 'size' | 'met', val: number) => void;
}

export const GrowthInputs: React.FC<GrowthInputsProps> = ({ classes, onAddClass, onRemoveClass, onUpdateClass }) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-2 text-xs font-bold text-r2-navy uppercase">Class / Period</th>
              <th className="py-2 text-xs font-bold text-r2-navy uppercase">Class Size</th>
              <th className="py-2 text-xs font-bold text-r2-navy uppercase">Students Met Growth</th>
              <th className="py-2 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {classes.map((cls, idx) => (
              <tr key={cls.id}>
                <td className="py-3 text-sm font-medium text-gray-600">Period {idx + 1}</td>
                <td className="py-3">
                  <input
                    type="number"
                    min="0"
                    value={cls.size}
                    onChange={(e) => onUpdateClass(cls.id, 'size', parseInt(e.target.value) || 0)}
                    className="w-20 border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-1 focus:ring-r2-teal outline-none"
                  />
                </td>
                <td className="py-3">
                  <input
                    type="number"
                    min="0"
                    max={cls.size}
                    value={cls.met}
                    onChange={(e) => onUpdateClass(cls.id, 'met', parseInt(e.target.value) || 0)}
                    className="w-20 border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-1 focus:ring-r2-teal outline-none"
                  />
                </td>
                <td className="py-3 text-right">
                  {classes.length > 1 && (
                    <button
                      onClick={() => onRemoveClass(cls.id)}
                      className="text-r2-red hover:bg-red-50 p-1 rounded transition-colors"
                      title="Remove Class"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        onClick={onAddClass}
        className="flex items-center justify-center gap-2 border-2 border-dashed border-r2-teal text-r2-teal py-2 rounded-md font-bold hover:bg-teal-50 transition-colors mt-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
        Add Class
      </button>
    </div>
  );
};
