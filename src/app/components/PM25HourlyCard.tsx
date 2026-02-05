"use client";

import { Info, Loader2, RefreshCw } from "lucide-react";
import { usePM25HourlyData, HourlyDataPoint } from "@/lib/usePM25HourlyData";
import { motion, AnimatePresence } from "framer-motion";

// Thailand AQI PM2.5 color standards
const getValueColor = (value: number): string => {
    if (value <= 25) return "text-cyan-500";
    if (value <= 37) return "text-emerald-500";
    if (value <= 50) return "text-yellow-500";
    if (value <= 90) return "text-orange-500";
    if (value <= 150) return "text-red-500";
    return "text-purple-600";
};

const getGradientClass = (value: number): string => {
    if (value <= 25) return "from-cyan-400/20 to-cyan-500/20 border-cyan-400/50";
    if (value <= 37) return "from-emerald-400/20 to-emerald-500/20 border-emerald-400/50";
    if (value <= 50) return "from-yellow-400/20 to-yellow-500/20 border-yellow-400/50";
    if (value <= 90) return "from-orange-400/20 to-orange-500/20 border-orange-400/50";
    if (value <= 150) return "from-red-400/20 to-red-500/20 border-red-400/50";
    return "from-purple-400/20 to-purple-500/20 border-purple-400/50";
};

const getHappinessIcon = (pmLevel: number): string => {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
    if (pmLevel <= 15) return `${basePath}/images/happiness/very-happy.png`;
    if (pmLevel <= 25) return `${basePath}/images/happiness/happy.png`;
    if (pmLevel <= 37.5) return `${basePath}/images/happiness/neutral.png`;
    if (pmLevel <= 75) return `${basePath}/images/happiness/sad.png`;
    return `${basePath}/images/happiness/very-sad.png`;
};

const legendItems = [
    { color: "bg-cyan-500", label: "ดีมาก", range: "0-25" },
    { color: "bg-emerald-500", label: "ดี", range: "26-37" },
    { color: "bg-yellow-500", label: "ปานกลาง", range: "38-50" },
    { color: "bg-orange-500", label: "เริ่มมีผล", range: "51-90" },
    { color: "bg-red-500", label: "มีผล", range: "91-150" },
    { color: "bg-purple-600", label: "อันตราย", range: ">150" },
];

interface PM25HourlyCardProps {
    className?: string;
}

export default function PM25HourlyCard({ className = "" }: PM25HourlyCardProps) {
    const { data, loading, error, refresh } = usePM25HourlyData(4);
    const currentData = data.find(d => d.isCurrent) || data[data.length - 1];
    const currentValue = currentData?.value || 0;

    const displayData: HourlyDataPoint[] = data.length > 0
        ? data
        : [
            { time: "ปัจจุบัน", value: 0, isCurrent: true },
            { time: "--:--", value: 0 },
            { time: "--:--", value: 0 },
            { time: "--:--", value: 0 },
        ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
            className={`
        relative overflow-hidden
        bg-white/80 backdrop-blur-lg 
        rounded-3xl p-6 
        shadow-xl shadow-gray-200/50
        border border-white/50
        ${className}
      `}
        >
            {/* Background gradient mesh */}
            <div className="absolute inset-0 opacity-30 pointer-events-none">
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-400 to-cyan-300 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-emerald-400 to-green-300 rounded-full blur-3xl" />
            </div>

            {/* Face Emotion Icon Indicator */}
            <AnimatePresence>
                {!loading && currentValue > 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="relative z-10 flex flex-col items-center mb-5"
                    >
                        <motion.div
                            className="relative"
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-b from-white/0 to-white/20 rounded-full blur-2xl transform scale-150" />
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={getHappinessIcon(currentValue)}
                                width={90}
                                height={90}
                                alt="air quality indicator"
                                className="relative drop-shadow-xl"
                            />
                        </motion.div>
                        <div className="mt-3 text-center">
                            <motion.span
                                className={`text-4xl font-bold font-display ${getValueColor(currentValue)}`}
                                key={currentValue}
                                initial={{ scale: 1.2, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                {currentValue}
                            </motion.span>
                            <span className="text-gray-400 text-sm ml-1.5">μg/m³</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <div className="relative z-10 flex justify-between items-center mb-5">
                <div className="flex-1">
                    <h3 className="text-gray-800 font-semibold font-display text-lg">
                        PM 2.5 ในช่วง 7 วันที่ผ่านมา
                    </h3>
                    <p className="text-gray-400 text-xs mt-0.5">(μg/m³)</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-9 h-9 bg-gray-800 hover:bg-gray-700 rounded-xl flex items-center justify-center shadow-lg transition-colors"
                >
                    <Info className="w-4 h-4 text-white" />
                </motion.button>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="relative z-10 flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                    <span className="ml-2 text-gray-500 text-sm">กำลังโหลดข้อมูล...</span>
                </div>
            )}

            {/* Error State */}
            {error && !loading && (
                <div className="relative z-10 text-center py-6">
                    <p className="text-red-500 text-sm mb-3">{error}</p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={refresh}
                        className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-full transition-colors shadow-sm"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        ลองใหม่
                    </motion.button>
                </div>
            )}

            {/* Data Grid */}
            {!loading && !error && (
                <motion.div
                    className="relative z-10 grid grid-cols-4 gap-2"
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: {},
                        visible: { transition: { staggerChildren: 0.1 } }
                    }}
                >
                    {displayData.map((item, index) => (
                        <motion.div
                            key={index}
                            variants={{
                                hidden: { opacity: 0, y: 10 },
                                visible: { opacity: 1, y: 0 }
                            }}
                            whileHover={{ scale: 1.05 }}
                            className={`
                flex flex-col items-center p-3 rounded-2xl
                transition-all duration-300 cursor-pointer
                ${item.isCurrent
                                    ? `bg-gradient-to-br ${getGradientClass(item.value)} border-2 shadow-lg`
                                    : "bg-gray-50/80 hover:bg-gray-100/80 border border-transparent"
                                }
              `}
                        >
                            <span className="text-xs text-gray-500 mb-2 font-medium">{item.time}</span>
                            <motion.span
                                className={`text-2xl font-bold tabular-nums ${item.value > 0 ? getValueColor(item.value) : 'text-gray-300'}`}
                                key={`${index}-${item.value}`}
                                initial={{ opacity: 0.5 }}
                                animate={{ opacity: 1 }}
                            >
                                {item.value > 0 ? item.value : '--'}
                            </motion.span>
                        </motion.div>
                    ))}
                </motion.div>
            )}

            {/* Legend */}
            <div className="relative z-10 mt-5 pt-4 border-t border-gray-100">
                <div className="flex flex-wrap justify-center gap-x-3 gap-y-2">
                    {legendItems.map((item, index) => (
                        <motion.span
                            key={index}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-center text-xs"
                        >
                            <span className={`w-2.5 h-2.5 rounded-full ${item.color} mr-1.5 shadow-sm`} />
                            <span className="text-gray-500">{item.label} ({item.range})</span>
                        </motion.span>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
