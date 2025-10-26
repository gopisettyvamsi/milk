import type { Metadata } from 'next';

// Define metadata for the app
export const metadata: Metadata = {
  title: 'kagof',
  description: 'KAGOF Data Management',
  icons: {
    icon: [
      { url: '/logo.jpg', sizes: '150x150', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
    apple: { url: '/logo.jpg', sizes: '150x150' }
  },
};
