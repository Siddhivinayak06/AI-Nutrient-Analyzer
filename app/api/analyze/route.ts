import { type NextRequest, NextResponse } from "next/server"
import { analyzeMeal } from "@/services/analysis-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { foods, userId, userProfile } = body

    if (!foods || !userId) {
      return NextResponse.json({ error: "Missing required fields: foods, userId" }, { status: 400 })
    }

    const analysis = await analyzeMeal({ foods, userId, userProfile })

    return NextResponse.json(analysis)
  } catch (error) {
    console.error("Analysis error:", error)
    return NextResponse.json({ error: "Failed to analyze meal" }, { status: 500 })
  }
}
