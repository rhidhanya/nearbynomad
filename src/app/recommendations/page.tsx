"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Compass, Sparkles, MapPin, Clock, DollarSign, Heart, Navigation, Shuffle, Route, User, Car } from "lucide-react";

// Mock data with verified image URLs
const mockRecommendations = [
  {
    id: 1,
    name: "Sunset Cafe",
    category: "Cafe",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd6e6b?auto=format&fit=crop&w=600&h=400",
    distance: "0.8 km",
    time: "10 min walk",
    price: "$$",
    moodMatch: "Perfect for your calm vibe",
    moodEmoji: "🌙",
    rating: 4.5,
    tags: ["Cozy", "Quiet", "WiFi"],
    address: "123 Main Street, Downtown",
    coordinates: { lat: 37.7749, lng: -122.4194 },
  },
  {
    id: 2,
    name: "Green Valley Park",
    category: "Nature",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=600&h=400",
    distance: "1.2 km",
    time: "15 min walk",
    price: "Free",
    moodMatch: "Great for relaxation",
    moodEmoji: "🌿",
    rating: 4.8,
    tags: ["Nature", "Peaceful", "Pet-friendly"],
    address: "456 Park Avenue, City",
    coordinates: { lat: 37.7849, lng: -122.4294 },
  },
  {
    id: 3,
    name: "The Burger Joint",
    category: "Restaurant",
    image: "https://images.unsplash.com/photo-1551782450-a2132b4a6d74?auto=format&fit=crop&w=600&h=400",
    distance: "2.1 km",
    time: "8 min drive",
    price: "$$$",
    moodMatch: "Satisfies your cravings",
    moodEmoji: "🍔",
    rating: 4.6,
    tags: ["Casual", "Popular", "Outdoor seating"],
    address: "789 Food Street, Downtown",
    coordinates: { lat: 37.7649, lng: -122.4094 },
  },
  {
    id: 4,
    name: "Art District Gallery",
    category: "Culture",
    image: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=600&h=400",
    distance: "3.5 km",
    time: "12 min drive",
    price: "$",
    moodMatch: "Inspires creativity",
    moodEmoji: "🎨",
    rating: 4.7,
    tags: ["Art", "Indoor", "Instagram-worthy"],
    address: "101 Art Lane, City",
    coordinates: { lat: 37.7549, lng: -122.3994 },
  },
  {
    id: 5,
    name: "Lakeside Trail",
    category: "Outdoor",
    image: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=600&h=400",
    distance: "4.2 km",
    time: "20 min bike",
    price: "Free",
    moodMatch: "Adventure awaits",
    moodEmoji: "⛰️",
    rating: 4.9,
    tags: ["Scenic", "Exercise", "Photo spots"],
    address: "202 Trail Road, Lakeside",
    coordinates: { lat: 37.7449, lng: -122.3894 },
  },
  {
    id: 6,
    name: "Sweet Dreams Bakery",
    category: "Dessert",
    image: "https://images.unsplash.com/photo-1558961390-73d8f7739a79?auto=format&fit=crop&w=600&h=400",
    distance: "1.5 km",
    time: "6 min drive",
    price: "$$",
    moodMatch: "Treats for your mood",
    moodEmoji: "🍰",
    rating: 4.4,
    tags: ["Desserts", "Cozy", "Takeout"],
    address: "303 Sweet Street, Downtown",
    coordinates: { lat: 37.7349, lng: -122.3794 },
  },
];

