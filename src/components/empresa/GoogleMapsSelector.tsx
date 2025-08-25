"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGoogleMaps } from "@/contexts/GoogleMapsContext";
import { Autocomplete, GoogleMap, Marker } from "@react-google-maps/api";
import { CheckCircle, Info, MapPin, Navigation, Search } from "lucide-react";
import { useCallback, useRef, useState } from "react";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const defaultCenter = {
  lat: -23.5505,
  lng: -46.6333, // São Paulo
};

interface GoogleMapsSelectorProps {
  onLocationSelect: (location: {
    address: string;
    lat: number;
    lng: number;
  }) => void;
  initialLocation?: { lat: number; lng: number };
  initialAddress?: string;
}

export default function GoogleMapsSelector({
  onLocationSelect,
  initialLocation,
  initialAddress,
}: GoogleMapsSelectorProps) {
  const { isLoaded } = useGoogleMaps();
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(
    initialLocation || null
  );
  const [searchValue, setSearchValue] = useState(initialAddress || "");
  const [selectedAddress, setSelectedAddress] = useState(initialAddress || "");
  const [isAddressConfirmed, setIsAddressConfirmed] = useState(
    !!initialAddress
  );
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);

    // Configurar opções avançadas do mapa após carregamento
    map.setOptions({
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: google.maps.ControlPosition.TOP_CENTER,
        mapTypeIds: [
          google.maps.MapTypeId.ROADMAP,
          google.maps.MapTypeId.SATELLITE,
          google.maps.MapTypeId.HYBRID,
        ],
      },
    });
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const onAutocompleteLoad = (
    autocompleteInstance: google.maps.places.Autocomplete
  ) => {
    setAutocomplete(autocompleteInstance);
  };

  const onPlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();

      if (place.geometry && place.geometry.location) {
        const location = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };

        const address = place.formatted_address || place.name || "";

        setMarker(location);
        setSearchValue(address);
        setSelectedAddress(address);
        setIsAddressConfirmed(true);

        if (map) {
          map.panTo(location);
          map.setZoom(17);
        }

        onLocationSelect({
          address,
          lat: location.lat,
          lng: location.lng,
        });
      }
    }
  };

  const onMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const location = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };

      setMarker(location);

      // Reverse geocoding para obter o endereço
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location }, (results, status) => {
        if (status === "OK" && results && results[0]) {
          const address = results[0].formatted_address;
          setSearchValue(address);
          setSelectedAddress(address);
          setIsAddressConfirmed(true);
          onLocationSelect({
            address,
            lat: location.lat,
            lng: location.lng,
          });
        } else {
          const coordinateAddress = `${location.lat}, ${location.lng}`;
          setSearchValue(coordinateAddress);
          setSelectedAddress(coordinateAddress);
          setIsAddressConfirmed(true);
          onLocationSelect({
            address: coordinateAddress,
            lat: location.lat,
            lng: location.lng,
          });
        }
      });
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          setMarker(location);

          if (map) {
            map.panTo(location);
            map.setZoom(17);
          }

          // Reverse geocoding para obter o endereço
          const geocoder = new google.maps.Geocoder();
          geocoder.geocode({ location }, (results, status) => {
            if (status === "OK" && results && results[0]) {
              const address = results[0].formatted_address;
              setSearchValue(address);
              setSelectedAddress(address);
              setIsAddressConfirmed(true);
              onLocationSelect({
                address,
                lat: location.lat,
                lng: location.lng,
              });
            }
          });
        },
        (error) => {
          console.error("Erro ao obter localização:", error);
        }
      );
    }
  };

  if (!isLoaded) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Localização da Empresa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Carregando Google Maps...</p>
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
      <CardContent className="space-y-4">
        {/* Instruções */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Busque o endereço da empresa ou clique diretamente no mapa para
            definir a localização exata.
          </AlertDescription>
        </Alert>

        {/* Campo de busca */}
        <div className="space-y-2">
          <Label htmlFor="endereco-busca">Buscar Endereço</Label>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Autocomplete
                onLoad={onAutocompleteLoad}
                onPlaceChanged={onPlaceChanged}
                options={{
                  componentRestrictions: { country: "br" },
                  fields: ["formatted_address", "geometry", "name"],
                }}
              >
                <Input
                  ref={searchInputRef}
                  id="endereco-busca"
                  value={searchValue}
                  onChange={(e) => {
                    setSearchValue(e.target.value);
                    setIsAddressConfirmed(false);
                  }}
                  placeholder="Digite o nome da empresa, rua ou bairro..."
                  className="pl-10"
                />
              </Autocomplete>
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={getCurrentLocation}
              title="Usar minha localização atual"
            >
              <Navigation className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Endereço Selecionado */}
        {isAddressConfirmed && selectedAddress && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-800">
                  Endereço Selecionado:
                </p>
                <p className="text-sm text-green-700">{selectedAddress}</p>
              </div>
            </div>
          </div>
        )}

        {/* Mapa */}
        <div className="space-y-2">
          <Label>Mapa Interativo</Label>
          <div className="border rounded-lg overflow-hidden">
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={marker || defaultCenter}
              zoom={marker ? 17 : 12}
              onLoad={onLoad}
              onUnmount={onUnmount}
              onClick={onMapClick}
              options={{
                zoomControl: true,
                streetViewControl: false,
                mapTypeControl: true,
                fullscreenControl: true,
              }}
            >
              {marker && (
                <Marker
                  position={marker}
                  draggable={true}
                  onDragEnd={(event) => {
                    if (event.latLng) {
                      const location = {
                        lat: event.latLng.lat(),
                        lng: event.latLng.lng(),
                      };

                      setMarker(location);

                      // Reverse geocoding
                      const geocoder = new google.maps.Geocoder();
                      geocoder.geocode({ location }, (results, status) => {
                        if (status === "OK" && results && results[0]) {
                          const address = results[0].formatted_address;
                          setSearchValue(address);
                          setSelectedAddress(address);
                          setIsAddressConfirmed(true);
                          onLocationSelect({
                            address,
                            lat: location.lat,
                            lng: location.lng,
                          });
                        }
                      });
                    }
                  }}
                />
              )}
            </GoogleMap>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Info className="w-3 h-3" />
            <span>
              Clique no mapa ou arraste o marcador para ajustar a posição
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
