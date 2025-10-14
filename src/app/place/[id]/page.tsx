"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
} from "lucide-react";

// Mock place data
const placeData = {
  id: 1,
  name: "Sunset Cafe",
  category: "Cafe",
  image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd6e6b?auto=format&fit=crop&w=800&h=500",
  images: [
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd6e6b?auto=format&fit=crop&w=800&h=500",
    "https://images.unsplash.com/photo-1511920170033-f8396924c312?auto=format&fit=crop&w=800&h=500",
    "https://images.unsplash.com/photo-1447933608146-09ea0d2a7b65?auto=format&fit=crop&w=800&h=500",
  ],
  distance: "0.8 km",
  time: "10 min walk",
  price: "$$",
  moodMatch: "Your cozy escape for a calm day",
  moodEmoji: "🌙",
  rating: 4.5,
  reviews: 127,
  tags: ["Cozy", "Quiet", "WiFi"],
  address: "123 Main Street, Downtown",
  phone: "+1 (555) 123-4567",
  website: "www.sunsetcafe.com",
  hours: "Mon-Fri: 7am-8pm, Sat-Sun: 8am-9pm",
  description:
    "Nestled in the heart of Downtown, Sunset Cafe is your go-to spot for a warm coffee and a peaceful vibe. With soft lighting, plush seats, and a welcoming atmosphere, it’s perfect for unwinding or catching up on work.",
  coordinates: { lat: 37.7749, lng: -122.4194 },
};

