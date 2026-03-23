import type { NextConfig } from "next";

const analysisApi = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
const userApi = process.env.NEXT_PUBLIC_USER_API_URL || "http://localhost:8001/api/v2";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/backend/:path*",
        destination: `${analysisApi}/:path*`,
      },
      {
        source: "/userapi/:path*",
        destination: `${userApi}/:path*`,
      },
    ];
  },
};

export default nextConfig;
// deployed 2026-03-21
// rebuild 1774240324
