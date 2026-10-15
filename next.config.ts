// import type { NextConfig } from 'next';

// const nextConfig: NextConfig = {
//   reactStrictMode: true,
//   poweredByHeader: false,
//   images: {
//     remotePatterns: [{ protocol: 'https', hostname: 'res.cloudinary.com' }],
//   },
// };

// export default nextConfig;
import type { NextConfig } from 'next';

// The browser only talks to this site's own /api/*. Next.js forwards those requests to the backend,
// so the refresh-token cookie is first-party (works even when the two apps live on different domains).
const API_PROXY_TARGET = (process.env.API_PROXY_TARGET ?? 'http://localhost:5000').replace(
  /\/+$/,
  '',
);

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'res.cloudinary.com' }],
  },
  async rewrites() {
    return [{ source: '/api/:path*', destination: `${API_PROXY_TARGET}/api/:path*` }];
  },
};

export default nextConfig;