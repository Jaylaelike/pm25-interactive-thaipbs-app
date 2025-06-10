"use client";

import { HeatIndexLevel } from "@/lib/heatIndex";

interface HeatIndexIndicatorProps {
  currentLevel?: HeatIndexLevel;
  className?: string;
}

const HeatIndexIndicator: React.FC<HeatIndexIndicatorProps> = ({
  currentLevel,
  className = "",
}) => {
  const levels = [
    {
      level: HeatIndexLevel.NORMAL,
      text: "ปกติ (Normal)",
      range: "< 32°C",
      bgColor: "bg-green-500",
      isActive: currentLevel === HeatIndexLevel.NORMAL,
    },
    {
      level: HeatIndexLevel.CAUTION,
      text: "ระวัง (Caution)",
      range: "32-40°C",
      bgColor: "bg-yellow-500",
      isActive: currentLevel === HeatIndexLevel.CAUTION,
    },
    {
      level: HeatIndexLevel.DANGER,
      text: "อันตราย (Danger)",
      range: "40-52°C",
      bgColor: "bg-orange-500",
      isActive: currentLevel === HeatIndexLevel.DANGER,
    },
    {
      level: HeatIndexLevel.EXTREME,
      text: "อันตรายมาก (Extreme)",
      range: "> 52°C",
      bgColor: "bg-red-500",
      isActive: currentLevel === HeatIndexLevel.EXTREME,
    },
  ];

  return (
    <div className={`p-6 ${className}`}>
      <div className="flex flex-col items-center justify-center">
        <h3 className="text-gray-150 text-xl font-bold mb-4 text-center">
          Heat Index Risk Levels
        </h3>
        
        {/* Desktop Grid Layout */}
        <div className="hidden md:grid md:grid-cols-4 w-full max-w-4xl h-16 rounded-full overflow-hidden shadow-lg">
          {levels.map((level, index) => (
            <div
              key={level.level}
              className={`
                ${level.bgColor} 
                text-white 
                flex flex-col items-center justify-center 
                px-3 py-2 
                text-center 
                transition-all duration-300
                ${level.isActive ? 'ring-4 ring-white/50 scale-105' : ''}
                ${index === 0 ? 'rounded-l-full' : ''}
                ${index === levels.length - 1 ? 'rounded-r-full' : ''}
              `}
            >
              <span className="text-xs font-semibold leading-tight">
                {level.text}
              </span>
              <span className="text-xs opacity-90 leading-tight">
                {level.range}
              </span>
            </div>
          ))}
        </div>

        {/* Mobile Stack Layout */}
        <div className="md:hidden w-full max-w-sm space-y-2">
          {levels.map((level) => (
            <div
              key={level.level}
              className={`
                ${level.bgColor} 
                text-white 
                flex justify-between items-center 
                px-4 py-3 
                rounded-full 
                transition-all duration-300
                ${level.isActive ? 'ring-4 ring-white/50 scale-102' : ''}
              `}
            >
              <span className="text-sm font-semibold">
                {level.text}
              </span>
              <span className="text-sm opacity-90">
                {level.range}
              </span>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-4 text-center">
          <p className="text-gray-400 text-sm">
            ค่าดัชนีความร้อน (Heat Index) แสดงความรู้สึกร้อนจากอุณหภูมิและความชื้น
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeatIndexIndicator;
