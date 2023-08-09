import React from "react";
import { useDropdown } from "contexts/dropdown-context";

const Option = (props) => {
  const { setShow } = useDropdown();
  const { onClick } = props;
  const handleClick = () => {
    if (onClick) onClick();
    setShow(false);
  };
  return (
    <div
      className="py-[15px] px-[25px]  cursor-pointer flex items-center justify-between hover:text-primary transition-all"
      onClick={handleClick}
    >
      {props.children}
    </div>
  );
};

export default Option;
