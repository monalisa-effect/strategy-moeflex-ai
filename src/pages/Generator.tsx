
import React from "react";
import Navbar from "@/components/Navbar";
import StrategyForm from "@/components/StrategyForm";

const Generator = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 py-6 sm:py-10 px-4 sm:px-6 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-6 sm:mb-10">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              Create Your <span className="gradient-text">Social Media Strategy</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground px-4">
              Answer a few questions about your business and let our AI generate a customized strategy for you.
            </p>
          </div>
          
          <StrategyForm />
        </div>
      </div>
    </div>
  );
};

export default Generator;
