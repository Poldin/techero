import React from 'react';

interface HeaderProps {
  onContactClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onContactClick }) => {
  return (
    <header className="fixed top-0 w-full bg-black/50 backdrop-blur-md z-50 border-b border-white/[.1]">
      <div className="max-w-screen-xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl text-white font-medium tracking-tight">
          tec<span className="font-bold">Hero</span>
        </h1>
        <nav className="hidden md:flex space-x-8">
          <a href="#services" className="text-sm text-white/60 hover:text-white transition-colors">Servizi</a>
          <a href="#pricing" className="text-sm text-white/60 hover:text-white transition-colors">Pricing</a>
          <a href="#faq" className="text-sm text-white/60 hover:text-white transition-colors">FAQ</a>
        </nav>
        <button 
          onClick={onContactClick}
          className="bg-white text-black text-sm px-4 py-2 transition-colors hover:bg-white/90 rounded"
        >
          Inizia Ora
        </button>
      </div>
    </header>
  );
};

export default Header;