"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import {
  TrendingUp,
  TrendingDown,
  Plus,
  Target,
  Activity,
  Heart,
  Brain,
  Zap,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  LineChart,
  Scale,
  Utensils,
  Moon,
  Clock,
} from "lucide-react"
import { format } from "date-fns"

interface ProgressEntry {
  date: string
  type: "meal" | "symptom" | "measurement" | "mood" | "energy"
  title: string
  value?: number
  unit?: string
  notes?: string
  rating?: number
  tags?: string[]
}

interface HealthMetric {
  name: string
  current: number
  previous: number
  target: number
  unit: string
  trend: "up" | "down" | "stable"
  icon: any
  color: string
}

// Mock data - in a real app, this would come from user's actual tracking
const mockProgressData: ProgressEntry[] = [
  {
    date: "2024-01-15",
    type: "energy",
    title: "Morning Energy Level",
    rating: 8,
    notes: "Felt great after following the diet plan for a week",
  },
  {
    date: "2024-01-14",
    type: "meal",
    title: "Spinach Dal with Brown Rice",
    notes: "Followed the lunch recommendation, felt satisfied and energized",
    tags: ["iron-rich", "vata-balancing"],
  },
  {
    date: "2024-01-14",
    type: "symptom",
    title: "Digestive Health",
    rating: 7,
    notes: "Less bloating since starting warm foods",
  },
  {
    date: "2024-01-13",
    type: "measurement",
    title: "Weight",
    value: 68.5,
    unit: "kg",
    notes: "Stable weight, feeling more energetic",
  },
  {
    date: "2024-01-12",
    type: "mood",
    title: "Overall Mood",
    rating: 9,
    notes: "Feeling calm and centered with regular meal times",
  },
]

const mockHealthMetrics: HealthMetric[] = [
  {
    name: "Energy Level",
    current: 78,
    previous: 65,
    target: 85,
    unit: "%",
    trend: "up",
    icon: Zap,
    color: "text-yellow-600",
  },
  {
    name: "Sleep Quality",
    current: 82,
    previous: 70,
    target: 90,
    unit: "%",
    trend: "up",
    icon: Moon,
    color: "text-purple-600",
  },
  {
    name: "Digestive Health",
    current: 75,
    previous: 60,
    target: 85,
    unit: "%",
    trend: "up",
    icon: Heart,
    color: "text-green-600",
  },
  {
    name: "Stress Level",
    current: 35,
    previous: 55,
    target: 25,
    unit: "%",
    trend: "down",
    icon: Brain,
    color: "text-blue-600",
  },
]

const weeklyGoals = [
  { goal: "Follow meal plan 6/7 days", progress: 85, completed: true },
  { goal: "Drink 8 glasses of water daily", progress: 70, completed: false },
  { goal: "Practice mindful eating", progress: 90, completed: true },
  { goal: "Take morning sunlight for Vitamin D", progress: 60, completed: false },
  { goal: "Sleep by 10 PM", progress: 75, completed: false },
]

