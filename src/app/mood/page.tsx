"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Compass,
  Sparkles,
  Heart,
  Coffee,
  Mountain,
  Utensils,
  Camera,
  Trees,
  Dumbbell,
  Calendar,
  Car,
  Bike,
  Footprints,
  Users,
  User,
} from "lucide-react"

const moods = [
  { emoji: "😊", label: "Happy", value: "happy" },
  { emoji: "😴", label: "Tired", value: "tired" },
  { emoji: "🌸", label: "Calm", value: "calm" },
  { emoji: "😍", label: "Romantic", value: "romantic" },
  { emoji: "😔", label: "Sad", value: "sad" },
  { emoji: "🤩", label: "Excited", value: "excited" },
]

const interests = [
  { icon: Coffee, label: "Relax", value: "relax", color: "bg-accent/10 hover:bg-accent/20 text-accent" },
  { icon: Sparkles, label: "Play", value: "play", color: "bg-primary/10 hover:bg-primary/20 text-primary" },
  { icon: Utensils, label: "Eat", value: "eat", color: "bg-secondary/10 hover:bg-secondary/20 text-secondary" },
  { icon: Camera, label: "Sightseeing", value: "sightseeing", color: "bg-chart-4/10 hover:bg-chart-4/20 text-chart-4" },
  { icon: Trees, label: "Nature", value: "nature", color: "bg-chart-5/10 hover:bg-chart-5/20 text-chart-5" },
  { icon: Dumbbell, label: "Sports", value: "sports", color: "bg-chart-1/10 hover:bg-chart-1/20 text-chart-1" },
  { icon: Calendar, label: "Events", value: "events", color: "bg-chart-2/10 hover:bg-chart-2/20 text-chart-2" },
]

const foodTypes = [
  { emoji: "🍔", label: "Junk Food", value: "junk" },
  { emoji: "🍲", label: "Home Food", value: "home" },
  { emoji: "🍩", label: "Desserts", value: "desserts" },
]

const transportOptions = [
  { icon: Car, label: "Uber", value: "uber" },
  { icon: Footprints, label: "Walk", value: "walk" },
  { icon: Bike, label: "Bike", value: "bike" },
  { icon: Car, label: "Car", value: "car" },
]

const accessibilityOptions = [
  { emoji: "🐶", label: "Pet-friendly", value: "pet" },
  { emoji: "👶", label: "Kid-friendly", value: "kid" },
  { emoji: "♿", label: "Wheelchair accessible", value: "wheelchair" },
  { emoji: "🚶‍♀️", label: "Safe-walk", value: "safe" },
]

