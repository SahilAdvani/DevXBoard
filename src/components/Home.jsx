"use client";

import React from "react";
import { useSelector } from "react-redux";
import Navbar from "@/components/Navbar";


const ClientHome = () => {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  return (
    <>
    <div
      className={`min-h-screen 
        ${
        isDarkMode ? "bg-white text-black" : "bg-black text-white"
}`}
    >
            <Navbar/>

      Home Page
    </div></>
  );
};

export default ClientHome;
