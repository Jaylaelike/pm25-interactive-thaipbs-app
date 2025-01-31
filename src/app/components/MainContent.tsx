"use client";
import mqtt from "mqtt";
import IndicatorBar from "./IndicatorBar";
import LargeCard from "./LargeCard";
import { useEffect, useState } from "react";
import ClockDigitTimer from "./DigitalClock";
import useSensorDataforPm25 from "@/lib/useSensorForPm25";

const MainContent = () => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const calculateAQI = (pm25: number): number => {
    // AQI breakpoints for PM2.5
    if (pm25 <= 12.0) {
      return Math.round(((50 - 0) / (12.0 - 0)) * (pm25 - 0) + 0);
    } else if (pm25 <= 35.4) {
      return Math.round(((100 - 51) / (35.4 - 12.1)) * (pm25 - 12.1) + 51);
    } else if (pm25 <= 55.4) {
      return Math.round(((150 - 101) / (55.4 - 35.5)) * (pm25 - 35.5) + 101);
    } else if (pm25 <= 150.4) {
      return Math.round(((200 - 151) / (150.4 - 55.5)) * (pm25 - 55.5) + 151);
    } else if (pm25 <= 250.4) {
      return Math.round(((300 - 201) / (250.4 - 150.5)) * (pm25 - 150.5) + 201);
    } else if (pm25 <= 350.4) {
      return Math.round(((400 - 301) / (350.4 - 250.5)) * (pm25 - 250.5) + 301);
    } else {
      return Math.round(((500 - 401) / (500.4 - 350.5)) * (pm25 - 350.5) + 401);
    }
  };

  const { sensorData, bgColorMain } = useSensorDataforPm25();
  const bgColorClass =
  bgColorMain === "#2ECC71"
      ? "bg-[#2ECC71]"
      : bgColorMain === "#f1c40f"
      ? "bg-[#f1c40f]"
      : bgColorMain === "#e3901b"
      ? "bg-[#e3901b]"
      : bgColorMain === "#e74c3c"
      ? "bg-[#e74c3c]"
      : bgColorMain === "#3498db"
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
            title="AQI"
            num={calculateAQI(sensorData.pm2_5)}
            desc=""
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