export default function PlaceDetailPage() {
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  // Function to get user's location and open a deep link
  const openRideShare = (service: "uber" | "lyft" | "googlemaps") => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pickupLat = position.coords.latitude;
        const pickupLng = position.coords.longitude;
        const dropoffAddress = encodeURIComponent(placeData.address);
        const dropoffLat = placeData.coordinates.lat;
        const dropoffLng = placeData.coordinates.lng;
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
      <div className="container mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between bg-white border border-gray-300 rounded-lg shadow-sm p-4">
          <Link href="/recommendations">
            <Button
              variant="ghost"
              className="text-gray-800 hover:bg-gray-200 rounded-lg transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Recommendations
            </Button>
          </Link>
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="icon"
              className="rounded-lg border-gray-300 bg-white hover:bg-gray-200 transition-all duration-300"
              onClick={() => setIsFavorite(!isFavorite)}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? "fill-gray-800 text-gray-800" : "text-gray-800"}`} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-lg border-gray-300 bg-white hover:bg-gray-200 transition-all duration-300"
            >
              <Share2 className="w-5 h-5 text-gray-800" />
            </Button>
          </div>
        </div>

        {/* Hero Section */}
        <Card className="relative rounded-lg border border-gray-300 bg-white shadow-lg overflow-hidden">
          <div className="h-64 sm:h-80">
            <img
              src={placeData.images[selectedImage]}
              alt={placeData.name}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
            <Badge className="absolute top-4 left-4 rounded-lg bg-gray-800 text-white px-3 py-1 shadow-md">
              {placeData.category}
            </Badge>
          </div>
          <div className="flex gap-2 p-4 overflow-x-auto bg-gray-100">
            {placeData.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 hover:scale-105 ${
                  selectedImage === i ? "border-gray-600 shadow-md" : "border-gray-300"
                }`}
              >
                <img src={img} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </Card>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Title & Mood */}
          <div className="text-center space-y-3">
            <h1 className="text-4xl font-bold text-black">{placeData.name}</h1>
            <p className="text-lg text-gray-600 flex items-center justify-center gap-2">
              <span className="text-2xl">{placeData.moodEmoji}</span>
              {placeData.moodMatch}
            </p>
            <div className="flex justify-center gap-4 text-gray-600">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 text-gray-800 fill-current" />
                <span className="font-semibold text-black">{placeData.rating}</span>
                <span>({placeData.reviews} reviews)</span>
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="w-5 h-5 text-gray-800" />
                <span>{placeData.price}</span>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex justify-center flex-wrap gap-2">
            {placeData.tags.map((tag) => (
              <Badge
                key={tag}
                className="rounded-lg px-3 py-1 bg-gray-200 text-gray-800 border-gray-300 hover:bg-gray-300 transition-all duration-300"
              >
                {tag}
              </Badge>
            ))}
          </div>

          {/* Tabs */}
          <Card className="p-6 rounded-lg border border-gray-300 bg-white shadow-lg">
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="w-full rounded-lg bg-gray-100 mb-4">
                <TabsTrigger
                  value="about"
                  className="flex-1 rounded-lg text-gray-800 data-[state=active]:bg-gray-200 data-[state=active]:text-black"
                >
                  About
                </TabsTrigger>
                <TabsTrigger
                  value="info"
                  className="flex-1 rounded-lg text-gray-800 data-[state=active]:bg-gray-200 data-[state=active]:text-black"
                >
                  Info
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="flex-1 rounded-lg text-gray-800 data-[state=active]:bg-gray-200 data-[state=active]:text-black"
                >
                  Reviews
                </TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="space-y-4">
                <p className="text-gray-600 leading-relaxed">{placeData.description}</p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-800 mt-0.5" />
                    <div>
                      <p className="font-medium text-black">Address</p>
                      <p className="text-sm text-gray-600">{placeData.address}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-gray-800 mt-0.5" />
                    <div>
                      <p className="font-medium text-black">Hours</p>
                      <p className="text-sm text-gray-600">{placeData.hours}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="info" className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-100">
                  <Phone className="w-5 h-5 text-gray-800" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium text-black">{placeData.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-100">
                  <Globe className="w-5 h-5 text-gray-800" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Website</p>
                    <a href={`https://${placeData.website}`} className="font-medium text-black hover:underline">
                      {placeData.website}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-100">
                  <Users className="w-5 h-5 text-gray-800" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Capacity</p>
                    <p className="font-medium text-black">Small groups welcome</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 rounded-lg bg-gray-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-sm text-gray-800">
                          U{i}
                        </div>
                        <span className="font-semibold text-black">User {i}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-gray-800 fill-current" />
                        <span className="text-sm font-medium text-black">4.5</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      Great atmosphere and excellent coffee. Perfect spot for working or relaxing!
                    </p>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </Card>

          {/* Map & Actions */}
          <Card className="p-6 rounded-lg border border-gray-300 bg-white shadow-lg space-y-6">
            <h2 className="text-xl font-semibold text-black flex items-center gap-2">
              <MapPin className="w-5 h-5 text-gray-800" />
              Find Your Way
            </h2>
            <div className="relative h-48 rounded-lg overflow-hidden bg-gray-100">
              <img
                src="https://images.unsplash.com/photo-1594021372082-0aacf2c6d359?auto=format&fit=crop&w=600&h=400"
                alt="Map of Sunset Cafe"
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center shadow-lg">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Navigation className="w-4 h-4 text-gray-800" />
              <span>{placeData.distance} away • {placeData.time}</span>
            </div>
            <Button
              className="w-full rounded-lg py-5 text-base bg-black text-white hover:bg-gray-800 hover:scale-105 transition-all duration-300"
              onClick={() => openRideShare("googlemaps")}
            >
              <Navigation className="w-5 h-5 mr-2" />
              Open in Google Maps
            </Button>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6 rounded-lg border border-gray-300 bg-white shadow-lg space-y-4">
            <h2 className="text-xl font-semibold text-black flex items-center gap-2">
              <Car className="w-5 h-5 text-gray-800" />
              Get There
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <Button
                variant="outline"
                className="rounded-lg py-5 border-2 border-gray-300 bg-white hover:bg-gray-200 hover:scale-105 transition-all duration-300"
                onClick={() => openRideShare("uber")}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center">
                    <span className="text-white font-bold text-xs">UBER</span>
                  </div>
                  <span className="font-semibold text-black">Book Uber</span>
                </div>
              </Button>
              <Button
                variant="outline"
                className="rounded-lg py-5 border-2 border-gray-300 bg-white hover:bg-gray-200 hover:scale-105 transition-all duration-300"
                onClick={() => openRideShare("lyft")}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center">
                    <span className="text-white font-bold text-xs">LYFT</span>
                  </div>
                  <span className="font-semibold text-black">Book Lyft</span>
                </div>
              </Button>
            </div>
            <h2 className="text-xl font-semibold text-black flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-800" />
              Plan Your Visit
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <Button
                variant="outline"
                className="rounded-lg py-5 border-2 border-gray-300 bg-white hover:bg-gray-200 hover:scale-105 transition-all duration-300"
              >
                <Calendar className="w-4 h-4 mr-2 text-gray-800" />
                Add to Itinerary
              </Button>
              <Button
                variant="outline"
                className="rounded-lg py-5 border-2 border-gray-300 bg-white hover:bg-gray-200 hover:scale-105 transition-all duration-300"
              >
                <Users className="w-4 h-4 mr-2 text-gray-800" />
                Invite Friends
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}