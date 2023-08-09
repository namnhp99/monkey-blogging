import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { LoadingSpinner } from "components/loading";
import { twMerge } from "tailwind-merge";
const buttonClassName =
  "cursor-pointer h-[56px]  flex justify-center items-center font-semibold text-lg rounded-lg px-5 outline-none transition-all  disabled:opacity-50 disabled:pointer-events-none";
const kindCheck = (kind) => {
  switch (kind) {
    case "primary": {
      return "text-white bg-primary";
    }
    case "secondary": {
      return "text-primary bg-white";
    }
    case "ghost": {
      return "text-primary bg-[rgba(29, 192, 113, 0.1)]";
    }
    case "header": {
      return "max-w-[150px] h-[56px] border border-slate-200 text-primary hover:bg-primary hover:text-white hover:border-transparent max-lg:hidden font-medium";
    }
    default:
      break;
  }
};
const Button = ({
  type = "button",
  onClick = () => {},
  children,
  to,
  kind = "",
  isLoading,
  className = "",
  ...props
}) => {
  const child = isLoading ? <LoadingSpinner></LoadingSpinner> : children;
  if (to !== "" && typeof to === "string") {
    return (
      <Link to={to}>
        <button
          type={type}
          kind={kind}
          className={twMerge(buttonClassName, kindCheck(kind), className)}
          {...props}
        >
          {child}
        </button>
      </Link>
    );
  }
  return (
    <button
      type={type}
      kind={kind}
      className={twMerge(buttonClassName, kindCheck(kind), className)}
      onClick={onClick}
      {...props}
    >
      {child}
    </button>
  );
};
Button.propTypes = {
  type: PropTypes.oneOf(["button", "submit"]),
  onClick: PropTypes.func,
  children: PropTypes.node,
  kind: PropTypes.oneOf(["primary", "secondary", "ghost", "header"]),
};
export default Button;
