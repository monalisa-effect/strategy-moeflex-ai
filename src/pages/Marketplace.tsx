
import React from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock data for talents
const talents = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Social Media Manager",
    avatar: "/placeholder.svg",
    specialties: ["Instagram", "TikTok", "Content Creation"],
    rate: "$45/hr",
    experience: "5 years",
    bio: "Specializing in viral content strategies for lifestyle and fashion brands with proven track record of increasing engagement by 300%.",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Graphic Designer",
    avatar: "/placeholder.svg",
    specialties: ["Social Graphics", "Branding", "Motion Design"],
    rate: "$55/hr",
    experience: "7 years",
    bio: "Award-winning designer creating scroll-stopping visuals for top DTC brands and scaling startups.",
  },
  {
    id: 3,
    name: "Ava Williams",
    role: "Content Writer",
    avatar: "/placeholder.svg",
    specialties: ["Copywriting", "Brand Voice", "SEO"],
    rate: "$40/hr",
    experience: "4 years",
    bio: "Former journalist turned copywriter with expertise in crafting compelling stories that convert for B2B SaaS companies.",
  },
  {
    id: 4,
    name: "James Rodriguez",
    role: "Video Editor",
    avatar: "/placeholder.svg",
    specialties: ["Short-form Video", "YouTube", "Motion Graphics"],
    rate: "$60/hr",
    experience: "6 years",
    bio: "Specializing in creating viral short-form content for TikTok and Instagram Reels with over 50M+ views for clients.",
  },
];

// Mock data for jobs
const jobs = [
  {
    id: 1,
    title: "Social Media Manager Needed for Fashion Brand",
    company: "StyleHouse",
    budget: "$2,000-$3,500/month",
    location: "Remote",
    type: "Contract",
    platforms: ["Instagram", "TikTok", "Pinterest"],
    description: "Looking for an experienced social media manager to handle our fashion brand's presence across multiple platforms.",
    posted: "2 days ago",
  },
  {
    id: 2,
    title: "Content Creator for SaaS Company",
    company: "CloudTech Solutions",
    budget: "$50-$70/hour",
    location: "Remote",
    type: "Part-time",
    platforms: ["LinkedIn", "Twitter", "Blog"],
    description: "Seeking a B2B content creator to develop thought leadership content for our SaaS platform.",
    posted: "5 days ago",
  },
  {
    id: 3,
    title: "Video Editor for YouTube Channel",
    company: "FitLife",
    budget: "$35-$50/hour",
    location: "Remote",
    type: "Project-based",
    platforms: ["YouTube"],
    description: "Need a skilled video editor for our fitness YouTube channel with 500K subscribers.",
    posted: "1 week ago",
  },
];

const Marketplace = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 py-10 px-6 bg-gray-50">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Talent <span className="gradient-text">Marketplace</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Connect with talented social media professionals or find exciting opportunities in the industry.
            </p>
          </div>

          <Tabs defaultValue="talent" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="talent">Find Talent</TabsTrigger>
              <TabsTrigger value="jobs">Find Jobs</TabsTrigger>
            </TabsList>

            <TabsContent value="talent" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                {talents.map((talent) => (
                  <Card key={talent.id} className="overflow-hidden">
                    <CardHeader className="pb-0">
                      <div className="flex items-start justify-between">
                        <div className="flex gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={talent.avatar} alt={talent.name} />
                            <AvatarFallback>{talent.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle>{talent.name}</CardTitle>
                            <CardDescription className="mt-1">{talent.role}</CardDescription>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-semibold">{talent.rate}</span>
                          <p className="text-sm text-muted-foreground">{talent.experience}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <p className="text-sm mb-4">{talent.bio}</p>
                      <div className="flex flex-wrap gap-2">
                        {talent.specialties.map((specialty, index) => (
                          <Badge key={index} variant="outline" className="bg-slate-100">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="border-t bg-slate-50 flex justify-between">
                      <Button variant="outline" size="sm">View Profile</Button>
                      <Button className="gradient-bg" size="sm">Contact</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="jobs" className="space-y-4">
              <div className="grid gap-6">
                {jobs.map((job) => (
                  <Card key={job.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{job.title}</CardTitle>
                          <CardDescription className="mt-1">{job.company}</CardDescription>
                        </div>
                        <div className="text-right">
                          <span className="font-semibold text-sm">{job.budget}</span>
                          <p className="text-xs text-muted-foreground">Posted {job.posted}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <div className="flex gap-3 mb-3">
                        <Badge variant="outline" className="bg-slate-100">{job.location}</Badge>
                        <Badge variant="outline" className="bg-slate-100">{job.type}</Badge>
                      </div>
                      <p className="text-sm mb-3">{job.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {job.platforms.map((platform, index) => (
                          <Badge key={index} className="bg-primary/10 text-primary border-primary/20">
                            {platform}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="border-t bg-slate-50">
                      <Button className="w-full gradient-bg">Apply Now</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
