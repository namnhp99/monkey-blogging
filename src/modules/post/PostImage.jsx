import React from "react";
import { Link } from "react-router-dom";
import { twMerge } from "tailwind-merge";
const PostImage = ({ url = "", alt = "", to = "", className = "" }) => {
  if (to)
    return (
      <Link
        to={`/${to}`}
        className={twMerge(
          "block h-full cursor-pointer rounded-2xl ",
          className
        )}
      >
        <img
          src={url}
          alt={alt}
          loading="lazy"
          className="w-full h-full object-cover rounded-[inherit]"
        />
      </Link>
    );
  return (
    <div className={twMerge("rounded-2xl", className)}>
      <img
        src={url}
        alt={alt}
        loading="lazy"
        className="object-cover w-full h-full rounded-2xl"
      />
    </div>
  );
};

export default PostImage;
