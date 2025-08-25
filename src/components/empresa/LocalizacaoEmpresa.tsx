"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, MapPin, Navigation } from "lucide-react";
import { useState } from "react";
import GoogleMapsSelector from "./GoogleMapsSelector";

interface LocalizacaoEmpresaProps {
  endereco?: string;
  latitude?: number | null;
  longitude?: number | null;
  isLoading?: boolean;
  onLocationSelect: (location: {
    address: string;
    lat: number;
    lng: number;
  }) => void;
}

export function LocalizacaoEmpresa({
  endereco,
  latitude,
  longitude,
  isLoading = false,
  onLocationSelect,
}: LocalizacaoEmpresaProps) {
  const [showMap, setShowMap] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [tempLocation, setTempLocation] = useState<{
    address: string;
    lat: number;
    lng: number;
  } | null>(null);

  const hasLocation =
    endereco &&
    latitude !== null &&
    latitude !== undefined &&
    longitude !== null &&
    longitude !== undefined;

  const handleRedefineLocation = () => {
    setShowMap(true);
    setIsEditing(true);
    // Inicializar com a localização atual se existir
    if (
      endereco &&
      latitude !== null &&
      latitude !== undefined &&
      longitude !== null &&
      longitude !== undefined
    ) {
      setTempLocation({
        address: endereco,
        lat: Number(latitude),
        lng: Number(longitude),
      });
    } else {
      // Se não há localização inicial, limpar tempLocation
      setTempLocation(null);
    }
  };

  const handleLocationSelect = (location: {
    address: string;
    lat: number;
    lng: number;
  }) => {
    // Armazena a localização temporariamente
    setTempLocation(location);
    // Não fechar o mapa automaticamente
  };

  const handleSaveLocation = () => {
    // Salvar a localização temporária
    if (tempLocation) {
      onLocationSelect(tempLocation);
    }
    setShowMap(false);
    setIsEditing(false);
    setTempLocation(null);
  };

  const handleCancelEdit = () => {
    setShowMap(false);
    setIsEditing(false);
    setTempLocation(null);
  };

  if (showMap) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            {isEditing ? "Redefinir Localização" : "Definir Localização"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <GoogleMapsSelector
            onLocationSelect={handleLocationSelect}
            initialLocation={
              tempLocation
                ? { lat: tempLocation.lat, lng: tempLocation.lng }
                : latitude !== null &&
                  latitude !== undefined &&
                  longitude !== null &&
                  longitude !== undefined
                ? { lat: Number(latitude), lng: Number(longitude) }
                : undefined
            }
            initialAddress={tempLocation?.address || endereco}
          />
          <div className="space-y-4">
            {tempLocation && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-800 mb-1">
                      Nova Localização Selecionada
                    </p>
                    <p className="text-sm text-blue-700">
                      {tempLocation.address}
                    </p>
                    <p className="text-xs text-blue-600">
                      Latitude: {tempLocation.lat.toFixed(6)} | Longitude:{" "}
                      {tempLocation.lng.toFixed(6)}
                    </p>
                  </div>
                </div>
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleCancelEdit}>
                Cancelar
              </Button>
              <Button onClick={handleSaveLocation} disabled={!tempLocation}>
                Salvar Localização
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Localização da Empresa
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <Skeleton className="w-5 h-5 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
                <Skeleton className="h-3 w-36" />
              </div>
            </div>
            <Skeleton className="h-10 w-40" />
          </div>
        ) : hasLocation ? (
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-800 mb-2">
                  Localização Definida
                </p>
                <div className="space-y-1">
                  <p className="text-sm text-green-700 font-medium">
                    {endereco}
                  </p>
                  <p className="text-xs text-green-600">
                    Latitude:{" "}
                    {latitude !== null && latitude !== undefined
                      ? Number(latitude).toFixed(6)
                      : "N/A"}{" "}
                    | Longitude:{" "}
                    {longitude !== null && longitude !== undefined
                      ? Number(longitude).toFixed(6)
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={handleRedefineLocation}
              className="flex items-center gap-2"
            >
              <Navigation className="w-4 h-4" />
              Redefinir Localização
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <MapPin className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-yellow-800 mb-1">
                  Localização Não Definida
                </p>
                <p className="text-sm text-yellow-700">
                  Defina a localização da empresa para permitir o registro de
                  ponto com geolocalização.
                </p>
              </div>
            </div>

            <Button
              onClick={() => {
                setShowMap(true);
                setIsEditing(false);
                setTempLocation(null);
              }}
              className="flex items-center gap-2"
            >
              <MapPin className="w-4 h-4" />
              Definir Localização
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
