"use client";

import IndicatorBar from "./IndicatorBar";
import LargeCard from "./LargeCard";
import { useEffect, useState } from "react";
import ClockDigitTimer from "./DigitalClock";
import useSensorDataforPm25 from "@/lib/useSensorForPm25";
import useMqttConfig from "@/lib/useMqttConfig";
import { Droplets, ThermometerSun, Smile, Wind } from "lucide-react";
import { motion } from "framer-motion";

const MainContent = () => {
  const [isClient, setIsClient] = useState(false);
  const { mqttUrl } = useMqttConfig();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const calculateAQI = (pm25: number): number => {
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
      ? "bg-gradient-to-br from-blue-400 to-blue-600"
      : bgColorMain === "#2ecc71"
        ? "bg-gradient-to-br from-emerald-400 to-emerald-600"
        : bgColorMain === "#f1c40f"
          ? "bg-gradient-to-br from-yellow-400 to-yellow-600"
          : bgColorMain === "#e3901b"
            ? "bg-gradient-to-br from-orange-400 to-orange-600"
            : bgColorMain === "#ef4444"
              ? "bg-gradient-to-br from-red-400 to-red-600"
              : "bg-gradient-to-br from-emerald-400 to-emerald-600";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      className="relative text-gray-150 p-6 md:p-10 flex-grow overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background gradient mesh */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-white/40 to-transparent rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-gradient-to-tr from-white/30 to-transparent rounded-full blur-3xl opacity-50" />
      </div>

      {/* Clock Section */}
      <motion.div
        className="relative z-10 flex justify-center md:justify-start mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {isClient && <ClockDigitTimer />}
      </motion.div>

      {/* Today's Highlights Section */}
      <motion.div
        className="relative z-10 my-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="flex items-center gap-3 mb-6"
          variants={itemVariants}
        >
          <h3 className="text-gray-100 text-xl md:text-2xl font-bold font-display">
            Today&apos;s Highlights
          </h3>
          <div className="h-px flex-1 bg-gradient-to-r from-white/30 to-transparent max-w-32" />
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <LargeCard
              title="PM10"
              num={sensorData.pm10}
              desc="µg/m³"
              bgColors={bgColorClass}
            >
              <div className="flex justify-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-full w-10 h-10 flex justify-center items-center shadow-lg">
                  <Wind size={18} className="text-white" />
                </div>
              </div>
            </LargeCard>
          </motion.div>

          <motion.div variants={itemVariants}>
            <LargeCard
              title="ความชื้นสัมพัทธ์"
              num={sensorData.humidity}
              desc="%"
              bgColors={bgColorClass}
            >
              <div className="flex justify-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-full w-10 h-10 flex justify-center items-center shadow-lg">
                  <Droplets size={18} className="text-white" />
                </div>
              </div>
            </LargeCard>
          </motion.div>

          <motion.div variants={itemVariants}>
            <LargeCard
              title="Temperature"
              num={sensorData.temperature}
              bgColors={bgColorClass}
              desc="°C"
            >
              <div className="flex justify-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-full w-10 h-10 flex justify-center items-center shadow-lg">
                  <ThermometerSun size={18} className="text-white" />
                </div>
              </div>
            </LargeCard>
          </motion.div>

          <motion.div variants={itemVariants}>
            <LargeCard
              title="AQI"
              num={calculateAQI(sensorData.pm2_5)}
              desc=""
              bgColors={bgColorClass}
            >
              <div className="flex justify-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-full w-10 h-10 flex justify-center items-center shadow-lg">
                  <Smile size={18} className="text-white" />
                </div>
              </div>
            </LargeCard>
          </motion.div>
        </motion.div>

        {/* Indicator Bar */}
        <motion.div
          className="mt-6"
          variants={itemVariants}
        >
          <IndicatorBar />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default MainContent;
