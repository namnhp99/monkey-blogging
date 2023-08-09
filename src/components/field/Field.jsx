import React from "react";
import { twMerge } from "tailwind-merge";

const Field = ({ children, className = "" }) => {
  return (
    <div
      className={twMerge(
        "flex flex-col items-start gap-y-5 mb-[25px] last:mb-0",
        className
      )}
    >
      {children}
    </div>
  );
};

export default Field;
