import React from "react";
import { Link } from "react-router-dom";
import { twMerge } from "tailwind-merge";

const typeCheckClassName = (type) => {
  switch (type) {
    case "primary": {
      return "bg-slate-500";
    }
    case "secondary": {
      return "bg-white";
    }
    default:
      break;
  }
};
const categoryClassName =
  "inline-block py-1 px-[10px] rounded-[10px] text-white text-sm font-medium whitespace-nowrap max-lg:text-[10px] hover:bg-opacity-80 transition-all duration-300";

const PostCategory = ({
  children,
  type = "primary",
  className = "",
  to = "",
}) => {
  return (
    <Link
      to={`/category/${to}`}
      className={twMerge(
        categoryClassName,
        typeCheckClassName(type),
        className
      )}
    >
      {children}
    </Link>
  );
};

export default PostCategory;
