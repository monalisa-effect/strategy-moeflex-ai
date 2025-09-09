import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, Share, Calendar, TrendingUp, Target, Users, Lightbulb, Hash, Loader2, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { supabase } from "@/integrations/supabase/client";

interface StrategyResultProps {
  data: any; // In a real app, you'd define a proper type
  aiGeneratedStrategy?: string; // Added the aiGeneratedStrategy prop as optional
}

const StrategyResult: React.FC<StrategyResultProps> = ({ data, aiGeneratedStrategy }) => {
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [isGeneratingHashtags, setIsGeneratingHashtags] = useState(false);
  const [copiedHashtag, setCopiedHashtag] = useState<string | null>(null);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Social Media Strategy for ${data?.businessName || 'Your Business'}`,
          text: 'Check out my custom social media strategy!',
          url: window.location.href
        });
        toast.success("Strategy shared successfully!");
      } else {
        // Fallback: copy URL to clipboard
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Strategy link copied to clipboard!");
      }
    } catch (error) {
      toast.error("Failed to share strategy");
    }
  };

  const handleDownload = async () => {
    try {
      const element = document.getElementById('strategy-content');
      if (!element) {
        toast.error("Content not found for PDF generation");
        return;
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 30;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`social-media-strategy-${data?.businessName?.replace(/\s+/g, '-') || 'strategy'}.pdf`);
      
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error("Failed to generate PDF");
    }
  };

  const generateHashtags = async () => {
    setIsGeneratingHashtags(true);
    try {
      const { data: hashtagData, error } = await supabase.functions.invoke('generate-hashtags', {
        body: {
          businessName: data.businessName,
          industry: data.industry,
          platforms: data.platforms,
          goals: data.goals,
          targetAudience: data.audience
        }
      });

      if (error) throw error;
      
      setHashtags(hashtagData.hashtags || []);
      toast.success("Hashtags Generated! AI-powered hashtags are ready for your campaigns.");
    } catch (error) {
      console.error('Error generating hashtags:', error);
      toast.error("Failed to generate hashtags. Please try again.");
    } finally {
      setIsGeneratingHashtags(false);
    }
  };

  const copyHashtag = async (hashtag: string) => {
    try {
      await navigator.clipboard.writeText(hashtag);
      setCopiedHashtag(hashtag);
      setTimeout(() => setCopiedHashtag(null), 2000);
      toast.success(`${hashtag} copied to clipboard`);
    } catch (error) {
      toast.error("Failed to copy hashtag");
    }
  };

  const copyAllHashtags = async () => {
    try {
      const allHashtags = hashtags.join(' ');
      await navigator.clipboard.writeText(allHashtags);
      toast.success("All hashtags copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy hashtags");
    }
  };

  // Format the AI generated strategy for better readability
  const formatAIStrategy = (strategy: string) => {
    if (!strategy) return null;
    
    // Split by double line breaks to create paragraphs
    const paragraphs = strategy.split('\n\n').filter(p => p.trim());
    
    return paragraphs.map((paragraph, index) => {
      // Check if it's a heading (starts with #, **, or is in ALL CAPS)
      const isHeading = paragraph.match(/^#+\s/) || paragraph.match(/^\*\*.*\*\*$/) || 
                       (paragraph.length < 100 && paragraph === paragraph.toUpperCase() && paragraph.includes(' '));
      
      if (isHeading) {
        return (
          <h4 key={index} className="font-semibold text-lg mt-4 mb-2 text-primary">
            {paragraph.replace(/^#+\s|\*\*/g, '').trim()}
          </h4>
        );
      }
      
      // Check if it's a list item
      const isListItem = paragraph.match(/^[\d\-\*•]/);
      
      if (isListItem) {
        const listItems = paragraph.split('\n').filter(item => item.trim());
        return (
          <ul key={index} className="list-disc pl-5 space-y-1 mb-4">
            {listItems.map((item, itemIndex) => (
              <li key={itemIndex} className="text-muted-foreground">
                {item.replace(/^[\d\-\*•]\s*/, '').trim()}
              </li>
            ))}
          </ul>
        );
      }
      
      // Regular paragraph
      return (
        <p key={index} className="text-muted-foreground mb-3 leading-relaxed">
          {paragraph.trim()}
        </p>
      );
    });
  };

  // This would be real data from the API in a production app
  const mockData = {
    overview: {
      summary: aiGeneratedStrategy || `Based on your input, we recommend a content-focused strategy for ${data?.businessName || "your business"} that emphasizes authentic storytelling on ${data?.platforms?.join(", ") || "selected platforms"}. Your target audience is looking for educational and inspirational content that addresses their specific needs.`,
      keyInsights: [
        "Your industry is growing at 12% annually with increasing competition",
        `${data?.goals?.includes("Brand Awareness") ? "Brand awareness should be prioritized through consistent posting and engagement" : "Focus on driving conversions through targeted content strategies"}`,
        `${data?.platforms?.includes("Instagram") ? "Instagram Reels show 3x higher engagement than static posts for your industry" : "Video content performs 2x better than static content across platforms"}`,
        "Industry benchmarks suggest posting 3-5 times per week for optimal growth"
      ]
    },
    contentStrategy: {
      pillars: [
        "Educational content explaining industry concepts",
        "Behind-the-scenes authentic brand storytelling",
        "User-generated content and testimonials",
        "Trend participation with branded approach"
      ],
      contentIdeas: [
        "Create a weekly 'Industry Insights' series addressing common questions",
        "Share team spotlights to humanize your brand",
        "Develop a branded hashtag challenge to encourage UGC",
        "Produce comparative analyses against key competitors",
        "Create platform-specific optimized content formats"
      ]
    },
    postingSchedule: {
      instagram: data?.platforms?.includes("Instagram") ? {
        frequency: "4-5 posts per week",
        bestTimes: "Tuesday 11am, Wednesday 3pm, Thursday 7pm, Saturday 12pm",
        formats: "40% Reels, 30% Carousels, 20% Single Image, 10% Stories"
      } : null,
      linkedin: data?.platforms?.includes("LinkedIn") ? {
        frequency: "2-3 posts per week",
        bestTimes: "Tuesday 9am, Wednesday 12pm, Thursday 3pm",
        formats: "60% Text with image, 30% Articles, 10% Documents"
      } : null,
      tiktok: data?.platforms?.includes("TikTok") ? {
        frequency: "Daily content recommended",
        bestTimes: "9am, 12pm, 7pm daily",
        formats: "100% Short-form video with trending sounds"
      } : null
    },
    hashtags: [
      "#IndustryInsights",
      "#BrandGrowth",
      "#ContentStrategy",
      `#${data?.industry?.replace(/\s+/g, '') || "YourIndustry"}`,
      "#SocialMediaTips",
      "#GrowthHacking",
      "#MarketingStrategy"
    ]
  };

  return (
    <div className="w-full" id="strategy-content">
      <div className="flex justify-between items-center mb-6 flex-col sm:flex-row gap-4">
        <div>
          <h1 className="text-3xl font-bold">Your Custom Strategy</h1>
          <p className="text-muted-foreground">
            Generated for {data?.businessName || "your business"} on {new Date().toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleShare} className="flex gap-2">
            <Share className="h-4 w-4" /> Share
          </Button>
          <Button variant="default" onClick={handleDownload} className="flex gap-2 gradient-bg">
            <Download className="h-4 w-4" /> Download PDF
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="content">Content Strategy</TabsTrigger>
          <TabsTrigger value="schedule">Posting Schedule</TabsTrigger>
          <TabsTrigger value="hashtags">Hashtags</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          {/* Strategy Summary Card */}
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                <CardTitle className="gradient-text">Strategy Overview</CardTitle>
              </div>
              <CardDescription>Your personalized social media strategy roadmap</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/4">Category</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-semibold">Business Name</TableCell>
                    <TableCell>{data?.businessName || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Industry</TableCell>
                    <TableCell>{data?.industry || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Business Description</TableCell>
                    <TableCell>{data?.businessDescription || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Unique Selling Point</TableCell>
                    <TableCell>{data?.uniqueSellingPoint || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Brand Values</TableCell>
                    <TableCell>{data?.brandValues || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Brand Personality</TableCell>
                    <TableCell>{data?.brandPersonality || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Target Audience</TableCell>
                    <TableCell>{data?.audience || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Marketing Goals</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {data?.goals?.map((goal: string, i: number) => (
                          <Badge key={i} variant="secondary">{goal}</Badge>
                        )) || "N/A"}
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Platforms</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {data?.platforms?.map((platform: string, i: number) => (
                          <Badge key={i} variant="outline">{platform}</Badge>
                        )) || "N/A"}
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Budget Range</TableCell>
                    <TableCell>{data?.budget || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Current Challenges</TableCell>
                    <TableCell>{data?.currentChallenges || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Competitors</TableCell>
                    <TableCell>{data?.competitors || "N/A"}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* AI Generated Strategy */}
          {aiGeneratedStrategy && (
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-primary/20">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Lightbulb className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="gradient-text text-xl">AI-Generated Strategy</CardTitle>
                    <CardDescription className="text-sm">Customized recommendations based on your business details</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="bg-gradient-to-br from-background to-muted/30 p-6 space-y-6">
                  <div className="flex items-start gap-4 p-4 bg-card rounded-lg border border-primary/10 shadow-sm">
                    <div className="bg-primary/10 p-2 rounded-full shrink-0">
                      <Target className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="border-l-4 border-primary/20 pl-4">
                        <h4 className="font-semibold text-base mb-3 text-foreground">Strategy Recommendations</h4>
                        <div className="prose prose-sm max-w-none">
                          {formatAIStrategy(aiGeneratedStrategy)}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Key Action Items */}
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <div className="bg-card p-4 rounded-lg border border-primary/10 hover:shadow-md transition-all duration-300">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        <h5 className="font-medium text-sm">Priority Action</h5>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Focus on the top 2-3 recommendations for immediate implementation
                      </p>
                    </div>
                    
                    <div className="bg-card p-4 rounded-lg border border-primary/10 hover:shadow-md transition-all duration-300">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        <h5 className="font-medium text-sm">Timeline</h5>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Implement changes over 2-4 weeks for optimal results
                      </p>
                    </div>
                    
                    <div className="bg-card p-4 rounded-lg border border-primary/10 hover:shadow-md transition-all duration-300 md:col-span-2 lg:col-span-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="h-4 w-4 text-primary" />
                        <h5 className="font-medium text-sm">Success Metrics</h5>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Track engagement, reach, and conversion improvements
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* AI-Generated Hashtags */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-secondary/5 to-secondary/10 border-b border-secondary/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-secondary/10 p-2 rounded-full">
                    <Hash className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">AI-Generated Hashtags</CardTitle>
                    <CardDescription className="text-sm">Boost your social media reach with targeted hashtags</CardDescription>
                  </div>
                </div>
                <Button 
                  onClick={generateHashtags} 
                  disabled={isGeneratingHashtags}
                  variant="outline"
                  size="sm"
                >
                  {isGeneratingHashtags ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Hash className="h-4 w-4 mr-2" />
                      Generate Hashtags
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {hashtags.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                      {hashtags.length} hashtags generated for your campaign
                    </p>
                    <Button 
                      onClick={copyAllHashtags}
                      variant="outline" 
                      size="sm"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy All
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {hashtags.map((hashtag, index) => (
                      <div 
                        key={index}
                        className="group relative"
                      >
                        <Badge 
                          variant="secondary" 
                          className="cursor-pointer hover:bg-secondary/80 transition-colors pr-8"
                          onClick={() => copyHashtag(hashtag)}
                        >
                          {hashtag}
                        </Badge>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-4 w-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyHashtag(hashtag);
                          }}
                        >
                          {copiedHashtag === hashtag ? (
                            <Check className="h-3 w-3 text-green-500" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">Hashtag Usage Tips:</h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Use 5-10 hashtags per post for optimal engagement</li>
                      <li>• Mix popular and niche hashtags for better reach</li>
                      <li>• Research trending hashtags in your industry regularly</li>
                      <li>• Create branded hashtags for your campaigns</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Hash className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    Generate AI-powered hashtags tailored to your business and goals
                  </p>
                  <Button onClick={generateHashtags} disabled={isGeneratingHashtags}>
                    {isGeneratingHashtags ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating Hashtags...
                      </>
                    ) : (
                      <>
                        <Hash className="h-4 w-4 mr-2" />
                        Generate Hashtags
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Key Insights Grid */}
          <div className="grid gap-4 md:grid-cols-2">
            {mockData.overview.keyInsights.map((insight, i) => (
              <Card key={i} className="hover:shadow-md transition-all duration-300 hover:scale-105 cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-full mt-1">
                      {i === 0 && <TrendingUp className="h-4 w-4 text-primary" />}
                      {i === 1 && <Target className="h-4 w-4 text-primary" />}
                      {i === 2 && <Users className="h-4 w-4 text-primary" />}
                      {i === 3 && <Lightbulb className="h-4 w-4 text-primary" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">
                        {i === 0 && "Market Growth"}
                        {i === 1 && "Strategy Focus"}
                        {i === 2 && "Content Performance"}
                        {i === 3 && "Posting Frequency"}
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{insight}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Business Info Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Strategy Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{data?.businessName || "Your Business"}</div>
                  <div className="text-sm text-muted-foreground">Business Name</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{data?.platforms?.length || 0}</div>
                  <div className="text-sm text-muted-foreground">Platforms</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{data?.goals?.length || 0}</div>
                  <div className="text-sm text-muted-foreground">Goals</div>
                </div>
              </div>
              
              {data?.platforms && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Selected Platforms:</h4>
                  <div className="flex flex-wrap gap-2">
                    {data.platforms.map((platform: string, i: number) => (
                      <Badge key={i} variant="secondary">{platform}</Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {data?.goals && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Primary Goals:</h4>
                  <div className="flex flex-wrap gap-2">
                    {data.goals.map((goal: string, i: number) => (
                      <Badge key={i} variant="outline">{goal}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>Content Strategy</CardTitle>
              <CardDescription>Recommended content pillars and ideas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">Content Pillars</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {mockData.contentStrategy.pillars.map((pillar, i) => (
                    <li key={i}>{pillar}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Content Ideas</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {mockData.contentStrategy.contentIdeas.map((idea, i) => (
                    <li key={i}>{idea}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle>Posting Schedule</CardTitle>
              <CardDescription>Optimal posting times and content mix by platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                {mockData.postingSchedule.instagram && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Instagram</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Frequency:</span>
                          <span>{mockData.postingSchedule.instagram.frequency}</span>
                        </div>
                        <div>
                          <span className="font-medium">Best times:</span>
                          <p className="text-sm text-muted-foreground">{mockData.postingSchedule.instagram.bestTimes}</p>
                        </div>
                        <div>
                          <span className="font-medium">Content mix:</span>
                          <p className="text-sm text-muted-foreground">{mockData.postingSchedule.instagram.formats}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {mockData.postingSchedule.linkedin && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">LinkedIn</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Frequency:</span>
                          <span>{mockData.postingSchedule.linkedin.frequency}</span>
                        </div>
                        <div>
                          <span className="font-medium">Best times:</span>
                          <p className="text-sm text-muted-foreground">{mockData.postingSchedule.linkedin.bestTimes}</p>
                        </div>
                        <div>
                          <span className="font-medium">Content mix:</span>
                          <p className="text-sm text-muted-foreground">{mockData.postingSchedule.linkedin.formats}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {mockData.postingSchedule.tiktok && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">TikTok</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Frequency:</span>
                          <span>{mockData.postingSchedule.tiktok.frequency}</span>
                        </div>
                        <div>
                          <span className="font-medium">Best times:</span>
                          <p className="text-sm text-muted-foreground">{mockData.postingSchedule.tiktok.bestTimes}</p>
                        </div>
                        <div>
                          <span className="font-medium">Content mix:</span>
                          <p className="text-sm text-muted-foreground">{mockData.postingSchedule.tiktok.formats}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="hashtags">
          <Card>
            <CardHeader>
              <CardTitle>Recommended Hashtags</CardTitle>
              <CardDescription>Strategic hashtags for increased visibility</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {mockData.hashtags.map((hashtag, i) => (
                  <div key={i} className="bg-slate-100 px-3 py-1 rounded-full text-sm">
                    {hashtag}
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <h3 className="font-semibold text-lg mb-2">Hashtag Strategy</h3>
                <p className="text-muted-foreground">
                  Use a mix of branded hashtags, industry hashtags, and trending hashtags. Include 5-10 hashtags per post on Instagram, 2-3 on LinkedIn, and 3-5 on TikTok. Research trending hashtags weekly to keep your strategy current.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StrategyResult;
