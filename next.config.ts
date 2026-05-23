import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://192.168.3.182:8787/api/:path*",
      },
    ];
  },
};

export default nextConfig;