export default function MoodPage() {
  const router = useRouter()
  const [selectedMood, setSelectedMood] = useState<string>("")
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [selectedFoodTypes, setSelectedFoodTypes] = useState<string[]>([])
  const [energyLevel, setEnergyLevel] = useState([50])
  const [budget, setBudget] = useState("")
  const [transport, setTransport] = useState<string>("")
  const [socialMode, setSocialMode] = useState<"solo" | "friends">("solo")
  const [accessibility, setAccessibility] = useState<string[]>([])

  const toggleInterest = (value: string) => {
    setSelectedInterests((prev) => (prev.includes(value) ? prev.filter((i) => i !== value) : [...prev, value]))
  }

  const toggleFoodType = (value: string) => {
    setSelectedFoodTypes((prev) => (prev.includes(value) ? prev.filter((i) => i !== value) : [...prev, value]))
  }

  const toggleAccessibility = (value: string) => {
    setAccessibility((prev) => (prev.includes(value) ? prev.filter((i) => i !== value) : [...prev, value]))
  }

  const getEnergyLabel = () => {
    if (energyLevel[0] < 33) return "🛋 Lazy - Short walks nearby"
    if (energyLevel[0] < 66) return "🚶 Moderate - Up to 5km radius"
    return "🧗 Adventurous - Explore far & wide"
  }

  const getBudgetSuggestion = () => {
    const amount = Number.parseInt(budget)
    if (!amount) return ""
    if (amount < 20) return "💸 Broke mode: street food walks & free spots"
    if (amount < 50) return "💵 Budget-friendly: casual dining & local gems"
    return "💰 Loaded: fine dining, events & premium experiences"
  }

  const handleSubmit = () => {
    // Store preferences and navigate to recommendations
    router.push("/recommendations")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20 py-8 px-4">
      <div className="container mx-auto max-w-3xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Compass className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">Let's find your vibe</h1>
          </div>
          <p className="text-muted-foreground">Tell us how you're feeling and what you're craving</p>
        </div>

        {/* Mood Selection */}
        <Card className="p-6 rounded-3xl border-2 bg-card/95 backdrop-blur">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary" />
            How are you feeling today?
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {moods.map((mood) => (
              <button
                key={mood.value}
                onClick={() => setSelectedMood(mood.value)}
                className={`p-4 rounded-2xl border-2 transition-all hover:scale-105 ${
                  selectedMood === mood.value
                    ? "border-primary bg-primary/10 shadow-lg"
                    : "border-border bg-background hover:border-primary/50"
                }`}
              >
                <div className="text-4xl mb-2">{mood.emoji}</div>
                <div className="text-sm font-medium">{mood.label}</div>
              </button>
            ))}
          </div>
        </Card>

        {/* Interest Selection */}
        <Card className="p-6 rounded-3xl border-2 bg-card/95 backdrop-blur">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent" />
            What interests you?
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {interests.map((interest) => {
              const Icon = interest.icon
              return (
                <button
                  key={interest.value}
                  onClick={() => toggleInterest(interest.value)}
                  className={`p-4 rounded-2xl border-2 transition-all hover:scale-105 ${interest.color} ${
                    selectedInterests.includes(interest.value) ? "border-current shadow-lg scale-105" : "border-border"
                  }`}
                >
                  <Icon className="w-8 h-8 mx-auto mb-2" />
                  <div className="text-sm font-medium">{interest.label}</div>
                </button>
              )
            })}
          </div>

          {/* Food Types (shown when Eat is selected) */}
          {selectedInterests.includes("eat") && (
            <div className="mt-4 pt-4 border-t border-border">
              <h3 className="text-sm font-semibold mb-3 text-muted-foreground">What kind of food?</h3>
              <div className="flex flex-wrap gap-2">
                {foodTypes.map((food) => (
                  <button
                    key={food.value}
                    onClick={() => toggleFoodType(food.value)}
                    className={`px-4 py-2 rounded-xl border-2 transition-all hover:scale-105 ${
                      selectedFoodTypes.includes(food.value)
                        ? "border-secondary bg-secondary/20 shadow-md"
                        : "border-border bg-background hover:border-secondary/50"
                    }`}
                  >
                    <span className="mr-2">{food.emoji}</span>
                    <span className="text-sm font-medium">{food.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Energy Level */}
        <Card className="p-6 rounded-3xl border-2 bg-card/95 backdrop-blur">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Mountain className="w-5 h-5 text-chart-5" />
            What's your energy level?
          </h2>
          <div className="space-y-4">
            <Slider value={energyLevel} onValueChange={setEnergyLevel} max={100} step={1} className="w-full" />
            <div className="text-center p-3 rounded-xl bg-muted/50">
              <p className="text-lg font-medium">{getEnergyLabel()}</p>
            </div>
          </div>
        </Card>

        {/* Budget */}
        <Card className="p-6 rounded-3xl border-2 bg-card/95 backdrop-blur">
          <h2 className="text-xl font-bold mb-4">What's your budget?</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">💵</span>
              <Input
                type="number"
                placeholder="Enter amount"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="rounded-2xl py-6 border-2 text-lg"
              />
            </div>
            {budget && (
              <div className="p-3 rounded-xl bg-secondary/10 border border-secondary/20">
                <p className="text-sm font-medium text-secondary-foreground">{getBudgetSuggestion()}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Transport */}
        <Card className="p-6 rounded-3xl border-2 bg-card/95 backdrop-blur">
          <h2 className="text-xl font-bold mb-4">How will you get there?</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {transportOptions.map((option) => {
              const Icon = option.icon
              return (
                <button
                  key={option.value}
                  onClick={() => setTransport(option.value)}
                  className={`p-4 rounded-2xl border-2 transition-all hover:scale-105 ${
                    transport === option.value
                      ? "border-accent bg-accent/10 shadow-lg"
                      : "border-border bg-background hover:border-accent/50"
                  }`}
                >
                  <Icon className="w-8 h-8 mx-auto mb-2 text-accent" />
                  <div className="text-sm font-medium">{option.label}</div>
                </button>
              )
            })}
          </div>
        </Card>

        {/* Social Mode */}
        <Card className="p-6 rounded-3xl border-2 bg-card/95 backdrop-blur">
          <h2 className="text-xl font-bold mb-4">Who's joining?</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setSocialMode("solo")}
              className={`p-6 rounded-2xl border-2 transition-all hover:scale-105 ${
                socialMode === "solo"
                  ? "border-primary bg-primary/10 shadow-lg"
                  : "border-border bg-background hover:border-primary/50"
              }`}
            >
              <User className="w-8 h-8 mx-auto mb-2 text-primary" />
              <div className="font-medium">Solo</div>
            </button>
            <button
              onClick={() => setSocialMode("friends")}
              className={`p-6 rounded-2xl border-2 transition-all hover:scale-105 ${
                socialMode === "friends"
                  ? "border-primary bg-primary/10 shadow-lg"
                  : "border-border bg-background hover:border-primary/50"
              }`}
            >
              <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
              <div className="font-medium">Friends</div>
            </button>
          </div>
        </Card>

        {/* Accessibility */}
        <Card className="p-6 rounded-3xl border-2 bg-card/95 backdrop-blur">
          <h2 className="text-xl font-bold mb-4">Accessibility needs</h2>
          <div className="flex flex-wrap gap-2">
            {accessibilityOptions.map((option) => (
              <Badge
                key={option.value}
                variant={accessibility.includes(option.value) ? "default" : "outline"}
                className={`px-4 py-2 rounded-xl text-sm cursor-pointer transition-all hover:scale-105 ${
                  accessibility.includes(option.value) ? "shadow-md" : ""
                }`}
                onClick={() => toggleAccessibility(option.value)}
              >
                <span className="mr-2">{option.emoji}</span>
                {option.label}
              </Badge>
            ))}
          </div>
        </Card>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          size="lg"
          className="w-full rounded-2xl py-8 text-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
        >
          Find My Perfect Spots
          <Sparkles className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  )
}
