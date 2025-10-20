'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, Clock, Star, DollarSign, Car, RefreshCw, ArrowLeft, Heart as HeartIcon, 
  PartyPopper, Bed, Flower2, Frown, Sparkles, Compass, Coffee, Utensils, Mountain, Zap, User
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
  distance?: string;
  time?: string;
  price?: string;
  rating?: number;
  matchReason?: string;
}

const Pages: React.FC = () => {
  const [recommendations, setRecommendations] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [userPreferences, setUserPreferences] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const savedPreferences = localStorage.getItem('userPreferences');
    if (savedPreferences) {
      const preferences = JSON.parse(savedPreferences);
      setUserPreferences(preferences);
      fetchRecommendations(preferences);
    } else {
      router.push('/mood');
    }
  }, []);

  const fetchRecommendations = async (preferences: any) => {
    try {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('http://localhost:8080/api/recommendations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
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

      const fallbackRecommendations: Place[] = [
        {
          id: 1,
          name: "Marudhamalai Temple",
          category: "Temple",
          latitude: 11.044,
          longitude: 76.863,
          image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Marudhamalai_Temple_Coimbatore.jpg/800px-Marudhamalai_Temple_Coimbatore.jpg",
          description: "Ancient hilltop temple dedicated to Lord Murugan with panoramic views of Coimbatore.",
          distance: "15 km",
          rating: 4.5,
          matchReason: "Perfect for your spiritual and peaceful mood",
          googleMapsUrl: "https://www.google.com/maps/dir/?api=1&destination=11.044,76.863"
        },
        {
          id: 2,
          name: "Siruvani Waterfalls",
          category: "Sightseeing",
          latitude: 10.938,
          longitude: 76.687,
          image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Siruvani_Waterfalls.jpg/800px-Siruvani_Waterfalls.jpg",
          description: "Beautiful waterfall in the Western Ghats, perfect for nature lovers and photography.",
          distance: "45 km",
          rating: 4.7,
          matchReason: "Great for nature lovers and adventure seekers",
          googleMapsUrl: "https://www.google.com/maps/dir/?api=1&destination=10.938,76.687"
        },
        // Add more fallback places as needed
      ];

      setRecommendations(fallbackRecommendations);
    } catch (err) {
      console.error(err);
      setError('Failed to load recommendations.');
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

  const handleUberClick = (place: Place) => {
    if (place.latitude && place.longitude) {
      const lat = place.latitude;
      const lng = place.longitude;
      const formattedAddress = encodeURIComponent(place.name); // Use place name as address label
  
      const uberDeepLink = `https://m.uber.com/?action=setPickup&pickup=my_location&dropoff[latitude]=${lat}&dropoff[longitude]=${lng}&dropoff[formatted_address]=${formattedAddress}`;
  
      window.open(uberDeepLink, '_blank');
    } else {
      window.open('https://m.uber.com', '_blank');
    }
  };
  

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'temple': return <HeartIcon className="w-4 h-4" />;
      case 'sightseeing': return <MapPin className="w-4 h-4" />;
      case 'adventure': return <Mountain className="w-4 h-4" />;
      case 'cafe': return <Coffee className="w-4 h-4" />;
      case 'restaurant': return <Utensils className="w-4 h-4" />;
      case 'shopping': return <Zap className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
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

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case 'happy': return <PartyPopper className="w-4 h-4" />;
      case 'tired': return <Bed className="w-4 h-4" />;
      case 'calm': return <Flower2 className="w-4 h-4" />;
      case 'romantic': return <HeartIcon className="w-4 h-4" />;
      case 'sad': return <Frown className="w-4 h-4" />;
      case 'excited': return <Sparkles className="w-4 h-4" />;
      default: return <Zap className="w-4 h-4" />;
    }
  };

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
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="container mx-auto max-w-6xl space-y-8">

        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Compass className="w-8 h-8 text-gray-800 transition-transform duration-300 hover:rotate-12" />
              <h1 className="text-4xl font-bold text-black tracking-tight">Your Perfect Spots</h1>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/profile')}
              className="p-2 rounded-full hover:bg-gray-200"
            >
              <User className="w-6 h-6 text-gray-800" />
            </Button>
          </div>
          <p className="text-lg text-gray-600 leading-relaxed text-center">
            Discover places that match your vibe perfectly
          </p>
        </div>

        {/* User Preferences Display */}
        {userPreferences && (
          <Card className="p-8 rounded-lg border border-gray-300 bg-white shadow-lg">
            <h3 className="text-xl font-semibold text-black mb-4 flex items-center gap-2">
              <HeartIcon className="w-6 h-6 text-gray-800" />
              Based on your preferences
            </h3>
            <div className="flex flex-wrap gap-3">
              <Badge className="bg-gray-200 text-gray-800 flex items-center gap-2">
                {getMoodIcon(userPreferences.mood)}
                Mood: {userPreferences.mood}
              </Badge>
              {userPreferences.interests?.map((interest: string) => (
                <Badge key={interest} className="bg-gray-200 text-gray-800">
                  {interest}
                </Badge>
              ))}
              <Badge className="bg-gray-200 text-gray-800">
                Energy: {userPreferences.energyLevel}
              </Badge>
              <Badge className="bg-gray-200 text-gray-800">
                Social: {userPreferences.socialMode}
              </Badge>
              {userPreferences.budget && (
                <Badge className="bg-gray-200 text-gray-800">
                  Budget: {userPreferences.budget}
                </Badge>
              )}
            </div>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => router.push('/mood')}
            variant="outline"
            className="flex items-center gap-2 px-6 py-3 text-lg border-2 border-gray-600 text-gray-800 rounded-lg hover:bg-gray-200 hover:scale-105 transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Mood
          </Button>
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-6 py-3 text-lg bg-black text-white rounded-lg hover:bg-gray-800 hover:scale-105 transition-all duration-300"
          >
            <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Get New Recommendations'}
          </Button>
        </div>

        {/* Recommendations Grid */}
        {recommendations.length === 0 ? (
          <Card className="p-12 rounded-lg border border-gray-300 bg-white shadow-lg text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mx-auto">
                <MapPin className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="text-xl font-semibold text-black">No recommendations found</h3>
              <p className="text-gray-600">Try updating your preferences to find more places</p>
              <Button onClick={() => router.push('/mood')} className="mt-4 bg-black text-white hover:bg-gray-800">
                Update Preferences
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((place, index) => (
              <Card key={place.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 rounded-lg border border-gray-300 bg-white shadow-lg">
                <div className="relative">
                  <img src={place.image} alt={place.name} className="w-full h-48 object-cover" />
                  <div className="absolute top-4 left-4">
                    <Badge className={`${getCategoryColor(place.category)} flex items-center gap-1`}>
                      {getCategoryIcon(place.category)}
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
                    <h3 className="text-xl font-bold text-gray-900 line-clamp-2">{place.name}</h3>
                    <div className="flex items-center gap-1 ml-2">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium text-gray-700">{place.rating || 'N/A'}</span>
                    </div>
                  </div>

                  {place.matchReason && (
                    <p className="text-sm text-gray-600 mb-3 font-medium">{place.matchReason}</p>
                  )}
                  
                  {place.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{place.description}</p>
                  )}
                  
                  <div className="space-y-2 mb-6">
                    {place.distance && <div className="flex items-center gap-2 text-sm text-gray-600"><MapPin className="w-4 h-4" /><span>{place.distance}</span></div>}
                    {place.time && <div className="flex items-center gap-2 text-sm text-gray-600"><Clock className="w-4 h-4" /><span>{place.time}</span></div>}
                    {place.price && <div className="flex items-center gap-2 text-sm text-gray-600"><DollarSign className="w-4 h-4" /><span>{place.price}</span></div>}
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button variant="outline" size="sm" onClick={() => place.googleMapsUrl && window.open(place.googleMapsUrl, '_blank')} className="flex-1">
                      <MapPin className="w-4 h-4 mr-2" />View Map
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleUberClick(place)} className="flex-1">
                      <Car className="w-4 h-4 mr-2" />Uber
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="text-center py-8">
          <p className="text-gray-500">&copy; 2025 NearbyNomad. Discover your perfect adventure! 🌟</p>
        </div>
      </div>
    </div>
  );
};

export default Pages;
