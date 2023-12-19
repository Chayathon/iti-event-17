/** @type {import('next').NextConfig} */


const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'

const nextConfig = {
  reactStrictMode: true,
  rewrites: async () => [
    {
      source: `/api/:path*`,
      destination: `${BASE_URL}/api/:path*`,
    },
  ],
}

module.exports = nextConfig
