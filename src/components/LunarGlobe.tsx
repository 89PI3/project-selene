import React from 'react';
import { LunarPhase } from '../types/astronomical';

interface LunarGlobeProps {
  lunarPhase: LunarPhase;
  className?: string;
}

export function LunarGlobe({ lunarPhase, className }: LunarGlobeProps) {
  // Create a simple 2D representation of the moon phase
  const getPhaseStyle = () => {
    const illumination = lunarPhase.illumination;
    const phase = lunarPhase.phase;
    
    // Determine if we're waxing or waning
    const isWaxing = phase < 0.5;
    
    return {
      background: `conic-gradient(from ${isWaxing ? '270deg' : '90deg'}, 
        #e2e8f0 0deg, 
        #e2e8f0 ${illumination * 3.6}deg, 
        #374151 ${illumination * 3.6}deg, 
        #374151 360deg)`,
    };
  };

  return (
    <div className={className}>
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg">
        <div className="relative">
          {/* Moon representation */}
          <div 
            className="w-48 h-48 rounded-full border-2 border-gray-600 shadow-2xl"
            style={getPhaseStyle()}
          >
            {/* Craters for visual detail */}
            <div className="absolute top-8 left-12 w-3 h-3 bg-gray-600 rounded-full opacity-60"></div>
            <div className="absolute top-16 right-16 w-2 h-2 bg-gray-600 rounded-full opacity-60"></div>
            <div className="absolute bottom-12 left-20 w-4 h-4 bg-gray-600 rounded-full opacity-60"></div>
            <div className="absolute bottom-20 right-12 w-2 h-2 bg-gray-600 rounded-full opacity-60"></div>
          </div>
          
          {/* Phase information overlay */}
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center">
            <p className="text-white text-sm font-medium">{lunarPhase.name}</p>
            <p className="text-gray-400 text-xs">{lunarPhase.illumination}% illuminated</p>
          </div>
        </div>
      </div>
    </div>
  );
}