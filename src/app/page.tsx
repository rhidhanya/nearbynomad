import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MapPin, Sparkles, Heart, Compass } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="flex flex-col items-center text-center space-y-8">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Compass className="w-12 h-12 text-primary animate-spin-slow" />
              <Sparkles className="w-5 h-5 text-secondary absolute -top-1 -right-1" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              NearbyNomad
            </h1>
          </div>

          {/* Tagline */}
          <p className="text-xl md:text-2xl text-foreground/80 max-w-2xl text-balance">
            Your mood-based trip planner that finds the perfect nearby adventures just for you
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link href="/login" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto text-lg px-8 py-6 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                Get Started
              </Button>
            </Link>
            <Link href="/mood" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto text-lg px-8 py-6 rounded-2xl border-2 hover:bg-accent/10 transition-all hover:scale-105 bg-transparent"
              >
                Explore Now
              </Button>
            </Link>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 w-full max-w-5xl">
            <Card className="p-6 rounded-3xl border-2 hover:shadow-lg transition-all hover:scale-105 bg-card/80 backdrop-blur">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Heart className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Mood-Based</h3>
                <p className="text-muted-foreground text-balance">Tell us how you feel, we'll find the perfect spot</p>
              </div>
            </Card>

            <Card className="p-6 rounded-3xl border-2 hover:shadow-lg transition-all hover:scale-105 bg-card/80 backdrop-blur">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center">
                  <MapPin className="w-7 h-7 text-accent" />
                </div>
                <h3 className="text-xl font-bold">Nearby & Easy</h3>
                <p className="text-muted-foreground text-balance">Discover hidden gems within your travel radius</p>
              </div>
            </Card>

            <Card className="p-6 rounded-3xl border-2 hover:shadow-lg transition-all hover:scale-105 bg-card/80 backdrop-blur">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center">
                  <Sparkles className="w-7 h-7 text-secondary" />
                </div>
                <h3 className="text-xl font-bold">Personalized</h3>
                <p className="text-muted-foreground text-balance">Tailored recommendations based on your vibe</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
