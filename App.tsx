
import React, { useState, useCallback } from 'react';
import { TTessInputs } from './components/TTessInputs';
import { GrowthInputs } from './components/GrowthInputs';
import { ResultsDisplay } from './components/ResultsDisplay';
import { Card } from './components/Card';
import { ClassData, TTessDimension, CalculatedResults, DesignationLevel } from './types';
import { TTESS_DIMENSIONS, TTESS_THRESHOLD, GROWTH_THRESHOLD } from './constants';

function App() {
  // State for T-TESS
  const [ttessRatings, setTtessRatings] = useState<Record<TTessDimension, number>>({
    '2.1': 3, '2.2': 3, '2.3': 3, '2.4': 3,
    '2.5': 3, '3.1': 3, '3.2': 3, '3.3': 3,
  });

  // State for Classes
  const [classes, setClasses] = useState<ClassData[]>([
    { id: '1', size: 25, met: 18 }
  ]);

  // Results State
  const [results, setResults] = useState<CalculatedResults | null>(null);

  const handleRatingChange = (dim: TTessDimension, val: number) => {
    setTtessRatings(prev => ({ ...prev, [dim]: Math.max(1, Math.min(5, val)) }));
  };

  const handleAddClass = () => {
    setClasses(prev => [...prev, { id: Math.random().toString(36).substr(2, 9), size: 0, met: 0 }]);
  };

  const handleRemoveClass = (id: string) => {
    setClasses(prev => prev.filter(c => c.id !== id));
  };

  const handleUpdateClass = (id: string, field: 'size' | 'met', val: number) => {
    setClasses(prev => prev.map(c => {
      if (c.id === id) {
        const newVal = Math.max(0, val);
        if (field === 'met') return { ...c, met: Math.min(c.size, newVal) };
        return { ...c, size: newVal };
      }
      return c;
    }));
  };

  const calculateTIA = useCallback(() => {
    // 1. Calculate T-TESS Avg
    const ttessSum = TTESS_DIMENSIONS.reduce((acc, dim) => acc + ttessRatings[dim], 0);
    const ttessAvg = ttessSum / TTESS_DIMENSIONS.length;

    // 2. Calculate Student Growth %
    const totalStudents = classes.reduce((acc, c) => acc + c.size, 0);
    const totalMet = classes.reduce((acc, c) => acc + c.met, 0);
    const growthPct = totalStudents > 0 ? (totalMet / totalStudents) * 100 : 0;

    // 3. Weighting Logic (50/50)
    const weightedTTess = (ttessAvg / 5) * 50;
    const weightedGrowth = (growthPct / 100) * 50;
    const totalPoints = weightedTTess + weightedGrowth;

    // 4. Multi-tier Designation logic
    let designation = DesignationLevel.NONE;
    
    // Master: 4.5 T-TESS, 70% Growth, 90 Points
    if (totalPoints >= 90 && ttessAvg >= 4.5 && growthPct >= 70) {
      designation = DesignationLevel.MASTER;
    } 
    // Exemplary: 3.9 T-TESS, 60% Growth, 78 Points
    else if (totalPoints >= 78 && ttessAvg >= 3.9 && growthPct >= 60) {
      designation = DesignationLevel.EXEMPLARY;
    }
    // Recognized: 3.7 T-TESS, 55% Growth, 74 Points
    else if (totalPoints >= 74 && ttessAvg >= 3.7 && growthPct >= 55) {
      designation = DesignationLevel.RECOGNIZED;
    }
    // Acknowledged: 3.5 T-TESS, 50% Growth, 70 Points
    else if (totalPoints >= 70 && ttessAvg >= 3.5 && growthPct >= 50) {
      designation = DesignationLevel.ACKNOWLEDGED;
    }

    // Eligibility Check for base level
    const meetsTTessThreshold = ttessAvg >= TTESS_THRESHOLD;
    const meetsGrowthThreshold = growthPct >= GROWTH_THRESHOLD;
    const overallEligible = meetsTTessThreshold && meetsGrowthThreshold && designation !== DesignationLevel.NONE;

    setResults({
      ttessAvg,
      growthPct,
      totalPoints,
      designation,
      meetsTTessThreshold,
      meetsGrowthThreshold,
      overallEligible
    });
  }, [ttessRatings, classes]);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Header */}
      <header className="bg-r2-navy shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center sm:text-left">
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl tracking-tight">
            Teacher Incentive Allotment (TIA) Calculator
          </h1>
          <p className="mt-2 text-lg text-r2-teal font-medium opacity-90">
            Calculate your TIA designation based on T-TESS ratings and student growth data (50/50)
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Inputs */}
          <div className="lg:col-span-7 space-y-6">
            <Card 
              title="T-TESS Ratings" 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            >
              <p className="text-sm text-gray-500 mb-6">Enter whole number ratings (1-5) for each dimension below.</p>
              <TTessInputs ratings={ttessRatings} onRatingChange={handleRatingChange} />
            </Card>

            <Card 
              title="Student Growth Data"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              }
            >
              <p className="text-sm text-gray-500 mb-6">Add your class rosters to calculate the aggregate growth percentage.</p>
              <GrowthInputs 
                classes={classes} 
                onAddClass={handleAddClass} 
                onRemoveClass={handleRemoveClass} 
                onUpdateClass={handleUpdateClass}
              />
            </Card>

            <button
              onClick={calculateTIA}
              className="w-full bg-r2-teal text-white py-4 rounded-lg font-black text-xl shadow-lg hover:bg-[#188C98] active:transform active:scale-[0.98] transition-all flex items-center justify-center gap-3 uppercase tracking-widest"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Calculate My Designation
            </button>
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-5">
            <div className="sticky top-10">
              <Card 
                title="Designation Status"
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                }
              >
                <ResultsDisplay results={results} />
              </Card>

              {/* Information / Legend Section */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h4 className="text-xs font-bold text-r2-navy uppercase mb-4 tracking-wider">Scoring Reference</h4>
                <div className="space-y-4">
                  {/* Designation Levels */}
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b pb-1">Designation Thresholds</p>
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex flex-col">
                        <span className="font-bold text-r2-teal">Master</span>
                        <span className="text-[10px] text-gray-400">T-TESS 4.5 | Growth 70%</span>
                      </div>
                      <span className="text-gray-600 font-bold">90+ pts</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex flex-col">
                        <span className="font-bold text-blue-600">Exemplary</span>
                        <span className="text-[10px] text-gray-400">T-TESS 3.9 | Growth 60%</span>
                      </div>
                      <span className="text-gray-600 font-bold">78+ pts</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex flex-col">
                        <span className="font-bold text-indigo-500">Recognized</span>
                        <span className="text-[10px] text-gray-400">T-TESS 3.7 | Growth 55%</span>
                      </div>
                      <span className="text-gray-600 font-bold">74+ pts</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex flex-col">
                        <span className="font-bold text-emerald-600">Acknowledged</span>
                        <span className="text-[10px] text-gray-400">T-TESS 3.5 | Growth 50%</span>
                      </div>
                      <span className="text-gray-600 font-bold">70+ pts</span>
                    </div>
                  </div>

                  {/* Eligibility Requirements */}
                  <div className="space-y-2 pt-2">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b pb-1">Eligibility Requirements</p>
                    <div className="flex justify-between items-start text-xs">
                      <div className="flex flex-col">
                        <span className="font-bold text-r2-navy">T-TESS Composite Score</span>
                        <span className="text-[10px] text-r2-red italic font-medium">Minimum score of 3.5 required</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-start text-xs pt-1">
                      <div className="flex flex-col">
                        <span className="font-bold text-r2-navy">Student Growth Percentage</span>
                        <span className="text-[10px] text-r2-red italic font-medium">Minimum score of 50% required</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Brand Logo Placement: Bottom Right above Footer */}
        <div className="flex justify-end mt-12 pb-4">
          <img 
            src="https://ik.imagekit.io/5xjaa8m0p/esc2.png" 
            alt="Region 2 Logo" 
            className="h-20 md:h-24 object-contain opacity-90"
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-r2-navy py-10 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-white/60 text-sm font-medium">
            &copy; {new Date().getFullYear()} Region 2 Education Service Center. 
            <span className="block mt-1">Provided as a planning tool for Texas teachers. Estimated results only.</span>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
