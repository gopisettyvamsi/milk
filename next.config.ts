import type { NextConfig } from 'next';
import path from 'path';

const config: NextConfig = {
  eslint: {
    // Disable ESLint during production builds for performance
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer }) => {
    // Handle server-side dependencies
    if (isServer) {
      // No need to polyfill or mock these on server side
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'pg-native': false,
        'pg-query-stream': false,
        'oracledb': false
      };
    } else {
      // Only mock these on the client side
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'pg-native': false,
        'pg-query-stream': false,
        'oracledb': false,
        'fs': false,
        'fs/promises': false,
        'path': false
      };
    }
    
    // Fix Handlebars loader issues
    config.module = {
      ...config.module,
      exprContextCritical: false,
      rules: [
        ...(config.module?.rules || []),
        {
          test: /\.hbs$/,
          loader: 'raw-loader',
        },
        {
          test: /node_modules\/handlebars\/lib\/index\.js$/,
          loader: 'string-replace-loader',
          options: {
            search: 'require.extensions',
            replace: 'undefined'
          }
        }
      ]
    };

    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@/components': path.resolve(__dirname, 'components'),
      '@/components/ui': path.resolve(__dirname, 'components/ui'),
      '@/components/layouts': path.resolve(__dirname, 'components/layouts'),
      '@/lib': path.resolve(__dirname, 'lib'), // <-- add this line
    };

    return config;
  }
};

export default config;
