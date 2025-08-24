"use client";

import GoogleMapsSelector from "@/components/empresa/GoogleMapsSelector";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/contexts/AuthContext";
import { useFormattedInput } from "@/hooks/use-formatted-input";
import { Building, MapPin, Save } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface EmpresaForm {
  nome: string;
  cnpj: string;
  email: string;
  telefone: string;
  endereco: string;
  latitude?: number;
  longitude?: number;
  raioPermitido: number;
}

export default function ConfiguracoesPage() {
  const { empresa, refreshUser } = useAuth();
  const { data: session } = useSession();
  const toast = useToast();
  const cnpjInput = useFormattedInput();
  const telefoneInput = useFormattedInput();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<EmpresaForm>({
    nome: "",
    cnpj: "",
    email: "",
    telefone: "",
    endereco: "",
    latitude: undefined,
    longitude: undefined,
    raioPermitido: 100,
  });

  // Carregar dados da empresa quando disponível
  useEffect(() => {
    if (empresa) {
      setFormData({
        nome: empresa.name || "",
        cnpj: empresa.cnpj || "",
        email: empresa.email || "",
        telefone: empresa.telefone || "",
        endereco: "", // Será preenchido pela API
        latitude: undefined,
        longitude: undefined,
        raioPermitido: 100,
      });

      // Configurar CNPJ formatado
      if (empresa.cnpj) {
        cnpjInput.setValue(formatCNPJ(empresa.cnpj));
      }

      // Configurar telefone formatado
      if (empresa.telefone) {
        telefoneInput.setValue(formatTelefone(empresa.telefone));
      }
    }
  }, [empresa]);

  const formatCNPJ = (cnpj: string) => {
    const numbers = cnpj.replace(/\D/g, "");
    if (numbers.length !== 14) return cnpj;
    return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(
      5,
      8
    )}/${numbers.slice(8, 12)}-${numbers.slice(12)}`;
  };

  const formatTelefone = (telefone: string) => {
    const numbers = telefone.replace(/\D/g, "");
    if (numbers.length === 11) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(
        7
      )}`;
    } else if (numbers.length === 10) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(
        6
      )}`;
    }
    return telefone;
  };

  const handleLocationSelect = (location: {
    address: string;
    lat: number;
    lng: number;
  }) => {
    setFormData((prev) => ({
      ...prev,
      endereco: location.address,
      latitude: location.lat,
      longitude: location.lng,
    }));
  };

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    let formatted = "";

    if (value.length <= 10) {
      formatted = value.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    } else {
      formatted = value.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    }

    telefoneInput.setValue(formatted);
    setFormData((prev) => ({
      ...prev,
      telefone: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const updateData = {
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        endereco: formData.endereco,
        latitude: formData.latitude,
        longitude: formData.longitude,
        raioPermitido: formData.raioPermitido,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/empresas/${empresa?.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.accessToken}`,
          },
          body: JSON.stringify(updateData),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao atualizar empresa");
      }

      toast.success("Configurações da empresa atualizadas com sucesso!");
      await refreshUser();
    } catch (error) {
      console.error("Erro ao atualizar empresa:", error);
      toast.error("Erro ao atualizar configurações. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!empresa) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando configurações...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <toast.ToastContainer />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Configurações da Empresa
            </h1>
            <p className="text-muted-foreground">
              Gerencie as informações e configurações da sua empresa
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                Informações Básicas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome da Empresa</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, nome: e.target.value }))
                    }
                    placeholder="Nome da empresa"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cnpj">CNPJ</Label>
                  <Input
                    id="cnpj"
                    value={cnpjInput.value}
                    placeholder="00.000.000/0001-00"
                    disabled
                    className="bg-muted cursor-not-allowed"
                  />
                  <p className="text-xs text-muted-foreground">
                    O CNPJ não pode ser alterado
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    placeholder="contato@empresa.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={telefoneInput.value}
                    onChange={handleTelefoneChange}
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Localização */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Localização da Empresa
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="endereco">Endereço</Label>
                <Textarea
                  id="endereco"
                  value={formData.endereco}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      endereco: e.target.value,
                    }))
                  }
                  placeholder="Digite o endereço completo da empresa"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label>Selecionar no Mapa</Label>
                <GoogleMapsSelector
                  onLocationSelect={handleLocationSelect}
                  initialLocation={
                    formData.latitude && formData.longitude
                      ? { lat: formData.latitude, lng: formData.longitude }
                      : undefined
                  }
                  initialAddress={formData.endereco}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="raioPermitido">Raio Permitido (metros)</Label>
                <Input
                  id="raioPermitido"
                  type="number"
                  min="10"
                  max="1000"
                  value={formData.raioPermitido}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      raioPermitido: parseInt(e.target.value) || 100,
                    }))
                  }
                  placeholder="100"
                />
                <p className="text-xs text-muted-foreground">
                  Distância em metros permitida para registro de ponto
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Botões de Ação */}
          <div className="flex justify-end space-x-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {isLoading ? "Salvando..." : "Salvar Configurações"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
