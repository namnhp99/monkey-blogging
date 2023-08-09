import { Button } from "components/button";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PageNotFound = () => {
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "Page Not Found";
  }, []);

  return (
    <div className="flex flex-col items-center pt-10">
      <img src="/404.png" alt="404" className="w-[300px]" />
      <h1 className="font-bold text-[60px] mb-5">Oops! Page not found</h1>
      <Button onClick={() => navigate("/")} kind="primary">
        Back to home
      </Button>
    </div>
  );
};

export default PageNotFound;
