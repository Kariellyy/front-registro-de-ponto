"use client";

import { LoadScript } from "@react-google-maps/api";
import { createContext, ReactNode, useContext } from "react";

const libraries: "places"[] = ["places"];

interface GoogleMapsContextType {
  isLoaded: boolean;
}

const GoogleMapsContext = createContext<GoogleMapsContextType>({
  isLoaded: false,
});

interface GoogleMapsProviderProps {
  children: ReactNode;
  apiKey?: string;
}

export function GoogleMapsProvider({
  children,
  apiKey,
}: GoogleMapsProviderProps) {
  if (!apiKey) {
    return (
      <GoogleMapsContext.Provider value={{ isLoaded: false }}>
        {children}
      </GoogleMapsContext.Provider>
    );
  }

  return (
    <LoadScript googleMapsApiKey={apiKey} libraries={libraries}>
      <GoogleMapsContext.Provider value={{ isLoaded: true }}>
        {children}
      </GoogleMapsContext.Provider>
    </LoadScript>
  );
}

export const useGoogleMaps = () => {
  const context = useContext(GoogleMapsContext);
  if (context === undefined) {
    throw new Error("useGoogleMaps must be used within a GoogleMapsProvider");
  }
  return context;
};
