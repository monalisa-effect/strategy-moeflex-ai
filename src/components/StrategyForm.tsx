
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "@/integrations/supabase/client";

const platforms = ["Instagram", "LinkedIn", "TikTok", "Facebook", "Twitter", "YouTube"];
const goals = ["Brand Awareness", "Lead Generation", "Sales", "Engagement", "Community Building", "Education"];

const StrategyForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    businessName: "",
    industry: "",
    brandTone: "",
    goals: [],
    audience: "",
    platforms: [],
    competitors: "",
    budget: "",
  });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [apiKeyError, setApiKeyError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-secret', {
          body: JSON.stringify({ secretName: 'GEMINI_API_KEY' })
        });

        if (error) {
          console.error("Error fetching Gemini API key:", error);
          setApiKeyError("Failed to fetch API key");
          toast.error("Error loading AI generator. Please try again later.");
          return;
        }

        if (data?.publicData?.secret) {
          setApiKey(data.publicData.secret);
        } else {
          setApiKeyError("API key not found");
          toast.error("AI generator configuration is incomplete. Please check your Supabase secrets.");
        }
      } catch (error) {
        console.error("Error initializing Gemini AI:", error);
        setApiKeyError("Failed to initialize AI");
        toast.error("Failed to initialize AI strategy generator");
      }
    };

    fetchApiKey();
  }, []);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlatformToggle = (platform: string) => {
    setFormData((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter((p) => p !== platform)
        : [...prev.platforms, platform],
    }));
  };

  const handleGoalToggle = (goal: string) => {
    setFormData((prev) => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter((g) => g !== goal)
        : [...prev.goals, goal],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey) {
      console.log("Gotten Here in the if block")
      toast.error("AI generator is not available. Please try again later.");
      return;
    }

    setLoading(true);

    try {
      console.log("Gotten Here at the top of try block")

      // const theApiKey = apiKey ? apikey: proccess.env.GEMINI_API_KEY
      const genAI = new GoogleGenerativeAI(apiKey);
      console.log("Gotten Here 1")
      const prompt = `Generate a social media strategy for a ${formData.industry} business named ${formData.businessName}. 
      Brand tone: ${formData.brandTone}. 
      Marketing goals: ${formData.goals.join(', ')}. 
      Target audience: ${formData.audience}. 
      Preferred platforms: ${formData.platforms.join(', ')}. 
      Competitors: ${formData.competitors}. 
      Budget range: ${formData.budget}`;
      console.log("Gotten Here 2")

      const model = genAI.getGenerativeModel({ model: "gemini-pro"});
      console.log("Gotten Here 3")

      const result = await model.generateContent(prompt);
      console.log("Gotten Here 4")
      const response = await result.response;
      console.log("Gotten Here 5")
      const text = response.text();
      console.log("Gotten Here 6")
      toast.success("Strategy generated successfully!");
      navigate("/results", { 
        state: { 
          formData, 
          aiGeneratedStrategy: text 
        } 
      });
    } catch (error) {
      console.error("Error generating strategy:", error);
      toast.error("Failed to generate strategy. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Generate Your Social Media Strategy</CardTitle>
        <CardDescription>
          Fill out the form below to create a customized, data-backed social media strategy.
        </CardDescription>
        <div className="flex justify-between items-center mt-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center">
              <div 
                className={`rounded-full h-10 w-10 flex items-center justify-center 
                  ${step >= i ? 'gradient-bg text-white' : 'bg-slate-100 text-slate-400'}`}
              >
                {step > i ? <CheckCircle className="h-5 w-5" /> : i}
              </div>
              <div className={`text-sm ml-2 ${step >= i ? 'text-foreground' : 'text-muted-foreground'}`}>
                {i === 1 ? 'Business Details' : i === 2 ? 'Audience & Goals' : 'Platforms & Budget'}
              </div>
              {i < 3 && (
                <div className={`h-0.5 w-10 md:w-20 mx-2 ${step > i ? 'bg-primary' : 'bg-slate-200'}`} />
              )}
            </div>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name</Label>
                <Input 
                  id="businessName"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleTextChange}
                  placeholder="e.g., Acme Digital Marketing"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry">Industry/Niche</Label>
                <Input 
                  id="industry"
                  name="industry"
                  value={formData.industry}
                  onChange={handleTextChange}
                  placeholder="e.g., Digital Marketing, Fashion, SaaS"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="brandTone">Brand Tone & Personality</Label>
                <Textarea 
                  id="brandTone"
                  name="brandTone"
                  value={formData.brandTone}
                  onChange={handleTextChange}
                  placeholder="Describe your brand's voice and personality (e.g., professional but friendly, quirky and fun, etc.)"
                  required
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-2">
                <Label>Marketing Goals (Select all that apply)</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 pt-2">
                  {goals.map((goal) => (
                    <Button
                      key={goal}
                      type="button"
                      variant={formData.goals.includes(goal) ? "default" : "outline"}
                      className={formData.goals.includes(goal) ? "gradient-bg" : ""}
                      onClick={() => handleGoalToggle(goal)}
                    >
                      {goal}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="audience">Target Audience Demographics</Label>
                <Textarea 
                  id="audience"
                  name="audience"
                  value={formData.audience}
                  onChange={handleTextChange}
                  placeholder="Describe your target audience (age, location, interests, pain points, etc.)"
                  required
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-2">
                <Label>Preferred Platforms (Select all that apply)</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 pt-2">
                  {platforms.map((platform) => (
                    <Button
                      key={platform}
                      type="button"
                      variant={formData.platforms.includes(platform) ? "default" : "outline"}
                      className={formData.platforms.includes(platform) ? "gradient-bg" : ""}
                      onClick={() => handlePlatformToggle(platform)}
                    >
                      {platform}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="competitors">Competitors (Optional)</Label>
                <Textarea 
                  id="competitors"
                  name="competitors"
                  value={formData.competitors}
                  onChange={handleTextChange}
                  placeholder="List any key competitors or accounts with similar target audiences"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="budget">Budget & Resources</Label>
                <Select 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, budget: value }))}
                  value={formData.budget}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your budget range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low (Under $1,000/month)</SelectItem>
                    <SelectItem value="medium">Medium ($1,000-$5,000/month)</SelectItem>
                    <SelectItem value="high">High ($5,000-$10,000/month)</SelectItem>
                    <SelectItem value="enterprise">Enterprise ($10,000+/month)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        {step > 1 ? (
          <Button variant="outline" onClick={handlePrevStep}>
            Back
          </Button>
        ) : (
          <div></div>
        )}
        
        {step < 3 ? (
          <Button onClick={handleNextStep}>
            Next
          </Button>
        ) : (
          <Button 
            onClick={handleSubmit} 
            disabled={loading || !formData.businessName || !formData.industry || formData.platforms.length === 0 || apiKeyError !== null}
            className="gradient-bg"
          >
            {loading ? "Generating..." : "Generate Strategy"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default StrategyForm;
