
import type {NextConfig} from 'next';

const supabaseHostname = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : '';

const nextConfig: NextConfig = {
  /* config options here */
  compiler: {
    // Enables the styled-components SWC transform
    styledComponents: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
       {
        protocol: 'https',
        hostname: '5.imimg.com',
      },
       {
        protocol: 'https',
        hostname: 'i0.wp.com',
      },
      {
        protocol: 'https',
        hostname: 'news.artnet.com',
      },
      // Add Supabase hostname if it exists
      ...(supabaseHostname ? [{
        protocol: 'https' as 'https',
        hostname: supabaseHostname,
      }] : []),
    ],
  },
  webpack: (config, { isServer }) => {
    config.externals = [...config.externals, 'canvas', 'handlebars', 'async_hooks', 'http2', 'net', 'tls', 'dns'];
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        async_hooks: false,
        tls: false,
        net: false,
        http2: false,
        dns: false,
      };
    }
    return config;
  },
};

export default nextConfig;
