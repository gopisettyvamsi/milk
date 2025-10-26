import type { Metadata } from 'next';

export const defaultMetadata: Metadata = {
  title: 'kagof',
  description: 'kagof - KAASHYAPI AYURVEDA GYNAECOLOGISTS AND OBSTETRICIANS FOUNDATION',
  icons: {
    icon: [
      { url: '/logo.jpg', sizes: '150x150', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
    apple: { url: '/logo.jpg', sizes: '150x150' }
  },
  openGraph: {
    title: 'kagof',
    description: 'KAGOF – Redefining business intelligence with automation and smart systems.',
    url: 'https://www.kagof', // Replace with your live domain
    siteName: 'kagof',
    type: 'website',
    images: [
      {
        url: '/logo.jpg',
        width: 1200,
        height: 630,
        alt: 'kagof Logo'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'kagof',
    description: 'kagof – AI-powered enterprise innovation',
    images: [{ url: '/logo.jpg' }]
  }
};
