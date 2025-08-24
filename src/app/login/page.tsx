"use client";

import { useAuth } from "@/components/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginRequest, RegisterRequest } from "@/types/auth";
import {
  Building2,
  Eye,
  EyeOff,
  FileText,
  Lock,
  Mail,
  User,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login, register, user } = useAuth();

  // Redirecionar se já estiver autenticado
  useEffect(() => {
    if (user) {
      router.push("/empresa");
    }
  }, [user, router]);

  // Estado para login
  const [loginData, setLoginData] = useState<LoginRequest>({
    email: "",
    password: "",
  });
  const [loginError, setLoginError] = useState("");

  // Estado para registro
  const [registerData, setRegisterData] = useState<RegisterRequest>({
    nome: "",
    email: "",
    password: "",
    nomeEmpresa: "",
    cnpj: "",
    emailEmpresa: "",
  });
  const [registerError, setRegisterError] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError("");

    try {
      await login(loginData);
      router.push("/empresa");
    } catch (error) {
      setLoginError(
        error instanceof Error ? error.message : "Erro ao fazer login"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setRegisterError("");

    try {
      await register(registerData);
      router.push("/empresa");
    } catch (error) {
      setRegisterError(
        error instanceof Error ? error.message : "Erro ao criar conta"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/20 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"></div>

      <div className="relative w-full max-w-md">
        <Card className="bg-card/80 backdrop-blur-sm shadow-2xl border-border">
          <CardHeader className="text-center pb-5">
            <div className="mx-auto mb-4 h-16 w-16 relative">
              <Image
                src="/logo.png"
                alt="Logo"
                fill
                className="object-contain"
              />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">
              Registro de Ponto
            </CardTitle>
            <p className="text-muted-foreground text-sm">
              Sistema de Gestão de Funcionários
            </p>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="login" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 bg-muted">
                <TabsTrigger
                  value="login"
                  className="data-[state=active]:bg-background data-[state=active]:text-foreground text-muted-foreground"
                >
                  Entrar
                </TabsTrigger>
                <TabsTrigger
                  value="register"
                  className="data-[state=active]:bg-background data-[state=active]:text-foreground text-muted-foreground"
                >
                  Criar Conta
                </TabsTrigger>
              </TabsList>

              {/* Tab de Login */}
              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="login-email"
                      className="text-foreground font-medium"
                    >
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="seu@email.com"
                        value={loginData.email}
                        onChange={(e) =>
                          setLoginData({ ...loginData, email: e.target.value })
                        }
                        className="pl-10 border-border focus:border-ring focus:ring-ring text-foreground"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="login-password"
                      className="text-foreground font-medium"
                    >
                      Senha
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={loginData.password}
                        onChange={(e) =>
                          setLoginData({
                            ...loginData,
                            password: e.target.value,
                          })
                        }
                        className="pl-10 pr-10 border-border focus:border-ring focus:ring-ring text-foreground"
                        required
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {loginError && (
                    <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                      <p className="text-destructive text-sm font-medium">
                        {loginError}
                      </p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full py-3"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                        <span>Entrando...</span>
                      </div>
                    ) : (
                      "Entrar"
                    )}
                  </Button>
                </form>
              </TabsContent>

              {/* Tab de Registro */}
              <TabsContent value="register" className="space-y-4">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="register-name"
                      className="text-foreground font-medium"
                    >
                      Nome Completo
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="register-name"
                        type="text"
                        placeholder="Seu nome completo"
                        value={registerData.nome}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            nome: e.target.value,
                          })
                        }
                        className="pl-10 border-border focus:border-ring focus:ring-ring text-foreground"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="register-email"
                      className="text-foreground font-medium"
                    >
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="seu@email.com"
                        value={registerData.email}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            email: e.target.value,
                          })
                        }
                        className="pl-10 border-border focus:border-ring focus:ring-ring text-foreground"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="register-password"
                      className="text-foreground font-medium"
                    >
                      Senha
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="register-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={registerData.password}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            password: e.target.value,
                          })
                        }
                        className="pl-10 pr-10 border-border focus:border-ring focus:ring-ring text-foreground"
                        required
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="text-sm font-medium text-foreground mb-3">
                      Dados da Empresa
                    </h3>

                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label
                          htmlFor="company-name"
                          className="text-foreground font-medium"
                        >
                          Nome da Empresa
                        </Label>
                        <div className="relative">
                          <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="company-name"
                            type="text"
                            placeholder="Nome da sua empresa"
                            value={registerData.nomeEmpresa}
                            onChange={(e) =>
                              setRegisterData({
                                ...registerData,
                                nomeEmpresa: e.target.value,
                              })
                            }
                            className="pl-10 border-border focus:border-ring focus:ring-ring text-foreground"
                            required
                            disabled={isLoading}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="company-cnpj"
                          className="text-foreground font-medium"
                        >
                          CNPJ
                        </Label>
                        <div className="relative">
                          <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="company-cnpj"
                            type="text"
                            placeholder="00.000.000/0001-00"
                            value={registerData.cnpj}
                            onChange={(e) =>
                              setRegisterData({
                                ...registerData,
                                cnpj: e.target.value,
                              })
                            }
                            className="pl-10 border-border focus:border-ring focus:ring-ring text-foreground"
                            required
                            disabled={isLoading}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="company-email"
                          className="text-foreground font-medium"
                        >
                          Email da Empresa
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="company-email"
                            type="email"
                            placeholder="contato@empresa.com"
                            value={registerData.emailEmpresa}
                            onChange={(e) =>
                              setRegisterData({
                                ...registerData,
                                emailEmpresa: e.target.value,
                              })
                            }
                            className="pl-10 border-border focus:border-ring focus:ring-ring text-foreground"
                            required
                            disabled={isLoading}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {registerError && (
                    <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                      <p className="text-destructive text-sm font-medium">
                        {registerError}
                      </p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full py-3"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                        <span>Criando conta...</span>
                      </div>
                    ) : (
                      "Criar Conta"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-muted-foreground text-sm">
            © 2025 Registro de Ponto. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}
