import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Plus, User, ExternalLink, MapPin } from "lucide-react";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  bio: z.string().max(500, "Bio must be under 500 characters").optional(),
  location: z.string().optional(),
  portfolio_url: z.string().url().optional().or(z.literal("")),
});

const skillSchema = z.object({
  skill_id: z.string().min(1, "Please select a skill"),
  type: z.enum(["offering", "needing"]),
  level: z.enum(["beginner", "intermediate", "advanced", "expert"]).optional(),
  description: z.string().max(200, "Description must be under 200 characters").optional(),
});

interface Skill {
  id: string;
  name: string;
  skill_categories: {
    name: string;
  };
}

interface UserProfile {
  id: string;
  name: string;
  bio?: string;
  location?: string;
  avatar_url?: string;
  portfolio_url?: string;
}

interface SkillSwapProfileProps {
  user: any;
}

export const SkillSwapProfile: React.FC<SkillSwapProfileProps> = ({ user }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [userSkills, setUserSkills] = useState<any[]>([]);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [skillDialogOpen, setSkillDialogOpen] = useState(false);
  const { toast } = useToast();

  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      bio: "",
      location: "",
      portfolio_url: "",
    },
  });

  const skillForm = useForm({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      skill_id: "",
      type: "offering" as const,
      level: undefined,
      description: "",
    },
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchSkills();
      fetchUserSkills();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching profile:", error);
      return;
    }

    if (data) {
      setProfile(data);
      profileForm.reset({
        name: data.name || "",
        bio: data.bio || "",
        location: data.location || "",
        portfolio_url: data.portfolio_url || "",
      });
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

    setSkills(data?.map(skill => ({
      ...skill,
      category: skill.skill_categories
    })) || []);
  };

  const fetchUserSkills = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("user_skills")
      .select(`
        *,
        skills (
          name,
          skill_categories (
            name
          )
        )
      `)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error fetching user skills:", error);
      return;
    }

    setUserSkills(data || []);
  };

  const onSubmitProfile = async (values: z.infer<typeof profileSchema>) => {
    if (!user || !values.name) return;

    const { error } = await supabase
      .from("user_profiles")
      .upsert({
        user_id: user.id,
        name: values.name,
        bio: values.bio || null,
        location: values.location || null,
        portfolio_url: values.portfolio_url || null,
      });

    if (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setProfileDialogOpen(false);
    fetchProfile();
    toast({
      title: "Success",
      description: "Profile updated successfully!",
    });
  };

  const onSubmitSkill = async (values: z.infer<typeof skillSchema>) => {
    if (!user || !values.skill_id) return;

    const { error } = await supabase
      .from("user_skills")
      .upsert({
        user_id: user.id,
        skill_id: values.skill_id,
        type: values.type,
        level: values.level || null,
        description: values.description || null,
      });

    if (error) {
      console.error("Error saving skill:", error);
      toast({
        title: "Error",
        description: "Failed to save skill. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setSkillDialogOpen(false);
    skillForm.reset();
    fetchUserSkills();
    toast({
      title: "Success",
      description: "Skill added successfully!",
    });
  };

  const removeSkill = async (skillId: string) => {
    const { error } = await supabase
      .from("user_skills")
      .delete()
      .eq("id", skillId);

    if (error) {
      console.error("Error removing skill:", error);
      return;
    }

    fetchUserSkills();
    toast({
      title: "Success",
      description: "Skill removed successfully!",
    });
  };

  const offeringSkills = userSkills.filter(skill => skill.type === "offering");
  const needingSkills = userSkills.filter(skill => skill.type === "needing");

  return (
    <div className="space-y-6">
      {/* Profile Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Your Profile
          </CardTitle>
          <Dialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                {profile ? "Edit Profile" : "Create Profile"}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {profile ? "Edit Profile" : "Create Profile"}
                </DialogTitle>
              </DialogHeader>
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onSubmitProfile)} className="space-y-4">
                  <FormField
                    control={profileForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Tell others about yourself..."
                            className="min-h-[80px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="City, Country" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="portfolio_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Portfolio URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://yourportfolio.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setProfileDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Save Profile</Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {profile ? (
            <div className="flex items-start space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={profile.avatar_url} />
                <AvatarFallback>{profile.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{profile.name}</h3>
                {profile.location && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {profile.location}
                  </p>
                )}
                {profile.bio && (
                  <p className="text-sm text-muted-foreground mt-2">{profile.bio}</p>
                )}
                {profile.portfolio_url && (
                  <a 
                    href={profile.portfolio_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline flex items-center gap-1 mt-2"
                  >
                    <ExternalLink className="h-3 w-3" />
                    View Portfolio
                  </a>
                )}
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">No profile created yet. Click "Create Profile" to get started!</p>
          )}
        </CardContent>
      </Card>

      {/* Skills Section */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Skills I'm Offering */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Skills I'm Offering</CardTitle>
            <Dialog open={skillDialogOpen} onOpenChange={setSkillDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Skill
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add a Skill</DialogTitle>
                </DialogHeader>
                <Form {...skillForm}>
                  <form onSubmit={skillForm.handleSubmit(onSubmitSkill)} className="space-y-4">
                    <FormField
                      control={skillForm.control}
                      name="skill_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Skill *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a skill" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {skills.map((skill) => (
                                <SelectItem key={skill.id} value={skill.id}>
                                  {skill.name} ({skill.skill_categories?.name})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={skillForm.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="offering">I'm offering this skill</SelectItem>
                              <SelectItem value="needing">I need this skill</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={skillForm.control}
                      name="level"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Level</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="beginner">Beginner</SelectItem>
                              <SelectItem value="intermediate">Intermediate</SelectItem>
                              <SelectItem value="advanced">Advanced</SelectItem>
                              <SelectItem value="expert">Expert</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={skillForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Brief description of your experience with this skill..."
                              className="min-h-[60px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={() => setSkillDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">Add Skill</Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {offeringSkills.length > 0 ? (
                offeringSkills.map((userSkill) => (
                  <div key={userSkill.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{userSkill.skills.name}</Badge>
                        {userSkill.level && (
                          <Badge variant="secondary" className="text-xs">
                            {userSkill.level}
                          </Badge>
                        )}
                      </div>
                      {userSkill.description && (
                        <p className="text-sm text-muted-foreground mt-1">{userSkill.description}</p>
                      )}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeSkill(userSkill.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      Remove
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-sm">No skills added yet. Add skills you can offer to others!</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Skills I Need */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Skills I Need</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {needingSkills.length > 0 ? (
                needingSkills.map((userSkill) => (
                  <div key={userSkill.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{userSkill.skills.name}</Badge>
                        {userSkill.level && (
                          <Badge variant="secondary" className="text-xs">
                            Looking for {userSkill.level}
                          </Badge>
                        )}
                      </div>
                      {userSkill.description && (
                        <p className="text-sm text-muted-foreground mt-1">{userSkill.description}</p>
                      )}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeSkill(userSkill.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      Remove
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-sm">No skills added yet. Add skills you need help with!</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};