"use client";

import { useEffect, useState } from "react";
import { Droplets, ThermometerSun, Activity } from "lucide-react";
import LargeCard from "../components/LargeCard";
import ClockDigitTimer from "../components/DigitalClock";
import HeatIndexCard from "../components/HeatIndexCard";
import HeatIndexIndicator from "../components/HeatIndexIndicator";
import HeatTimeSeriesChart from "../components/HeatTimeSeriesChart";
import PM25HourlyCard from "../components/PM25HourlyCard";
import useSensorDataforPm25 from "@/lib/useSensorForPm25";
import useMqttConfig from "@/lib/useMqttConfig";
import { calculateHeatIndex } from "@/lib/heatIndex";
import { motion } from "framer-motion";

const HeatMainContent = () => {
  const [isClient, setIsClient] = useState(false);
  const { mqttUrl } = useMqttConfig();
  const { sensorData, bgColorMain } = useSensorDataforPm25(mqttUrl);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const heatIndexResult = calculateHeatIndex(sensorData.temperature, sensorData.humidity);

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

  const heatIndexBgClass =
    heatIndexResult.bgColor === "bg-green-500"
      ? "bg-gradient-to-br from-green-400 to-green-600"
      : heatIndexResult.bgColor === "bg-yellow-500"
        ? "bg-gradient-to-br from-yellow-400 to-yellow-600"
        : heatIndexResult.bgColor === "bg-orange-500"
          ? "bg-gradient-to-br from-orange-400 to-orange-600"
          : heatIndexResult.bgColor === "bg-red-500"
            ? "bg-gradient-to-br from-red-400 to-red-600"
            : "bg-gradient-to-br from-green-400 to-green-600";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.33, 1, 0.68, 1] }
    }
  };

  return (
    <motion.div
      className="relative text-gray-150 p-6 md:p-10 flex-grow overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background gradient elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-white/40 to-transparent rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-40 left-10 w-72 h-72 bg-gradient-to-tr from-white/30 to-transparent rounded-full blur-3xl opacity-50" />
      </div>

      {/* Temperature Unit Toggle */}
      <motion.div
        className="relative z-10 flex justify-end gap-2 mb-6"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="
            bg-emerald-500 hover:bg-emerald-600
            rounded-full w-10 h-10 
            text-white font-bold text-lg
            shadow-lg shadow-emerald-500/30
            transition-colors
          "
        >
          °C
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="
            bg-white/20 hover:bg-white/30
            backdrop-blur-sm
            rounded-full w-10 h-10 
            text-white/80 font-bold text-lg
            border border-white/20
            transition-colors
          "
        >
          °F
        </motion.button>
      </motion.div>

      {/* Clock and Quick Stats */}
      <motion.div
        className="relative z-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5 mb-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          {isClient && <ClockDigitTimer />}
        </motion.div>

        <motion.div variants={itemVariants}>
          <LargeCard
            title="อุณหภูมิ"
            num={sensorData.temperature}
            desc="°C"
            bgColors={bgColorClass}
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
            title="ค่าดัชนีความร้อน"
            num={heatIndexResult.heatIndex}
            desc="°C"
            bgColors={heatIndexBgClass}
          >
            <div className="flex justify-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-full w-10 h-10 flex justify-center items-center shadow-lg">
                <Activity size={18} className="text-white" />
              </div>
            </div>
          </LargeCard>
        </motion.div>
      </motion.div>

      {/* PM 2.5 Hourly Section */}
      <motion.div
        className="relative z-10 my-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <h3 className="text-gray-100 text-xl md:text-2xl font-bold font-display">
            PM 2.5 รายชั่วโมง
          </h3>
          <div className="h-px flex-1 bg-gradient-to-r from-white/30 to-transparent max-w-32" />
        </div>

        <div className="max-w-lg mx-auto">
          <PM25HourlyCard />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default HeatMainContent;
