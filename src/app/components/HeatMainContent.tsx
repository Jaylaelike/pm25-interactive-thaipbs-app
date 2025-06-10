"use client";

import { useEffect, useState } from "react";
import { Droplets, ThermometerSun, Activity } from "lucide-react";
import LargeCard from "../components/LargeCard";
import ClockDigitTimer from "../components/DigitalClock";
import HeatIndexCard from "../components/HeatIndexCard";
import HeatIndexIndicator from "../components/HeatIndexIndicator";
import useSensorDataforPm25 from "@/lib/useSensorForPm25";
import useMqttConfig from "@/lib/useMqttConfig";
import { calculateHeatIndex } from "@/lib/heatIndex";

const HeatMainContent = () => {
  const [isClient, setIsClient] = useState(false);
  const { mqttUrl } = useMqttConfig();
  const { sensorData, bgColorMain } = useSensorDataforPm25(mqttUrl);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Calculate heat index
  const heatIndexResult = calculateHeatIndex(sensorData.temperature, sensorData.humidity);

  const bgColorClass =
    bgColorMain === "#3b82f6"
      ? "bg-[#3b82f6]"
      : bgColorMain === "#2ecc71"
      ? "bg-[#2ecc71]"
      : bgColorMain === "#f1c40f"
      ? "bg-[#f1c40f]"
      : bgColorMain === "#e3901b"
      ? "bg-[#e3901b]"
      : bgColorMain === "#ef4444"
      ? "bg-[#ef4444]"
      : "bg-[#2ecc71]";

  return (
    <div className="text-gray-150 p-10 flex-grow pt-0">
      {/* Temperature Unit Toggle */}
      <div className="space-x-3 text-right mb-8">
        <button className="bg-[#2ECC71] rounded-full w-10 h-10 text-gray-100 font-bold text-xl">
          &deg;C
        </button>
        <button className="bg-gray-150 rounded-full w-10 h-10 text-darkblue font-bold text-xl">
          &deg;F
        </button>
      </div>

      {/* Clock and Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 my-5 gap-5 justify-center">
        {isClient ? <ClockDigitTimer /> : null}

        {/* Quick stats cards */}
        <LargeCard
          title="อุณหภูมิ"
          num={sensorData.temperature}
          desc="°C"
          bgColors={bgColorClass}
        >
          <div className="flex justify-between space-x-5 items-center">
            <div className="bg-red-500 rounded-full w-[30px] h-[30px] flex justify-center items-center">
              <ThermometerSun size={16} className="text-white" />
            </div>
          </div>
        </LargeCard>

        <LargeCard
          title="ความชื้นสัมพัทธ์"
          num={sensorData.humidity}
          desc="%"
          bgColors={bgColorClass}
        >
          <div className="flex justify-between space-x-5 items-center">
            <div className="bg-blue-500 rounded-full w-[30px] h-[30px] flex justify-center items-center">
              <Droplets size={16} className="text-white" />
            </div>
          </div>
        </LargeCard>

        <LargeCard
          title="ค่าดัชนีความร้อน"
          num={heatIndexResult.heatIndex}
          desc="°C"
          bgColors={heatIndexResult.bgColor}
        >
          <div className="flex justify-between space-x-5 items-center">
            <div className="bg-orange-500 rounded-full w-[30px] h-[30px] flex justify-center items-center">
              <Activity size={16} className="text-white" />
            </div>
          </div>
        </LargeCard>
      </div>

      {/* Main Heat Index Section */}
      <div className="my-8">
        <h3 className="text-gray-350 text-3xl font-bold mb-6 text-center">
          Heat Index Monitor
        </h3>

        {/* Heat Index Card */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="lg:col-span-1">
            <HeatIndexCard
              temperature={sensorData.temperature}
              humidity={sensorData.humidity}
              className="h-full"
            />
          </div>

          {/* Additional Information Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Current Status */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h4 className="text-xl font-bold text-gray-150 mb-4 flex items-center">
                <Activity className="mr-2" size={20} />
                สถานะปัจจุบัน
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">ระดับความเสี่ยง:</span>
                  <span className={`font-semibold px-3 py-1 rounded-full text-sm ${heatIndexResult.bgColor} text-white`}>
                    {heatIndexResult.levelText}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Heat Index:</span>
                  <span className="text-white font-bold">{heatIndexResult.heatIndex}°C</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">อุณหภูมิ:</span>
                  <span className="text-white font-bold">{sensorData.temperature}°C</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">ความชื้น:</span>
                  <span className="text-white font-bold">{sensorData.humidity}%</span>
                </div>
              </div>
            </div>

            {/* Health Recommendations */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h4 className="text-xl font-bold text-gray-150 mb-4">
                คำแนะนำด้านสุขภาพ
              </h4>
              <p className="text-gray-200 leading-relaxed">
                {heatIndexResult.recommendation}
              </p>
            </div>

            {/* Heat Index Formula Info */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h4 className="text-xl font-bold text-gray-150 mb-4">
                เกี่ยวกับ Heat Index
              </h4>
              <p className="text-gray-200 text-sm leading-relaxed">
                Heat Index คือค่าที่แสดงความรู้สึกร้อนของร่างกายมนุษย์ 
                เมื่อรวมปัจจัยของอุณหภูมิและความชื้นสัมพัทธ์เข้าด้วยกัน 
                ค่านี้จะช่วยประเมินความเสี่ยงต่อการเกิดโรคที่เกี่ยวข้องกับความร้อน
              </p>
            </div>
          </div>
        </div>

        {/* Heat Index Level Indicator */}
        <HeatIndexIndicator 
          currentLevel={heatIndexResult.level}
          className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10"
        />
      </div>

      {/* Historical Data or Trends Section */}
      
      
      
    </div>
  );
};

export default HeatMainContent;
