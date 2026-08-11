import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  // Tree-shake icon / motion barrels in client chunks.
  experimental: {
    optimizePackageImports: ["lucide-react", "motion"],
  },
  // Smaller production JS for marketing pages.
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error"] } : false,
  },
};

export default nextConfig;
