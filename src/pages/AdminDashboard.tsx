
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BarChart, User, ArrowUpRight, ArrowDownRight, UserCheck, Briefcase, Users, Settings, Check, X } from "lucide-react";

const AdminDashboard = () => {
  // Mock data for talents
  const [pendingTalents, setPendingTalents] = useState([
    {
      id: 1,
      name: "Michael Smith",
      role: "Video Editor",
      avatar: "/placeholder.svg",
      joined: "2 days ago",
      status: "pending"
    },
    {
      id: 2,
      name: "Emily Johnson",
      role: "Social Media Manager",
      avatar: "/placeholder.svg",
      joined: "1 day ago",
      status: "pending"
    }
  ]);

  // Mock data for jobs
  const [pendingJobs, setPendingJobs] = useState([
    {
      id: 1,
      title: "Instagram Content Manager",
      company: "FitLife",
      posted: "3 days ago",
      status: "pending"
    },
    {
      id: 2,
      title: "TikTok Specialist",
      company: "MusicBrand",
      posted: "1 day ago",
      status: "pending"
    }
  ]);

  // Handle approving or rejecting a talent
  const handleTalentAction = (talentId, action) => {
    setPendingTalents(pendingTalents.filter(talent => talent.id !== talentId));
  };

  // Handle approving or rejecting a job
  const handleJobAction = (jobId, action) => {
    setPendingJobs(pendingJobs.filter(job => job.id !== jobId));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 py-10 px-6 bg-gray-50">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground mt-1">Manage the marketplace</p>
            </div>
            <Button variant="outline" className="mt-4 md:mt-0">
              <Settings className="mr-2 h-4 w-4" /> Settings
            </Button>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-baseline justify-between">
                  <p className="text-2xl font-bold">1,238</p>
                  <div className="flex items-center text-green-500">
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    <span className="text-xs">+12%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">New Talents</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-baseline justify-between">
                  <p className="text-2xl font-bold">52</p>
                  <div className="flex items-center text-green-500">
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    <span className="text-xs">+8%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Jobs</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-baseline justify-between">
                  <p className="text-2xl font-bold">86</p>
                  <div className="flex items-center text-green-500">
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    <span className="text-xs">+24%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Connections</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-baseline justify-between">
                  <p className="text-2xl font-bold">342</p>
                  <div className="flex items-center text-red-500">
                    <ArrowDownRight className="h-4 w-4 mr-1" />
                    <span className="text-xs">-3%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart className="h-5 w-5 mr-2" />
                  Marketplace Activity
                </CardTitle>
                <CardDescription>Last 30 days</CardDescription>
              </CardHeader>
              <CardContent className="h-[200px] flex items-center justify-center">
                <p className="text-muted-foreground">Chart would appear here</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  User Registration
                </CardTitle>
                <CardDescription>Last 30 days</CardDescription>
              </CardHeader>
              <CardContent className="h-[200px] flex items-center justify-center">
                <p className="text-muted-foreground">Chart would appear here</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="talents" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="talents">
                <UserCheck className="mr-2 h-4 w-4" />
                Pending Talents
              </TabsTrigger>
              <TabsTrigger value="jobs">
                <Briefcase className="mr-2 h-4 w-4" />
                Pending Jobs
              </TabsTrigger>
            </TabsList>

            <TabsContent value="talents" className="space-y-4">
              {pendingTalents.length > 0 ? (
                pendingTalents.map((talent) => (
                  <Card key={talent.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex gap-4">
                          <Avatar>
                            <AvatarImage src={talent.avatar} alt={talent.name} />
                            <AvatarFallback>{talent.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle>{talent.name}</CardTitle>
                            <CardDescription>{talent.role}</CardDescription>
                          </div>
                        </div>
                        <Badge>Pending Review</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm text-muted-foreground">Joined {talent.joined}</p>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleTalentAction(talent.id, 'reject')}
                        className="text-red-500 border-red-200 hover:bg-red-50"
                      >
                        <X className="mr-1 h-4 w-4" /> Reject
                      </Button>
                      <Button 
                        className="gradient-bg" 
                        size="sm"
                        onClick={() => handleTalentAction(talent.id, 'approve')}
                      >
                        <Check className="mr-1 h-4 w-4" /> Approve
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12">
                  <Users className="mx-auto h-12 w-12 text-muted-foreground/60" />
                  <h3 className="mt-4 text-lg font-medium">No pending talent profiles</h3>
                  <p className="mt-2 text-muted-foreground">
                    All talent profiles have been reviewed.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="jobs" className="space-y-4">
              {pendingJobs.length > 0 ? (
                pendingJobs.map((job) => (
                  <Card key={job.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{job.title}</CardTitle>
                          <CardDescription>{job.company}</CardDescription>
                        </div>
                        <Badge>Pending Review</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm text-muted-foreground">Posted {job.posted}</p>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleJobAction(job.id, 'reject')}
                        className="text-red-500 border-red-200 hover:bg-red-50"
                      >
                        <X className="mr-1 h-4 w-4" /> Reject
                      </Button>
                      <Button 
                        className="gradient-bg" 
                        size="sm"
                        onClick={() => handleJobAction(job.id, 'approve')}
                      >
                        <Check className="mr-1 h-4 w-4" /> Approve
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12">
                  <Briefcase className="mx-auto h-12 w-12 text-muted-foreground/60" />
                  <h3 className="mt-4 text-lg font-medium">No pending job listings</h3>
                  <p className="mt-2 text-muted-foreground">
                    All job listings have been reviewed.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
