import type { NextConfig } from "next";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const apiMediaPattern = (() => {
  if (!apiUrl) return [];

  try {
    const url = new URL(apiUrl);
    if (url.protocol !== "http:" && url.protocol !== "https:") return [];

    return [
      {
        protocol: url.protocol.slice(0, -1) as "http" | "https",
        hostname: url.hostname,
        port: url.port,
        pathname: "/uploads/**",
      },
    ];
  } catch {
    return [];
  }
})();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "3000",
        pathname: "/uploads/**",
      },
    ...apiMediaPattern,
    ],
  },
  async redirects() {
    return [
      { source: "/proyek", destination: "/#portofolio", permanent: false },
      { source: "/cara-kerja", destination: "/#cara-kerja", permanent: false },
      { source: "/layanan", destination: "/#layanan", permanent: false },
      { source: "/interior", destination: "/#interior", permanent: false },
      { source: "/faq", destination: "/#faq", permanent: false },
      { source: "/booking", destination: "/#booking", permanent: false },
    ];
  },
};

export default nextConfig;
