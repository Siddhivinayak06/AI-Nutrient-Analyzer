import { type NextRequest, NextResponse } from "next/server"

interface BatchMealRequest {
  meals: Array<{
    id: string
    name: string
    calories: number
    protein: number
    carbs: number
    fat: number
    iron?: number
    vitaminC?: number
  }>
  userProfile: {
    age: number
    gender: number
    dosha: string
    activityLevel: string
  }
}

export async function POST(request: NextRequest) {
  try {
    const { meals, userProfile }: BatchMealRequest = await request.json()

    if (!meals || meals.length === 0) {
      return NextResponse.json({ error: "No meals provided for analysis" }, { status: 400 })
    }

    const mlServiceUrl = process.env.ML_SERVICE_URL || "http://localhost:8000"

    // Process each meal through ML service
    const batchPredictions = await Promise.all(
      meals.map(async (meal) => {
        const payload = {
          calories: meal.calories,
          protein: meal.protein,
          carbs: meal.carbs,
          fat: meal.fat,
          iron: meal.iron || 0,
          vitaminC: meal.vitaminC || 0,
          age: userProfile.age,
          gender: userProfile.gender,
          dosha: userProfile.dosha,
        }

        try {
          const mlResponse = await fetch(`${mlServiceUrl}/predict`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })

          if (mlResponse.ok) {
            const prediction = await mlResponse.json()
            return {
              mealId: meal.id,
              mealName: meal.name,
              prediction,
              status: "success",
            }
          } else {
            return {
              mealId: meal.id,
              mealName: meal.name,
              error: "ML service error",
              status: "error",
            }
          }
        } catch (error) {
          return {
            mealId: meal.id,
            mealName: meal.name,
            error: "Network error",
            status: "error",
          }
        }
      }),
    )

    // Aggregate results
    const successfulPredictions = batchPredictions.filter((p) => p.status === "success")
    const failedPredictions = batchPredictions.filter((p) => p.status === "error")

    return NextResponse.json({
      results: batchPredictions,
      summary: {
        total: meals.length,
        successful: successfulPredictions.length,
        failed: failedPredictions.length,
      },
    })
  } catch (error) {
    console.error("Batch ML prediction error:", error)
    return NextResponse.json({ error: "Failed to process batch predictions" }, { status: 500 })
  }
}
