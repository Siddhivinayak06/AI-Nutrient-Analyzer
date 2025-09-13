"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Brain,
  Clock,
  ChefHat,
  Sparkles,
  Target,
  Leaf,
  Zap,
  Heart,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react"
import { useMlAnalysis } from "@/hooks/use-ml-analysis"

interface SmartSuggestion {
  id: string
  type: "meal" | "snack" | "supplement" | "timing"
  title: string
  description: string
  reasoning: string
  confidence: number
  nutrients: string[]
  ayurvedicBenefit: string
  prepTime: number
  difficulty: "easy" | "medium" | "hard"
  ingredients: string[]
  instructions?: string[]
}

interface PersonalizedRecommendation {
  category: string
  priority: "high" | "medium" | "low"
  recommendation: string
  action: string
}

export function SmartMealSuggestions() {
  const [suggestions, setSuggestions] = useState<SmartSuggestion[]>([])
  const [recommendations, setRecommendations] = useState<PersonalizedRecommendation[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedTime, setSelectedTime] = useState<"breakfast" | "lunch" | "dinner" | "snack">("lunch")
  const [userFeedback, setUserFeedback] = useState<Record<string, "like" | "dislike">>({})
  const { getPersonalizedRecommendations, loading } = useMlAnalysis()

  useEffect(() => {
    generateSmartSuggestions()
  }, [selectedTime])

  const generateSmartSuggestions = async () => {
    setIsGenerating(true)
    try {
      // Get personalized recommendations from ML service
      const params = {
        userProfile: {
          age: 32,
          gender: "female",
          dosha: "VATA",
          activityLevel: "moderate",
          healthGoals: ["Weight Management", "Energy Boost"],
          healthConcerns: ["Iron Deficiency", "Low Energy"],
          dietaryRestrictions: ["Vegetarian"],
        },
        currentNutrition: {
          calories: 1200,
          protein: 45,
          carbs: 150,
          fat: 40,
          iron: 8,
          vitaminC: 65,
          calcium: 800,
          magnesium: 250,
        },
        preferences: {
          cuisineTypes: ["Indian", "Mediterranean"],
          mealComplexity: "moderate",
          cookingTime: 30,
          budget: "medium",
        },
      }

      const result = await getPersonalizedRecommendations(params)

      if (result) {
        setRecommendations(result.recommendations || [])
        // Generate meal suggestions based on ML recommendations
        generateMealSuggestions(result)
      }
    } catch (error) {
      console.error("Failed to generate suggestions:", error)
      // Fallback to mock suggestions
      generateMockSuggestions()
    } finally {
      setIsGenerating(false)
    }
  }

  const generateMealSuggestions = (mlResult: any) => {
    const mockSuggestions: SmartSuggestion[] = [
      {
        id: "1",
        type: "meal",
        title: "Iron-Rich Spinach Dal with Quinoa",
        description: "Protein-packed dal with iron-rich spinach, perfect for addressing your iron deficiency",
        reasoning:
          "ML analysis shows 75% probability of iron deficiency. This meal provides 6mg iron + vitamin C for absorption.",
        confidence: 92,
        nutrients: ["Iron", "Protein", "Vitamin C", "Folate"],
        ayurvedicBenefit:
          "Balances Vata with warm, grounding qualities. Spinach provides iron while dal offers protein.",
        prepTime: 25,
        difficulty: "medium",
        ingredients: ["Moong dal", "Fresh spinach", "Quinoa", "Turmeric", "Cumin", "Ginger", "Tomatoes"],
        instructions: [
          "Wash and soak moong dal for 30 minutes",
          "Cook quinoa separately until fluffy",
          "Sauté ginger, cumin, and turmeric",
          "Add dal and cook until soft",
          "Stir in chopped spinach and tomatoes",
          "Serve over quinoa with a squeeze of lemon",
        ],
      },
      {
        id: "2",
        type: "snack",
        title: "Almond-Date Energy Balls",
        description: "Quick energy boost with healthy fats and natural sweetness",
        reasoning:
          "Your energy levels are 68%. These provide sustained energy through healthy fats and natural sugars.",
        confidence: 85,
        nutrients: ["Healthy Fats", "Magnesium", "Fiber", "Natural Sugars"],
        ayurvedicBenefit: "Sweet taste balances Vata. Almonds provide grounding energy and healthy fats.",
        prepTime: 10,
        difficulty: "easy",
        ingredients: ["Almonds", "Dates", "Coconut flakes", "Chia seeds", "Vanilla extract"],
        instructions: [
          "Soak dates in warm water for 10 minutes",
          "Blend almonds until coarsely ground",
          "Add dates and blend to paste",
          "Mix in coconut, chia seeds, and vanilla",
          "Roll into balls and refrigerate",
        ],
      },
      {
        id: "3",
        type: "supplement",
        title: "Golden Milk with Iron-Rich Herbs",
        description: "Traditional Ayurvedic drink enhanced with iron-supporting herbs",
        reasoning: "Combines traditional wisdom with modern nutrition science for iron absorption.",
        confidence: 78,
        nutrients: ["Iron", "Curcumin", "Calcium", "Antioxidants"],
        ayurvedicBenefit: "Turmeric reduces inflammation, warm milk soothes Vata, herbs support iron absorption.",
        prepTime: 5,
        difficulty: "easy",
        ingredients: ["Almond milk", "Turmeric", "Ginger", "Cinnamon", "Black pepper", "Honey"],
      },
    ]

    setSuggestions(mockSuggestions)
  }

  const generateMockSuggestions = () => {
    // Fallback suggestions when ML service is unavailable
    const fallbackSuggestions: SmartSuggestion[] = [
      {
        id: "fallback-1",
        type: "meal",
        title: "Warming Vegetable Soup",
        description: "Nourishing soup perfect for Vata constitution",
        reasoning: "Based on your dosha type and current season",
        confidence: 70,
        nutrients: ["Fiber", "Vitamins", "Minerals"],
        ayurvedicBenefit: "Warm, liquid foods are ideal for Vata balance",
        prepTime: 20,
        difficulty: "easy",
        ingredients: ["Mixed vegetables", "Vegetable broth", "Ginger", "Turmeric"],
      },
    ]

    setSuggestions(fallbackSuggestions)
  }

  const handleFeedback = (suggestionId: string, feedback: "like" | "dislike") => {
    setUserFeedback((prev) => ({
      ...prev,
      [suggestionId]: feedback,
    }))

    // In a real app, this would send feedback to improve ML recommendations
    console.log(`User ${feedback}d suggestion ${suggestionId}`)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "text-green-600 bg-green-50"
      case "medium":
        return "text-yellow-600 bg-yellow-50"
      case "hard":
        return "text-red-600 bg-red-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-50"
      case "medium":
        return "text-yellow-600 bg-yellow-50"
      case "low":
        return "text-green-600 bg-green-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                Smart Meal Suggestions
              </CardTitle>
              <CardDescription>
                AI-powered meal recommendations tailored to your nutritional needs and dosha
              </CardDescription>
            </div>
            <Button onClick={generateSmartSuggestions} disabled={isGenerating || loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isGenerating ? "animate-spin" : ""}`} />
              Refresh Suggestions
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="suggestions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="suggestions">Smart Suggestions</TabsTrigger>
          <TabsTrigger value="recommendations">ML Recommendations</TabsTrigger>
          <TabsTrigger value="timing">Optimal Timing</TabsTrigger>
        </TabsList>

        {/* Smart Suggestions Tab */}
        <TabsContent value="suggestions" className="space-y-4">
          {/* Meal Time Selector */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="h-4 w-4" />
                <span className="font-medium">Suggestions for:</span>
              </div>
              <div className="flex gap-2">
                {(["breakfast", "lunch", "dinner", "snack"] as const).map((time) => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTime(time)}
                  >
                    {time.charAt(0).toUpperCase() + time.slice(1)}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Suggestions List */}
          <div className="space-y-4">
            {suggestions.map((suggestion) => (
              <Card key={suggestion.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        <ChefHat className="h-5 w-5" />
                        {suggestion.title}
                        <Badge variant="outline" className="ml-2">
                          <Brain className="h-3 w-3 mr-1" />
                          {suggestion.confidence}% match
                        </Badge>
                      </CardTitle>
                      <CardDescription>{suggestion.description}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleFeedback(suggestion.id, "like")}
                        className={userFeedback[suggestion.id] === "like" ? "text-green-600" : ""}
                      >
                        <ThumbsUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleFeedback(suggestion.id, "dislike")}
                        className={userFeedback[suggestion.id] === "dislike" ? "text-red-600" : ""}
                      >
                        <ThumbsDown className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* AI Reasoning */}
                  <Alert>
                    <Brain className="h-4 w-4" />
                    <AlertDescription>
                      <strong>AI Reasoning:</strong> {suggestion.reasoning}
                    </AlertDescription>
                  </Alert>

                  {/* Nutrients and Benefits */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Key Nutrients:</h4>
                      <div className="flex flex-wrap gap-1">
                        {suggestion.nutrients.map((nutrient, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {nutrient}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge className={getDifficultyColor(suggestion.difficulty)}>{suggestion.difficulty}</Badge>
                      <Badge variant="outline">
                        <Clock className="h-3 w-3 mr-1" />
                        {suggestion.prepTime}m
                      </Badge>
                    </div>
                  </div>

                  {/* Ayurvedic Benefit */}
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Leaf className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-sm">Ayurvedic Benefit:</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{suggestion.ayurvedicBenefit}</p>
                  </div>

                  {/* Ingredients */}
                  <div>
                    <h4 className="font-medium mb-2">Ingredients:</h4>
                    <div className="flex flex-wrap gap-1">
                      {suggestion.ingredients.map((ingredient, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {ingredient}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Instructions */}
                  {suggestion.instructions && (
                    <div>
                      <h4 className="font-medium mb-2">Quick Instructions:</h4>
                      <ol className="text-sm space-y-1 text-muted-foreground">
                        {suggestion.instructions.map((step, index) => (
                          <li key={index}>
                            {index + 1}. {step}
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ML Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-4">
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{rec.category}</h4>
                        <Badge className={getPriorityColor(rec.priority)}>{rec.priority} priority</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{rec.recommendation}</p>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm">
                          <strong>Action:</strong> {rec.action}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {recommendations.length === 0 && (
              <Card>
                <CardContent className="pt-6 text-center">
                  <Brain className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    {isGenerating ? "Generating personalized recommendations..." : "No recommendations available"}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Optimal Timing Tab */}
        <TabsContent value="timing" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-600" />
                  Optimal Meal Timing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Breakfast</div>
                      <div className="text-sm text-muted-foreground">Light to moderate</div>
                    </div>
                    <Badge variant="outline">7:00 - 8:00 AM</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-green-50">
                    <div>
                      <div className="font-medium">Lunch</div>
                      <div className="text-sm text-muted-foreground">Largest meal (optimal digestion)</div>
                    </div>
                    <Badge className="bg-green-600">12:00 - 1:00 PM</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Dinner</div>
                      <div className="text-sm text-muted-foreground">Light and early</div>
                    </div>
                    <Badge variant="outline">6:00 - 7:00 PM</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-600" />
                  Energy Optimization
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <Clock className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Peak Energy Window:</strong> 10 AM - 2 PM. Schedule nutrient-dense meals during this time.
                  </AlertDescription>
                </Alert>
                <Alert>
                  <Heart className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Recovery Window:</strong> 6 PM - 8 PM. Focus on easily digestible, warming foods.
                  </AlertDescription>
                </Alert>
                <Alert>
                  <Leaf className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Vata Balance:</strong> Regular meal times are crucial. Avoid skipping meals or eating too
                    late.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
