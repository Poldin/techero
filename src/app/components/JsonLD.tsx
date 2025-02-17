// components/JsonLd.tsx
export const JsonLd = () => {
    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfessionalService",
            "name": "tecHero",
            "description": "Project management specializzato per progetti tech",
            "image": "https://techero.xyz/logo.png",
            "priceRange": "€€€",
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "IT"
            },
            "offers": [
              {
                "@type": "Offer",
                "name": "Analisi e Fattibilità",
                "price": "1500",
                "priceCurrency": "EUR"
              },
              {
                "@type": "Offer",
                "name": "Selezione Fornitori",
                "price": "1500",
                "priceCurrency": "EUR"
              }
            ]
          })
        }}
      />
    )
  }