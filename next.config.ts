import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pdf.ms.credential.net",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
