"use client";

import MainContent from "./components/MainContent";
import SideBar from "./components/SideBar";
import useSensorDataforPm25 from "@/lib/useSensorForPm25";
import useMqttConfig from "@/lib/useMqttConfig";
import React from "react";
import { Loader2, Settings, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const { mqttUrl, location, isLoading, error, updateMqttConfig } =
    useMqttConfig();
  const [localMqttUrl, setLocalMqttUrl] = React.useState(mqttUrl);
  const [showModal, setShowModal] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [localLocation, setLocalLocation] = React.useState(location);

  const { bgColorMain, bgColor } = useSensorDataforPm25(mqttUrl);

  const [bgColorClass, setBgColorClass] = React.useState("bg-emerald-500");

  React.useEffect(() => {
    setLocalMqttUrl(mqttUrl);
    setLocalLocation(location);
  }, [mqttUrl, location]);

  React.useEffect(() => {
    const newBgColor =
      bgColorMain === "#3b82f6"
        ? "bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700"
        : bgColorMain === "#2ecc71"
          ? "bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700"
          : bgColorMain === "#f1c40f"
            ? "bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600"
            : bgColorMain === "#e3901b"
              ? "bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700"
              : bgColorMain === "#ef4444"
                ? "bg-gradient-to-br from-red-500 via-red-600 to-red-700"
                : "bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700";

    setBgColorClass(newBgColor);
  }, [bgColorMain]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const success = await updateMqttConfig(localMqttUrl, localLocation);
      if (success) {
        setShowModal(false);
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center"
        >
          <div className="relative">
            <div className="absolute inset-0 blur-xl bg-emerald-500/30 rounded-full" />
            <Loader2 className="relative h-12 w-12 animate-spin text-emerald-400" />
          </div>
          <span className="mt-4 text-white/80 font-medium">Loading MQTT configuration...</span>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/10 backdrop-blur-lg border border-red-500/30 text-red-100 px-6 py-4 rounded-2xl max-w-md"
        >
          <p className="font-bold text-lg">Error loading MQTT configuration</p>
          <p className="text-red-200/80 mt-1">{error}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      {/* Settings Button */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowModal(true)}
        className="
          fixed top-4 right-4 z-[100]
          bg-gray-800/80 hover:bg-gray-700 
          backdrop-blur-lg
          text-white 
          p-3 rounded-full 
          flex items-center justify-center 
          shadow-xl shadow-black/30
          border border-gray-600/50
          transition-colors duration-300
          cursor-pointer
        "
      >
        <Settings className="h-5 w-5" />
      </motion.button>

      {/* Settings Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="
                bg-white/95 backdrop-blur-xl 
                p-6 rounded-3xl 
                w-full max-w-md 
                shadow-2xl
                border border-white/50
              "
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800 font-display">
                  MQTT Configuration
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </motion.button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    WebSocket URL
                  </label>
                  <input
                    type="text"
                    value={localMqttUrl}
                    onChange={(e) => setLocalMqttUrl(e.target.value)}
                    className="
                      w-full px-4 py-3 
                      bg-gray-50 
                      border border-gray-200 
                      rounded-xl
                      focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                      transition-all duration-200
                      outline-none
                    "
                    placeholder="WebSocket URL"
                    disabled={isSaving}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={localLocation}
                    onChange={(e) => setLocalLocation(e.target.value)}
                    className="
                      w-full px-4 py-3 
                      bg-gray-50 
                      border border-gray-200 
                      rounded-xl
                      focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                      transition-all duration-200
                      outline-none
                    "
                    placeholder="Location"
                    disabled={isSaving}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowModal(false)}
                    className="
                      px-5 py-2.5 
                      bg-gray-100 hover:bg-gray-200 
                      text-gray-700 
                      rounded-xl 
                      font-medium
                      transition-colors
                    "
                    disabled={isSaving}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="
                      px-5 py-2.5 
                      bg-gradient-to-r from-emerald-500 to-emerald-600 
                      hover:from-emerald-600 hover:to-emerald-700
                      text-white 
                      rounded-xl 
                      font-medium
                      shadow-lg shadow-emerald-500/30
                      flex items-center
                      transition-all duration-200
                    "
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Layout */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`${bgColorClass} flex flex-col lg:flex-row w-full min-h-screen`}
      >
        <SideBar bgColors={bgColor} />
        <MainContent />
      </motion.div>
    </>
  );
}
