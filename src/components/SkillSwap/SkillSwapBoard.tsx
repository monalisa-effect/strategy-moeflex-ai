import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, ArrowRightLeft, Clock, User, Search } from "lucide-react";

const listingSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  offering_skill_id: z.string().min(1, "Please select a skill you're offering"),
  needing_skill_id: z.string().min(1, "Please select a skill you need"),
  estimated_hours: z.number().min(1, "Must be at least 1 hour").max(100, "Must be under 100 hours"),
  delivery_time: z.string().min(1, "Delivery time is required"),
});

const offerSchema = z.object({
  offering_skill_id: z.string().min(1, "Please select a skill you're offering"),
  needing_skill_id: z.string().min(1, "Please select a skill you need"),
  proposed_hours: z.number().min(1, "Must be at least 1 hour").max(100, "Must be under 100 hours"),
  proposed_delivery_time: z.string().min(1, "Delivery time is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

interface Skill {
  id: string;
  name: string;
  skill_categories: {
    name: string;
  };
}

interface SwapListing {
  id: string;
  title: string;
  description: string;
  estimated_hours: number;
  delivery_time: string;
  created_at: string;
  user_profiles: {
    name: string;
    avatar_url?: string;
  } | null;
  offering_skill: {
    name: string;
  };
  needing_skill: {
    name: string;
  };
}

interface SkillSwapBoardProps {
  user: any;
}

export const SkillSwapBoard: React.FC<SkillSwapBoardProps> = ({ user }) => {
  const [listings, setListings] = useState<SwapListing[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [userSkills, setUserSkills] = useState<any[]>([]);
  const [listingDialogOpen, setListingDialogOpen] = useState(false);
  const [offerDialogOpen, setOfferDialogOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<SwapListing | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const listingForm = useForm({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      title: "",
      description: "",
      offering_skill_id: "",
      needing_skill_id: "",
      estimated_hours: 1,
      delivery_time: "",
    },
  });

  const offerForm = useForm({
    resolver: zodResolver(offerSchema),
    defaultValues: {
      offering_skill_id: "",
      needing_skill_id: "",
      proposed_hours: 1,
      proposed_delivery_time: "",
      message: "",
    },
  });

  useEffect(() => {
    fetchListings();
    fetchSkills();
    if (user) {
      fetchUserSkills();
    }
  }, [user]);

  const fetchListings = async () => {
    const { data, error } = await supabase
      .from("swap_listings")
      .select(`
        id,
        title,
        description,
        estimated_hours,
        delivery_time,
        created_at,
        user_id,
        offering_skill_id,
        needing_skill_id
      `)
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching listings:", error);
      return;
    }

    // Fetch additional data separately
    if (data && data.length > 0) {
      const userIds = [...new Set(data.map(listing => listing.user_id))];
      const skillIds = [...new Set([
        ...data.map(listing => listing.offering_skill_id),
        ...data.map(listing => listing.needing_skill_id)
      ])];

      // Fetch user profiles
      const { data: profiles } = await supabase
        .from("user_profiles")
        .select("user_id, name, avatar_url")
        .in("user_id", userIds);

      // Fetch skills
      const { data: skillsData } = await supabase
        .from("skills")
        .select("id, name")
        .in("id", skillIds);

      // Combine data
      const enrichedListings = data.map(listing => ({
        ...listing,
        user_profiles: profiles?.find(p => p.user_id === listing.user_id) || null,
        offering_skill: skillsData?.find(s => s.id === listing.offering_skill_id) || { name: "Unknown" },
        needing_skill: skillsData?.find(s => s.id === listing.needing_skill_id) || { name: "Unknown" }
      }));

      setListings(enrichedListings);
    } else {
      setListings([]);
    }
  };

  const fetchSkills = async () => {
    const { data, error } = await supabase
      .from("skills")
      .select(`
        id,
        name,
        skill_categories (
          name
        )
      `)
      .order("name");

    if (error) {
      console.error("Error fetching skills:", error);
      return;
    }

    setSkills(data || []);
  };

  const fetchUserSkills = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("user_skills")
      .select(`
        *,
        skills (
          id,
          name
        )
      `)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error fetching user skills:", error);
      return;
    }

    setUserSkills(data || []);
  };

  const onSubmitListing = async (values: z.infer<typeof listingSchema>) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create a listing.",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from("swap_listings")
      .insert({
        user_id: user.id,
        title: values.title,
        description: values.description,
        offering_skill_id: values.offering_skill_id,
        needing_skill_id: values.needing_skill_id,
        estimated_hours: values.estimated_hours,
        delivery_time: values.delivery_time,
      });

    if (error) {
      console.error("Error creating listing:", error);
      toast({
        title: "Error",
        description: "Failed to create listing. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setListingDialogOpen(false);
    listingForm.reset();
    fetchListings();
    toast({
      title: "Success",
      description: "Swap listing created successfully!",
    });
  };

  const onSubmitOffer = async (values: z.infer<typeof offerSchema>) => {
    if (!user || !selectedListing) {
      toast({
        title: "Error",
        description: "Please log in and select a listing to make an offer.",
        variant: "destructive",
      });
      return;
    }

    console.log("Submitting offer with values:", values);

    const { error } = await supabase
      .from("swap_offers")
      .insert({
        listing_id: selectedListing.id,
        proposer_id: user.id,
        offering_skill_id: values.offering_skill_id,
        needing_skill_id: values.needing_skill_id,
        proposed_hours: values.proposed_hours,
        proposed_delivery_time: values.proposed_delivery_time,
        message: values.message,
      });

    if (error) {
      console.error("Error creating offer:", error);
      toast({
        title: "Error",
        description: "Failed to send offer. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setOfferDialogOpen(false);
    offerForm.reset();
    setSelectedListing(null);
    toast({
      title: "Success",
      description: "Swap offer sent successfully!",
    });
  };

  const handleProposeSwap = (listing: SwapListing) => {
    setSelectedListing(listing);
    setOfferDialogOpen(true);
  };

  const filteredListings = listings.filter(listing => 
    listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.offering_skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.needing_skill.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const userOfferingSkills = userSkills.filter(skill => skill.type === "offering");
  const userNeedingSkills = userSkills.filter(skill => skill.type === "needing");

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative flex-1 max-w-md w-full sm:w-auto">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search listings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Dialog open={listingDialogOpen} onOpenChange={setListingDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-bg w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Create Swap Listing</span>
              <span className="sm:hidden">Create Listing</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md mx-4 sm:mx-auto">
            <DialogHeader>
              <DialogTitle>Create a Swap Listing</DialogTitle>
            </DialogHeader>
            <Form {...listingForm}>
              <form onSubmit={listingForm.handleSubmit(onSubmitListing)} className="space-y-4">
                <FormField
                  control={listingForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Logo design for website copy" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={listingForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description *</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe what you're offering and what you need..."
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={listingForm.control}
                    name="offering_skill_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>I'm offering *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select skill" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {skills.map((skill) => (
                              <SelectItem key={skill.id} value={skill.id}>
                                {skill.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={listingForm.control}
                    name="needing_skill_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>I need *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select skill" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {skills.map((skill) => (
                              <SelectItem key={skill.id} value={skill.id}>
                                {skill.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={listingForm.control}
                    name="estimated_hours"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estimated Hours *</FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            min="1"
                            max="100"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={listingForm.control}
                    name="delivery_time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Delivery Time *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 1 week" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setListingDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Listing</Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Listings Grid */}
      <div className="grid gap-4 sm:gap-6">
        {filteredListings.length > 0 ? (
          filteredListings.map((listing) => (
            <Card key={listing.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-0">
                  <div className="flex items-center space-x-3 flex-1">
                    <Avatar className="h-10 w-10 flex-shrink-0">
                      <AvatarImage src={listing.user_profiles?.avatar_url} />
                      <AvatarFallback>
                        {listing.user_profiles?.name?.substring(0, 2).toUpperCase() || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-base sm:text-lg truncate">{listing.title}</CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <User className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{listing.user_profiles?.name || "Anonymous"}</span>
                      </CardDescription>
                    </div>
                  </div>
                  <div className="text-left sm:text-right w-full sm:w-auto">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {listing.estimated_hours}h • {listing.delivery_time}
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{listing.description}</p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4 p-3 sm:p-4 bg-slate-50 rounded-lg">
                  <div className="text-center">
                    <Badge className="bg-green-100 text-green-800 border-green-200 text-xs sm:text-sm">
                      Offering: {listing.offering_skill.name}
                    </Badge>
                  </div>
                  <ArrowRightLeft className="h-4 w-4 text-muted-foreground hidden sm:block" />
                  <div className="text-center">
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs sm:text-sm">
                      Needs: {listing.needing_skill.name}
                    </Badge>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="bg-slate-50">
                <Button 
                  onClick={() => handleProposeSwap(listing)}
                  className="w-full gradient-bg"
                  disabled={!user}
                >
                  Propose Swap
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <ArrowRightLeft className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No swap listings found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? "Try adjusting your search terms." : "Be the first to create a swap listing!"}
              </p>
              {!searchTerm && (
                <Button 
                  onClick={() => setListingDialogOpen(true)}
                  className="gradient-bg"
                >
                  Create First Listing
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Offer Dialog */}
      <Dialog open={offerDialogOpen} onOpenChange={setOfferDialogOpen}>
        <DialogContent className="max-w-md mx-4 sm:mx-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Propose a Swap</DialogTitle>
          </DialogHeader>
          {selectedListing && (
            <div className="mb-4 p-3 bg-slate-50 rounded-lg">
              <p className="text-sm font-medium">{selectedListing.title}</p>
              <p className="text-xs text-muted-foreground">
                by {selectedListing.user_profiles?.name}
              </p>
            </div>
          )}
          <Form {...offerForm}>
            <form onSubmit={offerForm.handleSubmit(onSubmitOffer)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={offerForm.control}
                  name="offering_skill_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>I'm offering *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select skill" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {userOfferingSkills.map((userSkill) => (
                            <SelectItem key={userSkill.skills.id} value={userSkill.skills.id}>
                              {userSkill.skills.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={offerForm.control}
                  name="needing_skill_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>I need *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select skill" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {userNeedingSkills.map((userSkill) => (
                            <SelectItem key={userSkill.skills.id} value={userSkill.skills.id}>
                              {userSkill.skills.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={offerForm.control}
                  name="proposed_hours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hours *</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          min="1"
                          max="100"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={offerForm.control}
                  name="proposed_delivery_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Delivery Time *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 1 week" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={offerForm.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Introduce yourself and explain your proposal..."
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setOfferDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Send Offer</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};