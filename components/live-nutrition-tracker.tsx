"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Activity,
  TrendingUp,
  TrendingDown,
  Brain,
  Zap,
  Heart,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  BarChart3,
} from "lucide-react"
import { useMlAnalysis } from "@/hooks/use-ml-analysis"

interface NutritionGoal {
  nutrient: string
  current: number
  target: number
  unit: string
  status: "on-track" | "behind" | "exceeded"
  trend: "up" | "down" | "stable"
}

interface RealTimeMetric {
  name: string
  value: number
  change: number
  unit: string
  icon: any
  color: string
  description: string
}

export function LiveNutritionTracker() {
  const [currentGoals, setCurrentGoals] = useState<NutritionGoal[]>([
    {
      nutrient: "Protein",
      current: 45,
      target: 65,
      unit: "g",
      status: "behind",
      trend: "up",
    },
    {
      nutrient: "Iron",
      current: 8,
      target: 15,
      unit: "mg",
      status: "behind",
      trend: "stable",
    },
    {
      nutrient: "Vitamin C",
      current: 65,
      target: 75,
      unit: "mg",
      status: "on-track",
      trend: "up",
    },
    {
      nutrient: "Calories",
      current: 1200,
      target: 1800,
      unit: "kcal",
      status: "behind",
      trend: "up",
    },
  ])

  const [realTimeMetrics, setRealTimeMetrics] = useState<RealTimeMetric[]>([
    {
      name: "Deficiency Risk",
      value: 35,
      change: -5,
      unit: "%",
      icon: AlertTriangle,
      color: "text-yellow-600",
      description: "Overall nutrient deficiency probability",
    },
    {
      name: "Energy Score",
      value: 72,
      change: +8,
      unit: "%",
      icon: Zap,
      color: "text-green-600",
      description: "Predicted energy levels based on nutrition",
    },
    {
      name: "Immune Health",
      value: 68,
      change: +3,
      unit: "%",
      icon: Shield,
      color: "text-blue-600",
      description: "Immune system support score",
    },
    {
      name: "Heart Health",
      value: 78,
      change: +2,
      unit: "%",
      icon: Heart,
      color: "text-red-600",
      description: "Cardiovascular health indicator",
    },
  ])

  const [isTracking, setIsTracking] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const { analyze, loading } = useMlAnalysis()

  useEffect(() => {
    if (isTracking) {
      intervalRef.current = setInterval(() => {
        updateRealTimeMetrics()
        setLastUpdate(new Date())
      }, 30000) // Update every 30 seconds
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isTracking])

  const updateRealTimeMetrics = async () => {
    try {
      // Simulate real-time data updates
      const analysisParams = {
        calories: currentGoals.find((g) => g.nutrient === "Calories")?.current || 1200,
        protein: currentGoals.find((g) => g.nutrient === "Protein")?.current || 45,
        carbs: 150,
        fat: 40,
        iron: currentGoals.find((g) => g.nutrient === "Iron")?.current || 8,
        vitaminC: currentGoals.find((g) => g.nutrient === "Vitamin C")?.current || 65,
        age: 32,
        gender: 0,
        dosha: "VATA",
      }

      const result = await analyze(analysisParams)

      if (result) {
        // Update metrics based on ML predictions
        setRealTimeMetrics((prev) =>
          prev.map((metric) => {
            if (metric.name === "Deficiency Risk") {
              const avgDeficiency =
                (result.probabilities.iron_def + result.probabilities.vitc_def + result.probabilities.protein_def) / 3
              return {
                ...metric,
                value: Math.round(avgDeficiency * 100),
                change: Math.round((avgDeficiency * 100 - metric.value) * 0.3),
              }
            }
            return {
              ...metric,
              change: Math.round((Math.random() - 0.5) * 10),
            }
          }),
        )
      }
    } catch (error) {
      console.error("Failed to update real-time metrics:", error)
    }
  }

  const getGoalStatus = (goal: NutritionGoal) => {
    const percentage = (goal.current / goal.target) * 100
    if (percentage >= 90) return { color: "text-green-600 bg-green-50", text: "Excellent" }
    if (percentage >= 70) return { color: "text-blue-600 bg-blue-50", text: "On Track" }
    if (percentage >= 50) return { color: "text-yellow-600 bg-yellow-50", text: "Behind" }
    return { color: "text-red-600 bg-red-50", text: "Critical" }
  }

  const getTrendIcon = (trend: string, change?: number) => {
    if (change !== undefined) {
      if (change > 0) return <TrendingUp className="h-4 w-4 text-green-600" />
      if (change < 0) return <TrendingDown className="h-4 w-4 text-red-600" />
    }

    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with Live Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Live Nutrition Tracker
                {isTracking && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />}
              </CardTitle>
              <CardDescription>
                Real-time AI analysis of your nutritional status and progress toward daily goals
              </CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Last Update</div>
                <div className="text-sm font-medium">{lastUpdate.toLocaleTimeString()}</div>
              </div>
              <Button
                variant={isTracking ? "destructive" : "default"}
                onClick={() => setIsTracking(!isTracking)}
                disabled={loading}
              >
                {isTracking ? "Stop Tracking" : "Start Live Tracking"}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="goals" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="goals">Daily Goals</TabsTrigger>
          <TabsTrigger value="metrics">Live Metrics</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        {/* Daily Goals Tab */}
        <TabsContent value="goals" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {currentGoals.map((goal, index) => {
              const percentage = (goal.current / goal.target) * 100
              const status = getGoalStatus(goal)

              return (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold">{goal.nutrient}</h3>
                        <p className="text-sm text-muted-foreground">
                          {goal.current} / {goal.target} {goal.unit}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={status.color}>{status.text}</Badge>
                        {getTrendIcon(goal.trend)}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{Math.round(percentage)}%</span>
                      </div>
                      <Progress value={Math.min(percentage, 100)} className="h-3" />
                    </div>

                    <div className="mt-4 text-sm text-muted-foreground">
                      {percentage >= 100
                        ? "Goal achieved! Great work!"
                        : `${Math.round(goal.target - goal.current)} ${goal.unit} remaining`}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* Live Metrics Tab */}
        <TabsContent value="metrics" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {realTimeMetrics.map((metric, index) => {
              const Icon = metric.icon

              return (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full bg-muted ${metric.color}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{metric.name}</h3>
                          <p className="text-sm text-muted-foreground">{metric.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold">
                            {metric.value}
                            {metric.unit}
                          </span>
                          {getTrendIcon("", metric.change)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {metric.change > 0 ? "+" : ""}
                          {metric.change} from last update
                        </div>
                      </div>
                    </div>

                    <Progress value={metric.value} className="h-2" />
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Real-time Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                Live Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {realTimeMetrics
                .filter((metric) => metric.change < -3)
                .map((metric, index) => (
                  <Alert key={index}>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>{metric.name}</strong> has decreased by {Math.abs(metric.change)}
                      {metric.unit}. Consider adjusting your nutrition intake.
                    </AlertDescription>
                  </Alert>
                ))}

              {realTimeMetrics.filter((metric) => metric.change < -3).length === 0 && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>All metrics are stable or improving. Keep up the great work!</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Insights Tab */}
        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                AI-Powered Insights
              </CardTitle>
              <CardDescription>Machine learning analysis of your nutrition patterns and trends</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Pattern Recognition</h4>
                  <div className="space-y-3">
                    <Alert>
                      <BarChart3 className="h-4 w-4" />
                      <AlertDescription>
                        Your protein intake typically drops 20% on weekends. Consider meal prep strategies.
                      </AlertDescription>
                    </Alert>
                    <Alert>
                      <Clock className="h-4 w-4" />
                      <AlertDescription>
                        Iron absorption improves when you eat vitamin C-rich foods. Current pairing rate: 65%.
                      </AlertDescription>
                    </Alert>
                    <Alert>
                      <Target className="h-4 w-4" />
                      <AlertDescription>
                        You're most consistent with nutrition goals between 12-2 PM. Optimize this window.
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Predictive Recommendations</h4>
                  <div className="space-y-3">
                    <Alert>
                      <Brain className="h-4 w-4" />
                      <AlertDescription>
                        Based on current trends, you'll reach your iron goal in 4-5 days with consistent intake.
                      </AlertDescription>
                    </Alert>
                    <Alert>
                      <TrendingUp className="h-4 w-4" />
                      <AlertDescription>
                        Your energy levels are predicted to increase by 15% if you maintain current protein intake.
                      </AlertDescription>
                    </Alert>
                    <Alert>
                      <Shield className="h-4 w-4" />
                      <AlertDescription>
                        Immune health score will likely improve with 25mg more vitamin C daily.
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>
              </div>

              {/* Ayurvedic Integration */}
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Dosha-Specific Insights
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  AI analysis combined with Ayurvedic principles for your Vata constitution:
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Your warm food preference aligns well with Vata balancing needs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <span>Consider increasing healthy fats to support Vata stability</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-blue-600" />
                    <span>Regular meal timing will optimize your digestive fire (Agni)</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
