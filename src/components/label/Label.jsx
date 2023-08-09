import React from "react";

const Label = ({ htmlFor = "", children }) => {
  return (
    <label htmlFor={htmlFor} className="font-medium cursor-pointer text-gray4b">
      {children}
    </label>
  );
};

export default Label;
