"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Compass, Sparkles, MapPin, Clock, DollarSign, Heart, Navigation, Shuffle, Route, User } from "lucide-react"


// Mock data for recommendations
const mockRecommendations = [
  {
    id: 1,
    name: "Sunset Cafe",
    category: "Cafe",
    image: "/cozy-cafe-with-warm-lighting.jpg",
    distance: "0.8 km",
    time: "10 min walk",
    price: "$$",
    moodMatch: "Perfect for your calm vibe",
    moodEmoji: "🌙",
    rating: 4.5,
    tags: ["Cozy", "Quiet", "WiFi"],
  },
  {
    id: 2,
    name: "Green Valley Park",
    category: "Nature",
    image: "/beautiful-green-park-with-trees.jpg",
    distance: "1.2 km",
    time: "15 min walk",
    price: "Free",
    moodMatch: "Great for relaxation",
    moodEmoji: "🌿",
    rating: 4.8,
    tags: ["Nature", "Peaceful", "Pet-friendly"],
  },
  {
    id: 3,
    name: "The Burger Joint",
    category: "Restaurant",
    image: "/trendy-burger-restaurant.jpg",
    distance: "2.1 km",
    time: "8 min drive",
    price: "$$$",
    moodMatch: "Satisfies your cravings",
    moodEmoji: "🍔",
    rating: 4.6,
    tags: ["Casual", "Popular", "Outdoor seating"],
  },
  {
    id: 4,
    name: "Art District Gallery",
    category: "Culture",
    image: "/modern-art-gallery.png",
    distance: "3.5 km",
    time: "12 min drive",
    price: "$",
    moodMatch: "Inspires creativity",
    moodEmoji: "🎨",
    rating: 4.7,
    tags: ["Art", "Indoor", "Instagram-worthy"],
  },
  {
    id: 5,
    name: "Lakeside Trail",
    category: "Outdoor",
    image: "/scenic-lakeside-walking-trail.jpg",
    distance: "4.2 km",
    time: "20 min bike",
    price: "Free",
    moodMatch: "Adventure awaits",
    moodEmoji: "⛰️",
    rating: 4.9,
    tags: ["Scenic", "Exercise", "Photo spots"],
  },
  {
    id: 6,
    name: "Sweet Dreams Bakery",
    category: "Dessert",
    image: "/colorful-bakery-with-pastries.jpg",
    distance: "1.5 km",
    time: "6 min drive",
    price: "$$",
    moodMatch: "Treats for your mood",
    moodEmoji: "🍰",
    rating: 4.4,
    tags: ["Desserts", "Cozy", "Takeout"],
  },
]

export default function RecommendationsPage() {
  const [favorites, setFavorites] = useState<number[]>([])
  const [showItinerary, setShowItinerary] = useState(false)

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]))
  }

  const handleSurpriseMe = () => {
    // Shuffle recommendations logic
    alert("Shuffling recommendations for you!")
  }

  const generateItinerary = () => {
    setShowItinerary(!showItinerary)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20 py-8 px-4">
      <div className="container mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">Your Perfect Spots</h1>
          </div>
          <Link href="/profile">
            <Button variant="outline" size="icon" className="rounded-2xl bg-transparent">
              <User className="w-5 h-5" />
            </Button>
          </Link>
        </div>

        <p className="text-muted-foreground text-center">Based on your calm mood and preferences</p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={handleSurpriseMe}
            variant="outline"
            className="rounded-2xl px-6 py-6 border-2 hover:scale-105 transition-all bg-transparent"
          >
            <Shuffle className="w-5 h-5 mr-2" />
            Surprise Me
          </Button>
          <Button onClick={generateItinerary} className="rounded-2xl px-6 py-6 hover:scale-105 transition-all">
            <Route className="w-5 h-5 mr-2" />
            {showItinerary ? "Hide" : "Generate"} Mini-Itinerary
          </Button>
        </div>

        {/* Itinerary Preview */}
        {showItinerary && (
          <Card className="p-6 rounded-3xl border-2 bg-card/95 backdrop-blur animate-in slide-in-from-top">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Route className="w-5 h-5 text-accent" />
              Your 3-Stop Adventure
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 border border-primary/20">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  1
                </div>
                <div className="flex-1">
                  <p className="font-semibold">Sunset Cafe</p>
                  <p className="text-sm text-muted-foreground">Start with coffee (10 min)</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-accent/5 border border-accent/20">
                <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold">
                  2
                </div>
                <div className="flex-1">
                  <p className="font-semibold">Green Valley Park</p>
                  <p className="text-sm text-muted-foreground">Relax in nature (30 min)</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/5 border border-secondary/20">
                <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold">
                  3
                </div>
                <div className="flex-1">
                  <p className="font-semibold">Sweet Dreams Bakery</p>
                  <p className="text-sm text-muted-foreground">End with dessert (15 min)</p>
                </div>
              </div>
            </div>
            <div className="mt-4 p-3 rounded-xl bg-muted/50 text-center">
              <p className="text-sm font-medium">Total time: ~1 hour | Total distance: 3.5 km</p>
            </div>
          </Card>
        )}

        {/* Recommendations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockRecommendations.map((place) => (
            <Card
              key={place.id}
              className="overflow-hidden rounded-3xl border-2 hover:shadow-xl transition-all hover:scale-105 bg-card/95 backdrop-blur group"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={place.image || "/placeholder.svg"}
                  alt={place.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {/* Favorite Button */}
                <button
                  onClick={() => toggleFavorite(place.id)}
                  className="absolute top-3 right-3 w-10 h-10 rounded-full bg-card/90 backdrop-blur flex items-center justify-center hover:scale-110 transition-all"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      favorites.includes(place.id) ? "fill-primary text-primary" : "text-muted-foreground"
                    }`}
                  />
                </button>
                {/* Category Badge */}
                <Badge className="absolute top-3 left-3 rounded-xl bg-card/90 backdrop-blur">{place.category}</Badge>
              </div>

              {/* Content */}
              <div className="p-5 space-y-3">
                {/* Title & Rating */}
                <div>
                  <h3 className="text-lg font-bold mb-1">{place.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <span className="text-secondary">★</span>
                    <span>{place.rating}</span>
                  </div>
                </div>

                {/* Mood Match */}
                <div className="p-3 rounded-xl bg-primary/5 border border-primary/20">
                  <p className="text-sm font-medium text-primary flex items-center gap-2">
                    <span className="text-lg">{place.moodEmoji}</span>
                    {place.moodMatch}
                  </p>
                </div>

                {/* Details */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{place.distance}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{place.time}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    <span>{place.price}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {place.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="rounded-lg text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Action Button */}
                <Link href={`/place/${place.id}`}>
                  <Button
                    className="w-full rounded-2xl hover:scale-105 transition-all bg-transparent"
                    variant="outline"
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center">
          <Button
            variant="outline"
            size="lg"
            className="rounded-2xl px-8 py-6 border-2 hover:scale-105 transition-all bg-transparent"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Show More Recommendations
          </Button>
        </div>
      </div>
    </div>
  )
}
