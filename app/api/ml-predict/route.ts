import { type NextRequest, NextResponse } from "next/server"

interface MealRequest {
  calories: number
  protein: number
  carbs: number
  fat: number
  iron?: number
  vitaminC?: number
  age?: number
  gender?: number // 0 female, 1 male
  dosha?: string // 'VATA', 'PITTA', 'KAPHA'
}

export async function POST(request: NextRequest) {
  try {
    const payload: MealRequest = await request.json()

    // Call ML service (FastAPI microservice)
    const mlServiceUrl = process.env.ML_SERVICE_URL || "http://localhost:8000"

    const mlResponse = await fetch(`${mlServiceUrl}/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!mlResponse.ok) {
      const errorText = await mlResponse.text()
      console.error("ML service error:", errorText)
      return NextResponse.json({ error: "ML service error", detail: errorText }, { status: 502 })
    }

    const predictions = await mlResponse.json()

    return NextResponse.json(predictions)
  } catch (error) {
    console.error("ML prediction error:", error)
    return NextResponse.json({ error: "Failed to get ML predictions" }, { status: 500 })
  }
}
