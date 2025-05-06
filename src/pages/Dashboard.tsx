
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Bell, Briefcase, Calendar, MessageSquare } from "lucide-react";

const Dashboard = () => {
  const { toast } = useToast();
  
  // Mock data for received contact requests
  const [contactRequests, setContactRequests] = useState([
    {
      id: 1,
      from: {
        name: "Company ABC",
        avatar: "/placeholder.svg"
      },
      message: "We're interested in your social media management services for our fashion brand.",
      date: "2 days ago"
    },
    {
      id: 2,
      from: {
        name: "StartupXYZ",
        avatar: "/placeholder.svg"
      },
      message: "Would you be available for a TikTok campaign next month?",
      date: "5 days ago"
    }
  ]);

  // Mock data for job applications
  const [applications, setApplications] = useState([
    {
      id: 1,
      job: "Social Media Manager Needed for Fashion Brand",
      company: "StyleHouse",
      status: "Under review",
      appliedDate: "1 week ago"
    },
    {
      id: 2,
      job: "Content Creator for SaaS Company",
      company: "CloudTech Solutions",
      status: "Interview scheduled",
      appliedDate: "2 weeks ago"
    }
  ]);

  // Handle accepting a contact request
  const handleAcceptRequest = (requestId) => {
    toast({
      title: "Request accepted",
      description: "You have accepted the contact request. You can now message them directly.",
    });
    
    // In a real app, we would update the status in the database
    setContactRequests(contactRequests.filter(request => request.id !== requestId));
  };

  // Handle declining a contact request
  const handleDeclineRequest = (requestId) => {
    toast({
      title: "Request declined",
      description: "You have declined the contact request.",
    });
    
    // In a real app, we would update the status in the database
    setContactRequests(contactRequests.filter(request => request.id !== requestId));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 py-10 px-6 bg-gray-50">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">My Dashboard</h1>
              <p className="text-muted-foreground mt-1">Manage your marketplace activity</p>
            </div>
            <Button className="gradient-bg mt-4 md:mt-0">
              <MessageSquare className="mr-2 h-4 w-4" /> Messages
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Profile Views</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">24</p>
                <p className="text-sm text-muted-foreground">+12% from last week</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">New Contacts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{contactRequests.length}</p>
                <p className="text-sm text-muted-foreground">Waiting for your response</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Active Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{applications.length}</p>
                <p className="text-sm text-muted-foreground">Track your job applications</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="contacts" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="contacts">Contact Requests</TabsTrigger>
              <TabsTrigger value="applications">My Applications</TabsTrigger>
            </TabsList>

            <TabsContent value="contacts" className="space-y-4">
              {contactRequests.length > 0 ? (
                <div className="grid gap-4">
                  {contactRequests.map((request) => (
                    <Card key={request.id}>
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div className="flex gap-4">
                            <Avatar>
                              <AvatarImage src={request.from.avatar} alt={request.from.name} />
                              <AvatarFallback>{request.from.name.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle>{request.from.name}</CardTitle>
                              <CardDescription className="mt-1">
                                Sent {request.date}
                              </CardDescription>
                            </div>
                          </div>
                          <Badge className="bg-primary/10 text-primary">New</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-sm">{request.message}</p>
                      </CardContent>
                      <CardFooter className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeclineRequest(request.id)}
                        >
                          Decline
                        </Button>
                        <Button 
                          className="gradient-bg" 
                          size="sm"
                          onClick={() => handleAcceptRequest(request.id)}
                        >
                          Accept
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Bell className="mx-auto h-12 w-12 text-muted-foreground/60" />
                  <h3 className="mt-4 text-lg font-medium">No new contact requests</h3>
                  <p className="mt-2 text-muted-foreground">
                    When someone is interested in your profile, their requests will appear here.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="applications" className="space-y-4">
              {applications.map((application) => (
                <Card key={application.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{application.job}</CardTitle>
                        <CardDescription className="mt-1">
                          {application.company}
                        </CardDescription>
                      </div>
                      <Badge 
                        className={
                          application.status === "Under review" 
                            ? "bg-yellow-100 text-yellow-800" 
                            : "bg-green-100 text-green-800"
                        }
                      >
                        {application.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-muted-foreground">Applied {application.appliedDate}</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full">
                      <Calendar className="mr-2 h-4 w-4" /> View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
