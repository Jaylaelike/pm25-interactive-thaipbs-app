"use client";

import MainContent from "./components/MainContent";
import SideBar from "./components/SideBar";
import { useEffect, useState } from "react";
import mqtt from "mqtt";
import useSensorDataforPm25 from "@/lib/useSensorForPm25";
import React from "react";

export default function Home() {

  const { bgColorMain, bgColor } = useSensorDataforPm25();

  const [bgColorClass, setBgColorClass] = React.useState("bg-green-500");
  
  React.useEffect(() => {
    const newBgColor = 
      bgColorMain === "#f1c40f"
        ? "bg-yellow-300"
        : bgColorMain === "#e3901b"
        ? "bg-yellow-500"
        : bgColorMain === "#e74c3c"
        ? "bg-red-400"
        : bgColorMain === "#2ECC71"
        ? "bg-green-500"
        : bgColorMain === "#3498db"
        ? "bg-blue-500"
        : "bg-green-500";
    
    setBgColorClass(newBgColor);
  }, [bgColorMain]);


  // const [bgColor, setBgColor] = useState("#71ff47");
  // const [sensorData, setSensorData] = useState({
  //   temperature: 0,
  //   humidity: 0,
  //   pm1: 0,
  //   pm2_5: 0,
  //   pm10: 0,
  // });

  // useEffect(() => {
  //   const client = mqtt.connect("ws://172.16.202.63:8083/mqtt", {
  //     username: "admin",
  //     password: "public",
  //     clientId: "emqx_" + Math.random().toString(16).substr(2, 8),
  //   });

  //   client.on("connect", () => {
  //     console.log("Connected to MQTT broker");
  //     client.subscribe("sensor/data");
  //   });

  //   client.on("message", (topic, message) => {
  //     if (topic === "sensor/data") {
  //       const data = JSON.parse(message.toString());
  //       setSensorData(data);

    



  //       if (data) {
  //         if (data.pm2_5 >= 23 && data.pm2_5 <= 28) {
  //           setBgColor("#f1c40f");
  //         } else if (data.pm2_5 >= 30 && data.pm2_5 <= 40) {
  //           setBgColor("#f7dc6f");
  //         } else if (data.pm2_5 > 40) {
  //           setBgColor("#e74c3c");
  //         } else if (data.pm2_5 >= 10 && data.pm2_5 < 23) {
  //           setBgColor("#2ECC71");
  //         } else if (data.pm2_5 < 10) {
  //           setBgColor("#3498db");
  //         }

  //       }
  //     }
  //   });

  //   return () => {
  //     client.end();
  //   };
  // }, [sensorData.pm2_5]);

  // console.log(sensorData);

  // const bgColorClass  = 
  //   bgColor === "#f1c40f"
  //     ? "bg-yellow-300"
  //     : bgColor === "#f7dc6f"
  //     ? "bg-yellow-500"
  //     : bgColor === "#e74c3c"
  //     ? "bg-red-400"
  //     : bgColor === "#2ECC71"
  //     ? "bg-green-500"
  //     : bgColor === "#3498db"
  //     ? "bg-blue-500"
  //     : "bg-green-500"; 



  return (
    <>
      <div className={`${bgColorClass} flex flex-col lg:flex-row w-full h-full`}>
        <SideBar bgColors={bgColor} />
        <MainContent />
      </div>
    </>
  );
}
