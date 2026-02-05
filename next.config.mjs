/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  output: "standalone",
  distDir: '.next',
  basePath: '/pm25',
  env: {
    NEXT_PUBLIC_BASE_PATH: '/pm25',
  },
};

export default nextConfig;
