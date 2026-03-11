import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "apod.nasa.gov",
      },
      {
        protocol: "http",
        hostname: "mars.jpl.nasa.gov", // Servidor comum de fotos antigas
      },
      {
        protocol: "https",
        hostname: "mars.nasa.gov",
      },
      {
        protocol: "https",
        hostname: "www.nasa.gov",
      },
    ],
  },
};

export default nextConfig;
