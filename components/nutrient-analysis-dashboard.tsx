"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Zap,
  Shield,
  Heart,
  Brain,
  Bone,
  Droplets,
  Leaf,
  RefreshCw,
} from "lucide-react"
import { DietPlanGenerator } from "./diet-plan-generator"
import { useMlAnalysis } from "@/hooks/use-ml-analysis"
import { useProfile } from "./ProfileContext"

interface NutrientData {
  name: string
  current: number
  recommended: number
  unit: string
  status: "deficient" | "adequate" | "excess"
  icon: any
  description: string
  sources: string[]
  ayurvedicNote?: string
}

interface HealthMetric {
  name: string
  value: number
  unit: string
  status: "good" | "warning" | "critical"
  trend: "up" | "down" | "stable"
  description: string
}

const mockNutrientData: NutrientData[] = [
  {
    name: "Vitamin D",
    current: 18,
    recommended: 25,
    unit: "ng/mL",
    status: "deficient",
    icon: Shield,
    description: "Essential for bone health and immune function",
    sources: ["Sunlight exposure", "Fatty fish", "Fortified foods"],
    ayurvedicNote: "Supports Ojas (vital essence) and strengthens immunity",
  },
  {
    name: "Iron",
    current: 45,
    recommended: 55,
    unit: "μg/dL",
    status: "deficient",
    icon: Droplets,
    description: "Crucial for oxygen transport and energy production",
    sources: ["Spinach", "Lentils", "Red meat", "Pumpkin seeds"],
    ayurvedicNote: "Balances Vata and supports healthy blood formation",
  },
  {
    name: "Vitamin B12",
    current: 350,
    recommended: 300,
    unit: "pg/mL",
    status: "adequate",
    icon: Brain,
    description: "Important for nerve function and red blood cell formation",
    sources: ["Fish", "Meat", "Dairy", "Nutritional yeast"],
    ayurvedicNote: "Enhances mental clarity and supports nervous system",
  },
  {
    name: "Calcium",
    current: 950,
    recommended: 1000,
    unit: "mg",
    status: "adequate",
    icon: Bone,
    description: "Essential for bone and teeth health",
    sources: ["Dairy products", "Leafy greens", "Sesame seeds"],
    ayurvedicNote: "Strengthens bones and supports Kapha constitution",
  },
  {
    name: "Omega-3",
    current: 1.8,
    recommended: 2.5,
    unit: "g",
    status: "deficient",
    icon: Heart,
    description: "Important for heart and brain health",
    sources: ["Fish oil", "Walnuts", "Flax seeds", "Chia seeds"],
    ayurvedicNote: "Reduces inflammation and balances Pitta dosha",
  },
  {
    name: "Magnesium",
    current: 420,
    recommended: 400,
    unit: "mg",
    status: "adequate",
    icon: Zap,
    description: "Supports muscle and nerve function, energy production",
    sources: ["Dark chocolate", "Nuts", "Seeds", "Leafy greens"],
    ayurvedicNote: "Calms Vata and supports restful sleep",
  },
]

const mockHealthMetrics: HealthMetric[] = [
  {
    name: "Energy Level",
    value: 72,
    unit: "%",
    status: "good",
    trend: "up",
    description: "Based on nutrient profile and lifestyle factors",
  },
  {
    name: "Digestive Health",
    value: 65,
    unit: "%",
    status: "warning",
    trend: "stable",
    description: "Influenced by fiber intake and gut health nutrients",
  },
  {
    name: "Immune Strength",
    value: 58,
    unit: "%",
    status: "warning",
    trend: "down",
    description: "Based on vitamin D, zinc, and antioxidant levels",
  },
  {
    name: "Bone Health",
    value: 85,
    unit: "%",
    status: "good",
    trend: "stable",
    description: "Calcium, vitamin D, and magnesium status",
  },
]

