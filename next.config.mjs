/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },
  output: 'standalone'
};

export default nextConfig;
