import React from "react";
import { twMerge } from "tailwind-merge";

const Heading = ({ className = "", children }) => {
  return (
    <h2
      className={twMerge(
        "text-[28px] font-semibold relative mb-[30px] max-lg:text-[22px] max-lg:mb-5",
        className
      )}
    >
      {children}
    </h2>
  );
};

export default Heading;
