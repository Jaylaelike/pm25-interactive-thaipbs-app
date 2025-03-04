"use client";

import SearchLocation from "./SearchLocation";
import Image from "next/image";
import { useEffect, useState } from "react";
import mqtt from "mqtt";
import useMqttConfig from "@/lib/useMqttConfig";
import useSensorDataforPm25 from "@/lib/useSensorForPm25";

interface Propstype {
  bgColors: string;
}
const SideBar = ({ bgColors }: Propstype) => {
  const [isOpen, setIsOpen] = useState(false);

  const [isClient, setIsClient] = useState(false);
  const { mqttUrl, location } = useMqttConfig();
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  const { sensorData, bgColorMain } = useSensorDataforPm25(mqttUrl);

  const getHappinessIcon = (pm25Level: number) => {
    if (pm25Level <= 15) return "/images/happiness/very-happy.png";
    if (pm25Level <= 25) return "/images/happiness/happy.png";
    if (pm25Level <= 37.5) return "/images/happiness/neutral.png";
    if (pm25Level <= 75) return "/images/happiness/sad.png";
    return "/images/happiness/very-sad.png";
  };

  return (
    <div
      className={`flex flex-col min-h-screen bg-[${bgColors}] w-full lg:w-1/3 p-7 lg:p-4 xl:p-7 space-y-10 overflow-x-hidden pt-0`}
    >
      {isOpen ? (
        <SearchLocation onClose={() => setIsOpen(false)} />
      ) : (
        <>
          <div className="relative flex justify-between mb-10">
            <button className="static z-10 px-4 py-2 text bg-[#6E707A] hover:bg-[#6E707A]/70 text-gray-150 rounded-full shadow-lg">
              <i className="fas fa-map-marker-alt"></i>
            </button>
          </div>

          <div className="relative -mx-36 flex justify-center items-center max-h-40">
            <Image
              src="/images/Cloud-background.png"
              width={200}
              height={200}
              alt="bg"
              className="opacity-5 absolute max-w-52"
            />
            <Image
              src={getHappinessIcon(sensorData.pm2_5)}
              width={200}
              height={200}
              alt="air quality indicator"
              className="max-h-48 z-10"
            />
          </div>

          <div className="flex flex-col items-center justify-between flex-grow pt-6">
            {sensorData.pm2_5 !== null && (
              <h1 className="text-gray-150 text-[144px] font-medium">
                {sensorData.pm2_5}
                <span className="text-5xl text-gray-500">µg/m³</span>
              </h1>
            )}

            <h3 className="font-semibold text-4xl text-gray-500">PM 2.5</h3>
            <div className="flex flex-col items-center text-center text-gray-350 text-lg space-y-5">
              <p>
                Today &bull;{" "}
                {new Date().toLocaleString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p>
                <i className="fas fa-map-marker-alt"></i> {location}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SideBar;