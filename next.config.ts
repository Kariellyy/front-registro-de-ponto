import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configurações para desenvolvimento local
  experimental: {
    // Melhorar compatibilidade com dispositivos móveis
    optimizePackageImports: ["lucide-react"],
  },

  // Headers de segurança para geolocalização
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Permissions-Policy",
            value: "geolocation=(self)",
          },
          {
            key: "Feature-Policy",
            value: "geolocation 'self'",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
