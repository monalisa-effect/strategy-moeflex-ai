
import React from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingUp, Users, Search, Newspaper } from "lucide-react";

// Mock data for trending topics
const trendingTopics = [
  {
    id: 1,
    topic: "Sustainable Fashion Challenge",
    platforms: ["TikTok", "Instagram"],
    engagement: "High",
    audience: "Gen Z, Millennials",
    description: "Users sharing sustainable outfit transformations and thrifting hauls.",
    growth: "+243% in the last week",
    icon: TrendingUp,
  },
  {
    id: 2,
    topic: "AI Image Generators",
    platforms: ["Twitter", "Instagram", "TikTok"],
    engagement: "Very High",
    audience: "Tech Enthusiasts, Creators",
    description: "Discussions and examples of AI-created artwork and design concepts.",
    growth: "+187% in the last week",
    icon: Search,
  },
  {
    id: 3,
    topic: "Productivity Routines",
    platforms: ["LinkedIn", "YouTube"],
    engagement: "Medium",
    audience: "Professionals, Students",
    description: "Morning routines and productivity hacks for optimal workflow.",
    growth: "+78% in the last week",
    icon: Users,
  },
  {
    id: 4,
    topic: "Quick Recipe Shorts",
    platforms: ["TikTok", "Instagram Reels"],
    engagement: "High",
    audience: "Food Enthusiasts, Busy Parents",
    description: "15-second recipes that are easy to follow and make.",
    growth: "+156% in the last week",
    icon: TrendingUp,
  },
];

// Mock data for algorithm updates
const algorithmUpdates = [
  {
    id: 1,
    platform: "Instagram",
    date: "April 20, 2025",
    title: "Reels Algorithm Prioritizes Original Content",
    description: "Instagram announced a major update to their Reels algorithm, prioritizing original content over recycled TikToks. Content with visible watermarks from other platforms will be significantly deprioritized.",
    impact: "High",
    recommendation: "Focus on creating platform-native content specifically for Instagram without repurposing from other platforms with visible watermarks.",
  },
  {
    id: 2,
    platform: "TikTok",
    date: "April 18, 2025",
    title: "Watch Time Metric Changes",
    description: "TikTok's algorithm now places higher emphasis on full video watch time rather than just view count. Videos that are watched completely will receive significantly more distribution.",
    impact: "Medium",
    recommendation: "Create shorter, highly engaging videos that encourage viewers to watch until the end. Hook viewers in the first 3 seconds.",
  },
  {
    id: 3,
    platform: "LinkedIn",
    date: "April 15, 2025",
    title: "Text-Only Posts Gain Prominence",
    description: "LinkedIn has adjusted their algorithm to give more weight to text-only posts with meaningful conversation starters. Posts with external links are being deprioritized.",
    impact: "Medium",
    recommendation: "Focus on creating thoughtful text posts that encourage discussion. If sharing links, add them in the comments instead of the main post.",
  },
];

// Mock data for industry news
const industryNews = [
  {
    id: 1,
    headline: "Meta Introduces Advanced Creator Analytics",
    date: "April 23, 2025",
    source: "Social Media Today",
    summary: "Meta has rolled out new analytics tools for creators across Instagram and Facebook, providing deeper insights into audience demographics, content performance, and monetization opportunities.",
    link: "#",
    important: true,
  },
  {
    id: 2,
    headline: "Twitter Expands Character Limit for Premium Users",
    date: "April 21, 2025",
    source: "TechCrunch",
    summary: "Twitter announced that premium subscribers will now have access to expanded 4,000 character posts, along with enhanced formatting options.",
    link: "#",
    important: false,
  },
  {
    id: 3,
    headline: "TikTok Launches Advanced Business Suite",
    date: "April 19, 2025",
    source: "Marketing Dive",
    summary: "TikTok has unveiled a new business suite with advanced advertising tools, improved targeting options, and integrated e-commerce features to help brands increase ROI.",
    link: "#",
    important: true,
  },
  {
    id: 4,
    headline: "LinkedIn Tests New Content Discovery Feed",
    date: "April 17, 2025",
    source: "Social Media Examiner",
    summary: "LinkedIn is testing a new discovery feed algorithm that surfaces content from outside users' networks to increase engagement and networking opportunities.",
    link: "#",
    important: false,
  },
];

const Trends = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 py-10 px-6 bg-gray-50">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Trends & <span className="gradient-text">News Hub</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Stay ahead of the curve with real-time updates on trending topics, algorithm changes, and industry news.
            </p>
          </div>

          <Tabs defaultValue="trending" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
              <TabsTrigger value="trending">Trending Topics</TabsTrigger>
              <TabsTrigger value="algorithms">Algorithm Updates</TabsTrigger>
              <TabsTrigger value="news">Industry News</TabsTrigger>
            </TabsList>

            <TabsContent value="trending" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {trendingTopics.map((topic) => (
                  <Card key={topic.id}>
                    <CardHeader className="pb-2">
                      <div className="flex gap-4 items-start">
                        <div className="h-10 w-10 rounded-lg gradient-bg flex items-center justify-center">
                          <topic.icon className="text-white h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle>{topic.topic}</CardTitle>
                          <CardDescription className="mt-1">{topic.growth}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {topic.platforms.map((platform, index) => (
                          <Badge key={index} variant="outline" className="bg-slate-100">
                            {platform}
                          </Badge>
                        ))}
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Engagement</p>
                          <p className="font-medium">{topic.engagement}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Target Audience</p>
                          <p className="font-medium">{topic.audience}</p>
                        </div>
                      </div>
                      <p className="text-sm">{topic.description}</p>
                    </CardContent>
                    <CardFooter className="border-t bg-slate-50">
                      <Button className="w-full" variant="outline">
                        See Content Examples
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="algorithms">
              <div className="space-y-6">
                {algorithmUpdates.map((update) => (
                  <Card key={update.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline">{update.platform}</Badge>
                            <span className="text-sm text-muted-foreground">{update.date}</span>
                          </div>
                          <CardTitle>{update.title}</CardTitle>
                        </div>
                        <Badge className={update.impact === "High" ? "bg-orange-100 text-orange-700 border-orange-200" : "bg-blue-100 text-blue-700 border-blue-200"}>
                          {update.impact} Impact
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-4">{update.description}</p>
                      <div className="bg-slate-50 p-4 rounded-lg border">
                        <h4 className="font-medium mb-2">Recommended Action:</h4>
                        <p className="text-sm">{update.recommendation}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="news">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[350px]">Headline</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead className="w-[350px]">Summary</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {industryNews.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        {item.headline}
                        {item.important && (
                          <Badge className="ml-2 bg-red-100 text-red-700 border-red-200">
                            Important
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{item.date}</TableCell>
                      <TableCell>{item.source}</TableCell>
                      <TableCell className="text-sm">{item.summary}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" className="w-full">
                          Read More
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-6 flex justify-center">
                <Button className="gap-2">
                  <Newspaper className="h-4 w-4" />
                  View All News
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Trends;