export function NutrientAnalysisDashboard() {
  const [selectedTab, setSelectedTab] = useState("overview")
  const [showDietPlan, setShowDietPlan] = useState(false)
  const [mlPredictions, setMlPredictions] = useState<any>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const { analyze } = useMlAnalysis()
  const { profile } = useProfile()

  useEffect(() => {
    runMlAnalysis()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const runMlAnalysis = async () => {
    setIsAnalyzing(true)
    try {
      const analysisParams = {
        calories: 1850, // can later be calculated from logged meals
        protein: 65,
        carbs: 230,
        fat: 62,
        iron: 12,
        vitaminC: 45,
        age: Number(profile?.age) || 32,
        gender: profile?.gender === "male" ? 1 : 0,
        dosha: profile?.dosha || "VATA",
      }

      const predictions = await analyze(analysisParams)
      setMlPredictions(predictions)
    } catch (err) {
      console.error("ML analysis failed:", err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getUpdatedNutrientData = () => {
    if (!mlPredictions) return mockNutrientData

    return mockNutrientData.map((nutrient) => {
      let mlStatus = nutrient.status
      let mlNote = nutrient.ayurvedicNote

      if (nutrient.name === "Iron" && mlPredictions.probabilities?.iron_def > 0.5) {
        mlStatus = "deficient"
        mlNote += ` • ML Analysis: ${Math.round(mlPredictions.probabilities.iron_def * 100)}% probability of deficiency`
      }
      if (nutrient.name === "Vitamin C" && mlPredictions.probabilities?.vitc_def > 0.5) {
        mlStatus = "deficient"
        mlNote += ` • ML Analysis: ${Math.round(mlPredictions.probabilities.vitc_def * 100)}% probability of deficiency`
      }

      return {
        ...nutrient,
        status: mlStatus,
        ayurvedicNote: mlNote,
      }
    })
  }

  const updatedNutrientData = getUpdatedNutrientData()
  const deficientNutrients = updatedNutrientData.filter((n) => n.status === "deficient")
  const adequateNutrients = updatedNutrientData.filter((n) => n.status === "adequate")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "deficient":
      case "critical":
        return "text-red-600 bg-red-50"
      case "warning":
        return "text-yellow-600 bg-yellow-50"
      case "adequate":
      case "good":
        return "text-green-600 bg-green-50"
      case "excess":
        return "text-orange-600 bg-orange-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "deficient":
      case "critical":
        return <AlertTriangle className="h-4 w-4" />
      case "warning":
        return <AlertTriangle className="h-4 w-4" />
      case "adequate":
      case "good":
        return <CheckCircle className="h-4 w-4" />
      case "excess":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  if (showDietPlan) {
    return <DietPlanGenerator />
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Nutrient Analysis</h1>
          <p className="text-muted-foreground">
            AI-powered insights combining modern nutrition science with Ayurvedic wisdom
          </p>
          <div className="flex justify-center items-center gap-4 mt-4">
            {isAnalyzing && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <RefreshCw className="h-4 w-4 animate-spin" />
                Running ML analysis...
              </div>
            )}
            {mlPredictions && (
              <Badge variant="secondary" className="bg-green-50 text-green-700">
                <Brain className="h-3 w-3 mr-1" />
                ML Analysis Complete
              </Badge>
            )}
            <Button variant="outline" size="sm" onClick={runMlAnalysis} disabled={isAnalyzing}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh Analysis
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{deficientNutrients.length}</div>
                <p className="text-sm text-muted-foreground">Deficiencies</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{adequateNutrients.length}</div>
                <p className="text-sm text-muted-foreground">Adequate</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {mlPredictions
                    ? Math.round(
                        (1 -
                          (mlPredictions.probabilities?.iron_def +
                            mlPredictions.probabilities?.vitc_def +
                            mlPredictions.probabilities?.protein_def) /
                            3) *
                          100,
                      )
                    : 72}
                  %
                </div>
                <p className="text-sm text-muted-foreground">ML Health Score</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">Vata</div>
                <p className="text-sm text-muted-foreground">Primary Dosha</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="nutrients">Nutrients</TabsTrigger>
            <TabsTrigger value="health">Health Metrics</TabsTrigger>
            <TabsTrigger value="ayurvedic">Ayurvedic View</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {mlPredictions && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-600" />
                    AI-Powered Insights
                  </CardTitle>
                  <CardDescription>Machine learning analysis of your nutritional status</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Iron Deficiency Risk</span>
                        <Badge variant={mlPredictions.probabilities?.iron_def > 0.5 ? "destructive" : "secondary"}>
                          {Math.round(mlPredictions.probabilities?.iron_def * 100)}%
                        </Badge>
                      </div>
                      <Progress value={mlPredictions.probabilities?.iron_def * 100} className="h-2" />
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Vitamin C Risk</span>
                        <Badge variant={mlPredictions.probabilities?.vitc_def > 0.5 ? "destructive" : "secondary"}>
                          {Math.round(mlPredictions.probabilities?.vitc_def * 100)}%
                        </Badge>
                      </div>
                      <Progress value={mlPredictions.probabilities?.vitc_def * 100} className="h-2" />
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Protein Risk</span>
                        <Badge variant={mlPredictions.probabilities?.protein_def > 0.5 ? "destructive" : "secondary"}>
                          {Math.round(mlPredictions.probabilities?.protein_def * 100)}%
                        </Badge>
                      </div>
                      <Progress value={mlPredictions.probabilities?.protein_def * 100} className="h-2" />
                    </div>
                  </div>

                  {mlPredictions.suggestions && mlPredictions.suggestions.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium">AI Recommendations:</h4>
                      {mlPredictions.suggestions.map((suggestion: string, index: number) => (
                        <Alert key={index}>
                          <Brain className="h-4 w-4" />
                          <AlertDescription>{suggestion}</AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  Priority Actions
                </CardTitle>
                <CardDescription>
                  {mlPredictions
                    ? "ML-enhanced recommendations for maximum impact"
                    : "Address these deficiencies first for maximum impact"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {deficientNutrients.slice(0, 3).map((nutrient, index) => {
                  const Icon = nutrient.icon
                  return (
                    <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="bg-red-50 p-2 rounded-full">
                        <Icon className="h-5 w-5 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{nutrient.name}</h4>
                          <Badge variant="destructive" className="text-xs">
                            {Math.round(((nutrient.recommended - nutrient.current) / nutrient.recommended) * 100)}%
                            below
                          </Badge>
                          {mlPredictions && (
                            <Badge variant="outline" className="text-xs">
                              ML Verified
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{nutrient.description}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {nutrient.sources.slice(0, 3).map((source, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {source}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Health Metrics Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockHealthMetrics.map((metric, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{metric.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">
                            {metric.value}
                            {metric.unit}
                          </span>
                          {getTrendIcon(metric.trend)}
                        </div>
                      </div>
                      <Progress value={metric.value} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Personalized Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Alert>
                      <Leaf className="h-4 w-4" />
                      <AlertDescription>
                        <strong>For your Vata constitution:</strong> Focus on warm, cooked foods and regular meal times
                        to support digestion and energy stability.
                      </AlertDescription>
                    </Alert>
                    <Alert>
                      <Shield className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Immune Support:</strong> Increase vitamin D through sunlight exposure and consider
                        supplementation during winter months.
                      </AlertDescription>
                    </Alert>
                    <Alert>
                      <Heart className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Heart Health:</strong> Add omega-3 rich foods like walnuts and flax seeds to your daily
                        routine.
                      </AlertDescription>
                    </Alert>
                    {mlPredictions?.suggestions?.slice(0, 2).map((suggestion: string, index: number) => (
                      <Alert key={index}>
                        <Brain className="h-4 w-4" />
                        <AlertDescription>
                          <strong>AI Insight:</strong> {suggestion}
                        </AlertDescription>
                      </Alert>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="nutrients" className="space-y-6">
            {isAnalyzing && (
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid gap-4">
              {updatedNutrientData.map((nutrient, index) => {
                const Icon = nutrient.icon
                const percentage = (nutrient.current / nutrient.recommended) * 100

                return (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-full ${getStatusColor(nutrient.status)}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold">{nutrient.name}</h3>
                            <div className="flex items-center gap-2">
                              <Badge className={getStatusColor(nutrient.status)}>
                                {getStatusIcon(nutrient.status)}
                                <span className="ml-1 capitalize">{nutrient.status}</span>
                              </Badge>
                              {mlPredictions && (
                                <Badge variant="outline" className="text-xs">
                                  <Brain className="h-3 w-3 mr-1" />
                                  ML Analyzed
                                </Badge>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{nutrient.description}</p>

                          <div className="space-y-2 mb-3">
                            <div className="flex justify-between text-sm">
                              <span>
                                Current: {nutrient.current} {nutrient.unit}
                              </span>
                              <span>
                                Target: {nutrient.recommended} {nutrient.unit}
                              </span>
                            </div>
                            <Progress value={Math.min(percentage, 100)} className="h-2" />
                          </div>

                          <div className="space-y-2">
                            <div>
                              <h4 className="text-sm font-medium mb-1">Best Sources:</h4>
                              <div className="flex flex-wrap gap-1">
                                {nutrient.sources.map((source, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {source}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            {nutrient.ayurvedicNote && (
                              <div className="bg-muted/50 p-3 rounded-lg">
                                <p className="text-sm">
                                  <strong>Ayurvedic Insight:</strong> {nutrient.ayurvedicNote}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="health" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {mockHealthMetrics.map((metric, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{metric.name}</CardTitle>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold">
                          {metric.value}
                          {metric.unit}
                        </span>
                        {getTrendIcon(metric.trend)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Progress value={metric.value} className="h-3 mb-4" />
                    <p className="text-sm text-muted-foreground">{metric.description}</p>
                    <Badge className={`mt-3 ${getStatusColor(metric.status)}`}>
                      {getStatusIcon(metric.status)}
                      <span className="ml-1 capitalize">{metric.status}</span>
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="ayurvedic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-primary" />
                  Ayurvedic Nutritional Wisdom
                </CardTitle>
                <CardDescription>Traditional insights to complement your modern nutrient analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-blue-600">Vata Balance</h3>
                    <p className="text-sm text-muted-foreground">
                      Your dominant dosha needs grounding, warming foods and regular routines.
                    </p>
                    <ul className="text-sm space-y-1">
                      <li>• Warm, cooked meals</li>
                      <li>• Sweet, sour, salty tastes</li>
                      <li>• Regular meal times</li>
                      <li>• Adequate healthy fats</li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-red-600">Agni (Digestive Fire)</h3>
                    <p className="text-sm text-muted-foreground">
                      Your digestive capacity influences nutrient absorption.
                    </p>
                    <ul className="text-sm space-y-1">
                      <li>• Eat when hungry</li>
                      <li>• Avoid cold drinks with meals</li>
                      <li>• Include digestive spices</li>
                      <li>• Don't overeat</li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-green-600">Seasonal Eating</h3>
                    <p className="text-sm text-muted-foreground">Adjust your diet according to seasonal changes.</p>
                    <ul className="text-sm space-y-1">
                      <li>• Spring: Light, detoxifying</li>
                      <li>• Summer: Cool, hydrating</li>
                      <li>• Fall: Warm, grounding</li>
                      <li>• Winter: Nourishing, warming</li>
                    </ul>
                  </div>
                </div>

                <Alert>
                  <Leaf className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Holistic Approach:</strong> While addressing nutrient deficiencies is important, Ayurveda
                    emphasizes that how you eat is as important as what you eat. Practice mindful eating, proper food
                    combining, and eating in a peaceful environment for optimal digestion and absorption.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
