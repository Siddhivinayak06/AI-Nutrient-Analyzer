"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight, Leaf, Wind, Flame, Mountain } from "lucide-react"
import { NutrientAnalysisDashboard } from "./nutrient-analysis-dashboard"

interface DoshaQuestion {
  id: string
  category: string
  question: string
  options: {
    text: string
    dosha: "vata" | "pitta" | "kapha"
    points: number
  }[]
}

interface DoshaScores {
  vata: number
  pitta: number
  kapha: number
}

const doshaQuestions: DoshaQuestion[] = [
  {
    id: "body-frame",
    category: "Physical Constitution",
    question: "How would you describe your body frame?",
    options: [
      { text: "Thin, light, small-boned", dosha: "vata", points: 3 },
      { text: "Medium build, moderate weight", dosha: "pitta", points: 3 },
      { text: "Large frame, heavy, well-built", dosha: "kapha", points: 3 },
    ],
  },
  {
    id: "weight",
    category: "Physical Constitution",
    question: "How is your weight typically?",
    options: [
      { text: "Hard to gain weight, lose easily", dosha: "vata", points: 3 },
      { text: "Moderate weight, gain/lose with effort", dosha: "pitta", points: 3 },
      { text: "Gain weight easily, hard to lose", dosha: "kapha", points: 3 },
    ],
  },
  {
    id: "skin",
    category: "Physical Constitution",
    question: "How would you describe your skin?",
    options: [
      { text: "Dry, rough, thin, cool", dosha: "vata", points: 3 },
      { text: "Warm, oily, prone to irritation", dosha: "pitta", points: 3 },
      { text: "Thick, moist, smooth, cool", dosha: "kapha", points: 3 },
    ],
  },
  {
    id: "hair",
    category: "Physical Constitution",
    question: "What is your hair like?",
    options: [
      { text: "Dry, brittle, thin", dosha: "vata", points: 3 },
      { text: "Fine, oily, early graying/balding", dosha: "pitta", points: 3 },
      { text: "Thick, lustrous, strong", dosha: "kapha", points: 3 },
    ],
  },
  {
    id: "appetite",
    category: "Digestion",
    question: "How is your appetite?",
    options: [
      { text: "Variable, sometimes forget to eat", dosha: "vata", points: 3 },
      { text: "Strong, get irritable when hungry", dosha: "pitta", points: 3 },
      { text: "Steady, can skip meals easily", dosha: "kapha", points: 3 },
    ],
  },
  {
    id: "digestion",
    category: "Digestion",
    question: "How is your digestion?",
    options: [
      { text: "Irregular, gas, bloating", dosha: "vata", points: 3 },
      { text: "Strong, quick, sometimes acidic", dosha: "pitta", points: 3 },
      { text: "Slow, heavy feeling after meals", dosha: "kapha", points: 3 },
    ],
  },
  {
    id: "thirst",
    category: "Digestion",
    question: "How much do you typically drink?",
    options: [
      { text: "Variable thirst, prefer warm drinks", dosha: "vata", points: 3 },
      { text: "High thirst, prefer cold drinks", dosha: "pitta", points: 3 },
      { text: "Low thirst, sip throughout day", dosha: "kapha", points: 3 },
    ],
  },
  {
    id: "energy",
    category: "Mental & Emotional",
    question: "How would you describe your energy levels?",
    options: [
      { text: "Comes in bursts, then crashes", dosha: "vata", points: 3 },
      { text: "Intense, focused, driven", dosha: "pitta", points: 3 },
      { text: "Steady, enduring, slow to start", dosha: "kapha", points: 3 },
    ],
  },
  {
    id: "sleep",
    category: "Mental & Emotional",
    question: "How do you sleep?",
    options: [
      { text: "Light sleeper, restless, vivid dreams", dosha: "vata", points: 3 },
      { text: "Moderate sleep, intense dreams", dosha: "pitta", points: 3 },
      { text: "Deep, long sleep, hard to wake up", dosha: "kapha", points: 3 },
    ],
  },
  {
    id: "stress-response",
    category: "Mental & Emotional",
    question: "How do you respond to stress?",
    options: [
      { text: "Worry, anxiety, scattered thoughts", dosha: "vata", points: 3 },
      { text: "Anger, irritation, criticism", dosha: "pitta", points: 3 },
      { text: "Withdrawal, depression, attachment", dosha: "kapha", points: 3 },
    ],
  },
  {
    id: "learning",
    category: "Mental & Emotional",
    question: "How do you learn best?",
    options: [
      { text: "Quick to learn, quick to forget", dosha: "vata", points: 3 },
      { text: "Sharp intellect, good retention", dosha: "pitta", points: 3 },
      { text: "Slow to learn, excellent retention", dosha: "kapha", points: 3 },
    ],
  },
  {
    id: "weather",
    category: "Environmental",
    question: "What weather do you prefer?",
    options: [
      { text: "Warm, humid, dislike cold/wind", dosha: "vata", points: 3 },
      { text: "Cool, well-ventilated, dislike heat", dosha: "pitta", points: 3 },
      { text: "Warm, dry, dislike cold/damp", dosha: "kapha", points: 3 },
    ],
  },
]

