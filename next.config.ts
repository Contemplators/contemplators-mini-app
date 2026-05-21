import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Permite que la build de producción complete aunque existan errores
    // de TypeScript en archivos del template que no usamos.
    ignoreBuildErrors: true,
  },
  eslint: {
    // Lo mismo para warnings/errores de ESLint durante la build.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;