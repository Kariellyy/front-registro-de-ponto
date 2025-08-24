"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Autocomplete,
  GoogleMap,
  LoadScript,
  Marker,
} from "@react-google-maps/api";
import { MapPin, Search } from "lucide-react";
import { useCallback, useRef, useState } from "react";

const libraries: "places"[] = ["places"];

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
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(
    initialLocation || null
  );
  const [searchValue, setSearchValue] = useState(initialAddress || "");
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

        setMarker(location);
        setSearchValue(place.formatted_address || place.name || "");

        if (map) {
          map.panTo(location);
          map.setZoom(17);
        }

        onLocationSelect({
          address: place.formatted_address || place.name || "",
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
          onLocationSelect({
            address,
            lat: location.lat,
            lng: location.lng,
          });
        } else {
          onLocationSelect({
            address: `${location.lat}, ${location.lng}`,
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

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className="p-4 border border-destructive/20 rounded-md bg-destructive/10">
        <p className="text-destructive text-sm">
          Chave da API do Google Maps não configurada. Configure
          NEXT_PUBLIC_GOOGLE_MAPS_API_KEY no arquivo .env
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <LoadScript googleMapsApiKey={apiKey} libraries={libraries}>
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
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Digite o endereço ou nome do local"
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
              <MapPin className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Mapa */}
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

        <p className="text-xs text-muted-foreground">
          Clique no mapa ou arraste o marcador para selecionar a localização
          exata da empresa
        </p>
      </LoadScript>
    </div>
  );
}
