'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Clock, 
  Star, 
  DollarSign, 
  Users, 
  Car, 
  Footprints, 
  Bike,
  Sparkles,
  RefreshCw,
  ArrowLeft,
  Heart,
  Share2
} from 'lucide-react';

interface Place {
  id: number;
  name: string;
  category: string;
  latitude?: number;
  longitude?: number;
  image: string;
  description?: string;
  googleMapsUrl?: string;
  uberLink?: string;
  distance?: string;
  time?: string;
  price?: string;
  rating?: number;
  finalScore?: number;
  matchReason?: string;
  baseScore?: number;
}

interface RecommendationData {
  success: boolean;
  recommendations: Place[];
  totalPlaces: number;
  userPreferences: any;
  generatedAt: string;
}

const Pages: React.FC = () => {
  const [recommendations, setRecommendations] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [userPreferences, setUserPreferences] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Get user preferences from localStorage
    const savedPreferences = localStorage.getItem('userPreferences');
    if (savedPreferences) {
      const preferences = JSON.parse(savedPreferences);
      setUserPreferences(preferences);
      fetchRecommendations(preferences);
    } else {
      // If no preferences, redirect to mood page
      router.push('/mood');
    }
  }, []);

  const fetchRecommendations = async (preferences: any) => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to fetch from backend API first
      try {
        const response = await fetch('http://localhost:8080/api/recommendations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(preferences),
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data.recommendations) {
            setRecommendations(data.data.recommendations);
            return;
          }
        }
      } catch (apiError) {
        console.log('Backend API not available, using fallback data:', apiError);
      }
      
      // Fallback to sample data if backend is not available
      const fallbackRecommendations = [
        {
          id: 1,
          name: "Marudhamalai Temple",
          category: "Temple",
          image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Marudhamalai_Temple_Coimbatore.jpg/800px-Marudhamalai_Temple_Coimbatore.jpg",
          description: "Ancient hilltop temple dedicated to Lord Murugan with panoramic views of Coimbatore.",
          distance: "15 km",
      rating: 4.5,
          finalScore: 95,
          matchReason: "Perfect for your spiritual and peaceful mood"
        },
        {
          id: 2,
          name: "Siruvani Waterfalls",
          category: "Sightseeing",
          image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Siruvani_Waterfalls.jpg/800px-Siruvani_Waterfalls.jpg",
          description: "Beautiful waterfall in the Western Ghats, perfect for nature lovers and photography.",
      distance: "45 km",
      rating: 4.7,
          finalScore: 88,
          matchReason: "Great for nature lovers and adventure seekers"
        },
        {
          id: 3,
          name: "VOC Park & Zoo",
      category: "Sightseeing",
          image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/VOC_Park_Coimbatore.jpg/800px-VOC_Park_Coimbatore.jpg",
          description: "Family-friendly park with zoo, botanical garden, and recreational facilities.",
          distance: "8 km",
      rating: 4.2,
          finalScore: 82,
          matchReason: "Perfect for family outings and relaxation"
        },
        {
          id: 4,
          name: "Isha Yoga Center",
      category: "Sightseeing",
          image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Isha_Yoga_Center_Coimbatore.jpg/800px-Isha_Yoga_Center_Coimbatore.jpg",
          description: "Spiritual center founded by Sadhguru, offering yoga programs and meditation.",
      distance: "25 km",
      rating: 4.8,
          finalScore: 90,
          matchReason: "Ideal for spiritual seekers and wellness enthusiasts"
        },
        {
          id: 5,
          name: "Perur Pateeswarar Temple",
          category: "Temple",
          image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Perur_Pateeswarar_Temple_Coimbatore.jpg/800px-Perur_Pateeswarar_Temple_Coimbatore.jpg",
          description: "Ancient temple dedicated to Lord Shiva, known for its architectural beauty.",
          distance: "12 km",
        rating: 4.3,
          finalScore: 85,
          matchReason: "Rich in history and cultural significance"
        },
        {
          id: 6,
          name: "Coimbatore Railway Museum",
        category: "Sightseeing",
          image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Coimbatore_Railway_Museum.jpg/800px-Coimbatore_Railway_Museum.jpg",
          description: "Museum showcasing the history of Indian Railways with vintage locomotives.",
          distance: "5 km",
          rating: 4.1,
          finalScore: 78,
          matchReason: "Great for history buffs and railway enthusiasts"
        }
      ];
      
      setRecommendations(fallbackRecommendations);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError('Failed to load recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (userPreferences) {
      setRefreshing(true);
      await fetchRecommendations(userPreferences);
      setRefreshing(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'temple': return '🛕';
      case 'sightseeing': return '🏛️';
      case 'adventure': return '🏔️';
      case 'cafe': return '☕';
      case 'restaurant': return '🍽️';
      case 'shopping': return '🛍️';
      default: return '📍';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'temple': return 'bg-orange-100 text-orange-800';
      case 'sightseeing': return 'bg-blue-100 text-blue-800';
      case 'adventure': return 'bg-green-100 text-green-800';
      case 'cafe': return 'bg-amber-100 text-amber-800';
      case 'restaurant': return 'bg-red-100 text-red-800';
      case 'shopping': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEnergyIcon = (energyLevel: string) => {
    switch (energyLevel) {
      case 'very_low': return '😴';
      case 'low': return '🛋️';
      case 'medium': return '🚶';
      case 'high': return '🏃';
      case 'very_high': return '🧗';
      default: return '⚡';
    }
  };

  const router = useRouter();

  if (loading) {
  return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-600" />
          <p className="text-lg text-gray-600">Finding your perfect spots...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => router.push('/mood')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Mood
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-yellow-500" />
                  Your Personalized Recommendations
                </h1>
                <p className="text-gray-600">Discover places that match your vibe perfectly</p>
              </div>
            </div>
            <Button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Get New Recommendations'}
            </Button>
          </div>
        </div>
      </div>

      {/* User Preferences Display */}
      {userPreferences && (
        <div className="bg-blue-50 border-b border-blue-200">
          <div className="container mx-auto px-6 py-4">
            <h3 className="text-sm font-semibold text-blue-800 mb-2">Based on your preferences:</h3>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-blue-100 text-blue-800">
                Mood: {userPreferences.mood} {getEnergyIcon(userPreferences.energyLevel)}
              </Badge>
              {userPreferences.interests?.map((interest: string) => (
                <Badge key={interest} className="bg-green-100 text-green-800">
                  {interest}
                </Badge>
              ))}
              <Badge className="bg-purple-100 text-purple-800">
                Energy: {userPreferences.energyLevel}
              </Badge>
              <Badge className="bg-orange-100 text-orange-800">
                Social: {userPreferences.socialMode}
              </Badge>
              {userPreferences.budget && (
                <Badge className="bg-yellow-100 text-yellow-800">
                  Budget: {userPreferences.budget}
                </Badge>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border-b border-red-200">
          <div className="container mx-auto px-6 py-4">
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Recommendations Grid */}
      <div className="container mx-auto px-6 py-8">
        {recommendations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600 mb-4">No recommendations found</p>
            <Button onClick={() => router.push('/mood')}>
              Try Different Preferences
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((place, index) => (
              <Card key={place.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div className="relative">
                  <img
                    src={place.image}
          alt={place.name}
                    className="w-full h-48 object-cover"
        />
                  <div className="absolute top-4 left-4">
                    <Badge className={`${getCategoryColor(place.category)} flex items-center gap-1`}>
                      <span>{getCategoryIcon(place.category)}</span>
          {place.category}
                    </Badge>
        </div>
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-white/90 text-gray-800">
                      #{index + 1}
                    </Badge>
        </div>
      </div>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900 line-clamp-2">
                      {place.name}
                    </h3>
                    <div className="flex items-center gap-1 ml-2">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium text-gray-700">
                        {place.rating || 'N/A'}
                      </span>
          </div>
        </div>

                  {place.matchReason && (
                    <p className="text-sm text-blue-600 mb-3 font-medium">
                      {place.matchReason}
                    </p>
                  )}
                  
                  {place.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {place.description}
                    </p>
                  )}
                  
                  <div className="space-y-2 mb-4">
                    {place.distance && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{place.distance}</span>
          </div>
                    )}
                    {place.time && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{place.time}</span>
        </div>
                    )}
                    {place.price && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <DollarSign className="w-4 h-4" />
                        <span>{place.price}</span>
          </div>
                    )}
        </div>
                  
                  {place.finalScore && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Match Score:</span>
                        <span className="font-semibold text-green-600">
                          {Math.round(place.finalScore)}%
                        </span>
      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(place.finalScore, 100)}%` }}
                        ></div>
    </div>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    {place.googleMapsUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(place.googleMapsUrl, '_blank')}
                        className="flex-1"
                      >
                        <MapPin className="w-4 h-4 mr-2" />
                        View Map
                      </Button>
                    )}
                    {place.uberLink && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(place.uberLink, '_blank')}
                        className="flex-1"
                      >
                        <Car className="w-4 h-4 mr-2" />
                        Get Ride
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
        ))}
      </div>
        )}
    </div>

      {/* Footer */}
      <div className="bg-gray-800 text-white py-8 mt-12">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-300">
            &copy; 2025 NearbyNomad. Discover your perfect adventure! 🌟
          </p>
        </div>
      </div>
    </div>
  );
};

export default Pages;