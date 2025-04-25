
import React from "react";
import { 
  Lightbulb, 
  Users, 
  TrendingUp, 
  FileText, 
  Save 
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    title: "AI-Powered Strategy Generator",
    description: "Instantly delivers content strategy, ideas, posting schedules, and hashtag suggestions based on your business needs.",
    icon: Lightbulb,
  },
  {
    title: "Talent Marketplace",
    description: "Connect with social media experts, content creators, and designers—or offer your services and get hired.",
    icon: Users,
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
    title: "Save & Share Tools",
    description: "Save strategies, export as PDFs, or collaborate with teams and clients directly in the app.",
    icon: Save,
  },
];

const Features = () => {
  return (
    <div className="py-20 px-6 bg-slate-50">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">
            Everything You Need to <span className="gradient-text">Supercharge</span> Your Social Media Strategy
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
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
