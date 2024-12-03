"use client";


import LargeCard from "./LargeCard";
import { useEffect, useState } from "react";
import ClockDigitTimer from "../DigitalClock";
import useSensorDataforBuc from "@/lib/useSensorForBuc";
import { ThermometerSun } from 'lucide-react';



const MainContent = () => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const { sensorData, bgColorMain } = useSensorDataforBuc();



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
          BUC Temperature Status
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 justify-center">
          <LargeCard
            title="อุณหภูมิ BUC ตัวที่ 1"
            num={sensorData.Temp1}
            desc=" °C"
            bgColors={bgColorClass}
          >
            <div className="flex justify-between space-x-5 items-center">
              <div className=" rounded-full w-[30px] h-[30px] flex justify-center items-center">
              <ThermometerSun />
              </div>
              <p className="text-gray-150 text-sm"></p>
            </div>
          </LargeCard>

          <LargeCard
            title="อุณหภูมิ BUC ตัวที่ 2"
            num={sensorData.Temp2}
            desc=" °C"
            bgColors={bgColorClass}
          >
            <div className="flex justify-between space-x-5 items-center">
              <div className=" rounded-full w-[30px] h-[30px] flex justify-center items-center">
              <ThermometerSun />
              </div>
              <p className="text-gray-150 text-sm"></p>
            </div>
          </LargeCard>

         

        </div>

        <div>
        </div>


      </div>
    </div>
  );
};

export default MainContent;
