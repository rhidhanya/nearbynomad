"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Compass, Settings, Share2 } from "lucide-react"
import { GamificationWidget } from "@/components/gamification-widget"
import { StoryCard } from "@/components/story-card"
import Link from "next/link"

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20 py-8 px-4">
      <div className="container mx-auto max-w-5xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link href="/recommendations">
            <Button variant="outline" className="rounded-2xl bg-transparent">
              <Compass className="w-4 h-4 mr-2" />
              Back to Explore
            </Button>
          </Link>
          <Button variant="outline" size="icon" className="rounded-2xl bg-transparent">
            <Settings className="w-5 h-5" />
          </Button>
        </div>

        {/* Profile Header */}
        <Card className="p-6 rounded-3xl border-2 bg-card/95 backdrop-blur">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar className="w-24 h-24 border-4 border-primary/20">
              <AvatarImage src="/placeholder.svg?height=96&width=96" />
              <AvatarFallback className="text-2xl font-bold bg-primary/10">JD</AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center md:text-left space-y-2">
              <h1 className="text-3xl font-bold">Jane Doe</h1>
              <p className="text-muted-foreground">Local Explorer • Mood Adventurer</p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <div className="px-3 py-1 rounded-xl bg-primary/10 text-primary text-sm font-medium">Level 8</div>
                <div className="px-3 py-1 rounded-xl bg-accent/10 text-accent text-sm font-medium">1,247 XP</div>
              </div>
            </div>

            <Button className="rounded-2xl px-6 hover:scale-105 transition-all">
              <Share2 className="w-4 h-4 mr-2" />
              Share Profile
            </Button>
          </div>
        </Card>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Story */}
          <div>
            <StoryCard />
          </div>

          {/* Right Column - Gamification */}
          <div>
            <GamificationWidget />
          </div>
        </div>

        {/* Recent Adventures */}
        <Card className="p-6 rounded-3xl border-2 bg-card/95 backdrop-blur">
          <h2 className="text-xl font-bold mb-4">Recent Adventures</h2>
          <div className="space-y-3">
            {[
              { place: "Sunset Cafe", time: "2 hours ago", mood: "🌙" },
              { place: "Green Valley Park", time: "Yesterday", mood: "🌿" },
              { place: "The Burger Joint", time: "2 days ago", mood: "🍔" },
            ].map((adventure, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="text-3xl">{adventure.mood}</div>
                <div className="flex-1">
                  <p className="font-semibold">{adventure.place}</p>
                  <p className="text-sm text-muted-foreground">{adventure.time}</p>
                </div>
                <Button variant="ghost" size="sm" className="rounded-xl">
                  View
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
