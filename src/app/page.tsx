"use client";

import MainContent from "./components/MainContent";
import SideBar from "./components/SideBar";
import useSensorDataforPm25 from "@/lib/useSensorForPm25";
import useMqttConfig from "@/lib/useMqttConfig";
import React from "react";
import { Loader2, Settings } from "lucide-react";

export default function Home() {
  const { mqttUrl, isLoading, error, updateMqttConfig } = useMqttConfig();
  const [localMqttUrl, setLocalMqttUrl] = React.useState(mqttUrl);
  const [showModal, setShowModal] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  const { bgColorMain, bgColor } = useSensorDataforPm25(mqttUrl);

  const [bgColorClass, setBgColorClass] = React.useState("bg-green-500");
  
  // Update local state when the fetched mqttUrl changes
  React.useEffect(() => {
    setLocalMqttUrl(mqttUrl);
  }, [mqttUrl]);
  
  React.useEffect(() => {
    const newBgColor = 
      bgColorMain === "#3b82f6"
        ? "bg-blue-500"
        : bgColorMain === "#2ecc71"
        ? "bg-green-500" 
        : bgColorMain === "#f1c40f"
        ? "bg-yellow-300"
        : bgColorMain === "#e3901b"
        ? "bg-yellow-500"
        : bgColorMain === "#ef4444"
        ? "bg-red-500"
        : "bg-green-500";
    
    setBgColorClass(newBgColor);
  }, [bgColorMain]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const success = await updateMqttConfig(localMqttUrl);
      if (success) {
        setShowModal(false);
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading MQTT configuration...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error loading MQTT configuration</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <button 
        onClick={() => setShowModal(true)}
        className="fixed top-4 right-4 bg-gray-400 hover:bg-gray-600 text-white p-3 rounded-full flex items-center justify-center gap-2 shadow-lg transition-colors"
      >
        <Settings className="h-5 w-5" />
        <span>MQTT</span>
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">MQTT Configuration</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={localMqttUrl}
                onChange={(e) => setLocalMqttUrl(e.target.value)}
                className="w-full p-2 border rounded mb-4"
                placeholder="WebSocket URL"
                disabled={isSaving}
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded"
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded flex items-center"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    'Save'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className={`${bgColorClass} flex flex-col lg:flex-row w-full h-full`}>
        <SideBar bgColors={bgColor} />
        <MainContent />
      </div>
    </>
  );
}