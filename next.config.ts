import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'oumfwjoqosdsevnfgohi.supabase.co',
      },
    ],
  },
};

export default nextConfig;
