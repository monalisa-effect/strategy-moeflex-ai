
import React, { useState, useEffect } from "react";
import { 
  Lightbulb, 
  Users, 
  TrendingUp, 
  FileText, 
  Save 
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useUserProfile } from "@/hooks/useUserProfile";

const Features = () => {
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

  const allFeatures = [
    {
      title: "AI-Powered Strategy Generator",
      description: "Instantly delivers content strategy, ideas, posting schedules, and hashtag suggestions based on your business needs.",
      icon: Lightbulb,
    },
    {
      title: "SkillSwap Exchange",
      description: "Exchange skills with other professionals—trade your expertise for services you need without spending money.",
      icon: Users,
      adminOnly: true,
    },
    {
      title: "Trend & News Hub",
      description: "Real-time updates on platform algorithm changes, viral trends, and industry insights to keep you ahead.",
      icon: TrendingUp,  
    },
    {
      title: "Smart Brief Builder",
      description: "Automatically generate client-ready briefs and content calendars from strategy outputs.",
      icon: FileText,
    },
    {
      title: "Swap Calculator",
      description: "Calculate fair skill exchanges with our built-in calculator that estimates service values and ensures balanced trades.",
      icon: Save,
      adminOnly: true,
    },
  ];

  const features = allFeatures.filter(feature => !feature.adminOnly || isAdmin);
  return (
    <div className="py-20 px-6 bg-slate-50">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">
            Everything You Need to <span className="gradient-text">Supercharge</span> Your Social Media Strategy
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Moeflex brings together strategy, talent, and trends into one powerful platform.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <Card key={i} className="border shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="h-12 w-12 rounded-lg gradient-bg flex items-center justify-center mb-4">
                  <feature.icon className="text-white h-6 w-6" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
