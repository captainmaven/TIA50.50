
import React from 'react';
import { CalculatedResults, DesignationLevel } from '../types';
import { TTESS_THRESHOLD, GROWTH_THRESHOLD } from '../constants';

interface ResultsDisplayProps {
  results: CalculatedResults | null;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results }) => {
  if (!results) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400 bg-white rounded-lg border-2 border-dashed border-gray-200 p-8 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
        <p className="text-lg font-medium">Input your data and click <span className="text-r2-teal font-bold italic">"CALCULATE MY DESIGNATION"</span> to see your estimated TIA Designation status.</p>
      </div>
    );
  }

  const getDesignationColor = (level: string) => {
    switch (level) {
      case DesignationLevel.MASTER: return 'bg-r2-teal text-white';
      case DesignationLevel.EXEMPLARY: return 'bg-blue-600 text-white';
      case DesignationLevel.RECOGNIZED: return 'bg-indigo-500 text-white';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className={`p-8 rounded-lg text-center ${getDesignationColor(results.designation)} shadow-inner`}>
        <p className="text-sm font-bold uppercase tracking-widest opacity-90 mb-1">Estimated Designation</p>
        <h3 className="text-4xl font-black mb-2">{results.designation}</h3>
        {!results.overallEligible && (
          <p className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full inline-block mt-2">
             Eligibility Thresholds Not Met
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-xs font-bold text-gray-500 uppercase mb-1">T-TESS Composite</p>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-bold text-r2-navy">{results.ttessAvg.toFixed(2)}</span>
            <span className={`text-xs font-bold px-2 py-1 rounded ${results.meetsTTessThreshold ? 'text-r2-teal bg-teal-50' : 'text-r2-red bg-red-50'}`}>
              Min: {TTESS_THRESHOLD}
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-xs font-bold text-gray-500 uppercase mb-1">Growth Percentage</p>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-bold text-r2-navy">{Math.round(results.growthPct)}%</span>
            <span className={`text-xs font-bold px-2 py-1 rounded ${results.meetsGrowthThreshold ? 'text-r2-teal bg-teal-50' : 'text-r2-red bg-red-50'}`}>
              Min: {GROWTH_THRESHOLD}%
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <p className="text-xs font-bold text-gray-500 uppercase mb-4 text-center">Weighted Score Summary (50/50 Model)</p>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">Weighted T-TESS Score (Max 50)</span>
          <span className="text-sm font-bold text-r2-navy">{(results.ttessAvg / 5 * 50).toFixed(1)}</span>
        </div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-gray-600">Weighted Growth Score (Max 50)</span>
          <span className="text-sm font-bold text-r2-navy">{(results.growthPct / 100 * 50).toFixed(1)}</span>
        </div>
        <div className="border-t pt-4 flex items-center justify-between">
          <span className="text-base font-bold text-r2-navy uppercase">Total TIA Points</span>
          <span className="text-2xl font-black text-r2-teal">{Math.round(results.totalPoints)}</span>
        </div>
      </div>

      {!results.overallEligible && (
        <div className="bg-red-50 border border-r2-red p-4 rounded-lg flex items-start gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-r2-red flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <h4 className="text-r2-red font-bold text-sm">Designation Requirements Not Met</h4>
            <p className="text-xs text-red-700 mt-1">
              To be eligible for a TIA designation, you must meet the minimum threshold of {TTESS_THRESHOLD} on T-TESS composite and {GROWTH_THRESHOLD}% on Student Growth.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
