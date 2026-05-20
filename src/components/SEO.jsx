import { Helmet } from 'react-helmet-async';

const DEFAULT = {
  title: 'Zought — Personal Management System',
  description: 'Track anime, movies, web series. Save important links and codes. All in one personal Vault.',
  url: import.meta.env.VITE_WEB_URL,
  image: import.meta.env.VITE_WEB_URL,
};

export default function SEO({ title, description, url, image }) {
  const seoTitle = title ? `${title} | Zought` : DEFAULT.title;
  const seoDesc = description || DEFAULT.description;
  const seoUrl = url || DEFAULT.url;
  const seoImage = image || DEFAULT.image;

  return (
    <Helmet>
      {/* Basic */}
      <title>{seoTitle}</title>
      <meta name="description" content={seoDesc} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={seoUrl} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDesc} />
      <meta property="og:url" content={seoUrl} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:site_name" content="Zought" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDesc} />
      <meta name="twitter:image" content={seoImage} />

      {/* Extra */}
      <meta name="theme-color" content="#7C3AED" />
    </Helmet>
  );
}