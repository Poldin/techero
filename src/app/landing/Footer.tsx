import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onContactClick: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onContactClick }) => {
  return (
    <footer className="border-t border-white/[.1] py-12 mt-24">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div>
            <h2 className="text-xl text-white font-medium tracking-tight mb-4">
              tec<span className="font-bold">Hero</span>
            </h2>
            <p className="text-sm text-white/60 max-w-md">
              Gestiamo il tuo progetto tecnologico dall&apos;idea alla realizzazione, selezionando i migliori talenti e puntando all&apos;assoluta eccellenza.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <button 
              onClick={onContactClick}
              className="inline-flex items-center text-sm text-white/60 hover:text-white transition-colors gap-1 group"
            >
              Contattaci
              <ArrowUpRight className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" size={16} />
            </button>
            <a href="#pricing" className="text-sm text-white/60 hover:text-white transition-colors">Pricing</a>
            <a href="#faq" className="text-sm text-white/60 hover:text-white transition-colors">FAQ</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;