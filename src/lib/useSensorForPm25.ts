

"use client";

import { useEffect, useState } from "react";
import mqtt from "mqtt";

interface SensorData {
  temperature: number;
  humidity: number;
  pm1: number;
  pm2_5: number;
  pm10: number;
}

const useSensorDataforPm25 = (mqttUrl: string) => {
  const [sensorData, setSensorData] = useState<SensorData>({
    temperature: 0,
    humidity: 0,
    pm1: 0,
    pm2_5: 0,
    pm10: 0,
  });

  const [bgColor, setBgColor] = useState("#2ECC71");
  const [bgColorMain, setBgColorMain] = useState("#2ECC71");

  useEffect(() => {
    let client: mqtt.MqttClient | null = null;
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 5;

    // Only attempt to connect if we have a valid MQTT URL
    if (!mqttUrl) {
      console.error("MQTT URL is not provided");
      return;
    }

    const connectToMqtt = () => {
      try {
        client = mqtt.connect(mqttUrl, {
          username: "admin",
          password: "public",
          clientId: "emqx_" + Math.random().toString(16).slice(2, 10),
          keepalive: 60,
          reconnectPeriod: 5000,
          connectTimeout: 30 * 1000,
          clean: true,
        });

        client.on("connect", () => {
          console.log("Connected to MQTT broker at", mqttUrl);
          reconnectAttempts = 0;
          client?.subscribe("sensor/data");
        });

        client.on("error", (err) => {
          console.error("MQTT connection error:", err);
          if (reconnectAttempts < maxReconnectAttempts) {
            reconnectAttempts++;
            console.log(`Reconnection attempt ${reconnectAttempts}...`);
          }
        });

        client.on("close", () => {
          console.log("MQTT connection closed");
        });

        client.on("offline", () => {
          console.log("MQTT client is offline");
        });

        client.on("message", (topic, message) => {
          if (topic === "sensor/data") {
            try {
              const data = JSON.parse(message.toString());
              setSensorData(data);

              // Update background colors based on PM2.5 levels
              if (data.pm2_5 <= 15) {
                setBgColor("#3b82f6");
                setBgColorMain("#3b82f6");
              } else if (data.pm2_5 <= 25) {
                setBgColor("#2ecc71");  
                setBgColorMain("#2ecc71");
              } else if (data.pm2_5 <= 37.5) {
                setBgColor("#f1c40f");
                setBgColorMain("#f1c40f");
              } else if (data.pm2_5 <= 75) {
                setBgColor("#e3901b");
                setBgColorMain("#e3901b");
              } else {
                setBgColor("#ef4444");
                setBgColorMain("#ef4444");
              }
            } catch (error) {
              console.error("Error processing message:", error);
            }
          }
        });
      } catch (error) {
        console.error("Error connecting to MQTT:", error);
      }
    };

    connectToMqtt();

    // Cleanup function to properly close the MQTT connection
    return () => {
      if (client) {
        client.end(true, {}, () => {
          console.log("MQTT connection closed cleanly");
        });
      }
    };
  }, [mqttUrl]); // Re-connect when the MQTT URL changes

  return { sensorData, bgColor, bgColorMain };
};

export default useSensorDataforPm25