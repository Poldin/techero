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
          service: 'analisi',
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
        
        <h2 className="text-xl text-white font-medium mb-6">Richiedi l&apos;analisi</h2>
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
              {isSubmitting ? 'Richiesta in corso...' : 'Richiedi analisi'}
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

export default function AnalisiPage() {
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
            Richiedi analisi
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="py-20 px-6">
        <div className="max-w-screen-xl mx-auto flex justify-center">
          <div className="max-w-2xl w-full">
            <h1 className="text-lg font-medium text-white/60 tracking-tight mb-6">
              Analisi e Fattibilità
            </h1>
            <p className="text-5xl  mb-12 font-medium tracking-tight">
              Un&apos;analisi approfondita per trasformare la tua idea in un piano d&apos;azione concreto
            </p>

            {/* Use Cases */}
            <div className="grid gap-8 mb-12">
            <h1 className="text-lg font-medium text-white/60 tracking-tight">
              quando ha senso richiedere l&apos;analisi?
            </h1>
              <div className="bg-gray-800/50 p-8 rounded border border-white/[.1] transition-all duration-500 hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                <h3 className="text-xl font-bold mb-4">Nuovo Progetto</h3>
                <p className="text-white/60 mb-4">
                  Vuoi dare inizio ad un progetto tech ma non conosci potenziali costi, tempi, rischi e fattibilità?
                </p>
              </div>

              <div className="bg-gray-800/50 p-8 rounded border border-white/[.1] transition-all duration-500 hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                <h3 className="text-xl font-bold mb-4">Progetto Esistente</h3>
                <p className="text-white/60 mb-4">
                  Gestisci già un progetto tech e lo vuoi migliorare, integrare o modificare ma non sai da dove iniziare?
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
                    <h3 className="text-lg font-medium mb-2">Raccontaci la tua esigenza</h3>
                    <p className="text-white/60">
                      Scendiamo in profondità per comprendere ogni aspetto del tuo progetto
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Accesso al progetto esistente</h3>
                    <p className="text-white/60">
                      Se hai già un progetto, ci condividi il codice o ci dai accesso alle utenze admin
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Approfondimento dettagliato</h3>
                    <p className="text-white/60">
                      Ti facciamo tutte le domande necessarie per comprendere ogni dettaglio
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    4
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Analisi approfondita</h3>
                    <p className="text-white/60">
                      Cerchiamo, approfondiamo e analizziamo ogni aspetto del progetto
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    5
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Documento di analisi completo</h3>
                    <p className="text-white/60">
                      Ti forniamo un documento dettagliato che risponde a tutte le tue domande: fattibilità, tempistiche, costi, team necessari e stack tecnologico
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing box */}
            <div className="bg-gray-800/50 p-8 rounded border border-white/[.1] transition-all duration-500 hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]">
              <h2 className="text-2xl font-medium mb-4">Investimento per l&apos;analisi</h2>
              <p className="text-4xl font-medium mb-2">€1.500</p>
              <p className="text-white/60 mb-6">+ IVA • 10 giorni lavorativi</p>
              <button 
                onClick={() => setIsFormOpen(true)}
                className="w-full bg-white text-black px-6 py-3 rounded hover:bg-white/90 transition-colors inline-flex items-center justify-center gap-2"
              >
                Richiedi analisi <ArrowRight size={18} />
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