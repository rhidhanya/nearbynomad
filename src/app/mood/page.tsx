"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Compass,
  Heart,
  Coffee,
  Sparkles,
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
  Mountain, // Added Mountain import
  Smile,
  Bed,
  Flower2,
  Heart as HeartIcon,
  Frown,
  PartyPopper,
  Sandwich,
  Soup,
  Donut,
  Dog,
  Baby,
  Accessibility,
  ShieldCheck,
  DollarSign
} from "lucide-react";

const moods = [
  { Icon: Smile, label: "Happy", value: "happy" },
  { Icon: Bed, label: "Tired", value: "tired" },
  { Icon: Flower2, label: "Calm", value: "calm" },
  { Icon: HeartIcon, label: "Romantic", value: "romantic" },
  { Icon: Frown, label: "Sad", value: "sad" },
  { Icon: PartyPopper, label: "Excited", value: "excited" },
];

const interests = [
  { icon: Coffee, label: "Relax", value: "relax" },
  { icon: Sparkles, label: "Play", value: "play" },
  { icon: Utensils, label: "Eat", value: "eat" },
  { icon: Camera, label: "Sightseeing", value: "sightseeing" },
  { icon: Trees, label: "Nature", value: "nature" },
  { icon: Dumbbell, label: "Sports", value: "sports" },
  { icon: Calendar, label: "Events", value: "events" },
];

const foodTypes = [
  { Icon: Sandwich, label: "Junk Food", value: "junk" },
  { Icon: Soup, label: "Home Food", value: "home" },
  { Icon: Donut, label: "Desserts", value: "desserts" },
];

const transportOptions = [
  { icon: Car, label: "Uber", value: "uber" },
  { icon: Footprints, label: "Walk", value: "walk" },
  { icon: Bike, label: "Bike", value: "bike" },
  { icon: Car, label: "Car", value: "car" },
];

const accessibilityOptions = [
  { Icon: Dog, label: "Pet-friendly", value: "pet" },
  { Icon: Baby, label: "Kid-friendly", value: "kid" },
  { Icon: Accessibility, label: "Wheelchair accessible", value: "wheelchair" },
  { Icon: ShieldCheck, label: "Safe-walk", value: "safe" },
];

