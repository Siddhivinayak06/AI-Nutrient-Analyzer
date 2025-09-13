"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, User, Target, AlertCircle } from "lucide-react"
import { DoshaAssessment } from "./dosha-assessment"

interface UserProfile {
  // Basic Info
  name: string
  age: string
  gender: string
  height: string
  weight: string
  location: string
  activityLevel: string

  // Health & Goals
  healthConcerns: string[]
  primaryGoals: string[]
  dietaryRestrictions: string[]
  allergies: string

  // Lifestyle
  sleepHours: string
  stressLevel: string
  digestiveIssues: string[]
  currentDiet: string
}

const initialProfile: UserProfile = {
  name: "",
  age: "",
  gender: "",
  height: "",
  weight: "",
  location: "",
  activityLevel: "",
  healthConcerns: [],
  primaryGoals: [],
  dietaryRestrictions: [],
  allergies: "",
  sleepHours: "",
  stressLevel: "",
  digestiveIssues: [],
  currentDiet: "",
}

export function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(1)
  const [profile, setProfile] = useState<UserProfile>(initialProfile)
  const [showDoshaAssessment, setShowDoshaAssessment] = useState(false)
  const totalSteps = 4

  const updateProfile = (field: keyof UserProfile, value: any) => {
    setProfile((prev) => ({ ...prev, [field]: value }))
  }

  const toggleArrayItem = (field: keyof UserProfile, item: string) => {
    const currentArray = profile[field] as string[]
    const updated = currentArray.includes(item) ? currentArray.filter((i) => i !== item) : [...currentArray, item]
    updateProfile(field, updated)
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    console.log("Profile completed:", profile)
    setShowDoshaAssessment(true)
  }

  if (showDoshaAssessment) {
    return <DoshaAssessment />
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Let's Get to Know You</h1>
          <p className="text-muted-foreground">
            Step {currentStep} of {totalSteps}: Building your personalized wellness profile
          </p>
          <Progress value={(currentStep / totalSteps) * 100} className="max-w-md mx-auto mt-4" />
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <div className="flex items-center gap-2">
              {currentStep === 1 && <User className="h-5 w-5 text-primary" />}
              {currentStep === 2 && <Target className="h-5 w-5 text-primary" />}
              {currentStep === 3 && <AlertCircle className="h-5 w-5 text-primary" />}
              {currentStep === 4 && <Target className="h-5 w-5 text-primary" />}
              <CardTitle>
                {currentStep === 1 && "Basic Information"}
                {currentStep === 2 && "Health & Goals"}
                {currentStep === 3 && "Dietary Preferences"}
                {currentStep === 4 && "Lifestyle Factors"}
              </CardTitle>
            </div>
            <CardDescription>
              {currentStep === 1 && "Tell us about yourself to get started"}
              {currentStep === 2 && "What are your health concerns and wellness goals?"}
              {currentStep === 3 && "Help us understand your dietary needs and restrictions"}
              {currentStep === 4 && "A few more details about your daily routine"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Step 1: Basic Information */}
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
                    <Select value={profile.gender} onValueChange={(value) => updateProfile("gender", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Activity Level</Label>
                    <Select
                      value={profile.activityLevel}
                      onValueChange={(value) => updateProfile("activityLevel", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select activity level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sedentary">Sedentary</SelectItem>
                        <SelectItem value="light">Lightly Active</SelectItem>
                        <SelectItem value="moderate">Moderately Active</SelectItem>
                        <SelectItem value="very">Very Active</SelectItem>
                        <SelectItem value="extra">Extremely Active</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      value={profile.height}
                      onChange={(e) => updateProfile("height", e.target.value)}
                      placeholder="170"
                    />
                  </div>
                  <div>
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      value={profile.weight}
                      onChange={(e) => updateProfile("weight", e.target.value)}
                      placeholder="65"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={profile.location}
                    onChange={(e) => updateProfile("location", e.target.value)}
                    placeholder="City, Country"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Health & Goals */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <Label className="text-base font-medium">Health Concerns (select all that apply)</Label>
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    {[
                      "Diabetes",
                      "Hypertension",
                      "Obesity",
                      "Digestive Issues",
                      "Stress/Anxiety",
                      "Insomnia",
                      "Joint Pain",
                      "Low Energy",
                    ].map((concern) => (
                      <div key={concern} className="flex items-center space-x-2">
                        <Checkbox
                          id={concern}
                          checked={profile.healthConcerns.includes(concern)}
                          onCheckedChange={() => toggleArrayItem("healthConcerns", concern)}
                        />
                        <Label htmlFor={concern} className="text-sm">
                          {concern}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-base font-medium">Primary Goals (select all that apply)</Label>
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    {[
                      "Weight Loss",
                      "Weight Gain",
                      "Muscle Building",
                      "Better Digestion",
                      "Increased Energy",
                      "Stress Management",
                      "Better Sleep",
                      "Overall Wellness",
                    ].map((goal) => (
                      <div key={goal} className="flex items-center space-x-2">
                        <Checkbox
                          id={goal}
                          checked={profile.primaryGoals.includes(goal)}
                          onCheckedChange={() => toggleArrayItem("primaryGoals", goal)}
                        />
                        <Label htmlFor={goal} className="text-sm">
                          {goal}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Dietary Preferences */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <Label className="text-base font-medium">Dietary Restrictions (select all that apply)</Label>
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    {["Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free", "Nut-Free", "Low-Carb", "Keto", "Paleo"].map(
                      (restriction) => (
                        <div key={restriction} className="flex items-center space-x-2">
                          <Checkbox
                            id={restriction}
                            checked={profile.dietaryRestrictions.includes(restriction)}
                            onCheckedChange={() => toggleArrayItem("dietaryRestrictions", restriction)}
                          />
                          <Label htmlFor={restriction} className="text-sm">
                            {restriction}
                          </Label>
                        </div>
                      ),
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="allergies">Food Allergies or Intolerances</Label>
                  <Textarea
                    id="allergies"
                    value={profile.allergies}
                    onChange={(e) => updateProfile("allergies", e.target.value)}
                    placeholder="List any food allergies or intolerances..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Current Diet Type</Label>
                  <Select value={profile.currentDiet} onValueChange={(value) => updateProfile("currentDiet", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Describe your current diet" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="balanced">Balanced/Mixed Diet</SelectItem>
                      <SelectItem value="vegetarian">Vegetarian</SelectItem>
                      <SelectItem value="vegan">Vegan</SelectItem>
                      <SelectItem value="mediterranean">Mediterranean</SelectItem>
                      <SelectItem value="western">Western/Fast Food Heavy</SelectItem>
                      <SelectItem value="traditional">Traditional/Cultural Diet</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Step 4: Lifestyle Factors */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Average Sleep Hours</Label>
                    <Select value={profile.sleepHours} onValueChange={(value) => updateProfile("sleepHours", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select hours" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="less-than-5">Less than 5 hours</SelectItem>
                        <SelectItem value="5-6">5-6 hours</SelectItem>
                        <SelectItem value="6-7">6-7 hours</SelectItem>
                        <SelectItem value="7-8">7-8 hours</SelectItem>
                        <SelectItem value="8-9">8-9 hours</SelectItem>
                        <SelectItem value="more-than-9">More than 9 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Stress Level</Label>
                    <Select value={profile.stressLevel} onValueChange={(value) => updateProfile("stressLevel", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="very-high">Very High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label className="text-base font-medium">Digestive Issues (select all that apply)</Label>
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    {[
                      "Bloating",
                      "Gas",
                      "Constipation",
                      "Diarrhea",
                      "Acid Reflux",
                      "Nausea",
                      "Food Sensitivities",
                      "Irregular Appetite",
                    ].map((issue) => (
                      <div key={issue} className="flex items-center space-x-2">
                        <Checkbox
                          id={issue}
                          checked={profile.digestiveIssues.includes(issue)}
                          onCheckedChange={() => toggleArrayItem("digestiveIssues", issue)}
                        />
                        <Label htmlFor={issue} className="text-sm">
                          {issue}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-6">
              <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>

              {currentStep < totalSteps ? (
                <Button onClick={nextStep}>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleComplete}>Complete Setup</Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
