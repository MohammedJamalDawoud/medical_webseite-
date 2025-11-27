import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title: string;
    description: string;
    keywords?: string;
    author?: string;
    ogType?: string;
    ogImage?: string;
}

const SEO = ({
    title,
    description,
    keywords = 'MRI, brain organoids, tissue segmentation, deep learning, U-Net, GMM',
    author = 'Mohammed Jamal Dawoud',
    ogType = 'website',
    ogImage = '/og-image.jpg'
}: SEOProps) => {
    const siteTitle = 'MRI Organoids Segmentation';
    const fullTitle = `${title} | ${siteTitle}`;

    return (
        <Helmet>
            {/* Primary Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="title" content={fullTitle} />
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <meta name="author" content={author} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={ogType} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={ogImage} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:title" content={fullTitle} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={ogImage} />

            {/* Structured Data (JSON-LD) */}
            <script type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "WebSite",
                    "name": siteTitle,
                    "url": "https://example.com", // Replace with actual URL
                    "description": description,
                    "author": {
                        "@type": "Person",
                        "name": author
                    }
                })}
            </script>
        </Helmet>
    );
};

export default SEO;
