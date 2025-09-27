import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? '/spacex-api' : '',
  basePath: process.env.NODE_ENV === 'production' ? '/spacex-api' : ''
};

export default nextConfig;
