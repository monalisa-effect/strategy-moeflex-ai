import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Briefcase, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { toast } from "@/components/ui/sonner";
import { useNavigate } from "react-router-dom";

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

// Form validation schemas
const talentFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  role: z.string().min(2, { message: "Role must be at least 2 characters." }),
  rate: z.string().min(1, { message: "Rate is required." }),
  experience: z.string().min(1, { message: "Experience is required." }),
  bio: z.string().min(10, { message: "Bio must be at least 10 characters." }),
  specialties: z.string().min(2, { message: "At least one specialty is required." })
});

const jobFormSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters." }),
  company: z.string().min(2, { message: "Company name is required." }),
  budget: z.string().min(1, { message: "Budget is required." }),
  location: z.string().min(1, { message: "Location is required." }),
  type: z.string().min(1, { message: "Job type is required." }),
  platforms: z.string().min(2, { message: "At least one platform is required." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." })
});

const Marketplace = () => {
  const navigate = useNavigate();
  
  const [talents, setTalents] = useState([
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
  ]);
  
  const [jobs, setJobs] = useState([
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
  ]);

  const [talentDialogOpen, setTalentDialogOpen] = useState(false);
  const [jobDialogOpen, setJobDialogOpen] = useState(false);
  const [selectedTalent, setSelectedTalent] = useState(null);
  const [talentProfileOpen, setTalentProfileOpen] = useState(false);
  const { toast: hookToast } = useToast();

  // Initialize forms
  const talentForm = useForm({
    resolver: zodResolver(talentFormSchema),
    defaultValues: {
      name: "",
      role: "",
      rate: "",
      experience: "",
      bio: "",
      specialties: ""
    }
  });

  const jobForm = useForm({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      title: "",
      company: "",
      budget: "",
      location: "",
      type: "",
      platforms: "",
      description: ""
    }
  });

  // Form submission handlers
  const onSubmitTalent = (values) => {
    const newTalent = {
      id: talents.length + 1,
      name: values.name,
      role: values.role,
      avatar: "/placeholder.svg",
      specialties: values.specialties.split(",").map(s => s.trim()),
      rate: values.rate,
      experience: values.experience,
      bio: values.bio
    };
    
    setTalents([...talents, newTalent]);
    setTalentDialogOpen(false);
    talentForm.reset();
    
    toast({
      title: "Success",
      description: "New talent profile created",
    });
  };

  const onSubmitJob = (values) => {
    const newJob = {
      id: jobs.length + 1,
      title: values.title,
      company: values.company,
      budget: values.budget,
      location: values.location,
      type: values.type,
      platforms: values.platforms.split(",").map(p => p.trim()),
      description: values.description,
      posted: "Just now"
    };
    
    setJobs([...jobs, newJob]);
    setJobDialogOpen(false);
    jobForm.reset();
    
    toast({
      title: "Success",
      description: "New job listing created",
    });
  };

  // Handler functions for talent profile actions
  const handleViewProfile = (talent) => {
    setSelectedTalent(talent);
    setTalentProfileOpen(true);
  };
  
  const handleContactTalent = (talent) => {
    // Show toast notification using sonner toast
    toast.success(`Contact request sent to ${talent.name}`, {
      description: "They will receive your request and can respond via the messaging system."
    });
    
    // In a real app, this would save the connection request to a database
    // For now, we'll simulate this with a setTimeout to show how it would work
    setTimeout(() => {
      console.log(`Connection request sent to talent: ${talent.id}`);
      // This is where you would typically make an API call to store the connection
    }, 500);
    
    // Close the talent profile dialog if it's open
    if (talentProfileOpen) {
      setTalentProfileOpen(false);
    }
  };

  // Handler to navigate to user dashboard
  const goToDashboard = () => {
    navigate('/dashboard');
  };

  // Handler to navigate to admin dashboard
  const goToAdminDashboard = () => {
    navigate('/admin-dashboard');
  };

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
            <div className="flex justify-center gap-4 mt-6">
              <Button variant="outline" onClick={goToDashboard}>
                My Dashboard
              </Button>
              <Button variant="outline" onClick={goToAdminDashboard}>
                Admin Dashboard
              </Button>
            </div>
          </div>

          <Tabs defaultValue="talent" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="talent">Find Talent</TabsTrigger>
              <TabsTrigger value="jobs">Find Jobs</TabsTrigger>
            </TabsList>

            <TabsContent value="talent" className="space-y-4">
              <div className="flex justify-end mb-4">
                <Button onClick={() => setTalentDialogOpen(true)} className="gradient-bg">
                  <UserPlus className="mr-2 h-4 w-4" /> Add Talent
                </Button>
              </div>

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
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewProfile(talent)}
                      >
                        View Profile
                      </Button>
                      <Button 
                        className="gradient-bg" 
                        size="sm"
                        onClick={() => handleContactTalent(talent)}
                      >
                        Contact
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="jobs" className="space-y-4">
              <div className="flex justify-end mb-4">
                <Button onClick={() => setJobDialogOpen(true)} className="gradient-bg">
                  <Briefcase className="mr-2 h-4 w-4" /> Add Job
                </Button>
              </div>

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

      {/* Add Talent Dialog */}
      <Dialog open={talentDialogOpen} onOpenChange={setTalentDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Add New Talent Profile</DialogTitle>
            <DialogDescription>
              Create a new talent profile to showcase on the marketplace.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...talentForm}>
            <form onSubmit={talentForm.handleSubmit(onSubmitTalent)} className="space-y-4">
              <FormField
                control={talentForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={talentForm.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Professional Role</FormLabel>
                    <FormControl>
                      <Input placeholder="Social Media Manager" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={talentForm.control}
                  name="rate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hourly Rate</FormLabel>
                      <FormControl>
                        <Input placeholder="$45/hr" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={talentForm.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Years of Experience</FormLabel>
                      <FormControl>
                        <Input placeholder="5 years" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={talentForm.control}
                name="specialties"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Specialties</FormLabel>
                    <FormControl>
                      <Input placeholder="Instagram, TikTok, Content Creation (comma separated)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={talentForm.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Professional Bio</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Write a compelling bio highlighting your expertise and experience..." 
                        className="min-h-[100px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setTalentDialogOpen(false)}>Cancel</Button>
                <Button type="submit" className="gradient-bg">Create Profile</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Add Job Dialog */}
      <Dialog open={jobDialogOpen} onOpenChange={setJobDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Post a New Job</DialogTitle>
            <DialogDescription>
              Create a new job listing to find the perfect talent for your project.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...jobForm}>
            <form onSubmit={jobForm.handleSubmit(onSubmitJob)} className="space-y-4">
              <FormField
                control={jobForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Social Media Manager for Fashion Brand" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={jobForm.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Company" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={jobForm.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Budget</FormLabel>
                      <FormControl>
                        <Input placeholder="$2,000-$3,500/month" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={jobForm.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Remote" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={jobForm.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Type</FormLabel>
                    <FormControl>
                      <Input placeholder="Full-time, Contract, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={jobForm.control}
                name="platforms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Platforms</FormLabel>
                    <FormControl>
                      <Input placeholder="Instagram, TikTok, Pinterest (comma separated)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={jobForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe the job requirements, responsibilities, and qualifications..." 
                        className="min-h-[100px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setJobDialogOpen(false)}>Cancel</Button>
                <Button type="submit" className="gradient-bg">Post Job</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Talent Profile Dialog */}
      <Dialog open={talentProfileOpen} onOpenChange={setTalentProfileOpen}>
        <DialogContent className="sm:max-w-[600px]">
          {selectedTalent && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={selectedTalent.avatar} alt={selectedTalent.name} />
                    <AvatarFallback>{selectedTalent.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <DialogTitle className="text-xl">{selectedTalent.name}</DialogTitle>
                    <DialogDescription className="text-base mt-1">{selectedTalent.role}</DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              
              <div className="space-y-4 my-4">
                <div className="flex justify-between">
                  <span className="font-semibold">Rate:</span>
                  <span>{selectedTalent.rate}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="font-semibold">Experience:</span>
                  <span>{selectedTalent.experience}</span>
                </div>
                
                <div className="space-y-2">
                  <p className="font-semibold">Bio:</p>
                  <p>{selectedTalent.bio}</p>
                </div>
                
                <div className="space-y-2">
                  <p className="font-semibold">Specialties:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedTalent.specialties.map((specialty, index) => (
                      <Badge key={index} variant="outline" className="bg-slate-100">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  onClick={() => handleContactTalent(selectedTalent)}
                  className="w-full gradient-bg"
                >
                  Contact {selectedTalent.name}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Marketplace;
