/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports =  {
  experimental: {
    forceSwcTransforms: true,
  },
  nextConfig
}
