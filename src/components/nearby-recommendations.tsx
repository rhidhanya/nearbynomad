"use client";

import { useMemo } from "react";
import places from "@/data/places.json";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { MapPin } from "lucide-react";

type GeoPosition = { latitude: number; longitude: number };

type Place = {
  id: number;
  name: string;
  category: string;
  latitude: number;
  longitude: number;
  image: string;
  description: string;
  googleMapsUrl: string;
  uberLink: string;
};

function toRad(value: number) {
  return (value * Math.PI) / 180;
}

function haversineDistanceKm(a: GeoPosition, b: GeoPosition): number {
  const R = 6371; // km
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);

  const sinDLat = Math.sin(dLat / 2);
  const sinDLon = Math.sin(dLon / 2);
  const h = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLon * sinDLon;
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  return R * c;
}

type NearbyRecommendationsProps = {
  userPosition: GeoPosition | null;
  radiusKm?: number;
  onSelectPlace?: (place: Place & { distanceKm: number }) => void;
  allowedCategories?: string[] | null;
  onResultsChange?: (places: Array<Place & { distanceKm: number }>) => void;
};

export default function NearbyRecommendations({ userPosition, radiusKm = 50, onSelectPlace, allowedCategories, onResultsChange }: NearbyRecommendationsProps) {
  const results = useMemo(() => {
    if (!userPosition) return [] as Array<Place & { distanceKm: number }>;
    const pool = (places as Place[]).filter((p) => {
      if (!allowedCategories || allowedCategories.length === 0) return true;
      return allowedCategories.includes(p.category);
    });
    const enriched = pool.map((p) => ({
      ...p,
      distanceKm: haversineDistanceKm(userPosition, { latitude: p.latitude, longitude: p.longitude }),
    }));
    return enriched
      .filter((p) => p.distanceKm <= radiusKm)
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [userPosition, radiusKm, allowedCategories]);

  // Emit results to parent for map markers
  if (onResultsChange) {
    onResultsChange(results);
  }

  if (!userPosition) {
    return (
      <div className="text-center text-sm text-gray-600">
        Allow location access to see nearby recommendations.
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center text-sm text-gray-700">
        No nearby recommendations found. Try expanding your search radius.
      </div>
    );
  }

  const openUberDeepLink = async (destLat: number, destLng: number) => {
    if (!userPosition) return;
    const pickupLat = userPosition.latitude;
    const pickupLng = userPosition.longitude;
    const deepLink = `https://m.uber.com/ul/?action=setPickup&pickup[latitude]=${pickupLat}&pickup[longitude]=${pickupLng}&dropoff[latitude]=${destLat}&dropoff[longitude]=${destLng}`;
    window.open(deepLink, "_blank");
  };

  const openGoogleMaps = (destLat: number, destLng: number) => {
    if (!userPosition) return;
    const origin = `${userPosition.latitude},${userPosition.longitude}`;
    const destination = `${destLat},${destLng}`;
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`;
    window.open(url, "_blank");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {results.map((place) => (
        <Card key={place.id} className="overflow-hidden rounded-lg border border-gray-300 bg-white shadow-lg hover:shadow-xl transition-all duration-300 group">
          <div className="relative h-48 overflow-hidden">
            <img src={place.image} alt={place.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
            <div className="absolute top-3 left-3 rounded-lg bg-gray-800 text-white px-3 py-1 shadow-md text-xs">{place.category}</div>
          </div>
          <div className="p-5 space-y-4">
            <div>
              <h3 className="text-lg font-bold text-black mb-1">{place.name}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{place.description}</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <MapPin className="w-4 h-4 text-gray-800" />
              <span>{place.distanceKm.toFixed(1)} km away</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button onClick={() => openGoogleMaps(place.latitude, place.longitude)} className="rounded-lg py-3 border-2 border-gray-300 bg-white hover:bg-gray-200 text-gray-800" variant="outline">
                View on Map
              </Button>
              <Button onClick={() => openUberDeepLink(place.latitude, place.longitude)} className="rounded-lg py-3 bg-black text-white hover:bg-gray-800">
                Book Uber
              </Button>
            </div>
            <div className="flex items-center justify-between">
              {onSelectPlace && (
                <Link href="#" onClick={(e) => { e.preventDefault(); onSelectPlace(place); }} className="text-xs text-gray-600 underline">
                  Show on map
                </Link>
              )}
              <Link href={`/place/${place.id}`} className="text-xs text-gray-800 underline">
                Open details
              </Link>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

export { haversineDistanceKm };


