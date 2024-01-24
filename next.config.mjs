/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.prodia.xyz',
      },
    ],
  },
};

export default nextConfig;
