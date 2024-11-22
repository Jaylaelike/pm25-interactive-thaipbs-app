"use client";
import mqtt from "mqtt";
import IndicatorBar from "./IndicatorBar";
import LargeCard from "./LargeCard";
import { useEffect, useState } from "react";
import ClockDigitTimer from "./DigitalClock";

const MainContent = () => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const [bgColor, setBgColor] = useState("#2ECC71");
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
          if (data.pm2_5 >= 23 && data.pm2_5 <= 28) {
            setBgColor("#f1c40f");
          } else if (data.pm2_5 >= 30 && data.pm2_5 <= 40) {
            setBgColor("#e3901b");
          } else if (data.pm2_5 > 40) {
            setBgColor("#e74c3c");
          } else if (data.pm2_5 >= 10 && data.pm2_5 < 23) {
            setBgColor("#2ECC71");
          } else if (data.pm2_5 < 10) {
            setBgColor("#3498db");
          }
        }
      }
    });

    return () => {
      client.end();
    };
  }, []);

  console.log(sensorData);

  const bgColorClass =
    bgColor === "#2ECC71"
      ? "bg-[#2ECC71]"
      : bgColor === "#f1c40f"
      ? "bg-[#f1c40f]"
      : bgColor === "#e3901b"
      ? "bg-[#e3901b]"
      : bgColor === "#e74c3c"
      ? "bg-[#e74c3c]"
      : bgColor === "#3498db"
      ? "bg-[#3498db]"
      : "bg-[#2ECC71]";

  return (
    <div className="text-gray-150 p-10 flex-grow pt-0">
      <div className="space-x-3 text-right">
        <button className="bg-[#2ECC71] rounded-full w-10 h-10 text-gray-100 font-bold text-xl">
          &deg;C
        </button>
        <button className="bg-gray-150 rounded-full w-10 h-10 text-darkblue font-bold text-xl">
          &deg;F
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 my-5 gap-5 justify-center">
        {isClient ? <ClockDigitTimer /> : null}

        {/* <SmallCard
          dayTitle="Tomorrow"
          img="Shower"
          max={20}
          min={12}
          temp="C"
        />
        <SmallCard
          dayTitle="Sun, 7 Jun"
          img="Clear"
          max={27}
          min={18}
          temp="C"
        /> */}
      </div>

      <div className="my-5">
        <h3 className=" text-gray-350 text-2xl font-bold mb-5">
          Todays Highlights
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 justify-center">
          <LargeCard
            title="PM10"
            num={sensorData.pm10}
            desc="µg/m³"
            bgColors={bgColorClass}
          >
            <div className="flex justify-between space-x-5 items-center">
              <div className="bg-gray-500 rounded-full w-[30px] h-[30px] flex justify-center items-center">
                <i className="fas fa-location-arrow"></i>
              </div>
              <p className="text-gray-150 text-sm"></p>
            </div>
          </LargeCard>

          <LargeCard
            title="ความชื้นสัมพัทธ์"
            num={sensorData.humidity}
            desc="%"
            bgColors={bgColorClass}
          >
            <div className="self-stretch text-gray-250 text-xs space-y-1">
              <div className="flex justify-between space-x-5 items-center px-1">
                <p>0</p>
                <p>50</p>
                <p>100</p>
              </div>
              <div className="w-full h-2 bg-gray-150 rounded-full overflow-hidden">
                <div
                  className="bg-[#FFEC65] h-2"
                  style={{ width: "84%" }}
                ></div>
              </div>
              <p className="text-right">%</p>
            </div>
          </LargeCard>

          <LargeCard
            title="Temperature"
            num={sensorData.temperature}
            bgColors={bgColorClass}
            desc=" C"
          />

          <LargeCard
            title="Air Pressure"
            num={998}
            desc=" mb"
            bgColors={bgColorClass}
          />
        </div>
        <div>
          <IndicatorBar />
        </div>
      </div>
    </div>
  );
};

export default MainContent;
