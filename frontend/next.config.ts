import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    domains: ["m.media-amazon.com", "ecx.images-amazon.com"],
  },
};

export default nextConfig;
