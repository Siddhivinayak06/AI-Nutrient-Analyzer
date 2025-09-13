"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Camera, Plus, Trash2, Brain, Zap, AlertTriangle, CheckCircle, Loader2 } from "lucide-react"
import { useMlAnalysis } from "@/hooks/use-ml-analysis"

interface FoodItem {
  id: string
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  iron?: number
  vitaminC?: number
}

export function RealTimeMealAnalyzer() {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([])
  const [newFood, setNewFood] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const { analyze, loading, error } = useMlAnalysis()

  const addFoodItem = () => {
    if (!newFood.trim()) return

    // Mock nutrition data - in real app, this would come from food database
    const mockNutrition = {
      id: Date.now().toString(),
      name: newFood,
      calories: Math.floor(Math.random() * 300) + 50,
      protein: Math.floor(Math.random() * 20) + 5,
      carbs: Math.floor(Math.random() * 40) + 10,
      fat: Math.floor(Math.random() * 15) + 2,
      iron: Math.floor(Math.random() * 5) + 1,
      vitaminC: Math.floor(Math.random() * 30) + 5,
    }

    setFoodItems([...foodItems, mockNutrition])
    setNewFood("")

    // Trigger real-time analysis
    analyzeCurrentMeal([...foodItems, mockNutrition])
  }

  const removeFoodItem = (id: string) => {
    const updatedItems = foodItems.filter((item) => item.id !== id)
    setFoodItems(updatedItems)

    if (updatedItems.length > 0) {
      analyzeCurrentMeal(updatedItems)
    } else {
      setAnalysisResult(null)
    }
  }

  const analyzeCurrentMeal = async (items: FoodItem[]) => {
    if (items.length === 0) return

    setIsAnalyzing(true)
    try {
      const totalNutrition = items.reduce(
        (total, item) => ({
          calories: total.calories + item.calories,
          protein: total.protein + item.protein,
          carbs: total.carbs + item.carbs,
          fat: total.fat + item.fat,
          iron: total.iron + (item.iron || 0),
          vitaminC: total.vitaminC + (item.vitaminC || 0),
        }),
        { calories: 0, protein: 0, carbs: 0, fat: 0, iron: 0, vitaminC: 0 },
      )

      const analysisParams = {
        ...totalNutrition,
        age: 32,
        gender: 0,
        dosha: "VATA",
      }

      const result = await analyze(analysisParams)
      setAnalysisResult(result)
    } catch (err) {
      console.error("Real-time analysis failed:", err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setImageFile(file)

    // Call food recognition API
    const formData = new FormData()
    formData.append("image", file)

    try {
      const response = await fetch("/api/ml-predict/food-recognition", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const recognitionResult = await response.json()

        // Add recognized foods to the meal
        if (recognitionResult.recognizedFoods) {
          const newFoods = recognitionResult.recognizedFoods.map((food: any) => ({
            id: Date.now().toString() + Math.random(),
            name: food.name,
            calories: food.nutrition?.calories || 100,
            protein: food.nutrition?.protein || 5,
            carbs: food.nutrition?.carbs || 15,
            fat: food.nutrition?.fat || 3,
            iron: food.nutrition?.iron || 1,
            vitaminC: food.nutrition?.vitaminC || 5,
          }))

          setFoodItems([...foodItems, ...newFoods])
          analyzeCurrentMeal([...foodItems, ...newFoods])
        }
      }
    } catch (err) {
      console.error("Food recognition failed:", err)
    }
  }

  const totalNutrition = foodItems.reduce(
    (total, item) => ({
      calories: total.calories + item.calories,
      protein: total.protein + item.protein,
      carbs: total.carbs + item.carbs,
      fat: total.fat + item.fat,
      iron: total.iron + (item.iron || 0),
      vitaminC: total.vitaminC + (item.vitaminC || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0, iron: 0, vitaminC: 0 },
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-600" />
            Real-Time Meal Analyzer
          </CardTitle>
          <CardDescription>Add foods to your meal and get instant AI-powered nutritional analysis</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Food Input */}
          <div className="flex gap-2">
            <Input
              placeholder="Add food item (e.g., 'grilled chicken breast')"
              value={newFood}
              onChange={(e) => setNewFood(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addFoodItem()}
            />
            <Button onClick={addFoodItem} disabled={!newFood.trim()}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Image Upload */}
          <div className="flex items-center gap-2">
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="food-image" />
            <label htmlFor="food-image">
              <Button variant="outline" className="cursor-pointer bg-transparent" asChild>
                <span>
                  <Camera className="h-4 w-4 mr-2" />
                  Scan Food
                </span>
              </Button>
            </label>
            {imageFile && <span className="text-sm text-muted-foreground">{imageFile.name}</span>}
          </div>

          {/* Food Items List */}
          {foodItems.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Current Meal:</h4>
              {foodItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {item.calories} cal • {item.protein}g protein • {item.carbs}g carbs • {item.fat}g fat
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => removeFoodItem(item.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Nutrition Summary */}
          {foodItems.length > 0 && (
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2">Meal Totals:</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="font-medium">{totalNutrition.calories}</div>
                  <div className="text-muted-foreground">Calories</div>
                </div>
                <div>
                  <div className="font-medium">{totalNutrition.protein}g</div>
                  <div className="text-muted-foreground">Protein</div>
                </div>
                <div>
                  <div className="font-medium">{totalNutrition.carbs}g</div>
                  <div className="text-muted-foreground">Carbs</div>
                </div>
                <div>
                  <div className="font-medium">{totalNutrition.fat}g</div>
                  <div className="text-muted-foreground">Fat</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Real-time Analysis Results */}
      {(isAnalyzing || analysisResult) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              AI Analysis Results
              {isAnalyzing && <Loader2 className="h-4 w-4 animate-spin" />}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isAnalyzing ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing nutritional content...
                </div>
                <Progress value={60} className="h-2" />
              </div>
            ) : analysisResult ? (
              <div className="space-y-4">
                {/* Risk Assessment */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Iron Risk</span>
                      <Badge variant={analysisResult.probabilities?.iron_def > 0.5 ? "destructive" : "secondary"}>
                        {Math.round(analysisResult.probabilities?.iron_def * 100)}%
                      </Badge>
                    </div>
                    <Progress value={analysisResult.probabilities?.iron_def * 100} className="h-2" />
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Vitamin C Risk</span>
                      <Badge variant={analysisResult.probabilities?.vitc_def > 0.5 ? "destructive" : "secondary"}>
                        {Math.round(analysisResult.probabilities?.vitc_def * 100)}%
                      </Badge>
                    </div>
                    <Progress value={analysisResult.probabilities?.vitc_def * 100} className="h-2" />
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Protein Risk</span>
                      <Badge variant={analysisResult.probabilities?.protein_def > 0.5 ? "destructive" : "secondary"}>
                        {Math.round(analysisResult.probabilities?.protein_def * 100)}%
                      </Badge>
                    </div>
                    <Progress value={analysisResult.probabilities?.protein_def * 100} className="h-2" />
                  </div>
                </div>

                {/* AI Suggestions */}
                {analysisResult.suggestions && analysisResult.suggestions.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium">AI Recommendations:</h4>
                    {analysisResult.suggestions.map((suggestion: string, index: number) => (
                      <Alert key={index}>
                        <Brain className="h-4 w-4" />
                        <AlertDescription>{suggestion}</AlertDescription>
                      </Alert>
                    ))}
                  </div>
                )}

                {/* Overall Assessment */}
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    {analysisResult.probabilities?.iron_def < 0.3 &&
                    analysisResult.probabilities?.vitc_def < 0.3 &&
                    analysisResult.probabilities?.protein_def < 0.3 ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    )}
                    <span className="font-medium">
                      {analysisResult.probabilities?.iron_def < 0.3 &&
                      analysisResult.probabilities?.vitc_def < 0.3 &&
                      analysisResult.probabilities?.protein_def < 0.3
                        ? "Excellent nutritional balance!"
                        : "Consider adding complementary foods"}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    This meal analysis is based on your Vata constitution and current nutritional needs.
                  </p>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
