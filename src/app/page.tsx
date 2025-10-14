import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Sparkles, Heart, Compass } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-100 text-black">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16 md:py-24">
        <div className="flex flex-col items-start text-left space-y-6 max-w-3xl">
          {/* Logo & Brand */}
          <div className="flex items-center gap-4">
            <Compass className="w-10 h-10 text-black transition-transform duration-300 hover:rotate-12" />
            <h1 className="text-5xl font-bold tracking-tight">NearbyNomad</h1>
          </div>

          {/* Tagline */}
          <p className="text-2xl text-gray-600 leading-relaxed">
            Hey there, wanderer! Let’s find nearby adventures that match your vibe—whether you’re craving calm or chaos.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/login">
              <Button
                className="px-6 py-3 text-lg bg-black text-white rounded-lg hover:bg-gray-800 hover:scale-105 transition-all duration-300"
              >
                Start Your Journey
              </Button>
            </Link>
            <Link href="/mood">
              <Button
                variant="outline"
                className="px-6 py-3 text-lg border-2 border-gray-600 text-gray-800 rounded-lg hover:bg-gray-200 hover:scale-105 transition-all duration-300"
              >
                What’s Your Mood?
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-200 py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-semibold text-black mb-12 text-center">
            Why You’ll Love Exploring with Us
          </h2>
          <div className="flex flex-col md:flex-row md:justify-center gap-8">
            <Card className="p-6 rounded-lg border border-gray-300 bg-white max-w-sm hover:shadow-lg hover:shadow-gray-400/50 hover:scale-105 transition-all duration-300">
              <div className="flex items-start gap-4">
                <Heart className="w-8 h-8 text-gray-800 mt-1 transition-transform duration-300 hover:scale-110" />
                <div>
                  <h3 className="text-xl font-bold text-black">Feels Like You</h3>
                  <p className="text-gray-600 mt-2">
                    Tell us your mood—chill, adventurous, or curious—and we’ll find spots that feel just right.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 rounded-lg border border-gray-300 bg-white max-w-sm hover:shadow-lg hover:shadow-gray-400/50 hover:scale-105 transition-all duration-300">
              <div className="flex items-start gap-4">
                <MapPin className="w-8 h-8 text-gray-800 mt-1 transition-transform duration-300 hover:scale-110" />
                <div>
                  <h3 className="text-xl font-bold text-black">Close to Home</h3>
                  <p className="text-gray-600 mt-2">
                    Discover hidden gems just a short trip away, no matter where you are.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 rounded-lg border border-gray-300 bg-white max-w-sm hover:shadow-lg hover:shadow-gray-400/50 hover:scale-105 transition-all duration-300">
              <div className="flex items-start gap-4">
                <Sparkles className="w-8 h-8 text-gray-800 mt-1 transition-transform duration-300 hover:scale-110" />
                <div>
                  <h3 className="text-xl font-bold text-black">Made for You</h3>
                  <p className="text-gray-600 mt-2">
                    Get recommendations tailored to your unique style and preferences.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Closing CTA */}
      <div className="container mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl font-semibold text-black mb-6">
          Ready to Find Your Next Adventure?
        </h2>
        <Link href="/login">
          <Button className="px-8 py-4 text-xl bg-black text-white rounded-lg hover:bg-gray-800 hover:scale-105 transition-all duration-300">
            Let’s Go!
          </Button>
        </Link>
      </div>
    </div>
  );
}