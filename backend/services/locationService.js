// src/services/locationService.js

/**
 * Requests the user's current location.
 * This will automatically trigger the browser's native permission popup:
 * "Allow this site to access your location?"
 * 
 * @returns {Promise<{latitude: number, longitude: number}>}
 */
export const requestUserLocation = () => {
  return new Promise((resolve, reject) => {
    // Check if browser supports geolocation
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser."));
      return;
    }

    // This triggers the permission popup automatically
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        resolve({ latitude, longitude });
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            reject(
              new Error(
                "Permission denied. Please allow location access to use this feature."
              )
            );
            break;
          case error.POSITION_UNAVAILABLE:
            reject(new Error("Location information is unavailable."));
            break;
          case error.TIMEOUT:
            reject(new Error("The request to get location timed out."));
            break;
          default:
            reject(new Error("An unknown error occurred while fetching location."));
        }
      },
      {
        enableHighAccuracy: true, // use GPS if available
        timeout: 10000,           // 10s timeout
        maximumAge: 0,            // don't use cached position
      }
    );
  });
};