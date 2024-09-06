"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import dayjs from "dayjs";

function ClockDigitTimer() {
  const [time, setTime] = useState(dayjs().format("HH:mm:ss"));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(dayjs().format("HH:mm:ss"));
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  return (
    <div>
      <motion.div
        className="flex items-center justify-center  rounded-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          className="text-4xl font-mono text-white"
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {time}
        </motion.div>
      </motion.div>
    </div>
  );
}

export default ClockDigitTimer;