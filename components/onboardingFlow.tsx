"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, User, Target, AlertCircle, Sun } from "lucide-react";
import { DoshaAssessment } from "@/components/dosha-assessment";
import { useProfile } from "@/components/ProfileContext";

interface UserProfile {
  name: string;
  age: string;
  gender: string;
  height: string;
  weight: string;
  location: string;
  activityLevel: string;
  healthConcerns: string[];
  primaryGoals: string[];
  dietaryRestrictions: string[];
  allergies: string;
  sleepHours: string;
  stressLevel: string;
  digestiveIssues: string[];
  currentDiet: string;
}

const totalSteps = 4;

export default function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(1);
  const { profile, setProfile } = useProfile();
  const [showDoshaAssessment, setShowDoshaAssessment] = useState(false);

  const updateProfile = (field: keyof UserProfile, value: any) => {
    setProfile((prev: any) => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: keyof UserProfile, item: string) => {
    const currentArray = profile[field] as string[];
    const updated = currentArray.includes(item)
      ? currentArray.filter((i) => i !== item)
      : [...currentArray, item];
    updateProfile(field, updated);
  };

  const handleComplete = () => {
    console.log("Profile completed:", profile);
    setShowDoshaAssessment(true);
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  if (showDoshaAssessment) return <DoshaAssessment />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-100 py-10">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Let's Get to Know You</h1>
          <p className="text-muted-foreground">
            Step {currentStep} of {totalSteps} • Building your wellness profile
          </p>
          <Progress value={(currentStep / totalSteps) * 100} className="max-w-md mx-auto mt-4" />
        </div>

        {/* Card Wrapper */}
        <Card className="max-w-2xl mx-auto shadow-xl rounded-2xl">
          <CardHeader>
            <div className="flex items-center gap-2">
              {currentStep === 1 && <User className="h-5 w-5 text-primary" />}
              {currentStep === 2 && <Target className="h-5 w-5 text-primary" />}
              {currentStep === 3 && <AlertCircle className="h-5 w-5 text-primary" />}
              {currentStep === 4 && <Sun className="h-5 w-5 text-primary" />}
              <CardTitle>
                {currentStep === 1 && "Basic Information"}
                {currentStep === 2 && "Health & Goals"}
                {currentStep === 3 && "Dietary Preferences"}
                {currentStep === 4 && "Lifestyle Factors"}
              </CardTitle>
            </div>
            <CardDescription>
              {currentStep === 1 && "Tell us about yourself to get started."}
              {currentStep === 2 && "What are your health concerns and goals?"}
              {currentStep === 3 && "Your dietary needs and restrictions."}
              {currentStep === 4 && "A few details about your daily routine."}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* STEP 1 */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => updateProfile("name", e.target.value)}
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      value={profile.age}
                      onChange={(e) => updateProfile("age", e.target.value)}
                      placeholder="25"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Gender</Label>
                    <Select value={profile.gender} onValueChange={(v) => updateProfile("gender", v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="na">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Activity Level</Label>
                    <Select
                      value={profile.activityLevel}
                      onValueChange={(v) => updateProfile("activityLevel", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sedentary">Sedentary</SelectItem>
                        <SelectItem value="light">Lightly Active</SelectItem>
                        <SelectItem value="moderate">Moderately Active</SelectItem>
                        <SelectItem value="very">Very Active</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <Label className="text-base font-medium">Health Concerns</Label>
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    {["Diabetes", "Hypertension", "Obesity", "Stress", "Insomnia"].map((c) => (
                      <div key={c} className="flex items-center space-x-2">
                        <Checkbox
                          id={c}
                          checked={profile.healthConcerns.includes(c)}
                          onCheckedChange={() => toggleArrayItem("healthConcerns", c)}
                        />
                        <Label htmlFor={c} className="text-sm">
                          {c}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <Label className="text-base font-medium">Dietary Restrictions</Label>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  {["Vegetarian", "Vegan", "Gluten-Free", "Keto"].map((r) => (
                    <div key={r} className="flex items-center space-x-2">
                      <Checkbox
                        id={r}
                        checked={profile.dietaryRestrictions.includes(r)}
                        onCheckedChange={() => toggleArrayItem("dietaryRestrictions", r)}
                      />
                      <Label htmlFor={r} className="text-sm">
                        {r}
                      </Label>
                    </div>
                  ))}
                </div>
                <div>
                  <Label htmlFor="allergies">Allergies</Label>
                  <Textarea
                    id="allergies"
                    value={profile.allergies}
                    onChange={(e) => updateProfile("allergies", e.target.value)}
                    placeholder="List any food allergies..."
                  />
                </div>
              </div>
            )}

            {/* STEP 4 */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Sleep Hours</Label>
                    <Select value={profile.sleepHours} onValueChange={(v) => updateProfile("sleepHours", v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select hours" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5-6">5-6</SelectItem>
                        <SelectItem value="6-7">6-7</SelectItem>
                        <SelectItem value="7-8">7-8</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Stress Level</Label>
                    <Select value={profile.stressLevel} onValueChange={(v) => updateProfile("stressLevel", v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-6">
              <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              {currentStep < totalSteps ? (
                <Button onClick={nextStep}>
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleComplete}>Complete Setup</Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
