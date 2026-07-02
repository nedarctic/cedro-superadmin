import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-5cee8e6d1a574b6c84697dfdb9beba4a.r2.dev"
      }
    ]
  }
};

export default nextConfig;
