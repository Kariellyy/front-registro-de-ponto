import { useCallback, useState } from "react";

export interface GeolocationPosition {
  latitude: number;
  longitude: number;
  accuracy: number;
}

export interface GeolocationError {
  code: number;
  message: string;
}

export function useGeolocation() {
  const [position, setPosition] = useState<GeolocationPosition | null>(null);
  const [error, setError] = useState<GeolocationError | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getCurrentPosition = useCallback((): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        const error = {
          code: 0,
          message: "Geolocalização não é suportada por este navegador",
        };
        setError(error);
        reject(error);
        return;
      }

      setIsLoading(true);
      setError(null);

      const options: PositionOptions = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000, // Cache por 1 minuto
      };

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const position = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
          };

          setPosition(position);
          setIsLoading(false);
          resolve(position);
        },
        (err) => {
          const error = {
            code: err.code,
            message: getErrorMessage(err.code),
          };

          setError(error);
          setIsLoading(false);
          reject(error);
        },
        options
      );
    });
  }, []);

  const clearPosition = useCallback(() => {
    setPosition(null);
    setError(null);
  }, []);

  return {
    position,
    error,
    isLoading,
    getCurrentPosition,
    clearPosition,
  };
}

function getErrorMessage(code: number): string {
  switch (code) {
    case 1:
      return "Permissão de localização negada. Por favor, permita o acesso à localização.";
    case 2:
      return "Localização indisponível. Verifique sua conexão e tente novamente.";
    case 3:
      return "Tempo limite esgotado ao tentar obter a localização.";
    default:
      return "Erro desconhecido ao obter a localização.";
  }
}