export default function MoodPage() {
  const router = useRouter();
  const [selectedMood, setSelectedMood] = useState<string>("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedFoodTypes, setSelectedFoodTypes] = useState<string[]>([]);
  const [energyLevel, setEnergyLevel] = useState([50]);
  const [budget, setBudget] = useState("");
  const [transport, setTransport] = useState<string>("");
  const [socialMode, setSocialMode] = useState<"solo" | "friends">("solo");
  const [accessibility, setAccessibility] = useState<string[]>([]);

  const toggleInterest = (value: string) => {
    setSelectedInterests((prev) => (prev.includes(value) ? prev.filter((i) => i !== value) : [...prev, value]));
  };

  const toggleFoodType = (value: string) => {
    setSelectedFoodTypes((prev) => (prev.includes(value) ? prev.filter((i) => i !== value) : [...prev, value]));
  };

  const toggleAccessibility = (value: string) => {
    setAccessibility((prev) => (prev.includes(value) ? prev.filter((i) => i !== value) : [...prev, value]));
  };

  const getEnergyLabel = () => {
    if (energyLevel[0] < 20) return "Very Low - Just around the corner";
    if (energyLevel[0] < 40) return "Low - Short walks nearby";
    if (energyLevel[0] < 60) return "Medium - Up to 5km radius";
    if (energyLevel[0] < 80) return "High - Explore the city";
    return "Very High - Adventure far & wide";
  };

  const getBudgetSuggestion = () => {
    const amount = Number.parseInt(budget);
    if (!amount) return "";
    if (amount < 20) return "Budget-saving: street food walks & free spots";
    if (amount < 50) return "Budget-friendly: casual dining & local gems";
    return "Premium: fine dining, events & premium experiences";
  };

  const handleSubmit = async () => {
    try {
      // Enhanced energy level mapping
      let energyLevelStr = 'medium';
      if (energyLevel[0] < 20) energyLevelStr = 'very_low';
      else if (energyLevel[0] < 40) energyLevelStr = 'low';
      else if (energyLevel[0] < 60) energyLevelStr = 'medium';
      else if (energyLevel[0] < 80) energyLevelStr = 'high';
      else energyLevelStr = 'very_high';

      // Enhanced budget categorization
      const budgetAmount = parseInt(budget) || 0;
      let budgetCategory = 'medium';
      if (budgetAmount < 20) budgetCategory = 'low';
      else if (budgetAmount > 100) budgetCategory = 'high';

      // Prepare enhanced user preferences
      const preferences = {
        mood: selectedMood,
        interests: selectedInterests,
        foodTypes: selectedFoodTypes,
        energyLevel: energyLevelStr,
        budget: budgetCategory,
        budgetAmount: budgetAmount,
        transport: transport,
        socialMode: socialMode,
        accessibility: accessibility,
        timestamp: new Date().toISOString(),
        sessionId: Math.random().toString(36).substring(7) // For variety tracking
      };

      // Store preferences in localStorage for the recommendations page
      localStorage.setItem('userPreferences', JSON.stringify(preferences));
      
      // Navigate to recommendations page
      router.push("/recommendations");
    } catch (error) {
      console.error('Error saving preferences:', error);
      // Still navigate to recommendations page even if there's an error
      router.push("/recommendations");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="container mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-3">
            <Compass className="w-8 h-8 text-gray-800 transition-transform duration-300 hover:rotate-12" />
            <h1 className="text-4xl font-bold text-black tracking-tight">What’s Your Vibe Today?</h1>
          </div>
          <p className="text-lg text-gray-600 leading-relaxed">
            Tell us how you’re feeling, and we’ll find the perfect spots to match your mood.
          </p>
        </div>

        {/* Mood Selection */}
        <Card className="p-8 rounded-lg border border-gray-300 bg-white shadow-lg">
          <h2 className="text-xl font-semibold text-black mb-4 flex items-center gap-2">
            <Heart className="w-6 h-6 text-gray-800" />
            How’s Your Mood?
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {moods.map((mood) => {
              const Icon = mood.Icon;
              return (
                <button
                  key={mood.value}
                  onClick={() => setSelectedMood(mood.value)}
                  className={`p-4 rounded-lg border-2 transition-all duration-300 hover:scale-105 hover:shadow-md ${
                    selectedMood === mood.value
                      ? "border-gray-600 bg-gray-200 shadow-md"
                      : "border-gray-300 bg-white hover:border-gray-400"
                  }`}
                >
                  <div className="mb-2 flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="text-sm font-medium text-gray-800">{mood.label}</div>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Interest Selection */}
        <Card className="p-8 rounded-lg border border-gray-300 bg-white shadow-lg">
          <h2 className="text-xl font-semibold text-black mb-4 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-gray-800" />
            What Are You Craving?
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {interests.map((interest) => {
              const Icon = interest.icon;
              return (
                <button
                  key={interest.value}
                  onClick={() => toggleInterest(interest.value)}
                  className={`p-4 rounded-lg border-2 transition-all duration-300 hover:scale-105 hover:shadow-md ${
                    selectedInterests.includes(interest.value)
                      ? "border-gray-600 bg-gray-200 shadow-md"
                      : "border-gray-300 bg-white hover:border-gray-400"
                  }`}
                >
                  <Icon className="w-6 h-6 mx-auto mb-2 text-gray-800" />
                  <div className="text-sm font-medium text-gray-800">{interest.label}</div>
                </button>
              );
            })}
          </div>

          {/* Food Types (shown when Eat is selected) */}
          {selectedInterests.includes("eat") && (
            <div className="mt-6 pt-4 border-t border-gray-300">
              <h3 className="text-sm font-semibold text-gray-600 mb-3">What kind of food?</h3>
              <div className="flex flex-wrap gap-3">
                {foodTypes.map((food) => {
                  const Icon = food.Icon;
                  return (
                    <button
                      key={food.value}
                      onClick={() => toggleFoodType(food.value)}
                      className={`px-4 py-2 rounded-lg border-2 transition-all duration-300 hover:scale-105 hover:shadow-md ${
                        selectedFoodTypes.includes(food.value)
                          ? "border-gray-600 bg-gray-200 shadow-md"
                          : "border-gray-300 bg-white hover:border-gray-400"
                      }`}
                    >
                      <span className="mr-2 inline-flex items-center"><Icon className="w-4 h-4" /></span>
                      <span className="text-sm font-medium text-gray-800">{food.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </Card>

        {/* Energy Level */}
        <Card className="p-8 rounded-lg border border-gray-300 bg-white shadow-lg">
          <h2 className="text-xl font-semibold text-black mb-4 flex items-center gap-2">
            <Mountain className="w-6 h-6 text-gray-800" />
            How Much Energy Do You Have?
          </h2>
          <div className="space-y-4">
            <Slider
              value={energyLevel}
              onValueChange={setEnergyLevel}
              max={100}
              step={1}
              className="w-full"
            />
            <div className="text-center p-3 rounded-lg bg-gray-100">
              <p className="text-lg font-medium text-gray-800">{getEnergyLabel()}</p>
            </div>
          </div>
        </Card>

       
        <Card className="p-8 rounded-lg border border-gray-300 bg-white shadow-lg">
          <h2 className="text-xl font-semibold text-black mb-4">What’s Your Budget?</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <DollarSign className="w-5 h-5" />
              <Input
                type="number"
                placeholder="Enter amount"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="rounded-lg py-5 border-2 border-gray-300 focus:border-gray-600 focus:ring-2 focus:ring-gray-400 transition-all duration-300"
              />
            </div>
            {budget && (
              <div className="p-3 rounded-lg bg-gray-100 border border-gray-200">
                <p className="text-sm font-medium text-gray-600">{getBudgetSuggestion()}</p>
              </div>
            )}
          </div>
        </Card>

        
        <Card className="p-8 rounded-lg border border-gray-300 bg-white shadow-lg">
          <h2 className="text-xl font-semibold text-black mb-4">How Will You Get There?</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {transportOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.value}
                  onClick={() => setTransport(option.value)}
                  className={`p-4 rounded-lg border-2 transition-all duration-300 hover:scale-105 hover:shadow-md ${
                    transport === option.value
                      ? "border-gray-600 bg-gray-200 shadow-md"
                      : "border-gray-300 bg-white hover:border-gray-400"
                  }`}
                >
                  <Icon className="w-6 h-6 mx-auto mb-2 text-gray-800" />
                  <div className="text-sm font-medium text-gray-800">{option.label}</div>
                </button>
              );
            })}
          </div>
        </Card>

        
        <Card className="p-8 rounded-lg border border-gray-300 bg-white shadow-lg">
          <h2 className="text-xl font-semibold text-black mb-4">Who’s Joining?</h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setSocialMode("solo")}
              className={`p-6 rounded-lg border-2 transition-all duration-300 hover:scale-105 hover:shadow-md ${
                socialMode === "solo"
                  ? "border-gray-600 bg-gray-200 shadow-md"
                  : "border-gray-300 bg-white hover:border-gray-400"
              }`}
            >
              <User className="w-6 h-6 mx-auto mb-2 text-gray-800" />
              <div className="text-sm font-medium text-gray-800">Solo</div>
            </button>
            <button
              onClick={() => setSocialMode("friends")}
              className={`p-6 rounded-lg border-2 transition-all duration-300 hover:scale-105 hover:shadow-md ${
                socialMode === "friends"
                  ? "border-gray-600 bg-gray-200 shadow-md"
                  : "border-gray-300 bg-white hover:border-gray-400"
              }`}
            >
              <Users className="w-6 h-6 mx-auto mb-2 text-gray-800" />
              <div className="text-sm font-medium text-gray-800">Friends</div>
            </button>
          </div>
        </Card>

       
        <Card className="p-8 rounded-lg border border-gray-300 bg-white shadow-lg">
          <h2 className="text-xl font-semibold text-black mb-4">Any Accessibility Needs?</h2>
          <div className="flex flex-wrap gap-3">
            {accessibilityOptions.map((option) => {
              const Icon = option.Icon;
              return (
                <Badge
                  key={option.value}
                  variant={accessibility.includes(option.value) ? "default" : "outline"}
                  className={`px-4 py-2 rounded-lg text-sm cursor-pointer transition-all duration-300 hover:scale-105 ${
                    accessibility.includes(option.value)
                      ? "bg-gray-200 border-gray-600 text-gray-800 shadow-md"
                      : "border-gray-300 text-gray-600 hover:border-gray-400"
                  }`}
                  onClick={() => toggleAccessibility(option.value)}
                >
                  <span className="mr-2 inline-flex items-center"><Icon className="w-4 h-4" /></span>
                  {option.label}
                </Badge>
              );
            })}
          </div>
        </Card>

      
        <Button
          onClick={handleSubmit}
          size="lg"
          className="w-full rounded-lg py-6 text-lg bg-black text-white hover:bg-gray-800 hover:scale-105 transition-all duration-300 shadow-lg"
        >
          Find My Perfect Spots
          <Sparkles className="w-5 h-5 ml-2 text-gray-200" />
        </Button>
      </div>
    </div>
  );
}