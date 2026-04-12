import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin workspace root so builds don’t pick a parent lockfile when multiple exist locally.
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
