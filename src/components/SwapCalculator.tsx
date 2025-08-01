import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calculator, ArrowRightLeft, TrendingUp, AlertCircle } from "lucide-react";

const skillRates = {
  "Graphic Design": 45,
  "Logo Design": 50,
  "Web Development": 75,
  "Content Writing": 35,
  "SEO Services": 60,
  "Social Media Management": 40,
  "Video Editing": 55,
  "Photography": 65,
  "Copywriting": 50,
  "UI/UX Design": 70,
  "Marketing Strategy": 80,
  "Email Marketing": 45,
};

const experienceLevels = {
  "Beginner": 0.7,
  "Intermediate": 1.0,
  "Advanced": 1.3,
  "Expert": 1.6,
};

const SwapCalculator = () => {
  const [yourSkill, setYourSkill] = useState("");
  const [yourHours, setYourHours] = useState("");
  const [yourLevel, setYourLevel] = useState("");
  const [theirSkill, setTheirSkill] = useState("");
  const [theirHours, setTheirHours] = useState("");
  const [theirLevel, setTheirLevel] = useState("");
  const [result, setResult] = useState(null);

  const calculateSwap = () => {
    if (!yourSkill || !yourHours || !yourLevel || !theirSkill || !theirHours || !theirLevel) {
      return;
    }

    const yourBaseRate = skillRates[yourSkill] || 50;
    const theirBaseRate = skillRates[theirSkill] || 50;
    
    const yourMultiplier = experienceLevels[yourLevel] || 1;
    const theirMultiplier = experienceLevels[theirLevel] || 1;
    
    const yourValue = yourBaseRate * yourMultiplier * parseInt(yourHours);
    const theirValue = theirBaseRate * theirMultiplier * parseInt(theirHours);
    
    const difference = Math.abs(yourValue - theirValue);
    const averageValue = (yourValue + theirValue) / 2;
    const fairnessPercentage = ((averageValue - difference) / averageValue) * 100;
    
    let fairnessLevel = "Balanced";
    let fairnessColor = "bg-green-100 text-green-800 border-green-200";
    
    if (fairnessPercentage < 70) {
      fairnessLevel = yourValue > theirValue ? "Favors You" : "Favors Them";
      fairnessColor = yourValue > theirValue ? 
        "bg-blue-100 text-blue-800 border-blue-200" : 
        "bg-orange-100 text-orange-800 border-orange-200";
    }
    
    setResult({
      yourValue,
      theirValue,
      fairnessLevel,
      fairnessColor,
      fairnessPercentage: Math.round(fairnessPercentage),
      difference: Math.round(difference),
    });
  };

  const resetCalculator = () => {
    setYourSkill("");
    setYourHours("");
    setYourLevel("");
    setTheirSkill("");
    setTheirHours("");
    setTheirLevel("");
    setResult(null);
  };

  return (
    <div className="py-20 px-6 bg-white">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">
            <span className="gradient-text">Swap Calculator</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Ensure fair skill exchanges with our calculator that estimates service values based on market rates and experience levels.
          </p>
        </div>

        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Calculate Swap Fairness
            </CardTitle>
            <CardDescription>
              Enter details about both services to see if the exchange is balanced
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Your Service */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-green-700">Your Service</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="your-skill">Skill</Label>
                  <Select value={yourSkill} onValueChange={setYourSkill}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your skill" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(skillRates).map((skill) => (
                        <SelectItem key={skill} value={skill}>
                          {skill} (${skillRates[skill]}/hr base)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="your-hours">Hours</Label>
                  <Input
                    id="your-hours"
                    type="number"
                    min="1"
                    max="100"
                    value={yourHours}
                    onChange={(e) => setYourHours(e.target.value)}
                    placeholder="e.g., 8"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="your-level">Experience Level</Label>
                  <Select value={yourLevel} onValueChange={setYourLevel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your level" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(experienceLevels).map((level) => (
                        <SelectItem key={level} value={level}>
                          {level} ({Math.round(experienceLevels[level] * 100)}% of base rate)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Their Service */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-blue-700">Their Service</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="their-skill">Skill</Label>
                  <Select value={theirSkill} onValueChange={setTheirSkill}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select their skill" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(skillRates).map((skill) => (
                        <SelectItem key={skill} value={skill}>
                          {skill} (${skillRates[skill]}/hr base)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="their-hours">Hours</Label>
                  <Input
                    id="their-hours"
                    type="number"
                    min="1"
                    max="100"
                    value={theirHours}
                    onChange={(e) => setTheirHours(e.target.value)}
                    placeholder="e.g., 10"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="their-level">Experience Level</Label>
                  <Select value={theirLevel} onValueChange={setTheirLevel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select their level" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(experienceLevels).map((level) => (
                        <SelectItem key={level} value={level}>
                          {level} ({Math.round(experienceLevels[level] * 100)}% of base rate)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <Button onClick={calculateSwap} className="gradient-bg">
                <Calculator className="h-4 w-4 mr-2" />
                Calculate Fairness
              </Button>
              <Button onClick={resetCalculator} variant="outline">
                Reset
              </Button>
            </div>

            {result && (
              <div className="mt-8 p-6 bg-slate-50 rounded-lg space-y-4">
                <div className="text-center">
                  <Badge className={`text-lg px-4 py-2 ${result.fairnessColor}`}>
                    {result.fairnessLevel}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-2">
                    Fairness Score: {result.fairnessPercentage}%
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-white rounded-lg">
                    <p className="text-sm text-muted-foreground">Your Service Value</p>
                    <p className="text-2xl font-bold text-green-600">${result.yourValue}</p>
                  </div>
                  
                  <div className="flex items-center justify-center">
                    <ArrowRightLeft className="h-8 w-8 text-muted-foreground" />
                  </div>
                  
                  <div className="p-4 bg-white rounded-lg">
                    <p className="text-sm text-muted-foreground">Their Service Value</p>
                    <p className="text-2xl font-bold text-blue-600">${result.theirValue}</p>
                  </div>
                </div>

                {result.difference > 100 && (
                  <div className="flex items-start gap-2 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800">
                        Consider Adjusting the Exchange
                      </p>
                      <p className="text-sm text-yellow-700">
                        There's a ${result.difference} difference in value. You might want to adjust hours or add additional deliverables to make it more balanced.
                      </p>
                    </div>
                  </div>
                )}

                <div className="text-center">
                  <p className="text-xs text-muted-foreground">
                    * Values are estimates based on average market rates and may vary by location and specific requirements
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SwapCalculator;