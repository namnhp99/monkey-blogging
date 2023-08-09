import { LoadingSpinner } from "components/loading";
import React from "react";

const LoadingFallback = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <LoadingSpinner borderColor="blue"></LoadingSpinner>
    </div>
  );
};

export default LoadingFallback;
