"use client";

import { motion } from "framer-motion";

interface LargeCardProps {
  title: string;
  num: number;
  desc: string;
  bgColors: string;
  children?: React.ReactNode;
}

const LargeCard: React.FC<LargeCardProps> = ({
  title,
  num,
  desc,
  bgColors,
  children,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
      whileHover={{ y: -4, scale: 1.02 }}
      className={`
        ${bgColors} 
        relative overflow-hidden
        py-6 px-8 
        flex flex-col items-center justify-between 
        space-y-3 
        rounded-2xl
        shadow-lg hover:shadow-xl
        transition-shadow duration-300
        backdrop-blur-sm
        border border-white/20
      `}
    >
      {/* Background glow effect */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center space-y-2">
        <p className="text-white/90 font-medium text-sm tracking-wide uppercase">
          {title}
        </p>

        <div className="flex items-baseline">
          <motion.span
            className="text-5xl md:text-6xl font-bold text-white tabular-nums"
            key={num}
            initial={{ opacity: 0.5, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {num}
          </motion.span>
          <span className="text-2xl md:text-3xl font-normal text-white/80 ml-1">
            {desc}
          </span>
        </div>
      </div>

      {/* Icon area */}
      {children && (
        <div className="relative z-10 mt-2">
          {children}
        </div>
      )}

      {/* Shimmer effect on hover */}
      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000" />
      </div>
    </motion.div>
  );
};

export default LargeCard;