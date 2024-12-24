/** @type {import('next').NextConfig} */

// const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL || 'http://localhost:3000'

let BASE_URL = "http://localhost:3000/api"

//check env dev or prod
if (process.env.NODE_ENV !== 'development') {
  BASE_URL = process.env.PROD_BASE_URL || process.env.VERCEL_URL
}

const nextConfig = {
  reactStrictMode: true,
  env: {
    BASE_URL,
  },
  images: {
    domains: ['jpajjgeqekhebztqwhkr.supabase.co'],
  },
  rewrites: async () => [
    {
      source: `/api/:path*`,
      destination: `${BASE_URL}/:path*`,

    },
    {
      source: `/storage/:path*`,
      destination: `https://jpajjgeqekhebztqwhkr.supabase.co/storage/v1/object/public/:path*`,
    }
  ],
}

module.exports = nextConfig
