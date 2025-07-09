"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { themeClasses } from "@/lib/theme";

export default function ThemeDemo() {
  return (
    <div className="space-y-6 p-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Visualização do Tema</h2>
        <p className="text-muted-foreground">
          Demonstração das cores aplicadas no sistema
        </p>
      </div>



      {/* Cores Primárias */}
      <Card>
        <CardHeader>
          <CardTitle>Cores Primárias</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Primária</p>
                <div className="w-full h-20 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-medium">Primary</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Secundária</p>
                <div className="w-full h-20 bg-secondary rounded-lg flex items-center justify-center">
                  <span className="text-secondary-foreground font-medium">Secondary</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Accent</p>
                <div className="w-full h-20 bg-accent rounded-lg flex items-center justify-center">
                  <span className="text-accent-foreground font-medium">Accent</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cores de Status */}
      <Card>
        <CardHeader>
          <CardTitle>Cores de Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Sucesso</p>
                <div className="w-full h-20 bg-success rounded-lg flex items-center justify-center">
                  <span className="text-white font-medium">Success</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Erro</p>
                <div className="w-full h-20 bg-destructive rounded-lg flex items-center justify-center">
                  <span className="text-white font-medium">Error</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Aviso</p>
                <div className="w-full h-20 bg-warning rounded-lg flex items-center justify-center">
                  <span className="text-white font-medium">Warning</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botões com Variantes */}
      <Card>
        <CardHeader>
          <CardTitle>Botões com Variantes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button variant="default">Primário</Button>
              <Button variant="secondary">Secundário</Button>
              <Button variant="success">Sucesso</Button>
              <Button variant="warning">Aviso</Button>
              <Button variant="destructive">Erro</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Badges */}
      <Card>
        <CardHeader>
          <CardTitle>Badges de Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="default">Ativo</Badge>
              <Badge variant="secondary">Pendente</Badge>
              <Badge variant="destructive">Erro</Badge>
              <Badge className="bg-success text-white">Aprovado</Badge>
              <Badge className="bg-warning text-white">Atenção</Badge>
              <Badge variant="outline">Rascunho</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Classes Utilitárias */}
      <Card>
        <CardHeader>
          <CardTitle>Classes Utilitárias de Tema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium mb-2">Texto</p>
                <div className="space-y-1">
                  <p className={themeClasses.text.primary}>Texto primário</p>
                  <p className={themeClasses.text.secondary}>Texto secundário</p>
                  <p className={themeClasses.text.success}>Texto de sucesso</p>
                  <p className={themeClasses.text.error}>Texto de erro</p>
                  <p className={themeClasses.text.warning}>Texto de aviso</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Fundos</p>
                <div className="space-y-2">
                  <div className={`${themeClasses.background.primary} text-white p-2 rounded text-sm`}>
                    Fundo primário
                  </div>
                  <div className={`${themeClasses.background.success} text-white p-2 rounded text-sm`}>
                    Fundo de sucesso
                  </div>
                  <div className={`${themeClasses.background.warning} text-white p-2 rounded text-sm`}>
                    Fundo de aviso
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 