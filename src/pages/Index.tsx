
import React from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import SkillSwapShowcase from "@/components/SkillSwapShowcase";
import SwapCalculator from "@/components/SwapCalculator";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Hero />
      <Features />
      <SkillSwapShowcase />
      <SwapCalculator />
      
      <div className="py-20 px-6 bg-white text-center">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your <span className="gradient-text">Social Media Strategy</span>?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of social media managers who are saving time and driving better results with Moeflex.
          </p>
          <Button asChild size="lg" className="gradient-bg">
            <Link to="/generator" className="flex items-center gap-2">
              Generate Your Strategy <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
      
      <footer className="bg-slate-900 text-white py-10 px-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between gap-8">
            <div className="md:w-1/3">
              <Link to="/" className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-full gradient-bg flex items-center justify-center">
                  <span className="font-bold">M</span>
                </div>
                <span className="text-2xl font-bold">Moeflex</span>
              </Link>
              <p className="mt-4 text-slate-300">
                AI-powered social media strategy tools for busy managers and marketers.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-semibold mb-4">Product</h3>
                <ul className="space-y-2">
                  <li><Link to="/generator" className="text-slate-300 hover:text-white">Strategy Generator</Link></li>
                  <li><Link to="/marketplace" className="text-slate-300 hover:text-white">SkillSwap</Link></li>
                  <li><Link to="/trends" className="text-slate-300 hover:text-white">Trend Hub</Link></li>
                  <li><a href="#" className="text-slate-300 hover:text-white">Swap Calculator</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Company</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-slate-300 hover:text-white">About</a></li>
                  <li><a href="#" className="text-slate-300 hover:text-white">Blog</a></li>
                  <li><a href="#" className="text-slate-300 hover:text-white">Careers</a></li>
                  <li><a href="#" className="text-slate-300 hover:text-white">Contact</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Legal</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-slate-300 hover:text-white">Privacy Policy</a></li>
                  <li><a href="#" className="text-slate-300 hover:text-white">Terms of Service</a></li>
                  <li><a href="#" className="text-slate-300 hover:text-white">Cookie Policy</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-10 pt-6 text-center text-slate-400">
            <p>© {new Date().getFullYear()} Moeflex. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
