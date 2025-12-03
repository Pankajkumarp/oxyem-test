module.exports = {
  reactStrictMode: false,
  trace: false,
  outputFileTracing: true,
  images: {
    domains: ['skolrupdev.s3.eu-west-1.amazonaws.com'],
  },
  eslint: {
    ignoreDuringBuilds: true,
},
  async rewrites() {
    return [
      {
        source: '/Dashboard/:path*',
        destination: '/Dashboard',
      }, 
    ]
  },
  pageExtensions: ['page.tsx', 'page.ts', 'page.jsx', 'page.js'],
}