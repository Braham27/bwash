import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@bwash/database"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "img.clerk.com" },
    ],
  },
};

export default nextConfig;
