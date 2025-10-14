"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Compass, Settings, Share2, BookOpen, Trophy } from "lucide-react";
import Link from "next/link";

// Example StoryCard component
function StoryCard() {
  const stories = [
    { id: 1, title: "Sunset Cafe Visit", description: "A cozy evening with great coffee!", image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd6e6b?auto=format&fit=crop&w=300&h=200", date: "Oct 8, 2025" },
    { id: 2, title: "Park Stroll", description: "Fresh air and greenery at its best.", image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=300&h=200", date: "Oct 7, 2025" },
  ];

  return (
    <div className="space-y-4">
      {stories.map((story) => (
        <Card key={story.id} className="p-4 rounded-lg border border-gray-300 bg-white shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-4">
            <img src={story.image} alt={story.title} className="w-20 h-20 rounded-lg object-cover" />
            <div className="flex-1">
              <p className="font-semibold text-black">{story.title}</p>
              <p className="text-sm text-gray-600">{story.description}</p>
              <p className="text-xs text-gray-600 mt-1">{story.date}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="rounded-lg border-gray-300 bg-white hover:bg-gray-200 transition-all duration-300"
            >
              View Story
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}

// Example GamificationWidget component
function GamificationWidget() {
  const achievements = [
    { id: 1, name: "Coffee Connoisseur", description: "Visited 5 cafes", icon: <BookOpen className="w-6 h-6 text-gray-800" /> },
    { id: 2, name: "Nature Lover", description: "Explored 3 parks", icon: <Trophy className="w-6 h-6 text-gray-800" /> },
  ];

  return (
    <div className="space-y-4">
      {achievements.map((achievement) => (
        <Card key={achievement.id} className="p-4 rounded-lg border border-gray-300 bg-white shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-4">
            {achievement.icon}
            <div className="flex-1">
              <p className="font-semibold text-black">{achievement.name}</p>
              <p className="text-sm text-gray-600">{achievement.description}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="rounded-lg border-gray-300 bg-white hover:bg-gray-200 transition-all duration-300"
            >
              Share
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="container mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between bg-white border border-gray-300 rounded-lg shadow-sm p-4">
          <Link href="/recommendations">
            <Button
              variant="ghost"
              className="text-gray-800 hover:bg-gray-200 rounded-lg transition-all duration-300"
            >
              <Compass className="w-5 h-5 mr-2" />
              Back to Explore
            </Button>
          </Link>
          <Button
            variant="outline"
            size="icon"
            className="rounded-lg border-gray-300 bg-white hover:bg-gray-200 transition-all duration-300"
          >
            <Settings className="w-5 h-5 text-gray-800" />
          </Button>
        </div>

        {/* Profile Header */}
        <Card className="p-8 rounded-lg border border-gray-300 bg-white shadow-lg">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar className="w-24 h-24 border-4 border-gray-200">
              <AvatarImage src="" />
              <AvatarFallback className="text-2xl font-bold bg-gray-200 text-gray-800">RH</AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center md:text-left space-y-3">
              <h1 className="text-4xl font-bold text-black">Rhidhanya</h1>
              <p className="text-lg text-gray-600">Local Explorer • Mood Adventurer</p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <div className="px-3 py-1 rounded-lg bg-gray-200 text-gray-800 text-sm font-medium">
                  Level 8
                </div>
                <div className="px-3 py-1 rounded-lg bg-gray-200 text-gray-800 text-sm font-medium">
                  1,247 XP
                </div>
              </div>
            </div>

            <Button
              className="rounded-lg px-6 py-5 text-base bg-black text-white hover:bg-gray-800 hover:scale-105 transition-all duration-300"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share Profile
            </Button>
          </div>
        </Card>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Welcome Message */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-semibold text-black">Hey Rhidhanya, Ready to Explore?</h2>
            <p className="text-gray-600">Your adventures are waiting—let’s find your next favorite spot!</p>
          </div>

          {/* Stories & Gamification */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 rounded-lg border border-gray-300 bg-white shadow-lg">
              <h3 className="text-lg font-semibold text-black mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-gray-800" />
                Your Stories
              </h3>
              <StoryCard />
            </Card>
            <Card className="p-6 rounded-lg border border-gray-300 bg-white shadow-lg">
              <h3 className="text-lg font-semibold text-black mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-gray-800" />
                Your Achievements
              </h3>
              <GamificationWidget />
            </Card>
          </div>

          {/* Recent Adventures */}
          <Card className="p-6 rounded-lg border border-gray-300 bg-white shadow-lg">
            <h2 className="text-xl font-semibold text-black mb-4">Recent Adventures</h2>
            <div className="space-y-3">
              {[
                { place: "Sunset Cafe", time: "2 hours ago", mood: "🌙" },
                { place: "Green Valley Park", time: "Yesterday", mood: "🌿" },
                { place: "The Burger Joint", time: "2 days ago", mood: "🍔" },
              ].map((adventure, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all duration-300"
                >
                  <div className="text-3xl">{adventure.mood}</div>
                  <div className="flex-1">
                    <p className="font-semibold text-black">{adventure.place}</p>
                    <p className="text-sm text-gray-600">{adventure.time}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-lg border-gray-300 bg-white hover:bg-gray-200 transition-all duration-300"
                  >
                    View
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}