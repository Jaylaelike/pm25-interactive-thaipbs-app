"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import dayjs from "dayjs";

function ClockDigitTimer() {
  const [time, setTime] = useState(dayjs().format("HH:mm:ss"));
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const interval = setInterval(() => {
      setTime(dayjs().format("HH:mm:ss"));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!isClient) return null;

  const [hours, minutes, seconds] = time.split(":");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
      className="
        relative overflow-hidden
        flex items-center justify-center gap-2
        px-6 py-4
        bg-white/10 backdrop-blur-lg
        rounded-2xl
        border border-white/20
        shadow-xl shadow-black/10
      "
    >
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />

      <div className="relative flex items-center gap-1">
        {/* Hours */}
        <motion.div
          className="flex items-center justify-center min-w-[3rem]"
          key={hours}
        >
          <span className="text-4xl md:text-5xl font-bold text-white tabular-nums font-mono tracking-tight">
            {hours}
          </span>
        </motion.div>

        {/* Separator */}
        <motion.span
          className="text-3xl md:text-4xl font-bold text-white/60"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          :
        </motion.span>

        {/* Minutes */}
        <motion.div
          className="flex items-center justify-center min-w-[3rem]"
          key={minutes}
        >
          <span className="text-4xl md:text-5xl font-bold text-white tabular-nums font-mono tracking-tight">
            {minutes}
          </span>
        </motion.div>

        {/* Separator */}
        <motion.span
          className="text-3xl md:text-4xl font-bold text-white/60"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          :
        </motion.span>

        {/* Seconds */}
        <motion.div
          className="flex items-center justify-center min-w-[3rem]"
          key={seconds}
          initial={{ opacity: 0.5, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <span className="text-4xl md:text-5xl font-bold text-white/80 tabular-nums font-mono tracking-tight">
            {seconds}
          </span>
        </motion.div>
      </div>

      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
      />
    </motion.div>
  );
}

export default ClockDigitTimer;