import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Required for static export
  trailingSlash: true, // Helps with GitHub Pages routing
  outputFileTracingRoot: __dirname,
  images: {
    unoptimized: true // Required for static export
  },
  // Add basePath if deploying to project site (username.github.io/repo-name)
  basePath: process.env.NODE_ENV === 'production' ? '/AgriConnect' : '',
  // Add assetPrefix for proper asset loading
  assetPrefix: process.env.NODE_ENV === 'production' ? '/AgriConnect/' : '',
}

export default nextConfig
