import React from "react";
import { Link } from "react-router-dom";
import { twMerge } from "tailwind-merge";
const typeCheckClassName = (type) => {
  switch (type) {
    case "primary": {
      return "text-white";
    }
    case "secondary": {
      return "text-grayDark";
    }
    default:
      break;
  }
};
const PostMeta = ({
  date = "",
  authorName = "",
  type = "primary",
  to = "",
}) => {
  return (
    <div
      type={type}
      className={twMerge(
        "flex items-center gap-3 text-sm font-semibold max-lg:text-[10px] max-lg:gap-[6px]",
        typeCheckClassName(type)
      )}
    >
      <span className="post-time">{date}</span>
      <span className="inline-block w-1 h-1 bg-current rounded-full post-dot"></span>
      <Link to={`/author/${to}`} className="transition-all hover:underline">
        <span className="post-author">{authorName}</span>
      </Link>
    </div>
  );
};

export default PostMeta;