export function ProgressTrackingSystem() {
  const [selectedTab, setSelectedTab] = useState("overview")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [showAddEntry, setShowAddEntry] = useState(false)
  const [newEntry, setNewEntry] = useState({
    type: "meal",
    title: "",
    value: "",
    unit: "",
    rating: 5,
    notes: "",
    tags: "",
  })

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  const getEntryIcon = (type: string) => {
    switch (type) {
      case "meal":
        return <Utensils className="h-4 w-4" />
      case "symptom":
        return <AlertTriangle className="h-4 w-4" />
      case "measurement":
        return <Scale className="h-4 w-4" />
      case "mood":
        return <Heart className="h-4 w-4" />
      case "energy":
        return <Zap className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const getEntryColor = (type: string) => {
    switch (type) {
      case "meal":
        return "bg-green-50 text-green-700"
      case "symptom":
        return "bg-red-50 text-red-700"
      case "measurement":
        return "bg-blue-50 text-blue-700"
      case "mood":
        return "bg-purple-50 text-purple-700"
      case "energy":
        return "bg-yellow-50 text-yellow-700"
      default:
        return "bg-gray-50 text-gray-700"
    }
  }

  const handleAddEntry = () => {
    // In a real app, this would save to database
    console.log("Adding entry:", newEntry)
    setShowAddEntry(false)
    setNewEntry({
      type: "meal",
      title: "",
      value: "",
      unit: "",
      rating: 5,
      notes: "",
      tags: "",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Progress Tracking</h1>
          <p className="text-muted-foreground">
            Monitor your wellness journey and see how your health improves over time
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">12</div>
                <p className="text-sm text-muted-foreground">Days Tracked</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">85%</div>
                <p className="text-sm text-muted-foreground">Plan Adherence</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">+13%</div>
                <p className="text-sm text-muted-foreground">Energy Increase</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">4/5</div>
                <p className="text-sm text-muted-foreground">Goals Met</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="metrics">Health Metrics</TabsTrigger>
            <TabsTrigger value="journal">Daily Journal</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Health Metrics Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Health Metrics Trends
                </CardTitle>
                <CardDescription>Your progress over the last 2 weeks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {mockHealthMetrics.map((metric, index) => {
                    const Icon = metric.icon
                    const improvement = metric.current - metric.previous
                    const improvementPercent = Math.round((improvement / metric.previous) * 100)

                    return (
                      <div key={index} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Icon className={`h-5 w-5 ${metric.color}`} />
                            <span className="font-medium">{metric.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold">
                              {metric.current}
                              {metric.unit}
                            </span>
                            {getTrendIcon(metric.trend)}
                          </div>
                        </div>
                        <Progress value={metric.current} className="h-2" />
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>
                            Previous: {metric.previous}
                            {metric.unit}
                          </span>
                          <span className={improvement > 0 ? "text-green-600" : "text-red-600"}>
                            {improvement > 0 ? "+" : ""}
                            {improvementPercent}%
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest tracking entries</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockProgressData.slice(0, 5).map((entry, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                      <div className={`p-2 rounded-full ${getEntryColor(entry.type)}`}>{getEntryIcon(entry.type)}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium">{entry.title}</h4>
                          <span className="text-sm text-muted-foreground">{entry.date}</span>
                        </div>
                        {entry.rating && (
                          <div className="flex items-center gap-1 mb-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <div
                                key={i}
                                className={`w-3 h-3 rounded-full ${
                                  i < entry.rating! ? "bg-yellow-400" : "bg-gray-200"
                                }`}
                              />
                            ))}
                            <span className="text-sm text-muted-foreground ml-2">{entry.rating}/5</span>
                          </div>
                        )}
                        {entry.value && (
                          <p className="text-sm text-muted-foreground mb-2">
                            {entry.value} {entry.unit}
                          </p>
                        )}
                        {entry.notes && <p className="text-sm text-muted-foreground">{entry.notes}</p>}
                        {entry.tags && (
                          <div className="flex gap-1 mt-2">
                            {entry.tags.map((tag, tagIndex) => (
                              <Badge key={tagIndex} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Health Metrics Tab */}
          <TabsContent value="metrics" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {mockHealthMetrics.map((metric, index) => {
                const Icon = metric.icon
                const progressToTarget = (metric.current / metric.target) * 100

                return (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <Icon className={`h-5 w-5 ${metric.color}`} />
                          {metric.name}
                        </CardTitle>
                        {getTrendIcon(metric.trend)}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold mb-2">
                          {metric.current}
                          {metric.unit}
                        </div>
                        <Progress value={progressToTarget} className="h-3" />
                        <div className="flex justify-between text-sm text-muted-foreground mt-2">
                          <span>Current</span>
                          <span>
                            Target: {metric.target}
                            {metric.unit}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <div className="text-lg font-semibold">
                            {metric.previous}
                            {metric.unit}
                          </div>
                          <div className="text-xs text-muted-foreground">Previous</div>
                        </div>
                        <div>
                          <div
                            className={`text-lg font-semibold ${
                              metric.current > metric.previous ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {metric.current > metric.previous ? "+" : ""}
                            {metric.current - metric.previous}
                            {metric.unit}
                          </div>
                          <div className="text-xs text-muted-foreground">Change</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Chart Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5" />
                  Trends Over Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center border-2 border-dashed border-muted rounded-lg">
                  <div className="text-center text-muted-foreground">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Interactive charts showing your progress over time</p>
                    <p className="text-sm">Data visualization coming soon</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Daily Journal Tab */}
          <TabsContent value="journal" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">Daily Entries</h3>
                <p className="text-sm text-muted-foreground">Track meals, symptoms, and measurements</p>
              </div>
              <Button onClick={() => setShowAddEntry(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Entry
              </Button>
            </div>

            {/* Add Entry Form */}
            {showAddEntry && (
              <Card>
                <CardHeader>
                  <CardTitle>Add New Entry</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="entry-type">Type</Label>
                      <Select
                        value={newEntry.type}
                        onValueChange={(value) => setNewEntry({ ...newEntry, type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="meal">Meal</SelectItem>
                          <SelectItem value="symptom">Symptom</SelectItem>
                          <SelectItem value="measurement">Measurement</SelectItem>
                          <SelectItem value="mood">Mood</SelectItem>
                          <SelectItem value="energy">Energy</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="entry-title">Title</Label>
                      <Input
                        id="entry-title"
                        value={newEntry.title}
                        onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                        placeholder="e.g., Morning breakfast"
                      />
                    </div>
                  </div>

                  {newEntry.type === "measurement" && (
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="entry-value">Value</Label>
                        <Input
                          id="entry-value"
                          type="number"
                          value={newEntry.value}
                          onChange={(e) => setNewEntry({ ...newEntry, value: e.target.value })}
                          placeholder="e.g., 68.5"
                        />
                      </div>
                      <div>
                        <Label htmlFor="entry-unit">Unit</Label>
                        <Input
                          id="entry-unit"
                          value={newEntry.unit}
                          onChange={(e) => setNewEntry({ ...newEntry, unit: e.target.value })}
                          placeholder="e.g., kg"
                        />
                      </div>
                    </div>
                  )}

                  {(newEntry.type === "symptom" || newEntry.type === "mood" || newEntry.type === "energy") && (
                    <div>
                      <Label>Rating (1-5)</Label>
                      <div className="flex gap-2 mt-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Button
                            key={i}
                            variant={i < newEntry.rating ? "default" : "outline"}
                            size="sm"
                            onClick={() => setNewEntry({ ...newEntry, rating: i + 1 })}
                          >
                            {i + 1}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="entry-notes">Notes</Label>
                    <Textarea
                      id="entry-notes"
                      value={newEntry.notes}
                      onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
                      placeholder="Additional details..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="entry-tags">Tags (comma-separated)</Label>
                    <Input
                      id="entry-tags"
                      value={newEntry.tags}
                      onChange={(e) => setNewEntry({ ...newEntry, tags: e.target.value })}
                      placeholder="e.g., iron-rich, vata-balancing"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleAddEntry}>Save Entry</Button>
                    <Button variant="outline" onClick={() => setShowAddEntry(false)}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Calendar View */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Calendar</CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                  />
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Entries for {selectedDate ? format(selectedDate, "PPP") : "Select a date"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockProgressData
                      .filter((entry) => selectedDate && entry.date === format(selectedDate, "yyyy-MM-dd"))
                      .map((entry, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                          <div className={`p-2 rounded-full ${getEntryColor(entry.type)}`}>
                            {getEntryIcon(entry.type)}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{entry.title}</h4>
                            {entry.rating && (
                              <div className="flex items-center gap-1 my-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <div
                                    key={i}
                                    className={`w-2 h-2 rounded-full ${
                                      i < entry.rating! ? "bg-yellow-400" : "bg-gray-200"
                                    }`}
                                  />
                                ))}
                              </div>
                            )}
                            {entry.notes && <p className="text-sm text-muted-foreground">{entry.notes}</p>}
                          </div>
                        </div>
                      ))}
                    {(!selectedDate ||
                      mockProgressData.filter((entry) => entry.date === format(selectedDate, "yyyy-MM-dd")).length ===
                        0) && <p className="text-center text-muted-foreground py-8">No entries for this date</p>}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Goals Tab */}
          <TabsContent value="goals" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Weekly Goals
                </CardTitle>
                <CardDescription>Track your progress towards weekly wellness goals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {weeklyGoals.map((goal, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{goal.goal}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">{goal.progress}%</span>
                          {goal.completed ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <Clock className="h-4 w-4 text-yellow-600" />
                          )}
                        </div>
                      </div>
                      <Progress value={goal.progress} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Goal Achievement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-4">
                    <div className="text-4xl font-bold text-green-600">4/5</div>
                    <p className="text-muted-foreground">Goals completed this week</p>
                    <Progress value={80} className="h-3" />
                    <p className="text-sm text-muted-foreground">80% completion rate</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Streak Counter</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-4">
                    <div className="text-4xl font-bold text-blue-600">12</div>
                    <p className="text-muted-foreground">Days of consistent tracking</p>
                    <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                      🔥 On Fire!
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI-Powered Insights
                </CardTitle>
                <CardDescription>Personalized observations based on your tracking data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <TrendingUp className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Energy Improvement:</strong> Your energy levels have increased by 20% since starting the
                    Vata-balancing diet plan. The consistent warm meals and regular eating schedule appear to be working
                    well for your constitution.
                  </AlertDescription>
                </Alert>

                <Alert>
                  <Heart className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Digestive Health:</strong> You've reported 25% fewer digestive issues since incorporating
                    warming spices and avoiding cold foods. Consider continuing this approach.
                  </AlertDescription>
                </Alert>

                <Alert>
                  <Moon className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Sleep Pattern:</strong> Your sleep quality scores are highest on days when you finish dinner
                    by 7 PM. Try to maintain this timing for optimal rest.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Correlation Insights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-sm">Warm breakfast → Higher energy</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      Strong
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm">Regular meal times → Better mood</span>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                      Moderate
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <span className="text-sm">Mindful eating → Less bloating</span>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                      Strong
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recommendations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium text-sm mb-1">Continue Current Approach</h4>
                    <p className="text-xs text-muted-foreground">
                      Your Vata-balancing diet is showing excellent results
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium text-sm mb-1">Focus on Hydration</h4>
                    <p className="text-xs text-muted-foreground">Increase warm water intake to support digestion</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-medium text-sm mb-1">Optimize Sleep Timing</h4>
                    <p className="text-xs text-muted-foreground">Maintain early dinner schedule for better sleep</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
