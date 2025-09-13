"use client"

import { useState, useCallback } from "react"

interface MlAnalysisParams {
  calories: number
  protein: number
  carbs: number
  fat: number
  iron?: number
  vitaminC?: number
  age?: number
  gender?: number
  dosha?: string
}

interface MlAnalysisResult {
  probabilities: {
    iron_def: number
    vitc_def: number
    protein_def: number
  }
  risk_assessment: {
    iron_def: string
    vitc_def: string
    protein_def: string
  }
  suggestions: string[]
  confidence_scores: {
    iron_def: string
    vitc_def: string
    protein_def: string
  }
}

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

export function useMlAnalysis() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<MlAnalysisResult | null>(null)

  const analyze = useCallback(async (params: MlAnalysisParams) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/ml-predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      })

      if (!response.ok) {
        throw new Error("Analysis failed")
      }

      const data = await response.json()
      setResult(data)
      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Analysis failed"
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const analyzeBatch = useCallback(async (params: BatchMealRequest) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/ml-predict/batch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      })

      if (!response.ok) {
        throw new Error("Batch analysis failed")
      }

      const data = await response.json()
      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Batch analysis failed"
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const analyzeWeekly = useCallback(async (params: WeeklyAnalysisRequest) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/ml-predict/weekly-analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      })

      if (!response.ok) {
        throw new Error("Weekly analysis failed")
      }

      const data = await response.json()
      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Weekly analysis failed"
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const getPersonalizedRecommendations = useCallback(async (params: any) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/ml-predict/personalized-recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      })

      if (!response.ok) {
        throw new Error("Personalized recommendations failed")
      }

      const data = await response.json()
      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Personalized recommendations failed"
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    analyze,
    analyzeBatch,
    analyzeWeekly,
    getPersonalizedRecommendations,
    loading,
    error,
    result,
    clearError: () => setError(null),
    clearResult: () => setResult(null),
  }
}
