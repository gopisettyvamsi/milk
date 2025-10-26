'use client';

import localFont from "next/font/local";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import Script from "next/script";   // ✅ added import



const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});





export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/png" sizes="150x150" href="/logo.jpg" />
        <link rel="apple-touch-icon" href="/logo.jpg" />
        <title>KAASHYAPI AYURVEDA GYNAECOLOGISTS AND OBSTETRICIANS FOUNDATION</title>

        {/* SEO Meta Tags */}
        <meta
          name="description"
          content="Discover the power of Ayurvedic Gynaecology — a holistic approach to women's reproductive health. Learn about natural remedies, hormone balance, menstrual wellness, fertility care, and postpartum recovery through Ayurveda’s time-tested wisdom.
"
        />
        <meta
          name="keywords"
          content="Ayurvedic gynaecology, Ayurveda for women, natural fertility care, menstrual health, hormone balance, Ayurvedic pregnancy care, postpartum recovery, women's wellness, reproductive health, Ayurvedic treatment for PCOS, holistic gynaecology
"
        />
        <meta name="author" content="KAGOF" />

        {/* Open Graph Tags */}
        <meta property="og:title" content="Ayurvedic Gynaecology | Holistic Women's Health & Wellness Care" />
        <meta property="og:description" content="Explore Ayurvedic approaches to women's health — from menstrual balance and fertility to pregnancy and menopause. Restore harmony naturally." />
        <meta property="og:image" content="/eventslogo.png" /> {/* Replace with actual image path */}
        <meta property="og:url" content="https://kagof" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Kagof" />

        {/* Twitter Card Tags */}
        {/* <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Kagof – AI Automation for Enterprise Workflows" />
        <meta name="twitter:description" content="Explore AI-powered enterprise automation with Kagof." />
        <meta name="twitter:image" content="/Kagof-og.jpg" /> 
        <meta name="twitter:creator" content="@Kagofai" />  
        */}

        {/* ✅ Google Analytics (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-VSRKJZ2D9F"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-VSRKJZ2D9F');
          `}
          
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
         <SessionProvider>{children}</SessionProvider>
          <Script
           src="https://checkout.razorpay.com/v1/checkout.js"
           strategy="afterInteractive"
         />
      </body>
    </html>
  );
}
