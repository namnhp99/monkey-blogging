import React from "react";
import { Link } from "react-router-dom";
import { twMerge } from "tailwind-merge";

const sizeCheckClassName = (size) => {
  switch (size) {
    case "normal": {
      return "text-lg max-lg:text-sm";
    }
    case "big": {
      return "text-[22px] max-lg:text-base";
    }
    default:
      break;
  }
};
const PostTitle = ({ children, className = "", size = "normal", to = "" }) => {
  return (
    <h3
      className={twMerge(
        "font-semibold leading-normal tracking-[0.25px]",
        sizeCheckClassName(size),
        className
      )}
    >
      <Link to={`/${to}`} className="block">
        {children}
      </Link>
    </h3>
  );
};

export default PostTitle;
