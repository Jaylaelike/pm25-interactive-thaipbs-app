"use client";

import { Activity, AlertTriangle, Shield, Thermometer } from "lucide-react";
import { calculateHeatIndex, HeatIndexLevel } from "@/lib/heatIndex";

interface HeatIndexCardProps {
  temperature: number;
  humidity: number;
  className?: string;
}

const HeatIndexCard: React.FC<HeatIndexCardProps> = ({
  temperature,
  humidity,
  className = "",
}) => {
  const heatIndexResult = calculateHeatIndex(temperature, humidity);

  const getIcon = () => {
    switch (heatIndexResult.level) {
      case HeatIndexLevel.NORMAL:
        return <Shield size={20} className="text-white" />;
      case HeatIndexLevel.CAUTION:
        return <Activity size={20} className="text-white" />;
      case HeatIndexLevel.DANGER:
        return <AlertTriangle size={20} className="text-white" />;
      case HeatIndexLevel.EXTREME:
        return <Thermometer size={20} className="text-white" />;
      default:
        return <Thermometer size={20} className="text-white" />;
    }
  };

  const getGradient = () => {
    switch (heatIndexResult.level) {
      case HeatIndexLevel.NORMAL:
        return "from-green-400 to-green-600";
      case HeatIndexLevel.CAUTION:
        return "from-yellow-400 to-yellow-600";
      case HeatIndexLevel.DANGER:
        return "from-orange-400 to-orange-600";
      case HeatIndexLevel.EXTREME:
        return "from-red-400 to-red-600";
      default:
        return "from-green-400 to-green-600";
    }
  };

  return (
    <div
      className={`bg-gradient-to-br ${getGradient()} py-7 px-10 flex flex-col items-center justify-between space-y-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between w-full">
        <p className="text-white font-medium text-lg">Heat Index</p>
        <div className="bg-white/20 rounded-full w-10 h-10 flex justify-center items-center backdrop-blur-sm">
          {getIcon()}
        </div>
      </div>

      {/* Main Value */}
      <div className="text-center">
        <h2 className="text-6xl font-bold text-white mb-2">
          {heatIndexResult.heatIndex}
          <span className="text-3xl font-normal">°C</span>
        </h2>
        
        {/* Status Badge */}
        <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-3">
          <span className="text-white font-medium text-sm">
            {heatIndexResult.levelText}
          </span>
        </div>
      </div>

      {/* Input Values Display */}
      <div className="flex justify-between w-full text-white/80 text-sm">
        <div className="text-center">
          <p className="font-medium">Temperature</p>
          <p className="text-lg font-bold">{temperature}°C</p>
        </div>
        <div className="text-center">
          <p className="font-medium">Humidity</p>
          <p className="text-lg font-bold">{humidity}%</p>
        </div>
      </div>

      {/* Recommendation */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 w-full">
        <p className="text-white text-sm text-center leading-relaxed">
          {heatIndexResult.recommendation}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full bg-white transition-all duration-500 ease-out`}
          style={{
            width: `${Math.min((heatIndexResult.heatIndex / 60) * 100, 100)}%`,
          }}
        />
      </div>
    </div>
  );
};

export default HeatIndexCard;
