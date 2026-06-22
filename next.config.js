/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'oxyemdev.s3.eu-west-1.amazonaws.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'oxytal.s3.eu-west-1.amazonaws.com',
        pathname: '/**',
      },
    ],
  },

  async rewrites() {
    return [
      { source: '/', destination: '/home' },
      { source: '/Dashboard/:path*', destination: '/Dashboard' },
    ];
  },

  pageExtensions: ['page.tsx', 'page.ts', 'page.jsx', 'page.js'],

  // 👇 THIS SILENCES THE ERROR (intentional webpack usage)
  turbopack: {},

  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
};

module.exports = nextConfig;
