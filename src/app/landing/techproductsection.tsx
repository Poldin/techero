'use client'

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface BadgeProps {
  text: string;
  colorClass: string;
}

interface Product {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
}

// Badge component with colors
const Badge: React.FC<BadgeProps> = ({ text, colorClass }) => (
  <span className={`inline-block px-3 py-1 text-sm border ${colorClass} rounded mr-2 mb-2 transition-colors`}>
    {text}
  </span>
);

const badgesConfig: BadgeProps[] = [
  { text: "AI", colorClass: "border-blue-500/20 text-blue-500 hover:bg-blue-500/20" },
  { text: "e-commerce", colorClass: "border-green-500/20 text-green-500 hover:bg-green-500/20" },
  { text: "autenticazione multifattore", colorClass: "border-purple-500/20 text-purple-500 hover:bg-purple-500/20" },
  { text: "Starter", colorClass: "border-yellow-500/20 text-yellow-500 hover:bg-yellow-500/20" },
  { text: "Blog", colorClass: "border-red-500/20 text-red-500 hover:bg-red-500/20" },
  { text: "Portfolio", colorClass: "border-indigo-500/20 text-indigo-500 hover:bg-indigo-500/20" },
  { text: "SaaS", colorClass: "border-pink-500/20 text-pink-500 hover:bg-pink-500/20" },
  { text: "Multi-tenant App", colorClass: "border-teal-500/20 text-teal-500 hover:bg-teal-500/20" }
];

const techProducts: Product[] = [
  {
    id: 'tts',
    title: 'TTS - trasforma dialoghi in testo con l\'AI',
    description: 'Converti facilmente le tue registrazioni vocali in testo accurato con la potenza dell\'intelligenza artificiale.',
    image: '/product-tts-placeholder.jpg',
    link: '/products/tts'
  },
  {
    id: 'budgez',
    title: 'Budgez - quota le lavorazioni complesse in 4 click',
    description: 'Definisci le risorse, il tipo di costo (orario, a quantità o fisso), indica le attività da svolgere e calcola quanto costa la lavorazione. Mai più preventivi a sentimento.',
    image: '/product-budgez-placeholder.jpg',
    link: '/products/budgez'
  },
  {
    id: 'stt',
    title: 'STT - da testo a audio in 0-2',
    description: 'Trasforma istantaneamente i tuoi testi in voci naturali e coinvolgenti per contenuti più accessibili.',
    image: '/product-stt-placeholder.jpg',
    link: '/products/stt'
  },
  {
    id: 'aibot',
    title: 'AI Bot - crea un chatbot basato su AI',
    description: 'Automatizza il supporto clienti con un assistente virtuale intelligente che impara e migliora costantemente.',
    image: '/product-aibot-placeholder.jpg',
    link: '/products/aibot'
  },
  {
    id: 'dashboard',
    title: 'Dashboard o cruscotto? - analizza dati aggregati in tempo reale',
    description: 'Trasforma i tuoi dati grezzi in insights actionable con visualizzazioni intuitive e aggiornate in tempo reale.',
    image: '/dashboard.jpg',
    link: '/products/dashboard'
  }
];

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => (
  <div className="w-96 h-[32rem] border border-white/[.1] p-6 hover:border-white/20 transition-colors rounded-lg shadow-lg backdrop-blur-sm flex flex-col">
    <div className="relative w-full h-48 mb-6">
      <Image
        src={product.image}
        alt={product.title}
        fill
        className="object-cover rounded-lg"
      />
    </div>
    <div className="flex flex-col flex-grow justify-between">
      <div>
        <h3 className="text-lg font-medium mb-4">{product.title}</h3>
        <p className="text-white/60">
          {product.description}
        </p>
      </div>
      <Link 
        href={product.link}
        className="w-full inline-flex items-center justify-center gap-2 bg-white/10 text-white px-6 py-3 hover:bg-white/20 transition-colors rounded-lg mt-6"
      >
        scopri <ArrowRight size={18} />
      </Link>
    </div>
  </div>
);

const TechProducts: React.FC = () => {
  return (
    <section className="py-20 px-6 border-t border-white/[.1]">
      <div className="max-w-screen-3xl mx-auto bg-black/40 rounded-xl p-8 border border-white/10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl text-gray-200 font-medium">I nostri prodotti tech e soluzioni</h2>
          <Link href="/" className="text-white text-2xl hover:opacity-80 transition-opacity">
            tec<strong>H</strong>ero
          </Link>
        </div>
        <p className="text-lg text-white/60 mb-6">
          Competenza e fiducia vanno guadagnate, non raccontate. Usa i nostri micro-prodotti e decidi se siamo all&apos;altezza.
        </p>
        
        <div className="mb-12">
          {badgesConfig.map((badge, index) => (
            <Badge key={index} text={badge.text} colorClass={badge.colorClass} />
          ))}
        </div>
        
        <div className="relative">
          <div className="overflow-x-auto pb-6">
            <div className="flex gap-8 min-w-max text-gray-200">
              {techProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechProducts;