
import React from 'react';

interface CardProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ title, children, icon }) => {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden mb-6">
      <div className="bg-r2-navy px-6 py-4 flex items-center gap-3">
        {icon && <span className="text-white">{icon}</span>}
        <h2 className="text-lg font-bold text-white uppercase tracking-wide">{title}</h2>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};
