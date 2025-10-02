"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Sparkles } from "lucide-react"

export function StoryCard() {
  return (
    <Card className="p-6 rounded-3xl border-2 bg-gradient-to-br from-secondary/20 via-primary/10 to-accent/20 backdrop-blur overflow-hidden relative">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent/10 rounded-full blur-2xl"></div>

      <div className="relative space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-primary" />
          <h3 className="text-xl font-bold">Your Story Today</h3>
          <Sparkles className="w-5 h-5 text-secondary" />
        </div>

        <div className="space-y-3">
          <p className="text-lg font-serif italic text-balance leading-relaxed">
            "On this calm Tuesday afternoon, you embarked on a journey of tranquility. Starting at the cozy Sunset Cafe,
            where the aroma of fresh coffee mingled with soft jazz melodies..."
          </p>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-primary"></span>
            <span>Chapter 1 of your adventure</span>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="rounded-2xl flex-1 hover:scale-105 transition-all bg-transparent">
            Read Full Story
          </Button>
          <Button className="rounded-2xl flex-1 hover:scale-105 transition-all">Share Story</Button>
        </div>

        {/* Story Progress */}
        <div className="pt-4 border-t border-border/50">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Today's adventure</span>
            <span className="font-semibold">3/5 spots</span>
          </div>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= 3 ? "bg-primary" : "bg-muted"}`}></div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}
