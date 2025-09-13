import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const image = formData.get("image") as File

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    // Convert image to base64 for ML service
    const bytes = await image.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Image = buffer.toString("base64")

    const mlServiceUrl = process.env.ML_SERVICE_URL || "http://localhost:8000"

    // Call ML service for food recognition
    const mlResponse = await fetch(`${mlServiceUrl}/recognize-food`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: base64Image,
        format: image.type,
      }),
    })

    if (!mlResponse.ok) {
      const errorText = await mlResponse.text()
      return NextResponse.json({ error: "Food recognition failed", detail: errorText }, { status: 502 })
    }

    const recognitionResult = await mlResponse.json()

    // Enhance results with nutrition data
    const enhancedResults = await enhanceWithNutritionData(recognitionResult.foods)

    return NextResponse.json({
      recognizedFoods: enhancedResults,
      confidence: recognitionResult.confidence,
      suggestions: recognitionResult.suggestions || [],
    })
  } catch (error) {
    console.error("Food recognition error:", error)
    return NextResponse.json({ error: "Failed to recognize food" }, { status: 500 })
  }
}

async function enhanceWithNutritionData(foods: any[]) {
  // This would integrate with your nutrition database
  return foods.map((food) => ({
    ...food,
    nutrition: {
      calories: food.estimatedCalories || 0,
      protein: food.estimatedProtein || 0,
      carbs: food.estimatedCarbs || 0,
      fat: food.estimatedFat || 0,
    },
    ayurvedicProperties: getAyurvedicProperties(food.name),
  }))
}

function getAyurvedicProperties(foodName: string) {
  // Mock Ayurvedic properties - in production, use comprehensive database
  const properties: Record<string, any> = {
    rice: { taste: "sweet", energy: "cooling", effect: "sweet" },
    spinach: { taste: "bitter", energy: "cooling", effect: "pungent" },
    chicken: { taste: "sweet", energy: "heating", effect: "sweet" },
  }

  return (
    properties[foodName.toLowerCase()] || {
      taste: "unknown",
      energy: "neutral",
      effect: "unknown",
    }
  )
}
