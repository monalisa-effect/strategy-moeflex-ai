import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowRightLeft, Clock, User, Plus } from "lucide-react";
import { Link } from "react-router-dom";

const demoSwaps = [
  {
    id: 1,
    title: "Logo Design for Website Copy",
    user: {
      name: "Sarah Chen",
      avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    },
    offering: "Logo Design",
    needing: "Website Copywriting",
    hours: 8,
    deliveryTime: "1 week",
    description: "I'll create a professional logo package (3 concepts, unlimited revisions) in exchange for compelling website copy for my design portfolio.",
  },
  {
    id: 2,
    title: "Social Media Strategy for Video Editing",
    user: {
      name: "Marcus Johnson",
      avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    },
    offering: "Social Media Strategy",
    needing: "Video Editing",
    hours: 12,
    deliveryTime: "2 weeks",
    description: "Complete social media strategy with content calendar and posting schedule for your business in exchange for editing my YouTube videos.",
  },
  {
    id: 3,
    title: "Web Development for SEO Optimization",
    user: {
      name: "Emily Rodriguez",
      avatar: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    },
    offering: "React Development",
    needing: "SEO Services",
    hours: 15,
    deliveryTime: "3 weeks",
    description: "I'll build a responsive React website with modern design in exchange for comprehensive SEO optimization of my existing site.",
  },
  {
    id: 4,
    title: "Graphic Design for Content Writing",
    user: {
      name: "David Kim",
      avatar: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
    },
    offering: "Graphic Design",
    needing: "Blog Writing",
    hours: 6,
    deliveryTime: "5 days",
    description: "Social media graphics package (10 posts + templates) for a series of well-researched blog posts about design trends.",
  },
];

const SkillSwapShowcase = () => {
  return (
    <div className="py-20 px-6 bg-slate-50">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">
            Discover <span className="gradient-text">SkillSwap</span> Opportunities
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Trade your skills with other professionals. No money involved—just fair exchanges that help everyone grow.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {demoSwaps.map((swap) => (
            <Card key={swap.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={swap.user.avatar} alt={swap.user.name} />
                      <AvatarFallback>{swap.user.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{swap.title}</CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {swap.user.name}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {swap.hours}h • {swap.deliveryTime}
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-4">{swap.description}</p>
                
                <div className="flex items-center justify-center space-x-4 p-4 bg-white rounded-lg border">
                  <div className="text-center">
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      Offering: {swap.offering}
                    </Badge>
                  </div>
                  <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
                  <div className="text-center">
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                      Needs: {swap.needing}
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
              <Plus className="h-4 w-4" />
              Create Your Swap
            </Link>
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Join thousands of professionals exchanging skills every day
          </p>
        </div>
      </div>
    </div>
  );
};

export default SkillSwapShowcase;