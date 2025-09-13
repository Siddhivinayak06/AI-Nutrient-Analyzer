import { type NextRequest, NextResponse } from "next/server"

interface WeeklyAnalysisRequest {
  weeklyMeals: Array<{
    day: string
    meals: Array<{
      type: "breakfast" | "lunch" | "dinner" | "snack"
      calories: number
      protein: number
      carbs: number
      fat: number
      iron?: number
      vitaminC?: number
    }>
  }>
  userProfile: {
    age: number
    gender: number
    dosha: string
    activityLevel: string
    healthGoals: string[]
  }
}

export async function POST(request: NextRequest) {
  try {
    const { weeklyMeals, userProfile }: WeeklyAnalysisRequest = await request.json()

    if (!weeklyMeals || weeklyMeals.length === 0) {
      return NextResponse.json({ error: "No weekly meal data provided" }, { status: 400 })
    }

    // Calculate weekly averages
    const totalNutrients = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      iron: 0,
      vitaminC: 0,
    }

    let totalMeals = 0

    weeklyMeals.forEach((day) => {
      day.meals.forEach((meal) => {
        totalNutrients.calories += meal.calories
        totalNutrients.protein += meal.protein
        totalNutrients.carbs += meal.carbs
        totalNutrients.fat += meal.fat
        totalNutrients.iron += meal.iron || 0
        totalNutrients.vitaminC += meal.vitaminC || 0
        totalMeals++
      })
    })

    // Calculate daily averages
    const dailyAverages = {
      calories: totalNutrients.calories / 7,
      protein: totalNutrients.protein / 7,
      carbs: totalNutrients.carbs / 7,
      fat: totalNutrients.fat / 7,
      iron: totalNutrients.iron / 7,
      vitaminC: totalNutrients.vitaminC / 7,
    }

    // Get ML prediction for average daily intake
    const mlServiceUrl = process.env.ML_SERVICE_URL || "http://localhost:8000"

    const payload = {
      ...dailyAverages,
      age: userProfile.age,
      gender: userProfile.gender,
      dosha: userProfile.dosha,
    }

    let mlPrediction = null
    try {
      const mlResponse = await fetch(`${mlServiceUrl}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (mlResponse.ok) {
        mlPrediction = await mlResponse.json()
      }
    } catch (error) {
      console.error("ML service error:", error)
    }

    // Generate weekly insights
    const weeklyInsights = generateWeeklyInsights(weeklyMeals, dailyAverages, userProfile, mlPrediction)

    return NextResponse.json({
      weeklyAverages: dailyAverages,
      mlPrediction,
      insights: weeklyInsights,
      recommendations: generateWeeklyRecommendations(dailyAverages, userProfile, mlPrediction),
    })
  } catch (error) {
    console.error("Weekly analysis error:", error)
    return NextResponse.json({ error: "Failed to analyze weekly data" }, { status: 500 })
  }
}

function generateWeeklyInsights(weeklyMeals: any[], averages: any, profile: any, mlPrediction: any) {
  const insights = []

  // Consistency analysis
  const dailyCalories = weeklyMeals.map((day) => day.meals.reduce((sum: number, meal: any) => sum + meal.calories, 0))
  const calorieVariation = Math.max(...dailyCalories) - Math.min(...dailyCalories)

  if (calorieVariation > 500) {
    insights.push({
      type: "consistency",
      message: "High calorie variation between days detected",
      recommendation: "Try to maintain more consistent daily calorie intake",
    })
  }

  // Nutrient balance
  if (averages.protein < 50) {
    insights.push({
      type: "protein",
      message: "Weekly protein intake is below recommended levels",
      recommendation: "Include more protein-rich foods like legumes, nuts, or lean meats",
    })
  }

  // ML-based insights
  if (mlPrediction && mlPrediction.probabilities) {
    if (mlPrediction.probabilities.iron_def > 0.6) {
      insights.push({
        type: "deficiency",
        message: "High probability of iron deficiency detected",
        recommendation: "Focus on iron-rich foods and vitamin C for better absorption",
      })
    }
  }

  return insights
}

function generateWeeklyRecommendations(averages: any, profile: any, mlPrediction: any) {
  const recommendations = []

  // Dosha-based weekly planning
  switch (profile.dosha?.toUpperCase()) {
    case "VATA":
      recommendations.push("Plan regular meal times throughout the week")
      recommendations.push("Include warm, cooked foods in your weekly meal prep")
      break
    case "PITTA":
      recommendations.push("Balance intense flavors throughout the week")
      recommendations.push("Include cooling foods during warmer days")
      break
    case "KAPHA":
      recommendations.push("Vary your meals to avoid monotony")
      recommendations.push("Include lighter meals and stimulating spices")
      break
  }

  // Activity-based recommendations
  if (profile.activityLevel === "very" || profile.activityLevel === "extra") {
    recommendations.push("Increase protein intake on workout days")
    recommendations.push("Ensure adequate carbohydrate replenishment post-exercise")
  }

  return recommendations
}
