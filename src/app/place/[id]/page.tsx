"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  MapPin,
  Clock,
  DollarSign,
  Heart,
  Share2,
  Navigation,
  Car,
  Phone,
  Globe,
  Star,
  Users,
  Calendar,
} from "lucide-react"

// Mock place data
const placeData = {
  id: 1,
  name: "Sunset Cafe",
  category: "Cafe",
  image: "/cozy-cafe-with-warm-lighting.jpg",
  images: [
    "/cozy-cafe-with-warm-lighting.jpg",
    "/placeholder.svg?height=400&width=600&key=cafe2",
    "/placeholder.svg?height=400&width=600&key=cafe3",
  ],
  distance: "0.8 km",
  time: "10 min walk",
  price: "$$",
  moodMatch: "Perfect for your calm vibe",
  moodEmoji: "🌙",
  rating: 4.5,
  reviews: 127,
  tags: ["Cozy", "Quiet", "WiFi"],
  address: "123 Main Street, Downtown",
  phone: "+1 (555) 123-4567",
  website: "www.sunsetcafe.com",
  hours: "Mon-Fri: 7am-8pm, Sat-Sun: 8am-9pm",
  description:
    "A cozy neighborhood cafe perfect for relaxing with a good book and excellent coffee. Features comfortable seating, natural lighting, and a peaceful atmosphere.",
  coordinates: { lat: 37.7749, lng: -122.4194 },
}

export default function PlaceDetailPage() {
  const [isFavorite, setIsFavorite] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/recommendations">
            <Button variant="ghost" className="rounded-2xl">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </Button>
          </Link>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-2xl bg-transparent"
              onClick={() => setIsFavorite(!isFavorite)}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? "fill-primary text-primary" : ""}`} />
            </Button>
            <Button variant="outline" size="icon" className="rounded-2xl bg-transparent">
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card className="overflow-hidden rounded-3xl border-2 bg-card/95 backdrop-blur">
              <div className="relative h-96">
                <img
                  src={placeData.images[selectedImage] || "/placeholder.svg"}
                  alt={placeData.name}
                  className="w-full h-full object-cover"
                />
                <Badge className="absolute top-4 left-4 rounded-xl bg-card/90 backdrop-blur">
                  {placeData.category}
                </Badge>
              </div>
              <div className="p-4 flex gap-2 overflow-x-auto">
                {placeData.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === i ? "border-primary scale-105" : "border-border"
                    }`}
                  >
                    <img src={img || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </Card>

            {/* Details */}
            <Card className="p-6 rounded-3xl border-2 bg-card/95 backdrop-blur space-y-6">
              {/* Title & Rating */}
              <div>
                <h1 className="text-3xl font-bold mb-2">{placeData.name}</h1>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-secondary fill-current" />
                    <span className="font-semibold text-foreground">{placeData.rating}</span>
                    <span>({placeData.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-5 h-5" />
                    <span>{placeData.price}</span>
                  </div>
                </div>
              </div>

              {/* Mood Match */}
              <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20">
                <p className="font-medium text-primary flex items-center gap-2">
                  <span className="text-2xl">{placeData.moodEmoji}</span>
                  {placeData.moodMatch}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {placeData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="rounded-xl px-3 py-1">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Tabs */}
              <Tabs defaultValue="about" className="w-full">
                <TabsList className="w-full rounded-2xl">
                  <TabsTrigger value="about" className="flex-1 rounded-xl">
                    About
                  </TabsTrigger>
                  <TabsTrigger value="info" className="flex-1 rounded-xl">
                    Info
                  </TabsTrigger>
                  <TabsTrigger value="reviews" className="flex-1 rounded-xl">
                    Reviews
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="about" className="space-y-4 mt-4">
                  <p className="text-muted-foreground leading-relaxed">{placeData.description}</p>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">Address</p>
                        <p className="text-sm text-muted-foreground">{placeData.address}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-accent mt-0.5" />
                      <div>
                        <p className="font-medium">Hours</p>
                        <p className="text-sm text-muted-foreground">{placeData.hours}</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="info" className="space-y-3 mt-4">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
                    <Phone className="w-5 h-5 text-primary" />
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{placeData.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
                    <Globe className="w-5 h-5 text-accent" />
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Website</p>
                      <p className="font-medium">{placeData.website}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
                    <Users className="w-5 h-5 text-secondary" />
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Capacity</p>
                      <p className="font-medium">Small groups welcome</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="reviews" className="space-y-4 mt-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-4 rounded-2xl bg-muted/30 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-sm">
                            U{i}
                          </div>
                          <span className="font-semibold">User {i}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-secondary fill-current" />
                          <span className="text-sm font-medium">4.5</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Great atmosphere and excellent coffee. Perfect spot for working or relaxing!
                      </p>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Map Preview */}
            <Card className="p-6 rounded-3xl border-2 bg-card/95 backdrop-blur space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Location
              </h3>

              {/* Map Placeholder */}
              <div className="relative h-48 rounded-2xl overflow-hidden bg-muted">
                <img src="/map-view.png" alt="Map" className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center shadow-lg">
                    <MapPin className="w-6 h-6 text-primary-foreground" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Navigation className="w-4 h-4" />
                  <span>{placeData.distance} away</span>
                  <span>•</span>
                  <span>{placeData.time}</span>
                </div>
              </div>

              <Button className="w-full rounded-2xl py-6 hover:scale-105 transition-all">
                <Navigation className="w-5 h-5 mr-2" />
                Open in Google Maps
              </Button>
            </Card>

            {/* Booking Options */}
            <Card className="p-6 rounded-3xl border-2 bg-card/95 backdrop-blur space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Car className="w-5 h-5 text-accent" />
                Get There
              </h3>

              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full rounded-2xl py-6 border-2 hover:scale-105 transition-all justify-start bg-transparent"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-foreground flex items-center justify-center">
                      <span className="text-background font-bold text-sm">UBER</span>
                    </div>
                    <div className="text-left">
                      <p className="font-semibold">Book Uber</p>
                      <p className="text-xs text-muted-foreground">~$8 • 5 min away</p>
                    </div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="w-full rounded-2xl py-6 border-2 hover:scale-105 transition-all justify-start bg-transparent"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                      <span className="text-accent-foreground font-bold text-sm">LYFT</span>
                    </div>
                    <div className="text-left">
                      <p className="font-semibold">Book Lyft</p>
                      <p className="text-xs text-muted-foreground">~$7 • 6 min away</p>
                    </div>
                  </div>
                </Button>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6 rounded-3xl border-2 bg-card/95 backdrop-blur space-y-3">
              <h3 className="text-lg font-bold">Quick Actions</h3>

              <Button variant="outline" className="w-full rounded-2xl hover:scale-105 transition-all bg-transparent">
                <Calendar className="w-4 h-4 mr-2" />
                Add to Itinerary
              </Button>

              <Button variant="outline" className="w-full rounded-2xl hover:scale-105 transition-all bg-transparent">
                <Users className="w-4 h-4 mr-2" />
                Invite Friends
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
