import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  htmlLimitedBots: /.*/,
  transpilePackages: [
    "three",
    "meshline",
    "@react-three/fiber",
    "@react-three/drei",
    "@react-three/rapier",
  ],
  serverExternalPackages: ["@dimforge/rapier3d-compat"],
  turbopack: {},
};

export default nextConfig;
