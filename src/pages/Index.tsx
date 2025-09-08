
import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import SkillSwapShowcase from "@/components/SkillSwapShowcase";
import SwapCalculator from "@/components/SwapCalculator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useUserProfile } from "@/hooks/useUserProfile";

const Index = () => {
  const [user, setUser] = useState(null);
  const { profile } = useUserProfile(user);
  const isAdmin = profile?.role === 'admin';

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Hero />
      <Features />
      
      {/* SkillSwap Info Section - Only for admins */}
      {isAdmin && (
        <div className="py-20 px-6 bg-gradient-to-br from-slate-50 to-blue-50">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
                Discover <span className="gradient-text">SkillSwap</span> Exchange
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                Trade your skills for services you need. No money, just value exchange between professionals.
              </p>
            </div>
          
          {/* Demo SkillSwap Options */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[
              {
                name: "Sarah Chen",
                skill: "Instagram Content Creation",
                seeking: "Web Design",
                avatar: "/placeholder.svg",
                rating: 4.9,
                exchanges: 23
              },
              {
                name: "Marcus Rodriguez",
                skill: "Video Editing",
                seeking: "Copywriting",
                avatar: "/placeholder.svg",
                rating: 5.0,
                exchanges: 15
              },
              {
                name: "Emma Thompson",
                skill: "SEO Strategy",
                seeking: "Social Media Management",
                avatar: "/placeholder.svg",
                rating: 4.8,
                exchanges: 31
              },
              {
                name: "David Kim",
                skill: "Graphic Design",
                seeking: "Content Writing",
                avatar: "/placeholder.svg",
                rating: 4.9,
                exchanges: 18
              },
              {
                name: "Lisa Park",
                skill: "Email Marketing",
                seeking: "Photography",
                avatar: "/placeholder.svg",
                rating: 5.0,
                exchanges: 27
              },
              {
                name: "Alex Johnson",
                skill: "Analytics & Reporting",
                seeking: "Video Production",
                avatar: "/placeholder.svg",
                rating: 4.7,
                exchanges: 12
              }
            ].map((user, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{user.name}</CardTitle>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{user.rating}</span>
                        <span className="text-sm text-muted-foreground">({user.exchanges} swaps)</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Offering: {user.skill}
                      </Badge>
                    </div>
                    <div>
                      <Badge variant="outline" className="border-blue-200 text-blue-800">
                        Seeking: {user.seeking}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
            <div className="text-center">
              <Button asChild size="lg" className="gradient-bg">
                <Link to="/marketplace" className="flex items-center gap-2">
                  Start SkillSwapping <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {isAdmin && <SkillSwapShowcase />}
      {isAdmin && <SwapCalculator />}
      
      <div className="py-20 px-6 bg-white text-center">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your <span className="gradient-text">Social Media Strategy</span>?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of social media managers who are saving time and driving better results with Moeflex.
          </p>
          <div className="max-w-full px-4">
            <Button asChild size="lg" className="gradient-bg w-full sm:w-auto">
              <Link to="/generator" className="flex items-center justify-center gap-2">
                Generate Your Strategy <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
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
                  {isAdmin && <li><Link to="/marketplace" className="text-slate-300 hover:text-white">SkillSwap</Link></li>}
                  <li><Link to="/trends" className="text-slate-300 hover:text-white">Trend Hub</Link></li>
                  {isAdmin && <li><a href="#" className="text-slate-300 hover:text-white">Swap Calculator</a></li>}
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
