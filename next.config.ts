import type { NextConfig } from "next";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "https://polaria-wms-api.onrender.com";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${apiBaseUrl}/:path*`,
      },
    ];
  },
  async headers() {
    const noStore = [
      { key: "Cache-Control", value: "no-store, must-revalidate" },
    ];

    return [
      { source: "/configurador", headers: noStore },
      { source: "/configurador/:path*", headers: noStore },
      { source: "/dashboard", headers: noStore },
      { source: "/dashboard/:path*", headers: noStore },
      { source: "/platform", headers: noStore },
      { source: "/platform/:path*", headers: noStore },
    ];
  },
};

export default nextConfig;
