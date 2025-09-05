"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  BarChart3,
  Bell,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  MapPin,
  Settings,
  Shield,
  Smartphone,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function LandingPage() {
  const features = [
    {
      icon: Clock,
      title: "Registro de Ponto",
      description:
        "Controle de entrada e saída com geolocalização precisa e validação em tempo real.",
    },
    {
      icon: MapPin,
      title: "Geolocalização",
      description:
        "Registro baseado em localização com raio de tolerância configurável para maior segurança.",
    },
    {
      icon: Shield,
      title: "Segurança",
      description:
        "Autenticação robusta, criptografia de dados e controle de acesso por níveis.",
    },
    {
      icon: BarChart3,
      title: "Relatórios",
      description:
        "Dashboards completos com métricas, gráficos e relatórios exportáveis em PDF.",
    },
    {
      icon: Users,
      title: "Gestão de Funcionários",
      description:
        "Cadastro completo de funcionários, departamentos e controle de hierarquia.",
    },
    {
      icon: Smartphone,
      title: "Mobile First",
      description:
        "Interface responsiva otimizada para dispositivos móveis e tablets.",
    },
  ];

  const benefits = [
    {
      icon: CheckCircle,
      title: "Redução de Custos",
      description:
        "Elimine o papel e automatize processos manuais de controle de ponto.",
    },
    {
      icon: CheckCircle,
      title: "Conformidade Legal",
      description:
        "Atenda às exigências da CLT e legislação trabalhista brasileira.",
    },
    {
      icon: CheckCircle,
      title: "Transparência",
      description:
        "Funcionários têm acesso completo ao seu histórico de ponto e horas trabalhadas.",
    },
    {
      icon: CheckCircle,
      title: "Integração",
      description:
        "API robusta para integração com sistemas de RH e folha de pagamento.",
    },
  ];

  const adminFeatures = [
    {
      icon: Calendar,
      title: "Gestão de Jornadas",
      description: "Configure horários flexíveis e turnos",
    },
    {
      icon: FileText,
      title: "Justificativas",
      description: "Aprove atrasos e faltas com documentação",
    },
    {
      icon: Settings,
      title: "Configurações",
      description: "Personalize regras e políticas da empresa",
    },
    {
      icon: Bell,
      title: "Notificações",
      description: "Alertas automáticos para gestores e funcionários",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="relative w-10 h-8">
              <Image
                src="/logo.png"
                alt="RPonto Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              RPonto
            </span>
          </div>
          <Link href="/login">
            <Button variant="outline" className="mr-2">
              Entrar
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24 px-6">
        <div className="container mx-auto text-center max-w-6xl">
          <Badge variant="secondary" className="mb-6 text-sm px-4 py-2">
            🚀 Sistema Completo de Controle de Ponto
          </Badge>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
            Controle de Ponto
            <span className="text-blue-600 block">Inteligente</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            Gerencie o ponto eletrônico da sua empresa com tecnologia de ponta.
            Geolocalização, relatórios em tempo real e interface intuitiva para
            funcionários e gestores.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center max-w-md mx-auto">
            <Link href="/login">
              <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6">
                Começar Agora
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto text-lg px-8 py-6"
            >
              Ver Demonstração
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-white dark:bg-gray-900">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Funcionalidades Principais
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Tudo que você precisa para um controle de ponto eficiente
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 p-6"
              >
                <CardHeader className="pb-4">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center mb-6">
                    <feature.icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-2xl font-semibold">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-lg leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 px-6 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Por que escolher nosso sistema?
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Vantagens que fazem a diferença para sua empresa
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center p-6">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
                  <benefit.icon className="w-10 h-10 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  {benefit.title}
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Admin Features */}
      <section className="py-24 px-6 bg-white dark:bg-gray-900">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Painel Administrativo
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Ferramentas avançadas para gestores e administradores
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
            {adminFeatures.map((feature, index) => (
              <Card
                key={index}
                className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 p-6"
              >
                <CardHeader className="pb-4">
                  <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center mx-auto mb-6">
                    <feature.icon className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <CardTitle className="text-xl font-semibold">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-lg leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-blue-600">
        <div className="container mx-auto text-center max-w-5xl">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Pronto para modernizar seu controle de ponto?
          </h2>
          <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-4xl mx-auto leading-relaxed">
            Junte-se a centenas de empresas que já confiam em nossa solução para
            gerenciar o ponto eletrônico de forma eficiente e segura.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center max-w-md mx-auto">
            <Link href="/login">
              <Button
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto text-lg px-8 py-6"
              >
                Acessar Sistema
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-blue-600"
            >
              Solicitar Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 bg-gray-900 text-white">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="relative w-10 h-10">
              <Image
                src="/logo.png"
                alt="RPonto Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-2xl font-bold">RPonto</span>
          </div>
          <p className="text-lg text-gray-400 mb-6">
            Sistema completo de controle de ponto eletrônico
          </p>
          <p className="text-sm text-gray-500">
            © 2024 RPonto. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
