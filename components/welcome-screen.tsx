"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Leaf, Brain, Heart, Sparkles } from "lucide-react"
import OnboardingFlow from "@/components/OnboardingFlow";

export function WelcomeScreen() {
  const [showOnboarding, setShowOnboarding] = useState(false)

  if (showOnboarding) {
    return <OnboardingFlow />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-primary/10 p-3 rounded-full">
              <Leaf className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-balance mb-6">AI Nutrient Analyzer</h1>
          <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto mb-8">
            Combine modern nutrition science with traditional Ayurvedic principles for personalized wellness
          </p>
          <Button size="lg" onClick={() => setShowOnboarding(true)} className="text-lg px-8 py-6">
            Start Your Wellness Journey
            <Sparkles className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center">
            <CardHeader>
              <div className="bg-primary/10 p-3 rounded-full w-fit mx-auto mb-4">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>AI-Powered Analysis</CardTitle>
              <CardDescription>
                Advanced algorithms analyze your nutritional needs and detect deficiencies
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="bg-primary/10 p-3 rounded-full w-fit mx-auto mb-4">
                <Leaf className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Ayurvedic Wisdom</CardTitle>
              <CardDescription>
                Traditional dosha-based recommendations tailored to your unique constitution
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="bg-primary/10 p-3 rounded-full w-fit mx-auto mb-4">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Personalized Plans</CardTitle>
              <CardDescription>
                Custom diet plans that balance modern nutrition with ancient healing principles
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* How It Works */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-8">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: "1", title: "Profile Setup", desc: "Share your basic info and health goals" },
              { step: "2", title: "Dosha Assessment", desc: "Complete our Ayurvedic constitution quiz" },
              { step: "3", title: "AI Analysis", desc: "Get personalized nutrient recommendations" },
              { step: "4", title: "Custom Plan", desc: "Receive your tailored diet and lifestyle plan" },
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center">
                <Badge
                  variant="secondary"
                  className="w-8 h-8 rounded-full flex items-center justify-center mb-4 text-sm font-bold"
                >
                  {item.step}
                </Badge>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground text-center">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-6">
              <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Health?</h3>
              <p className="text-muted-foreground mb-6">
                Join thousands who have discovered the perfect balance of modern science and ancient wisdom
              </p>
              <Button size="lg" onClick={() => setShowOnboarding(true)} className="w-full md:w-auto">
                Get Started Now
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
