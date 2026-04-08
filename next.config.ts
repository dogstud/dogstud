import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.dog.ceo' },
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
  },
};

export default nextConfig;