export default function RecommendationsPage() {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [showItinerary, setShowItinerary] = useState(false);

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]));
  };

  const handleSurpriseMe = () => {
    alert("Shuffling recommendations for you!");
  };

  const generateItinerary = () => {
    setShowItinerary(!showItinerary);
  };

  // Function to open ride share or maps
  const openRideShare = (service: "uber" | "lyft" | "googlemaps", place: typeof mockRecommendations[0]) => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pickupLat = position.coords.latitude;
        const pickupLng = position.coords.longitude;
        const dropoffAddress = encodeURIComponent(place.address);
        const dropoffLat = place.coordinates.lat;
        const dropoffLng = place.coordinates.lng;
        let deepLink = "";

        if (service === "uber") {
          deepLink = `https://m.uber.com/ul/?action=setPickup&pickup[latitude]=${pickupLat}&pickup[longitude]=${pickupLng}&dropoff[formatted_address]=${dropoffAddress}&product_id=a1111c8c-c720-46c3-8538-2fcdd730040d`;
        } else if (service === "lyft") {
          deepLink = `lyft://ride?pickup[latitude]=${pickupLat}&pickup[longitude]=${pickupLng}&destination[latitude]=${dropoffLat}&destination[longitude]=${dropoffLng}&id=lyft`;
        } else if (service === "googlemaps") {
          deepLink = `https://www.google.com/maps/dir/?api=1&origin=${pickupLat},${pickupLng}&destination=${dropoffAddress}`;
        }

        window.open(deepLink, "_blank");
      },
      (error) => {
        alert("Unable to get your location. Please enable location services.");
        console.error("Geolocation error:", error);
      },
      { enableHighAccuracy: true }
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="container mx-auto max-w-5xl space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between bg-white border border-gray-300 rounded-lg shadow-sm p-4">
          <div className="flex items-center gap-2">
            <Compass className="w-8 h-8 text-gray-800" />
            <h1 className="text-3xl font-bold text-black">Rhidhanya’s Perfect Spots</h1>
          </div>
          <Link href="/profile">
            <Button
              variant="outline"
              size="icon"
              className="rounded-lg border-gray-300 bg-white hover:bg-gray-200 transition-all duration-300"
            >
              <User className="w-5 h-5 text-gray-800" />
            </Button>
          </Link>
        </div>

        <p className="text-gray-600 text-center">Curated just for you based on your calm mood</p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleSurpriseMe}
            variant="outline"
            className="rounded-lg px-6 py-5 border-2 border-gray-300 bg-white hover:bg-gray-200 hover:scale-105 transition-all duration-300"
          >
            <Shuffle className="w-5 h-5 mr-2 text-gray-800" />
            Surprise Me
          </Button>
          <Button
            onClick={generateItinerary}
            className="rounded-lg px-6 py-5 bg-black text-white hover:bg-gray-800 hover:scale-105 transition-all duration-300"
          >
            <Route className="w-5 h-5 mr-2" />
            {showItinerary ? "Hide" : "Generate"} Mini-Itinerary
          </Button>
        </div>

        {/* Itinerary Preview */}
        {showItinerary && (
          <Card className="p-6 rounded-lg border border-gray-300 bg-white shadow-lg animate-in slide-in-from-top">
            <h2 className="text-xl font-semibold text-black mb-4 flex items-center gap-2">
              <Route className="w-5 h-5 text-gray-800" />
              Your 3-Stop Adventure
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-100">
                <div className="w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center font-bold">
                  1
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-black">Sunset Cafe</p>
                  <p className="text-sm text-gray-600">Start with coffee (10 min)</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-100">
                <div className="w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center font-bold">
                  2
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-black">Green Valley Park</p>
                  <p className="text-sm text-gray-600">Relax in nature (30 min)</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-100">
                <div className="w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center font-bold">
                  3
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-black">Sweet Dreams Bakery</p>
                  <p className="text-sm text-gray-600">End with dessert (15 min)</p>
                </div>
              </div>
            </div>
            <div className="mt-4 p-3 rounded-lg bg-gray-200 text-center">
              <p className="text-sm font-medium text-black">Total time: ~1 hour | Total distance: 3.5 km</p>
            </div>
          </Card>
        )}

        {/* Recommendations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockRecommendations.map((place) => (
            <Card
              key={place.id}
              className="overflow-hidden rounded-lg border border-gray-300 bg-white shadow-lg hover:shadow-xl transition-all duration-300 group min-h-[450px]"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={place.image}
                  alt={place.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1501426026826-31c667bdf23d?auto=format&fit=crop&w=600&h=400";
                  }}
                />
                {/* Favorite Button */}
                <button
                  onClick={() => toggleFavorite(place.id)}
                  className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 border border-gray-300 flex items-center justify-center hover:scale-110 transition-all duration-300"
                >
                  <Heart
                    className={`w-5 h-5 ${favorites.includes(place.id) ? "fill-gray-800 text-gray-800" : "text-gray-600"}`}
                  />
                </button>
                {/* Category Badge */}
                <Badge className="absolute top-3 left-3 rounded-lg bg-gray-800 text-white px-3 py-1 shadow-md">
                  {place.category}
                </Badge>
              </div>

              {/* Content */}
              <div className="p-5 space-y-4 flex flex-col justify-between h-full">
                <div className="space-y-3">
                  {/* Title & Rating */}
                  <div>
                    <h3 className="text-lg font-bold text-black mb-1">{place.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <span className="text-gray-800">★</span>
                      <span>{place.rating}</span>
                    </div>
                  </div>

                  {/* Mood Match */}
                  <div className="p-3 rounded-lg bg-gray-100 border border-gray-200">
                    <p className="text-sm font-medium text-black flex items-center gap-2">
                      <span className="text-lg">{place.moodEmoji}</span>
                      {place.moodMatch}
                    </p>
                  </div>

                  {/* Details */}
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-gray-800" />
                      <span>{place.distance}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-gray-800" />
                      <span>{place.time}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-gray-800" />
                      <span>{place.price}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {place.tags.map((tag) => (
                      <Badge
                        key={tag}
                        className="rounded-lg px-3 py-1 bg-gray-200 text-gray-800 border-gray-300 hover:bg-gray-300 transition-all duration-300"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <Link href={`/place/${place.id}`}>
                    <Button
                      className="w-full rounded-lg py-5 border-2 border-gray-300 bg-white hover:bg-gray-200 hover:scale-105 transition-all duration-300 text-gray-800"
                    >
                      <Navigation className="w-4 h-4 mr-2 text-gray-800" />
                      View Details
                    </Button>
                  </Link>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant="outline"
                      className="rounded-lg py-3 border-2 border-gray-300 bg-white hover:bg-gray-200 hover:scale-105 transition-all duration-300 text-xs"
                      onClick={() => openRideShare("uber", place)}
                    >
                      <div className="flex items-center gap-1">
                        <div className="w-5 h-5 rounded bg-gray-800 flex items-center justify-center">
                          <span className="text-white font-bold text-[10px]">UBER</span>
                        </div>
                        <span>Uber</span>
                      </div>
                    </Button>
                    <Button
                      variant="outline"
                      className="rounded-lg py-3 border-2 border-gray-300 bg-white hover:bg-gray-200 hover:scale-105 transition-all duration-300 text-xs"
                      onClick={() => openRideShare("lyft", place)}
                    >
                      <div className="flex items-center gap-1">
                        <div className="w-5 h-5 rounded bg-gray-800 flex items-center justify-center">
                          <span className="text-white font-bold text-[10px]">LYFT</span>
                        </div>
                        <span>Lyft</span>
                      </div>
                    </Button>
                    <Button
                      variant="outline"
                      className="rounded-lg py-3 border-2 border-gray-300 bg-white hover:bg-gray-200 hover:scale-105 transition-all duration-300 text-xs"
                      onClick={() => openRideShare("googlemaps", place)}
                    >
                      <div className="flex items-center gap-1">
                        <div className="w-5 h-5 rounded bg-gray-800 flex items-center justify-center">
                          <MapPin className="w-3 h-3 text-white" />
                        </div>
                        <span>Maps</span>
                      </div>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center">
          <Button
            variant="outline"
            size="lg"
            className="rounded-lg px-8 py-6 border-2 border-gray-300 bg-white hover:bg-gray-200 hover:scale-105 transition-all duration-300"
          >
            <Sparkles className="w-5 h-5 mr-2 text-gray-800" />
            Show More Recommendations
          </Button>
        </div>
      </div>
    </div>
  );
}