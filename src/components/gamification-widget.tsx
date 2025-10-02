"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Trophy, Flame, Star, Award } from "lucide-react"

const badges = [
  { id: 1, name: "Dessert Explorer", emoji: "🍰", earned: true, description: "Visited 5 dessert spots" },
  { id: 2, name: "Hidden Park Finder", emoji: "🌿", earned: true, description: "Discovered 3 hidden parks" },
  { id: 3, name: "Coffee Connoisseur", emoji: "☕", earned: true, description: "Tried 10 different cafes" },
  { id: 4, name: "Night Owl", emoji: "🦉", earned: false, description: "Visit 5 places after 8pm" },
  { id: 5, name: "Early Bird", emoji: "🐦", earned: false, description: "Visit 5 places before 9am" },
  { id: 6, name: "Social Butterfly", emoji: "🦋", earned: false, description: "Visit 10 places with friends" },
]

export function GamificationWidget() {
  const streak = 7
  const totalBadges = badges.filter((b) => b.earned).length
  const nextBadgeProgress = 60

  return (
    <div className="space-y-4">
      {/* Streak Counter */}
      <Card className="p-5 rounded-3xl border-2 bg-gradient-to-br from-primary/10 to-accent/10 backdrop-blur">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
              <Flame className="w-7 h-7 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{streak} Days</p>
              <p className="text-sm text-muted-foreground">Exploration Streak</p>
            </div>
          </div>
          <div className="text-4xl animate-pulse">🔥</div>
        </div>
      </Card>

      {/* Badge Collection */}
      <Card className="p-5 rounded-3xl border-2 bg-card/95 backdrop-blur">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Trophy className="w-5 h-5 text-secondary" />
            Your Badges
          </h3>
          <Badge variant="secondary" className="rounded-xl">
            {totalBadges}/{badges.length}
          </Badge>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`relative p-3 rounded-2xl border-2 transition-all ${
                badge.earned ? "border-primary bg-primary/5 hover:scale-105" : "border-border bg-muted/30 opacity-50"
              }`}
              title={badge.description}
            >
              <div className="text-3xl text-center mb-1">{badge.emoji}</div>
              <p className="text-xs text-center font-medium line-clamp-2">{badge.name}</p>
              {badge.earned && (
                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <Star className="w-3 h-3 text-primary-foreground fill-current" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Next Badge Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Next badge progress</span>
            <span className="font-semibold">{nextBadgeProgress}%</span>
          </div>
          <Progress value={nextBadgeProgress} className="h-2" />
        </div>
      </Card>

      {/* Stats */}
      <Card className="p-5 rounded-3xl border-2 bg-card/95 backdrop-blur">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-accent" />
          Your Stats
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 rounded-xl bg-primary/5 border border-primary/20">
            <p className="text-2xl font-bold text-primary">42</p>
            <p className="text-xs text-muted-foreground">Places Visited</p>
          </div>
          <div className="p-3 rounded-xl bg-accent/5 border border-accent/20">
            <p className="text-2xl font-bold text-accent">18</p>
            <p className="text-xs text-muted-foreground">Hidden Gems</p>
          </div>
          <div className="p-3 rounded-xl bg-secondary/5 border border-secondary/20">
            <p className="text-2xl font-bold text-secondary">127</p>
            <p className="text-xs text-muted-foreground">km Traveled</p>
          </div>
          <div className="p-3 rounded-xl bg-chart-5/5 border border-chart-5/20">
            <p className="text-2xl font-bold text-chart-5">9</p>
            <p className="text-xs text-muted-foreground">Friends Met</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
