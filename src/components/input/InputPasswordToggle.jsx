import { IconEyeClose, IconEyeOpen } from "components/icon";
import React, { useState } from "react";
import Input from "./Input";

const InputPasswordToggle = ({ control, name = "password" }) => {
  const [showPassWord, setShowPassWord] = useState(false);
  const handleShowPassword = () => {
    setShowPassWord(!showPassWord);
  };
  return (
    <Input
      type={showPassWord ? "text" : "password"}
      name={name}
      placeholder="Enter your password"
      control={control}
    >
      {showPassWord ? (
        <IconEyeOpen onClick={handleShowPassword}></IconEyeOpen>
      ) : (
        <IconEyeClose onClick={handleShowPassword}></IconEyeClose>
      )}
    </Input>
  );
};

export default InputPasswordToggle;
