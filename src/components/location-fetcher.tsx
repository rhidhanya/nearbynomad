"use client";

import { useEffect, useState, useCallback } from "react";

type GeoPosition = {
  latitude: number;
  longitude: number;
};

type LocationFetcherProps = {
  onLocation: (pos: GeoPosition) => void;
  onError?: (message: string) => void;
  children?: (state: {
    loading: boolean;
    error: string | null;
    position: GeoPosition | null;
    requestPermission: () => void;
  }) => React.ReactNode;
};

export default function LocationFetcher({ onLocation, onError, children }: LocationFetcherProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [position, setPosition] = useState<GeoPosition | null>(null);

  const handleSuccess = useCallback(
    (pos: GeolocationPosition) => {
      const coords = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
      setPosition(coords);
      setLoading(false);
      setError(null);
      onLocation(coords);
    },
    [onLocation]
  );

  const handleError = useCallback(
    (err: GeolocationPositionError) => {
      let message = "Unable to retrieve your location.";
      if (err.code === err.PERMISSION_DENIED) {
        message = "Location access denied. Please enable location to get nearby recommendations.";
      } else if (err.code === err.POSITION_UNAVAILABLE) {
        message = "Location information is unavailable.";
      } else if (err.code === err.TIMEOUT) {
        message = "The request to get your location timed out.";
      }
      setError(message);
      setLoading(false);
      onError?.(message);
    },
    [onError]
  );

  const requestPermission = useCallback(() => {
    if (!navigator.geolocation) {
      const msg = "Geolocation is not supported by your browser.";
      setError(msg);
      setLoading(false);
      onError?.(msg);
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    });
  }, [handleError, handleSuccess]);

  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  if (typeof children === "function") {
    return <>{children({ loading, error, position, requestPermission })}</>;
  }
  return null;
}


