"use client";

import MainContent from "./components/MainContent";
import SideBar from "./components/SideBar";
import { useEffect, useState } from "react";
import mqtt from "mqtt";

export default function Home() {
  const [bgColor, setBgColor] = useState("#71ff47");
  const [sensorData, setSensorData] = useState({
    temperature: 0,
    humidity: 0,
    pm1: 0,
    pm2_5: 0,
    pm10: 0,
  });

  useEffect(() => {
    const client = mqtt.connect("ws://172.16.202.63:8083/mqtt", {
      username: "admin",
      password: "public",
      clientId: "emqx_" + Math.random().toString(16).substr(2, 8),
    });

    client.on("connect", () => {
      console.log("Connected to MQTT broker");
      client.subscribe("sensor/data");
    });

    client.on("message", (topic, message) => {
      if (topic === "sensor/data") {
        const data = JSON.parse(message.toString());
        setSensorData(data);

    



        if (data) {
          if (data.temperature >= 23 && data.temperature <= 28) {
            setBgColor("#f1c40f");
          } else if (data.temperature >= 30 && data.temperature <= 40) {
            setBgColor("#f7dc6f");
          } else if (data.temperature > 40) {
            setBgColor("#e74c3c");
          } else if (data.temperature >= 10 && data.temperature < 23) {
            setBgColor("#2ECC71");
          } else if (data.temperature < 10) {
            setBgColor("#3498db");
          }

        }
      }
    });

    return () => {
      client.end();
    };
  }, [sensorData.temperature]);

  console.log(sensorData);

  const bgColorClass  = 
    bgColor === "#f1c40f"
      ? "bg-yellow-300"
      : bgColor === "#f7dc6f"
      ? "bg-yellow-500"
      : bgColor === "#e74c3c"
      ? "bg-red-400"
      : bgColor === "#2ECC71"
      ? "bg-green-500"
      : bgColor === "#3498db"
      ? "bg-blue-500"
      : "bg-green-500"; 



  return (
    <>
      <div className={`${bgColorClass} flex flex-col lg:flex-row w-full h-full`}>
        <SideBar bgColors={bgColor} />
        <MainContent />
      </div>
    </>
  );
}
