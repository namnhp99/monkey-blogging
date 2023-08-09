import React from "react";
import { Link } from "react-router-dom";

const AuthenticationLayout = ({ children }) => {
  return (
    <div className="min-h-screen p-10">
      <div
        className="container flex flex-col items-center"
        aria-label="auth-page"
      >
        <Link to={"/"}>
          <img srcSet="/logo.png 2x" alt="monkey-blogging" className="logo" />
        </Link>
        <h1
          className="text-center text-primary font-bold text-[40px] mb-[60px] mt-5"
          aria-label="heading"
        >
          Monkey blogging
        </h1>
        {children}
      </div>
    </div>
  );
};

export default AuthenticationLayout;
