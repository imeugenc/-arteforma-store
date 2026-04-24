import type { NextConfig } from "next";
import path from "node:path";

const supabaseHostname = process.env.SUPABASE_URL
  ? new URL(process.env.SUPABASE_URL).hostname
  : undefined;

const nextConfig: NextConfig = {
  skipTrailingSlashRedirect: true,
  skipProxyUrlNormalize: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: supabaseHostname
      ? [
          {
            protocol: "https",
            hostname: supabaseHostname,
            pathname: "/storage/v1/object/public/**",
          },
        ]
      : [],
  },
  outputFileTracingRoot: path.join(process.cwd()),
};

export default nextConfig;
