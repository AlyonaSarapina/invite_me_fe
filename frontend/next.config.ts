import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "greatwesternarcade.co.uk",
      },
      {
        protocol: "https",
        hostname: "feedthelion.co.uk",
      },
    ],
  },
};

export default nextConfig;
