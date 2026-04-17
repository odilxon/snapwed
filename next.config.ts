import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  allowedDevOrigins: ['192.168.100.148'],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "daconflngzgozcdnyzfu.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
