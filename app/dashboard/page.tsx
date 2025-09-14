vimport { RealTimeMealAnalyzer } from "@/components/real-time-meal-analyzer"
import { LiveNutritionTracker } from "@/components/live-nutrition-tracker"
import { SmartMealSuggestions } from "@/components/smart-meal-suggestions"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { NutrientAnalysisDashboard } from "@/components/nutrient-analysis-dashboard"
import { DietPlanGenerator } from "@/components/diet-plan-generator"
import { ProgressTrackingSystem } from "@/components/progress-tracking-system"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">AI Nutrient + Ayurvedic Diet Analyzer</h1>
          <p className="text-xl text-muted-foreground mb-6">
            Personalized nutrition insights combining modern AI with ancient Ayurvedic wisdom
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="dashboard" className="space-y-8">
          <TabsList className="flex overflow-x-auto space-x-2 border-b border-muted-foreground pb-2">
            <TabsTrigger value="dashboard" className="flex-shrink-0">Dashboard</TabsTrigger>
            <TabsTrigger value="analyzer" className="flex-shrink-0">Meal Analyzer</TabsTrigger>
            <TabsTrigger value="tracker" className="flex-shrink-0">Live Tracker</TabsTrigger>
            <TabsTrigger value="suggestions" className="flex-shrink-0">Smart Suggestions</TabsTrigger>
            <TabsTrigger value="diet-plan" className="flex-shrink-0">Diet Plan</TabsTrigger>
            <TabsTrigger value="progress" className="flex-shrink-0">Progress</TabsTrigger>
          </TabsList>

          {/* Tab Contents */}
          <TabsContent value="dashboard">
            <div className="bg-card p-6 rounded-2xl shadow-md">
              <NutrientAnalysisDashboard />
            </div>
          </TabsContent>

          <TabsContent value="analyzer">
            <div className="bg-card p-6 rounded-2xl shadow-md">
              <RealTimeMealAnalyzer />
            </div>
          </TabsContent>

          <TabsContent value="tracker">
            <div className="bg-card p-6 rounded-2xl shadow-md">
              <LiveNutritionTracker />
            </div>
          </TabsContent>

          <TabsContent value="suggestions">
            <div className="bg-card p-6 rounded-2xl shadow-md">
              <SmartMealSuggestions />
            </div>
          </TabsContent>

          <TabsContent value="diet-plan">
            <div className="bg-card p-6 rounded-2xl shadow-md">
              <DietPlanGenerator />
            </div>
          </TabsContent>

          <TabsContent value="progress">
            <div className="bg-card p-6 rounded-2xl shadow-md">
              <ProgressTrackingSystem />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
