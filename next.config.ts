import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "trefle.io",
      },
      {
        protocol: "https",
        hostname: "*.trefle.io",
      },
    ],
  },
};

export default nextConfig;
