import { type NextRequest, NextResponse } from "next/server"

interface PersonalizedRequest {
  userProfile: {
    age: number
    gender: string
    dosha: string
    activityLevel: string
    healthGoals: string[]
    healthConcerns: string[]
    dietaryRestrictions: string[]
  }
  currentNutrition: {
    calories: number
    protein: number
    carbs: number
    fat: number
    iron?: number
    vitaminC?: number
    calcium?: number
    magnesium?: number
  }
  preferences: {
    cuisineTypes: string[]
    mealComplexity: "simple" | "moderate" | "complex"
    cookingTime: number // minutes
    budget: "low" | "medium" | "high"
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userProfile, currentNutrition, preferences }: PersonalizedRequest = await request.json()

    // Get ML predictions for current nutrition status
    const mlServiceUrl = process.env.ML_SERVICE_URL || "http://localhost:8000"

    const nutritionPayload = {
      ...currentNutrition,
      age: userProfile.age,
      gender: userProfile.gender === "male" ? 1 : 0,
      dosha: userProfile.dosha,
    }

    let mlPrediction = null
    try {
      const mlResponse = await fetch(`${mlServiceUrl}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nutritionPayload),
      })

      if (mlResponse.ok) {
        mlPrediction = await mlResponse.json()
      }
    } catch (error) {
      console.error("ML service error:", error)
    }

    // Generate personalized recommendations
    const recommendations = generatePersonalizedRecommendations(
      userProfile,
      currentNutrition,
      preferences,
      mlPrediction,
    )

    return NextResponse.json({
      recommendations,
      mlInsights: mlPrediction,
      personalizedMeals: generateMealSuggestions(userProfile, preferences, mlPrediction),
      supplementSuggestions: generateSupplementSuggestions(userProfile, mlPrediction),
    })
  } catch (error) {
    console.error("Personalized recommendations error:", error)
    return NextResponse.json({ error: "Failed to generate personalized recommendations" }, { status: 500 })
  }
}

function generatePersonalizedRecommendations(profile: any, nutrition: any, preferences: any, mlPrediction: any) {
  const recommendations = []

  // Health goal-based recommendations
  if (profile.healthGoals.includes("Weight Loss")) {
    recommendations.push({
      category: "Weight Management",
      priority: "high",
      recommendation: "Create a moderate calorie deficit while maintaining protein intake",
      action: "Reduce daily calories by 300-500 while keeping protein at 1.2g per kg body weight",
    })
  }

  if (profile.healthGoals.includes("Muscle Building")) {
    recommendations.push({
      category: "Muscle Building",
      priority: "high",
      recommendation: "Increase protein intake and ensure adequate calories",
      action: "Aim for 1.6-2.2g protein per kg body weight with slight calorie surplus",
    })
  }

  // ML-based deficiency recommendations
  if (mlPrediction?.probabilities) {
    if (mlPrediction.probabilities.iron_def > 0.5) {
      recommendations.push({
        category: "Nutrient Deficiency",
        priority: "high",
        recommendation: "Address potential iron deficiency",
        action: "Include iron-rich foods with vitamin C sources for better absorption",
      })
    }

    if (mlPrediction.probabilities.vitc_def > 0.5) {
      recommendations.push({
        category: "Nutrient Deficiency",
        priority: "medium",
        recommendation: "Increase vitamin C intake",
        action: "Add citrus fruits, bell peppers, or amla to daily diet",
      })
    }
  }

  // Dosha-specific recommendations
  const doshaRecs = getDoshaSpecificRecommendations(profile.dosha, profile.healthConcerns)
  recommendations.push(...doshaRecs)

  return recommendations
}

function getDoshaSpecificRecommendations(dosha: string, healthConcerns: string[]) {
  const recommendations = []

  switch (dosha?.toUpperCase()) {
    case "VATA":
      recommendations.push({
        category: "Dosha Balance",
        priority: "medium",
        recommendation: "Focus on grounding and warming foods",
        action: "Include warm, cooked meals with healthy fats and regular meal timing",
      })

      if (healthConcerns.includes("Anxiety") || healthConcerns.includes("Insomnia")) {
        recommendations.push({
          category: "Mental Health",
          priority: "high",
          recommendation: "Use calming foods to balance Vata",
          action: "Include warm milk with nutmeg, dates, and calming herbal teas",
        })
      }
      break

    case "PITTA":
      recommendations.push({
        category: "Dosha Balance",
        priority: "medium",
        recommendation: "Emphasize cooling and calming foods",
        action: "Include sweet, bitter tastes and avoid excessive spicy or acidic foods",
      })
      break

    case "KAPHA":
      recommendations.push({
        category: "Dosha Balance",
        priority: "medium",
        recommendation: "Choose light, stimulating foods",
        action: "Include pungent, bitter tastes and reduce heavy, oily foods",
      })
      break
  }

  return recommendations
}

function generateMealSuggestions(profile: any, preferences: any, mlPrediction: any) {
  // This would integrate with a meal database and recipe API
  const mealSuggestions = {
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: [],
  }

  // Add dosha-appropriate meals based on preferences
  if (profile.dosha === "VATA") {
    mealSuggestions.breakfast.push({
      name: "Warm Oatmeal with Nuts and Dates",
      calories: 350,
      protein: 12,
      cookingTime: 10,
      doshaRating: "excellent",
    })
  }

  return mealSuggestions
}

function generateSupplementSuggestions(profile: any, mlPrediction: any) {
  const supplements = []

  if (mlPrediction?.probabilities?.iron_def > 0.6) {
    supplements.push({
      name: "Iron Supplement",
      dosage: "18mg daily",
      timing: "With vitamin C source",
      duration: "3 months, then retest",
      ayurvedicAlternative: "Lauha Bhasma (Ayurvedic iron preparation)",
    })
  }

  if (mlPrediction?.probabilities?.vitc_def > 0.5) {
    supplements.push({
      name: "Vitamin C",
      dosage: "500mg daily",
      timing: "With meals",
      duration: "Ongoing",
      ayurvedicAlternative: "Fresh Amla juice daily",
    })
  }

  return supplements
}
