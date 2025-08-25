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

  const getCurrentPosition = useCallback(
    (options?: {
      timeout?: number;
      enableHighAccuracy?: boolean;
      maximumAge?: number;
      retries?: number;
      minAccuracy?: number;
    }): Promise<GeolocationPosition> => {
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

        // Verificar se estamos em HTTPS ou localhost
        const isSecure =
          window.location.protocol === "https:" ||
          window.location.hostname === "localhost" ||
          window.location.hostname === "127.0.0.1";

        if (!isSecure) {
          const error = {
            code: 0,
            message:
              "Geolocalização requer HTTPS ou localhost. Use 'https://' ou acesse via localhost.",
          };
          setError(error);
          reject(error);
          return;
        }

        const {
          timeout = 15000,
          enableHighAccuracy = true,
          maximumAge = 30000, // 30 segundos
          retries = 2,
          minAccuracy = 100, // 100 metros
        } = options || {};

        setIsLoading(true);
        setError(null);

        let attempts = 0;

        const tryGetPosition = () => {
          attempts++;

          const positionOptions: PositionOptions = {
            enableHighAccuracy,
            timeout,
            maximumAge,
          };

          navigator.geolocation.getCurrentPosition(
            (pos) => {
              const position = {
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude,
                accuracy: pos.coords.accuracy,
              };

              // Verificar se a precisão é suficiente
              if (position.accuracy > minAccuracy && attempts < retries) {
                console.warn(
                  `Precisão baixa (${position.accuracy}m). Tentando novamente...`
                );
                setTimeout(tryGetPosition, 1000);
                return;
              }

              setPosition(position);
              setIsLoading(false);
              resolve(position);
            },
            (err) => {
              const error = {
                code: err.code,
                message: getErrorMessage(err.code),
              };

              // Tentar novamente se ainda há tentativas
              if (attempts < retries) {
                console.warn(
                  `Tentativa ${attempts} falhou. Tentando novamente...`
                );
                setTimeout(tryGetPosition, 1000);
                return;
              }

              setError(error);
              setIsLoading(false);
              reject(error);
            },
            positionOptions
          );
        };

        tryGetPosition();
      });
    },
    []
  );

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
      return "Permissão de localização negada. Verifique:\n1. Configurações do navegador\n2. Se está usando HTTPS ou localhost\n3. Permissões do site no celular";
    case 2:
      return "Localização indisponível. Verifique:\n1. Conexão com a internet\n2. GPS ativado no celular\n3. Se está em área com sinal";
    case 3:
      return "Tempo limite esgotado. Verifique:\n1. Conexão com a internet\n2. GPS ativado\n3. Tente novamente em área aberta";
    default:
      return "Erro desconhecido ao obter a localização. Tente novamente.";
  }
}
