'use client'

import Link from 'next/link';

export default function BlogHeader() {
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'TecHero Blog',
          url: window.location.href,
        });
      } else {
        // Fallback per browser che non supportano Web Share API
        await navigator.clipboard.writeText(window.location.href);
        alert('URL copiato negli appunti!');
      }
    } catch (error) {
      console.error('Errore durante la condivisione:', error);
    }
  };

  return (
    <header className="border-b border-white/[.1] bg-black/50 backdrop-blur-lg fixed top-0 left-0 right-0 z-50">
      <div className="max-w-screen-xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-medium">
            tec<b>Hero</b>
          </Link>
          
          <button 
            onClick={handleShare}
            className="bg-white text-black px-4 py-2 inline-flex items-center gap-2 hover:bg-white/90 transition-colors rounded"
          >
            condividi
          </button>
        </div>
      </div>
    </header>
  );
}