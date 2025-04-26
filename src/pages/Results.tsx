
import React from "react";
import { useLocation, Navigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import StrategyResult from "@/components/StrategyResult";

const Results = () => {
  const location = useLocation();
  const { formData, aiGeneratedStrategy } = location.state || {};
  
  // Redirect to generator if no form data exists
  if (!formData) {
    return <Navigate to="/generator" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 py-10 px-6 bg-gray-50">
        <div className="container mx-auto max-w-5xl">
          <StrategyResult 
            data={formData} 
            aiGeneratedStrategy={aiGeneratedStrategy} 
          />
        </div>
      </div>
    </div>
  );
};

export default Results;
