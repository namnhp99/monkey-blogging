import React from "react";
import Header from "./Header";

const RootLayout = ({ children }) => {
  return (
    <div className="py-10">
      <Header></Header>
      {children}
    </div>
  );
};

export default RootLayout;
