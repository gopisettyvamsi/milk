import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'kagof',
  description: 'kagof,AI, Data Management,Data Pipe Line',
  icons: {
    icon: [
      { url: '/logo.jpg', sizes: '150x150', type: 'image/png' },
      { url: '/logo.jpg', sizes: 'any' }
    ],
    apple: { url: '/logo.jpg', sizes: '150x150' }
  },
};

export default function Head() {
  return (
    <>
      <link rel="icon" href="/logo.jpg" sizes="any" />
      <link rel="apple-touch-icon" href="/logo.jpg" />
    </>
  );
}
