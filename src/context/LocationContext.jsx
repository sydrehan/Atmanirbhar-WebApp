import React, { createContext, useContext, useState, useEffect } from 'react';

const LocationContext = createContext();

export const useLocation = () => {
  return useContext(LocationContext);
};

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [permissionStatus, setPermissionStatus] = useState('prompt');

  const getLocation = () => {
    setLoading(true);
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
        setError(null);
        setLoading(false);
        setPermissionStatus('granted');
      },
      (err) => {
        let errorMsg = "Could not get your location.";
        switch(err.code) {
          case err.PERMISSION_DENIED:
            errorMsg = "Location permission denied. Please enable it in your browser settings.";
            setPermissionStatus('denied');
            break;
          case err.POSITION_UNAVAILABLE:
            errorMsg = "Location information is unavailable.";
            break;
          case err.TIMEOUT:
            errorMsg = "The request to get user location timed out.";
            break;
        }
        setError(errorMsg);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  useEffect(() => {
    getLocation();
  }, []);

  const value = {
    location,
    error,
    loading,
    permissionStatus,
    refreshLocation: getLocation
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};
