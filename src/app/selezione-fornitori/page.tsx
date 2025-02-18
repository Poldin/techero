'use client'

import React, { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface RequestFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const RequestForm: React.FC<RequestFormProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    description: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/send-specific', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          service: 'fornitori',
          ccn: 'paolo@neocode.dev'
        }),
      });

      if (!response.ok) {
        throw new Error('Errore nell\'invio');
      }

      setShowSuccess(true);
      setFormData({ name: '', email: '', description: '' });

      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 3000);

    } catch (error) {
      console.error('Errore:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-gray-900 border border-white/[.1] p-8 rounded text-center max-w-md">
          <h2 className="text-xl text-white font-medium mb-2">Top, ci sentiamo a breve.</h2>
          <p className="text-white/60">Stay tuned.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-white/[.1] w-full max-w-md p-8 relative rounded">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        
        <h2 className="text-xl text-white font-medium mb-6">Richiedi selezione fornitori</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm text-white/60 mb-2">il tuo nome?</label>
            <input
              type="text"
              className="w-full p-2 bg-white/5 border border-white/[.1] text-white focus:outline-none focus:border-white/20 rounded"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm text-white/60 mb-2">la tua email?</label>
            <input
              type="email"
              className="w-full p-2 bg-white/5 border border-white/[.1] text-white focus:outline-none focus:border-white/20 rounded"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="block text-sm text-white/60 mb-2">raccontaci di più.</label>
            <textarea
              className="w-full p-2 bg-white/5 border border-white/[.1] text-white h-32 focus:outline-none focus:border-white/20 rounded"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-white text-black px-6 py-2 text-sm hover:bg-white/90 transition-colors rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Richiesta in corso...' : 'Richiedi selezione'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-2 text-sm border border-white/[.1] text-white hover:bg-white/5 transition-colors rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Annulla
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function FornitoriPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header with brand and CTA */}
      <header className="border-b border-white/[.1] p-6">
        <div className="max-w-screen-xl mx-auto flex justify-between items-center px-4 md:px-6 lg:px-8">
          <Link href="/" className="text-xl font-medium">
            tecHero
          </Link>
          <button 
            onClick={() => setIsFormOpen(true)}
            className="bg-white text-black px-6 py-2 rounded hover:bg-white/90 transition-colors"
          >
            Richiedi selezione
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="py-20 px-6">
        <div className="max-w-screen-xl mx-auto flex justify-center">
          <div className="max-w-2xl w-full">
            <h1 className="text-lg font-medium text-white/60 tracking-tight mb-6">
              Selezione Fornitori
            </h1>
            <p className="text-5xl mb-12 font-medium tracking-tight">
              Identifichiamo e selezioniamo i professionisti più adatti per il tuo progetto tech
            </p>

            {/* Use Cases */}
            <div className="grid gap-8 mb-12">
              <h1 className="text-lg font-medium text-white/60 tracking-tight">
                quando hai bisogno della selezione fornitori?
              </h1>
              <div className="bg-gray-800/50 p-8 rounded border border-white/[.1] transition-all duration-500 hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                <h3 className="text-xl font-bold mb-4">Post Analisi</h3>
                <p className="text-white/60 mb-4">
                  Hai completato l&apos;analisi di fattibilità e sei pronto a costruire il team perfetto per il tuo progetto
                </p>
              </div>
            </div>

            {/* Process Steps */}
            <div className="space-y-8 mb-12">
              <h2 className="text-2xl font-medium mb-6">Il nostro processo</h2>
              
              <div className="grid gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Analisi dei requisiti</h3>
                    <p className="text-white/60">
                      Sulla base dell&apos;analisi di fattibilità, definiamo il profilo ideale per ogni ruolo necessario
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Ricerca nel network</h3>
                    <p className="text-white/60">
                      Attiviamo il nostro network di professionisti e aziende verificate per individuare i candidati ideali
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Screening tecnico</h3>
                    <p className="text-white/60">
                      Verifichiamo le competenze tecniche e l&apos;esperienza attraverso un processo di valutazione approfondito
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    4
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Presentazione candidati</h3>
                    <p className="text-white/60">
                      Ti presentiamo una selezione dei professionisti più adatti con un report per ogni candidato
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    5
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Supporto nella scelta</h3>
                    <p className="text-white/60">
                      Ti affianchiamo nella scelta finale, puntanto al miglior match per il tuo progetto
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing box */}
            <div className="bg-gray-800/50 p-8 rounded border border-white/[.1] transition-all duration-500 hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]">
              <h2 className="text-2xl font-medium mb-4">Investimento per la selezione</h2>
              <p className="text-4xl font-medium mb-2">€1.500</p>
              <p className="text-white/60 mb-6">+ IVA • 10 giorni lavorativi</p>
              <button 
                onClick={() => setIsFormOpen(true)}
                className="w-full bg-white text-black px-6 py-3 rounded hover:bg-white/90 transition-colors inline-flex items-center justify-center gap-2"
              >
                Richiedi selezione <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </main>

      <RequestForm 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
      />
    </div>
  );
}