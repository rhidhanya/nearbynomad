"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Compass, Settings, Share2, BookOpen, Trophy, Edit, LogOut, User, MapPin, Clock, Star } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Example StoryCard component
function StoryCard() {
  const stories = [
    { id: 1, title: "Sunset Cafe Visit", description: "A cozy evening with great coffee!", image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd6e6b?auto=format&fit=crop&w=300&h=200", date: "Oct 8, 2025" },
    { id: 2, title: "Park Stroll", description: "Fresh air and greenery at its best.", image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=300&h=200", date: "Oct 7, 2025" },
  ];

  return (
    <div className="space-y-4" role="list" aria-label="User stories">
      {stories.map((story) => (
        <Card key={story.id} className="p-4 rounded-lg border border-gray-300 bg-white shadow-lg hover:shadow-xl transition-all duration-300" role="listitem">
          <div className="flex items-center gap-4">
            <img 
              src={story.image} 
              alt={`${story.title} - ${story.description}`} 
              className="w-20 h-20 rounded-lg object-cover"
              loading="lazy"
            />
            <div className="flex-1">
              <h4 className="font-semibold text-black">{story.title}</h4>
              <p className="text-sm text-gray-600">{story.description}</p>
              <time className="text-xs text-gray-600 mt-1" dateTime="2025-10-08">{story.date}</time>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="rounded-lg border-gray-300 bg-white hover:bg-gray-200 transition-all duration-300"
              aria-label={`View story: ${story.title}`}
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
    { id: 1, name: "Coffee Connoisseur", description: "Visited 5 cafes", icon: <BookOpen className="w-6 h-6 text-gray-800" aria-hidden="true" /> },
    { id: 2, name: "Nature Lover", description: "Explored 3 parks", icon: <Trophy className="w-6 h-6 text-gray-800" aria-hidden="true" /> },
  ];

  return (
    <div className="space-y-4" role="list" aria-label="User achievements">
      {achievements.map((achievement) => (
        <Card key={achievement.id} className="p-4 rounded-lg border border-gray-300 bg-white shadow-lg hover:shadow-xl transition-all duration-300" role="listitem">
          <div className="flex items-center gap-4">
            <div aria-hidden="true">{achievement.icon}</div>
            <div className="flex-1">
              <h4 className="font-semibold text-black">{achievement.name}</h4>
              <p className="text-sm text-gray-600">{achievement.description}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="rounded-lg border-gray-300 bg-white hover:bg-gray-200 transition-all duration-300"
              aria-label={`Share achievement: ${achievement.name}`}
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
  const router = useRouter();
  const [userData, setUserData] = useState({
    name: "xyzie",
    level: 8,
    xp: 1247,
    totalPlaces: 23,
    favoriteCategories: ["Cafe", "Sightseeing", "Temple"]
  });

  const [recentAdventures, setRecentAdventures] = useState([
    { place: "Marudhamalai Temple", time: "2 hours ago", mood: "temple", rating: 4.8 },
    { place: "Siruvani Waterfalls", time: "Yesterday", mood: "water", rating: 4.9 },
    { place: "VOC Park & Zoo", time: "2 days ago", mood: "zoo", rating: 4.4 },
  ]);

  const handleLogout = () => {
    localStorage.removeItem("userPreferences");
    localStorage.removeItem("userData");
    router.push("/login");
  };

  const handleEditProfile = () => {
    // TODO: Implement profile editing
    alert("Profile editing coming soon!");
  };

  const handleKeyDown = (event: React.KeyboardEvent, action: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="container mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <header className="flex items-center justify-between bg-white border border-gray-300 rounded-lg shadow-sm p-4">
          <Link href="/recommendations">
            <Button
              variant="ghost"
              className="text-gray-800 hover:bg-gray-200 rounded-lg transition-all duration-300"
              aria-label="Go back to recommendations page"
            >
              <Compass className="w-5 h-5 mr-2" aria-hidden="true" />
              Back to Explore
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleEditProfile}
              onKeyDown={(e) => handleKeyDown(e, handleEditProfile)}
              className="rounded-lg border-gray-300 bg-white hover:bg-gray-200 transition-all duration-300"
              aria-label="Edit profile"
            >
              <Edit className="w-5 h-5 text-gray-800" aria-hidden="true" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleLogout}
              onKeyDown={(e) => handleKeyDown(e, handleLogout)}
              className="rounded-lg border-gray-300 bg-white hover:bg-gray-200 transition-all duration-300"
              aria-label="Logout"
            >
              <LogOut className="w-5 h-5 text-gray-800" aria-hidden="true" />
            </Button>
          </div>
        </header>

        {/* Profile Header */}
        <Card className="p-8 rounded-lg border border-gray-300 bg-white shadow-lg">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar className="w-24 h-24 border-4 border-gray-200">
              <AvatarImage src="" alt={`${userData.name}'s profile picture`} />
              <AvatarFallback className="text-2xl font-bold bg-gray-200 text-gray-800" aria-label={`${userData.name}'s initials`}>
                xy
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center md:text-left space-y-3">
              <h1 className="text-4xl font-bold text-black">{userData.name}</h1>
              <p className="text-lg text-gray-600">Local Explorer • Mood Adventurer</p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start" role="list" aria-label="User stats">
                <div className="px-3 py-1 rounded-lg bg-gray-200 text-gray-800 text-sm font-medium" role="listitem">
                  Level {userData.level}
                </div>
                <div className="px-3 py-1 rounded-lg bg-gray-200 text-gray-800 text-sm font-medium" role="listitem">
                  {userData.xp.toLocaleString()} XP
                </div>
                <div className="px-3 py-1 rounded-lg bg-gray-200 text-gray-800 text-sm font-medium" role="listitem">
                  {userData.totalPlaces} Places Visited
                </div>
              </div>
            </div>

            <Button
              className="rounded-lg px-6 py-5 text-base bg-black text-white hover:bg-gray-800 hover:scale-105 transition-all duration-300"
              aria-label="Share your profile"
            >
              <Share2 className="w-4 h-4 mr-2" aria-hidden="true" />
              Share Profile
            </Button>
          </div>
        </Card>

        {/* Main Content */}
        <main className="space-y-8">
          {/* Welcome Message */}
          <section className="text-center space-y-2">
            <h2 className="text-2xl font-semibold text-black">Hey {userData.name}, Ready to Explore?</h2>
            <p className="text-gray-600">Your adventures are waiting—let's find your next favorite spot!</p>
          </section>

          {/* Stories & Gamification */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 rounded-lg border border-gray-300 bg-white shadow-lg">
              <h3 className="text-lg font-semibold text-black mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-gray-800" aria-hidden="true" />
                Your Stories
              </h3>
              <StoryCard />
            </Card>
            <Card className="p-6 rounded-lg border border-gray-300 bg-white shadow-lg">
              <h3 className="text-lg font-semibold text-black mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-gray-800" aria-hidden="true" />
                Your Achievements
              </h3>
              <GamificationWidget />
            </Card>
          </div>

          {/* Recent Adventures */}
          <Card className="p-6 rounded-lg border border-gray-300 bg-white shadow-lg">
            <h2 className="text-xl font-semibold text-black mb-4">Recent Adventures</h2>
            <div className="space-y-3" role="list" aria-label="Recent adventures">
              {recentAdventures.map((adventure, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all duration-300"
                  role="listitem"
                >
                  <div className="text-gray-600" aria-hidden="true">
                    {adventure.mood === 'temple' && <Compass className="w-5 h-5" />}
                    {adventure.mood === 'water' && <MapPin className="w-5 h-5" />}
                    {adventure.mood === 'zoo' && <User className="w-5 h-5" />}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-black">{adventure.place}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="w-4 h-4 text-gray-500" aria-hidden="true" />
                      <time className="text-sm text-gray-600">{adventure.time}</time>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" aria-hidden="true" />
                        <span className="text-sm text-gray-600" aria-label={`Rating: ${adventure.rating} out of 5`}>
                          {adventure.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-lg border-gray-300 bg-white hover:bg-gray-200 transition-all duration-300"
                    aria-label={`View details for ${adventure.place}`}
                  >
                    View
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          {/* Stats Overview */}
          <Card className="p-6 rounded-lg border border-gray-300 bg-white shadow-lg">
            <h2 className="text-xl font-semibold text-black mb-4">Your Exploration Stats</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" role="list" aria-label="Exploration statistics">
              <div className="text-center p-4 rounded-lg bg-blue-50 border border-blue-200" role="listitem">
                <MapPin className="w-8 h-8 text-blue-600 mx-auto mb-2" aria-hidden="true" />
                <p className="text-2xl font-bold text-blue-800" aria-label={`${userData.totalPlaces} places explored`}>
                  {userData.totalPlaces}
                </p>
                <p className="text-sm text-blue-600">Places Explored</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-green-50 border border-green-200" role="listitem">
                <Trophy className="w-8 h-8 text-green-600 mx-auto mb-2" aria-hidden="true" />
                <p className="text-2xl font-bold text-green-800" aria-label={`Explorer level ${userData.level}`}>
                  {userData.level}
                </p>
                <p className="text-sm text-green-600">Explorer Level</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-purple-50 border border-purple-200" role="listitem">
                <Star className="w-8 h-8 text-purple-600 mx-auto mb-2" aria-hidden="true" />
                <p className="text-2xl font-bold text-purple-800" aria-label={`${userData.favoriteCategories.length} favorite categories`}>
                  {userData.favoriteCategories.length}
                </p>
                <p className="text-sm text-purple-600">Favorite Categories</p>
              </div>
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
}