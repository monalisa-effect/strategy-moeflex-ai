
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Lightbulb } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  
  return (
    <nav className="border-b py-4 px-6 bg-white/90 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-full gradient-bg flex items-center justify-center">
            <Lightbulb className="text-white h-5 w-5" />
          </div>
          <span className="text-2xl font-bold gradient-text">Moeflex</span>
        </Link>
        <div className="hidden md:flex gap-6">
          <Link 
            to="/" 
            className={`${location.pathname === '/' ? 'text-foreground' : 'text-muted-foreground'} hover:text-foreground transition-colors`}
          >
            Home
          </Link>
          <Link 
            to="/generator" 
            className={`${location.pathname === '/generator' ? 'text-foreground' : 'text-muted-foreground'} hover:text-foreground transition-colors`}
          >
            Strategy Generator
          </Link>
          <Link 
            to="/marketplace" 
            className={`${location.pathname === '/marketplace' ? 'text-foreground' : 'text-muted-foreground'} hover:text-foreground transition-colors`}
          >
            Marketplace
          </Link>
          <Link 
            to="/trends" 
            className={`${location.pathname === '/trends' ? 'text-foreground' : 'text-muted-foreground'} hover:text-foreground transition-colors`}
          >
            Trends
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="hidden md:inline-flex">
            Sign In
          </Button>
          <Button className="gradient-bg">Get Started</Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
