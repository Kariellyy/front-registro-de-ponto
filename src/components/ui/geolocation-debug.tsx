"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGeolocation } from "@/hooks/use-geolocation";
import { AlertCircle, CheckCircle, Info, XCircle } from "lucide-react";
import { useState } from "react";

export function GeolocationDebug() {
  const { getCurrentPosition, error, isLoading } = useGeolocation();
  const [diagnostic, setDiagnostic] = useState<any>(null);

  const runDiagnostic = async () => {
    const diagnostic = {
      userAgent: navigator.userAgent,
      protocol: window.location.protocol,
      hostname: window.location.hostname,
      geolocationSupported: !!navigator.geolocation,
      isSecure:
        window.location.protocol === "https:" ||
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1",
      timestamp: new Date().toISOString(),
    };

    setDiagnostic(diagnostic);

    try {
      const position = await getCurrentPosition({
        timeout: 10000,
        enableHighAccuracy: true,
        maximumAge: 0,
        retries: 1,
        minAccuracy: 1000, // 1km para teste
      });

      setDiagnostic((prev) => ({
        ...prev,
        success: true,
        position: {
          latitude: position.latitude,
          longitude: position.longitude,
          accuracy: position.accuracy,
        },
      }));
    } catch (err: any) {
      setDiagnostic((prev) => ({
        ...prev,
        success: false,
        error: {
          code: err.code,
          message: err.message,
        },
      }));
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="w-5 h-5" />
          Diagnóstico de Geolocalização
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={runDiagnostic} disabled={isLoading} className="w-full">
          {isLoading ? "Testando..." : "Executar Diagnóstico"}
        </Button>

        {diagnostic && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Informações do Navegador</h4>
                <div className="text-sm space-y-1">
                  <div>
                    <strong>Protocolo:</strong> {diagnostic.protocol}
                  </div>
                  <div>
                    <strong>Hostname:</strong> {diagnostic.hostname}
                  </div>
                  <div>
                    <strong>Geolocalização:</strong>
                    {diagnostic.geolocationSupported ? (
                      <CheckCircle className="w-4 h-4 text-green-500 inline ml-1" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500 inline ml-1" />
                    )}
                  </div>
                  <div>
                    <strong>HTTPS/Localhost:</strong>
                    {diagnostic.isSecure ? (
                      <CheckCircle className="w-4 h-4 text-green-500 inline ml-1" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500 inline ml-1" />
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Status do Teste</h4>
                <div className="text-sm space-y-1">
                  {diagnostic.success ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span>Geolocalização funcionando!</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-red-600">
                      <AlertCircle className="w-4 h-4" />
                      <span>Erro na geolocalização</span>
                    </div>
                  )}

                  {diagnostic.position && (
                    <div className="space-y-1">
                      <div>
                        <strong>Latitude:</strong>{" "}
                        {diagnostic.position.latitude}
                      </div>
                      <div>
                        <strong>Longitude:</strong>{" "}
                        {diagnostic.position.longitude}
                      </div>
                      <div>
                        <strong>Precisão:</strong>{" "}
                        {diagnostic.position.accuracy}m
                      </div>
                    </div>
                  )}

                  {diagnostic.error && (
                    <div className="text-red-600">
                      <div>
                        <strong>Erro:</strong> {diagnostic.error.message}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {!diagnostic.isSecure && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">
                      Problema de Segurança Detectado
                    </p>
                    <p className="text-sm text-yellow-700">
                      Geolocalização requer HTTPS ou localhost. Use "npm run
                      dev:https" ou acesse via localhost.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {diagnostic.error?.code === 1 && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-800">
                      Permissão Negada
                    </p>
                    <p className="text-sm text-red-700">
                      Verifique as permissões de localização no seu
                      navegador/celular.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
