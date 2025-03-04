"use client";

import IndicatorBar from "./IndicatorBar";
import LargeCard from "./LargeCard";
import { useEffect, useState } from "react";
import ClockDigitTimer from "./DigitalClock";
import useSensorDataforPm25 from "@/lib/useSensorForPm25";
import useMqttConfig from "@/lib/useMqttConfig";
import { Droplets, ThermometerSun, Smile } from "lucide-react";

const MainContent = () => {
  const [isClient, setIsClient] = useState(false);
  const { mqttUrl } = useMqttConfig();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const calculateAQI = (pm25: number): number => {
    // AQI breakpoints for PM2.5
    if (pm25 <= 12.0) {
      return Math.round(((50 - 0) / (12.0 - 0)) * (pm25 - 0) + 0);
    } else if (pm25 <= 35.4) {
      return Math.round(((100 - 51) / (35.4 - 12.1)) * (pm25 - 12.1) + 51);
    } else if (pm25 <= 55.4) {
      return Math.round(((150 - 101) / (55.4 - 35.5)) * (pm25 - 35.5) + 101);
    } else if (pm25 <= 150.4) {
      return Math.round(((200 - 151) / (150.4 - 55.5)) * (pm25 - 55.5) + 151);
    } else if (pm25 <= 250.4) {
      return Math.round(((300 - 201) / (250.4 - 150.5)) * (pm25 - 150.5) + 201);
    } else if (pm25 <= 350.4) {
      return Math.round(((400 - 301) / (350.4 - 250.5)) * (pm25 - 250.5) + 301);
    } else {
      return Math.round(((500 - 401) / (500.4 - 350.5)) * (pm25 - 350.5) + 401);
    }
  };

  const { sensorData, bgColorMain } = useSensorDataforPm25(mqttUrl);

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
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 my-5 gap-5 justify-center">
        {isClient ? <ClockDigitTimer /> : null}
      </div>

      <div className="my-5">
        <h3 className="text-gray-350 text-2xl font-bold mb-5">
          Todays Highlights
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 justify-center">
          <LargeCard
            title="PM10"
            num={sensorData.pm10}
            desc="µg/m³"
            bgColors={bgColorClass}
          >
            <div className="flex justify-between space-x-5 items-center">
              <div className="bg-gray-500 rounded-full w-[30px] h-[30px] flex justify-center items-center">
                <i className="fas fa-smog"></i>
              </div>
              <p className="text-gray-150 text-sm"></p>
            </div>{" "}
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
              <p className="text-gray-150 text-sm"></p>
            </div>{" "}
          </LargeCard>

          <LargeCard
            title="Temperature"
            num={sensorData.temperature}
            bgColors={bgColorClass}
            desc=" C"
          >
            <div className="flex justify-between space-x-5 items-center">
              <div className="bg-red-500 rounded-full w-[30px] h-[30px] flex justify-center items-center">
                <ThermometerSun size={16} className="text-white" />
              </div>
              <p className="text-gray-150 text-sm"></p>
            </div>{" "}
          </LargeCard>

          <LargeCard
            title="AQI"
            num={calculateAQI(sensorData.pm2_5)}
            desc=""
            bgColors={bgColorClass}
          >
            <div className="flex justify-between space-x-5 items-center">
              <div className="bg-green-500 rounded-full w-[30px] h-[30px] flex justify-center items-center">
                <Smile size={16} className="text-white" />
              </div>
              <p className="text-gray-150 text-sm"></p>
            </div>{" "}
          </LargeCard>
        </div>
        <div>
          <IndicatorBar />
        </div>
      </div>
    </div>
  );
};

export default MainContent;
