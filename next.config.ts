import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* hide the Next.js DevTools floating button (dev mode) */
  devIndicators: false,
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  async headers() {
    return [
      {
        // artwork images are content-addressed (hash filenames) → cache forever
        source: "/art/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
