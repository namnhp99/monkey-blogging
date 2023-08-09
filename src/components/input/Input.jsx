import React from "react";
import { useController } from "react-hook-form";
import PropTypes from "prop-types";

const Input = ({
  control,
  name = "",
  type = "text",
  children,
  hasIcon = false,
  ...props
}) => {
  const { field } = useController({
    control,
    name,
    defaultValue: "",
  });
  const inputClassName =
    "w-full rounded-lg font-medium border border-grayf1 transition-all focus:bg-white  focus:border-black placeholder:text-[#84878b] ";
  return (
    <div className="relative w-full">
      <input
        id={name}
        type={type}
        {...field}
        className={`${inputClassName} ${
          hasIcon ? "p-[15px_60px_15px_15px]" : "p-[15px]"
        }`}
        {...props}
      />
      {children ? (
        <div
          className="absolute -translate-y-1/2 cursor-pointer top-1/2 right-5"
          aria-label="input-icon"
        >
          {children}
        </div>
      ) : null}
    </div>
  );
};
Input.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  children: PropTypes.any,
  control: PropTypes.any.isRequired,
  hasIcon: PropTypes.bool,
};
export default Input;
