import React from "react";
import { twMerge } from "tailwind-merge";

const DashboardHeading = ({ title = "", className = "" }) => {
  return (
    <h1
      className={twMerge(
        "font-bold text-[25px] max-lg:text-xl mb-5",
        className
      )}
    >
      {title}
    </h1>
  );
};

export default DashboardHeading;
