import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lightbulb, Users, Calculator, Star, FileText, AlertTriangle, Phone } from "lucide-react";

const Help = () => {
  const [activeSection, setActiveSection] = useState("getting-started");

  const sections = [
    { id: "getting-started", label: "Getting Started", icon: Lightbulb },
    { id: "strategy-generator", label: "Strategy Generator", icon: Lightbulb },
    { id: "safety", label: "Safety & Trust", icon: AlertTriangle },
    { id: "contact", label: "Contact Support", icon: Phone },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-4">Help Center</h1>
          <p className="text-xl text-muted-foreground">
            Find answers to common questions and learn how to make the most of Moeflex
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Help Topics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <Button
                      key={section.id}
                      variant={activeSection === section.id ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveSection(section.id)}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {section.label}
                    </Button>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeSection === "getting-started" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5" />
                    Getting Started with Moeflex
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="account">
                      <AccordionTrigger>How do I create an account?</AccordionTrigger>
                      <AccordionContent>
                        <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                          <li>Click "Sign In" in the top navigation</li>
                          <li>Choose "Sign Up" on the authentication page</li>
                          <li>Enter your email and create a secure password</li>
                          <li>Verify your email address</li>
                          <li>Complete your profile setup</li>
                        </ol>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="features">
                      <AccordionTrigger>What features are available?</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-3">
                          <div>
                            <Badge variant="secondary" className="mb-2">Strategy Generator</Badge>
                            <p className="text-sm text-muted-foreground">AI-powered marketing strategies tailored to your business</p>
                          </div>
                          <div>
                            <Badge variant="secondary" className="mb-2">Trends & Analytics</Badge>
                            <p className="text-sm text-muted-foreground">Market insights and trending strategies</p>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            )}

            {activeSection === "strategy-generator" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5" />
                    Strategy Generator Guide
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="how-to-use">
                      <AccordionTrigger>How to generate a marketing strategy</AccordionTrigger>
                      <AccordionContent>
                        <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                          <li>Navigate to the "Strategy Generator" page</li>
                          <li>Fill out the required fields marked with <span className="text-red-500">*</span>:
                            <ul className="list-disc list-inside ml-4 mt-1">
                              <li>Business Name</li>
                              <li>Industry/Niche</li>
                              <li>Business Description</li>
                              <li>Marketing Goals</li>
                              <li>Target Audience Demographics</li>
                              <li>Preferred Platforms</li>
                            </ul>
                          </li>
                          <li>Optionally fill additional details for better results</li>
                          <li>Click "Generate Strategy" to get your AI-powered plan</li>
                          <li>Review and download your strategy as PDF</li>
                        </ol>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="tips">
                      <AccordionTrigger>Tips for better results</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                          <li>Be specific about your target audience demographics</li>
                          <li>Clearly define your marketing goals (brand awareness, lead generation, sales, etc.)</li>
                          <li>Provide detailed business descriptions including your unique value proposition</li>
                          <li>Mention your current marketing challenges if any</li>
                          <li>Include budget ranges if you have specific constraints</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            )}

            {activeSection === "safety" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Safety & Trust
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="rating-system">
                      <AccordionTrigger className="flex items-center gap-2">
                        <Star className="h-4 w-4" />
                        Rating and Review System
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-3 text-muted-foreground">
                          <p>After each completed swap, both parties can rate each other:</p>
                          <ul className="list-disc list-inside space-y-2">
                            <li><strong>Star ratings:</strong> 1-5 stars for overall experience</li>
                            <li><strong>Written feedback:</strong> Detailed comments about the collaboration</li>
                            <li><strong>Public display:</strong> Ratings appear on user profiles</li>
                            <li><strong>Trust building:</strong> Higher ratings increase credibility</li>
                          </ul>
                          <p className="mt-3 p-3 bg-muted rounded-lg">
                            <strong>Tip:</strong> Always complete your part of the swap and communicate clearly to maintain a good rating.
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="agreement-builder">
                      <AccordionTrigger className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Swap Agreement Builder
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-3 text-muted-foreground">
                          <p>Use our agreement builder to set clear expectations:</p>
                          <ul className="list-disc list-inside space-y-2">
                            <li><strong>Service delivery:</strong> Exact deliverables for both parties</li>
                            <li><strong>Format requirements:</strong> File types, dimensions, specifications</li>
                            <li><strong>Deadlines:</strong> Clear timeline for completion</li>
                            <li><strong>Tools and resources:</strong> What each party will provide</li>
                            <li><strong>Revision rounds:</strong> How many changes are included</li>
                          </ul>
                          <p className="mt-3 p-3 bg-muted rounded-lg">
                            <strong>Important:</strong> Both parties must agree to terms before work begins.
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="reporting">
                      <AccordionTrigger>Reporting and Moderation</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-3 text-muted-foreground">
                          <p>Report users for inappropriate behavior:</p>
                          <ul className="list-disc list-inside space-y-2">
                            <li><strong>No-shows:</strong> Users who don't deliver as promised</li>
                            <li><strong>Poor quality work:</strong> Deliverables that don't meet agreed standards</li>
                            <li><strong>Spam or harassment:</strong> Inappropriate messages or behavior</li>
                            <li><strong>Incomplete trades:</strong> Users who disappear mid-project</li>
                          </ul>
                          <p className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <strong>Strike System:</strong> Users receive warnings for violations. After 3 strikes, accounts are flagged for review and potential suspension.
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            )}

            {activeSection === "contact" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    Contact Support
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-2">Need Help?</h3>
                      <p className="text-muted-foreground mb-4">
                        Can't find what you're looking for? Our support team is here to help.
                      </p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <Card>
                        <CardContent className="pt-6">
                          <h4 className="font-medium mb-2">Email Support</h4>
                          <p className="text-sm text-muted-foreground mb-3">
                            For general questions and account issues
                          </p>
                          <p className="text-sm font-medium">support@moeflex.com</p>
                          <p className="text-xs text-muted-foreground">Response within 24 hours</p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="pt-6">
                          <h4 className="font-medium mb-2">Priority Support</h4>
                          <p className="text-sm text-muted-foreground mb-3">
                            For urgent disputes and safety issues
                          </p>
                          <p className="text-sm font-medium">urgent@moeflex.com</p>
                          <p className="text-xs text-muted-foreground">Response within 4 hours</p>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-medium mb-2">Before contacting support:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Check this help center for common solutions</li>
                        <li>• Include your account email and relevant details</li>
                        <li>• For swap disputes, include the swap ID and timeline</li>
                        <li>• Attach screenshots if reporting a technical issue</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;