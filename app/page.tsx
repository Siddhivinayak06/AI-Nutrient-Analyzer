import { RealTimeMealAnalyzer } from "@/components/real-time-meal-analyzer"
import { LiveNutritionTracker } from "@/components/live-nutrition-tracker"
import { SmartMealSuggestions } from "@/components/smart-meal-suggestions"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { NutrientAnalysisDashboard } from "@/components/nutrient-analysis-dashboard"
import { DietPlanGenerator } from "@/components/diet-plan-generator"
import { ProgressTrackingSystem } from "@/components/progress-tracking-system"
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">AI Nutrient + Ayurvedic Diet Analyzer</h1>
          <p className="text-xl text-muted-foreground mb-6">
            Personalized nutrition insights combining modern AI with ancient Ayurvedic wisdom
          </p>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-8">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="analyzer">Meal Analyzer</TabsTrigger>
            <TabsTrigger value="tracker">Live Tracker</TabsTrigger>
            <TabsTrigger value="suggestions">Smart Suggestions</TabsTrigger>
            <TabsTrigger value="diet-plan">Diet Plan</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <NutrientAnalysisDashboard />
          </TabsContent>

          <TabsContent value="analyzer">
            <RealTimeMealAnalyzer />
          </TabsContent>

          <TabsContent value="tracker">
            <LiveNutritionTracker />
          </TabsContent>

          <TabsContent value="suggestions">
            <SmartMealSuggestions />
          </TabsContent>

          <TabsContent value="diet-plan">
            <DietPlanGenerator />
          </TabsContent>

          <TabsContent value="progress">
            <ProgressTrackingSystem />
          </TabsContent>
          <TabsContent value="profile">
            <Link href="/profile" className="underline text-primary">Go to Profile Setup</Link>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
