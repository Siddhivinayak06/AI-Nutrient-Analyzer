import { getUserProfile } from "./user-service"
import { calculateNutrients } from "@/lib/nutrition/nutrient-db"
import { suggestAyurvedicModifications } from "@/utils/ayurveda"

interface AnalyzeMealParams {
  foods: string[]
  userId: string
  userProfile?: any
}

export async function analyzeMeal({ foods, userId, userProfile }: AnalyzeMealParams) {
  try {
    // Get user profile if not provided
    const profile = userProfile || (await getUserProfile(userId))

    // Calculate basic nutrients from foods
    const nutrientSummary = calculateNutrients(foods)

    // Get Ayurvedic recommendations based on dosha
    const doshaAdvice = suggestAyurvedicModifications(profile.dosha, nutrientSummary)

    // Call ML service for deficiency predictions
    const mlPredictions = await getMlPredictions({
      calories: nutrientSummary.calories,
      protein: nutrientSummary.protein,
      carbs: nutrientSummary.carbs,
      fat: nutrientSummary.fat,
      iron: nutrientSummary.iron,
      vitaminC: nutrientSummary.vitaminC,
      age: profile.age,
      gender: profile.gender === "male" ? 1 : 0,
      dosha: profile.dosha,
    })

    return {
      nutrientSummary,
      doshaAdvice,
      mlPredictions,
      recommendations: generateRecommendations(nutrientSummary, doshaAdvice, mlPredictions),
    }
  } catch (error) {
    console.error("Analysis service error:", error)
    throw new Error("Failed to analyze meal")
  }
}

async function getMlPredictions(payload: any) {
  try {
    const response = await fetch("/api/ml-predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error("ML prediction failed")
    }

    return await response.json()
  } catch (error) {
    console.error("ML prediction error:", error)
    // Return fallback predictions if ML service is unavailable
    return {
      probabilities: {
        iron_def: 0.3,
        vitc_def: 0.2,
        protein_def: 0.1,
      },
      suggestions: ["ML service unavailable - using fallback recommendations"],
    }
  }
}

function generateRecommendations(nutrients: any, ayurvedicAdvice: any, mlPredictions: any) {
  const recommendations = []

  // Add ML-based recommendations
  if (mlPredictions.suggestions) {
    recommendations.push(...mlPredictions.suggestions)
  }

  // Add Ayurvedic recommendations
  if (ayurvedicAdvice) {
    recommendations.push(...ayurvedicAdvice)
  }

  return recommendations
}
