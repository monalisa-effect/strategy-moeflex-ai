
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <div className="py-20 px-6">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center space-y-6 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            AI-Powered Social Media <span className="gradient-text">Strategy</span> in Minutes
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Moeflex helps social media managers create data-backed content strategies, find talent, and stay ahead of trends.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Button asChild size="lg" className="gradient-bg text-white">
              <Link to="/generator" className="flex items-center gap-2">
                Generate Strategy <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="#">Learn More</Link>
            </Button>
          </div>
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {["10k+ Strategies Generated", "5k+ Social Media Managers", "200+ Industries Covered", "24/7 AI Assistant"].map((stat, i) => (
              <div key={i} className="flex flex-col items-center p-4 rounded-lg border bg-card">
                <p className="text-sm text-muted-foreground">{stat}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
