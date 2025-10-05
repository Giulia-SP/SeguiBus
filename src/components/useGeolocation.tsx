import { useState, useEffect } from 'react';

interface GeolocationState {
  lat: number;
  lng: number;
}

interface GeolocationResult {
  location: GeolocationState | null;
  loading: boolean;
  error: string | null;
}

export const useGeolocation = (): GeolocationResult => {
  const [location, setLocation] = useState<GeolocationState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocalização não é suportada pelo seu navegador.');
      setLoading(false);
      return;
    }

    const handleSuccess = (position: GeolocationPosition) => {
      setLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
      setLoading(false);
      setError(null);
    };

    const handleError = (error: GeolocationPositionError) => {
      let errorMessage = 'Ocorreu um erro desconhecido.';
      switch(error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = "Você negou o pedido de Geolocalização.";
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = "A informação de localização não está disponível.";
          break;
        case error.TIMEOUT:
          errorMessage = "O pedido para obter a localização do usuário expirou.";
          break;
      }
      setError(errorMessage);
      setLoading(false);
    };

    const watchId = navigator.geolocation.watchPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    });

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return { location, loading, error };
};