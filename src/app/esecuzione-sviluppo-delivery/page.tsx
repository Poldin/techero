'use client'

import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, ArrowRight, Target, Shield, Clock4, Award } from 'lucide-react';
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
          service: 'execution',
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
        
        <h2 className="text-xl text-white font-medium mb-6">Richiedi esecuzione</h2>
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
            <label className="block text-sm text-white/60 mb-2">raccontaci del tuo progetto</label>
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
              {isSubmitting ? 'Invio in corso...' : 'Invia richiesta'}
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

export default function ExecutionPage() {
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
            Richiedi esecuzione
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="py-20 px-6">
        <div className="max-w-screen-xl mx-auto flex justify-center">
          <div className="max-w-2xl w-full">
            <h1 className="text-lg font-medium text-white/60 tracking-tight mb-6">
              Esecuzione, sviluppo e delivery
            </h1>
            <p className="text-5xl mb-12 font-medium tracking-tight">
              Dalla tua parte per guidare lo sviluppo del tuo progetto tech
            </p>

            {/* Value Proposition */}
            <div className="bg-gray-800/50 p-8 rounded border border-white/[.1] transition-all duration-500 hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] mb-12">
              <h2 className="text-xl font-bold mb-4">Il nostro approccio è diverso</h2>
              <p className="text-white/60 mb-6">
                Nell&apos;industria tech, spesso si crea un conflitto di interessi: il team di sviluppo vuole concludere rapidamente per massimizzare il guadagno, mentre il cliente desidera un prodotto perfetto nei minimi dettagli.
              </p>
              <p className="text-white/60">
                Noi scegliamo di stare dalla tua parte: il nostro successo è legato al tuo.
              </p>
            </div>

            {/* Key Benefits */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-gray-800/50 p-8 rounded border border-white/[.1] transition-all duration-500 hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                <div className="flex items-center gap-3 mb-4">
                  <Target className="text-white/40" size={24} />
                  <h3 className="text-lg font-medium">Interessi allineati</h3>
                </div>
                <p className="text-white/60">
                  Il nostro compenso è legato al successo del tuo progetto: rispetto delle tempistiche e del budget
                </p>
              </div>

              <div className="bg-gray-800/50 p-8 rounded border border-white/[.1] transition-all duration-500 hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="text-white/40" size={24} />
                  <h3 className="text-lg font-medium">Controllo totale</h3>
                </div>
                <p className="text-white/60">
                  Supervisione costante su team, costi e avanzamento per proteggere i tuoi interessi
                </p>
              </div>
            </div>

            {/* Pricing Model */}
            <div className="space-y-8 mb-12">
              <h2 className="text-2xl font-medium mb-6">Un modello di pricing che premia i risultati</h2>
              
              <div className="grid gap-6">
                <div className="bg-gray-800/50 p-6 rounded border border-white/[.1]">
                  <div className="flex items-start gap-4">
                    <Clock4 className="text-white/40 mt-1" size={24} />
                    <div>
                      <h3 className="text-lg font-medium mb-2">Fee base</h3>
                      <p className="text-white/60">
                        12% dell&apos;ammontare totale delle lavorazioni
                        <br />
                        <span className="text-sm">(minimo €2.500 + IVA)</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800/50 p-6 rounded border border-emerald-500/20">
                  <div className="flex items-start gap-4">
                    <Award className="text-emerald-400 mt-1" size={24} />
                    <div>
                      <h3 className="text-lg font-medium mb-2">Bonus di performance</h3>
                      <p className="text-white/60 mb-4">
                        +20% sulla fee base se:
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2">
                          <CheckCircle size={16} className="text-emerald-400" />
                          <span>Consegna entro la deadline concordata</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle size={16} className="text-emerald-400" />
                          <span>Nessuno sforamento del budget stabilito</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Process Steps */}
            <div className="space-y-8 mb-12">
              <h2 className="text-2xl font-medium mb-6">Come lavoriamo</h2>
              
              <div className="grid gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Setup iniziale</h3>
                    <p className="text-white/60">
                      Definiamo obiettivi, metriche di successo, tempistiche e budget di riferimento
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Supervisione attiva</h3>
                    <p className="text-white/60">
                      Monitoriamo ogni aspetto dello sviluppo con focus su qualità, tempi e costi
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Comunicazione costante</h3>
                    <p className="text-white/60">
                      Report settimanali dettagliati e allineamenti periodici sul progresso
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    4
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Quality Assurance</h3>
                    <p className="text-white/60">
                      Controlli di qualità continui per garantire la massima aderenza ai requisiti
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    5
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Delivery e supporto</h3>
                    <p className="text-white/60">
                      Consegna del prodotto e periodo di supporto post-rilascio per garantire il successo
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Box */}
            <div className="bg-gray-800/50 p-8 rounded border border-white/[.1] transition-all duration-500 hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]">
              <h2 className="text-2xl font-medium mb-4">Investimento</h2>
              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-4xl font-medium">12%</p>
                  <p className="text-white/60">del valore totale del progetto</p>
                </div>
                <div className="pt-4 border-t border-white/[.1]">
                  <p className="font-medium">+20% bonus</p>
                  <p className="text-white/60">se rispettiamo tempistiche e budget</p>
                </div>
                <div className="pt-4 border-t border-white/[.1]">
                  <p className="text-sm text-white/60">Minimo garantito: €2.500 + IVA</p>
                </div>
              </div>
              <button 
                onClick={() => setIsFormOpen(true)}
                className="w-full bg-white text-black px-6 py-3 rounded hover:bg-white/90 transition-colors inline-flex items-center justify-center gap-2"
              >
                Richiedi esecuzione <ArrowRight size={18} />
              </button>
            </div>

            {/* Additional Info */}
            <div className="bg-gray-800/50 p-8 rounded border border-white/[.1] transition-all duration-500 hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] mt-12">
              <h3 className="text-xl font-medium mb-4">Perché questo modello?</h3>
              <p className="text-white/60 mb-4">
                Vogliamo che i nostri interessi siano perfettamente allineati con i tuoi. Il bonus di performance ci motiva a:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-emerald-400 mt-1" size={16} />
                  <span className="text-white/60">Controllare attivamente ogni aspetto del progetto</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-emerald-400 mt-1" size={16} />
                  <span className="text-white/60">Intervenire tempestivamente in caso di problemi</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-emerald-400 mt-1" size={16} />
                  <span className="text-white/60">Garantire la massima trasparenza su costi e tempistiche</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-emerald-400 mt-1" size={16} />
                  <span className="text-white/60">Assicurare che ogni euro speso porti valore al progetto</span>
                </li>
              </ul>
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