/** @type {import('next').NextConfig} */

// const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL || 'http://localhost:3000'

let BASE_URL = "http://localhost:3000"

//check env dev or prod
if (process.env.NODE_ENV !== 'development') {
  BASE_URL = `https://${process.env.VERCEL_URL}` || process.env.NEXT_PUBLIC_BASE_URL
}

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