export function DoshaAssessment() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [showResults, setShowResults] = useState(false)
  const [scores, setScores] = useState<DoshaScores>({ vata: 0, pitta: 0, kapha: 0 })
  const [showNutrientAnalysis, setShowNutrientAnalysis] = useState(false)

  const handleAnswer = (questionId: string, optionIndex: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }))
  }

  const nextQuestion = () => {
    if (currentQuestion < doshaQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      calculateResults()
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const calculateResults = () => {
    const newScores: DoshaScores = { vata: 0, pitta: 0, kapha: 0 }

    Object.entries(answers).forEach(([questionId, optionIndex]) => {
      const question = doshaQuestions.find((q) => q.id === questionId)
      if (question) {
        const option = question.options[Number.parseInt(optionIndex)]
        if (option) {
          newScores[option.dosha] += option.points
        }
      }
    })

    setScores(newScores)
    setShowResults(true)
  }

  const getDominantDosha = () => {
    const total = scores.vata + scores.pitta + scores.kapha
    const percentages = {
      vata: Math.round((scores.vata / total) * 100),
      pitta: Math.round((scores.pitta / total) * 100),
      kapha: Math.round((scores.kapha / total) * 100),
    }

    const dominant = Object.entries(percentages).reduce((a, b) =>
      percentages[a[0] as keyof DoshaScores] > percentages[b[0] as keyof DoshaScores] ? a : b,
    )

    return { dominant: dominant[0] as keyof DoshaScores, percentages }
  }

  const getDoshaInfo = (dosha: keyof DoshaScores) => {
    const info = {
      vata: {
        name: "Vata",
        element: "Air & Space",
        icon: Wind,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        description: "Creative, energetic, and quick-thinking. Governs movement and communication.",
        characteristics: ["Creative and artistic", "Quick thinking", "Energetic bursts", "Loves variety"],
        balancing: ["Warm, cooked foods", "Regular routine", "Adequate rest", "Calming practices"],
      },
      pitta: {
        name: "Pitta",
        element: "Fire & Water",
        icon: Flame,
        color: "text-red-600",
        bgColor: "bg-red-50",
        description: "Intelligent, focused, and determined. Governs digestion and metabolism.",
        characteristics: ["Strong leadership", "Sharp intellect", "Goal-oriented", "Competitive nature"],
        balancing: ["Cool, fresh foods", "Moderate exercise", "Stress management", "Cooling practices"],
      },
      kapha: {
        name: "Kapha",
        element: "Earth & Water",
        icon: Mountain,
        color: "text-green-600",
        bgColor: "bg-green-50",
        description: "Calm, stable, and nurturing. Governs structure and immunity.",
        characteristics: ["Calm and stable", "Loyal and caring", "Strong endurance", "Good memory"],
        balancing: ["Light, spicy foods", "Regular exercise", "Variety in routine", "Stimulating activities"],
      },
    }
    return info[dosha]
  }

  if (showNutrientAnalysis) {
    return <NutrientAnalysisDashboard />
  }

  if (showResults) {
    const { dominant, percentages } = getDominantDosha()
    const dominantInfo = getDoshaInfo(dominant)
    const Icon = dominantInfo.icon

    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Your Dosha Assessment Results</h1>
            <p className="text-muted-foreground">Understanding your unique Ayurvedic constitution</p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            {/* Dominant Dosha */}
            <Card className={`${dominantInfo.bgColor} border-2`}>
              <CardHeader className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-white p-4 rounded-full">
                    <Icon className={`h-8 w-8 ${dominantInfo.color}`} />
                  </div>
                </div>
                <CardTitle className="text-2xl">
                  Your Primary Dosha: <span className={dominantInfo.color}>{dominantInfo.name}</span>
                </CardTitle>
                <CardDescription className="text-lg">{dominantInfo.element}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-lg mb-6">{dominantInfo.description}</p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Key Characteristics:</h4>
                    <ul className="space-y-2">
                      {dominantInfo.characteristics.map((char, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <Leaf className="h-4 w-4 text-primary" />
                          {char}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Balancing Recommendations:</h4>
                    <ul className="space-y-2">
                      {dominantInfo.balancing.map((rec, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <Leaf className="h-4 w-4 text-primary" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dosha Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Your Complete Dosha Profile</CardTitle>
                <CardDescription>Understanding your unique constitution blend</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {Object.entries(percentages).map(([dosha, percentage]) => {
                    const info = getDoshaInfo(dosha as keyof DoshaScores)
                    const Icon = info.icon
                    return (
                      <div key={dosha} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Icon className={`h-5 w-5 ${info.color}`} />
                            <span className="font-medium">{info.name}</span>
                          </div>
                          <Badge variant="secondary">{percentage}%</Badge>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-4">Ready for Your Personalized Plan?</h3>
                  <p className="text-muted-foreground mb-6">
                    Now that we know your dosha, let's create a customized nutrition and wellness plan just for you.
                  </p>
                  <Button size="lg" onClick={() => setShowNutrientAnalysis(true)}>
                    Continue to Nutrient Analysis
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  const currentQ = doshaQuestions[currentQuestion]
  const progress = ((currentQuestion + 1) / doshaQuestions.length) * 100

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Dosha Assessment</h1>
          <p className="text-muted-foreground">
            Question {currentQuestion + 1} of {doshaQuestions.length}
          </p>
          <Progress value={progress} className="max-w-md mx-auto mt-4" />
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <Badge variant="secondary" className="w-fit">
              {currentQ.category}
            </Badge>
            <CardTitle className="text-xl">{currentQ.question}</CardTitle>
            <CardDescription>Choose the option that best describes you</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <RadioGroup value={answers[currentQ.id] || ""} onValueChange={(value) => handleAnswer(currentQ.id, value)}>
              {currentQ.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2 p-4 rounded-lg border hover:bg-muted/50">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option.text}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            {/* Navigation */}
            <div className="flex justify-between pt-6">
              <Button variant="outline" onClick={prevQuestion} disabled={currentQuestion === 0}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>

              <Button onClick={nextQuestion} disabled={!answers[currentQ.id]}>
                {currentQuestion === doshaQuestions.length - 1 ? "Get Results" : "Next"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
