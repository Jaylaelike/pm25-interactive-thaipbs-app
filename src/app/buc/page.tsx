"use client";
/* eslint-disable react-hooks/rules-of-hooks */
import React from "react";
import MainContent from "../components/buc_components/MainContent";
import SideBar from "../components/buc_components/SideBar";


import useSensorDataforBuc from "@/lib/useSensorForBuc";
function page() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { bgColorMain, bgColor } = useSensorDataforBuc();

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



  return (
    <div className={`${bgColorClass} flex flex-col lg:flex-row w-full h-full`}>
      <SideBar bgColors={bgColor} />
      <MainContent />
    </div>
  );
}

export default page;
