import { useEffect, useState } from "react";
import mqtt from "mqtt";

const useSensorDataforPm25 = () => {
  const [sensorData, setSensorData] = useState({
    temperature: 0,
    humidity: 0,
    pm1: 0,
    pm2_5: 0,
    pm10: 0,
  });

  const [bgColor, setBgColor] = useState("#2ECC71");
  const [bgColorMain, setBgColorMain] = useState("#2ECC71");

  useEffect(() => {
    let client: mqtt.MqttClient;
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 5;

    const connectToMqtt = () => {
      client = mqtt.connect("ws://172.16.202.63:8083/mqtt", {
        username: "admin",
        password: "public",
        clientId: "emqx_" + Math.random().toString(16).slice(2, 10),
        keepalive: 60,
        reconnectPeriod: 5000,
        connectTimeout: 30 * 1000,
        clean: true,
      });

      client.on("connect", () => {
        console.log("Connected to MQTT broker");
        reconnectAttempts = 0;
        client.subscribe("sensor/data");
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

            // Update background colors based on Temp1
            if (data.pm2_5 > 23.6 && data.pm2_5 < 28) {
              setBgColor("#f1c40f");
              setBgColorMain("#f1c40f");
            } else if (data.pm2_5 <= 23.6) {
              setBgColor("#2ECC71");
              setBgColorMain("#2ECC71");
            } else if (data.pm2_5 >= 28) {
              setBgColor("#e3901b");
              setBgColorMain("#e3901b");
            }
          } catch (error) {
            console.error("Error processing message:", error);
          }
        }
      });
    };

    connectToMqtt();

    return () => {
      if (client) {
        client.end(true, {}, () => {
          console.log("MQTT connection closed cleanly");
        });
      }
    };
  }, []);

  return { sensorData, bgColor, bgColorMain };
};

export default useSensorDataforPm25;
