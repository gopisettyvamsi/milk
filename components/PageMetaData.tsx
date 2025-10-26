// components/PageMetadata.tsx
import Head from "next/head";

interface PageMetadataProps {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  ogUrl?: string;
  canonicalUrl?: string;
}

const PageMetadata = ({
  title,
  description,
  keywords = "",
  ogImage = "/logo.jpg",
  ogUrl = "https://kagof",
  canonicalUrl = "https://kagof",
}: PageMetadataProps) => {
  const fullTitle = `${title} | kagof`;

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="KAGOF" />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="article" />
      <meta property="og:url" content={ogUrl} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Head>
  );
};

export default PageMetadata;
