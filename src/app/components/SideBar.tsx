"use client";

import SearchLocation from "./SearchLocation";
import { useEffect, useState } from "react";
import useMqttConfig from "@/lib/useMqttConfig";
import useSensorDataforPm25 from "@/lib/useSensorForPm25";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Calendar } from "lucide-react";

interface Propstype {
  bgColors: string;
}

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const SideBar = ({ bgColors }: Propstype) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { mqttUrl, location } = useMqttConfig();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { sensorData, bgColorMain } = useSensorDataforPm25(mqttUrl);

  const getHappinessIcon = (pm25Level: number) => {
    if (pm25Level <= 15) return `${basePath}/images/happiness/very-happy.png`;
    if (pm25Level <= 25) return `${basePath}/images/happiness/happy.png`;
    if (pm25Level <= 37.5) return `${basePath}/images/happiness/neutral.png`;
    if (pm25Level <= 75) return `${basePath}/images/happiness/sad.png`;
    return `${basePath}/images/happiness/very-sad.png`;
  };

  const getGlowColor = (pm25Level: number) => {
    if (pm25Level <= 25) return "shadow-cyan-500/50";
    if (pm25Level <= 37) return "shadow-emerald-500/50";
    if (pm25Level <= 50) return "shadow-yellow-500/50";
    if (pm25Level <= 90) return "shadow-orange-500/50";
    if (pm25Level <= 150) return "shadow-red-500/50";
    return "shadow-purple-500/50";
  };

  // Get gradient colors based on PM2.5 level
  const getGradientStyle = (pm25Level: number) => {
    if (pm25Level <= 25) {
      return {
        background: "linear-gradient(180deg, #0891b2 0%, #0e7490 50%, #155e75 100%)",
      };
    }
    if (pm25Level <= 37) {
      return {
        background: "linear-gradient(180deg, #10b981 0%, #059669 50%, #047857 100%)",
      };
    }
    if (pm25Level <= 50) {
      return {
        background: "linear-gradient(180deg, #eab308 0%, #ca8a04 50%, #a16207 100%)",
      };
    }
    if (pm25Level <= 90) {
      return {
        background: "linear-gradient(180deg, #f97316 0%, #ea580c 50%, #c2410c 100%)",
      };
    }
    if (pm25Level <= 150) {
      return {
        background: "linear-gradient(180deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%)",
      };
    }
    return {
      background: "linear-gradient(180deg, #8b5cf6 0%, #7c3aed 50%, #6d28d9 100%)",
    };
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
      className="relative flex flex-col min-h-screen w-full lg:w-1/3 p-7 lg:p-4 xl:p-7 space-y-8 overflow-hidden"
      style={getGradientStyle(sensorData.pm2_5)}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating orbs */}
        <motion.div
          animate={{ y: [-20, 20, -20], x: [-10, 10, -10] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ y: [20, -20, 20], x: [10, -10, 10] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-40 left-5 w-32 h-32 bg-white/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl"
        />
        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/10" />
      </div>

      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.div
            key="search"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <SearchLocation onClose={() => setIsOpen(false)} />
          </motion.div>
        ) : (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10 flex flex-col h-full"
          >
            {/* Location Button */}
            <div className="flex justify-between mb-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="
                  flex items-center gap-2
                  px-5 py-2.5 
                  bg-white/15 hover:bg-white/25 
                  backdrop-blur-md
                  text-white 
                  rounded-full 
                  shadow-lg shadow-black/20
                  border border-white/20
                  transition-all duration-300
                "
              >
                <MapPin className="w-4 h-4" />
                <span className="font-medium">Location</span>
              </motion.button>
            </div>

            {/* Face Icon with Cloud Background */}
            <motion.div
              className="relative flex justify-center items-center py-8"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              {/* Cloud background */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${basePath}/images/Cloud-background.png`}
                width={280}
                height={280}
                alt="bg"
                className="opacity-10 absolute -mx-20"
              />

              {/* Main face icon with glow */}
              <motion.div
                className="relative"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="absolute inset-0 blur-3xl opacity-60 bg-white/40 rounded-full scale-125" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getHappinessIcon(sensorData.pm2_5)}
                  width={180}
                  height={180}
                  alt="air quality indicator"
                  className="relative z-10 drop-shadow-2xl"
                />
              </motion.div>
            </motion.div>

            {/* PM2.5 Value Display */}
            <motion.div
              className="flex flex-col items-center justify-center flex-grow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {sensorData.pm2_5 !== null && isClient && (
                <motion.div
                  className="relative"
                  key={sensorData.pm2_5}
                >
                  {/* Glow effect behind number */}
                  <div
                    className="absolute inset-0 blur-3xl opacity-40 rounded-full bg-white/50"
                    style={{ transform: 'scale(1.5)' }}
                  />

                  <h1 className="relative text-white text-[110px] md:text-[130px] font-bold leading-none tracking-tight tabular-nums">
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      style={{ textShadow: "0 4px 30px rgba(0,0,0,0.3)" }}
                    >
                      {sensorData.pm2_5}
                    </motion.span>
                    <span className="text-3xl md:text-4xl text-white/60 font-normal ml-2">µg/m³</span>
                  </h1>
                </motion.div>
              )}

              <motion.h3
                className="font-semibold text-2xl md:text-3xl text-white/70 mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                PM 2.5
              </motion.h3>

              {/* Date and Location */}
              <motion.div
                className="flex flex-col items-center text-center text-white/80 text-base space-y-4 mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-white/60" />
                  <span>
                    วันนี้ •{" "}
                    {new Date().toLocaleString("th-TH", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-2 bg-white/15 px-5 py-2.5 rounded-full backdrop-blur-md border border-white/20 shadow-lg"
                >
                  <MapPin className="w-4 h-4 text-white/80" />
                  <span className="font-medium">{location}</span>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SideBar;