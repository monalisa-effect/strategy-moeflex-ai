import React from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, Users, TrendingUp, Shield } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold gradient-text mb-4">About Moeflex</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Empowering businesses and professionals with AI-driven marketing strategies and skill exchange opportunities.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We believe every business deserves access to expert-level marketing strategies. 
                Our AI-powered platform democratizes marketing expertise, making it accessible 
                to entrepreneurs, small businesses, and growing companies worldwide.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Community First
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Beyond AI-generated strategies, we foster a community where professionals 
                can exchange skills and services. SkillSwap connects you with peers who 
                complement your expertise, creating mutually beneficial partnerships.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">What We Offer</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">AI Strategy Generator</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Get personalized marketing strategies based on your business goals, 
                  target audience, and industry trends.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">SkillSwap Marketplace</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Exchange services with other professionals. Trade your expertise 
                  for skills you need to grow your business.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Market Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Stay ahead with trending strategies, popular skills, and 
                  market analysis to inform your business decisions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Trust & Safety
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              We prioritize the safety and security of our community. Our platform includes 
              rating systems, verification processes, and moderation tools to ensure positive 
              experiences for all users. Every swap is protected by our agreement system and 
              dispute resolution process.
            </p>
          </CardContent>
        </Card>

        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Transform Your Business?</h2>
          <p className="text-muted-foreground mb-6">
            Join thousands of professionals who are already leveraging AI-powered strategies 
            and skill exchanges to grow their businesses.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;