'use client'

import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import Image from 'next/image';
import Header from './landing/Header';
import Footer from './landing/Footer';
import ContactForm from './landing/contactform';

// Rimuoviamo handleFormSubmit poiché il form gestisce internamente i dati
export default function Home() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header onContactClick={() => setIsFormOpen(true)} />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-screen-xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-medium tracking-tight mb-6 max-w-2xl">
                Progetti tech da Zero a Hero
              </h1>
              <p className="text-lg text-white/60 mb-8 max-w-xl">
                Project management specializzato per trasformare le tue idee in prodotti tech completi. Performanti. Fighi.
              </p>
              <button 
                onClick={() => setIsFormOpen(true)}
                className="bg-white text-black px-6 py-3 inline-flex items-center gap-2 hover:bg-white/90 transition-colors rounded"
              >
                Inizia il tuo progetto <ArrowRight size={18} />
              </button>
            </div>
            <div className="relative w-full aspect-square md:aspect-video">
              <Image
                src="/animated-gifs01.gif"
                alt="Tech Hero Animation"
                fill
                className="object-cover object-center rounded border border-white/[.1] hover:border-white/20 transition-colors"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 border-t border-white/[.1]">
        <div className="max-w-screen-xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                <Check size={20} className="text-white/40" />
                Qualità del Risultato
              </h3>
              <p className="text-white/60">
                Garantiamo l&apos;eccellenza in ogni fase del progetto, dalla pianificazione alla consegna finale.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                <Check size={20} className="text-white/40" />
                Ordine e Metodo
              </h3>
              <p className="text-white/60">
                Strutturiamo ogni processo con metodologia e precisione per garantire efficienza e trasparenza.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                <Check size={20} className="text-white/40" />
                Comunicazione Efficace
              </h3>
              <p className="text-white/60">
                Aggiornamenti costanti e comunicazione trasparente sullo stato di avanzamento del progetto.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6 border-t border-white/[.1]">
        <div className="max-w-screen-xl mx-auto">
          <h2 className="text-3xl font-medium mb-12">I Nostri Servizi</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="border border-white/[.1] p-6 hover:border-white/20 transition-colors rounded">
              <h3 className="text-lg font-medium mb-4">Analisi e Fattibilità</h3>
              <p className="text-white/60 mb-6">
                Analisi preliminare del progetto, definizione delle risorse necessarie e tempistiche.
              </p>
              <p className="text-2xl font-medium mb-2">€1.500</p>
              <p className="text-sm text-white/40 mb-6">+ IVA • 5 giorni lavorativi</p>
            </div>
            
            <div className="border border-white/[.1] p-6 hover:border-white/20 transition-colors rounded">
              <h3 className="text-lg font-medium mb-4">Selezione Fornitori</h3>
              <p className="text-white/60 mb-6">
                Ricerca e selezione dei migliori professionisti per il tuo progetto.
              </p>
              <p className="text-2xl font-medium">€1.500</p>
              <p className="text-sm text-white/40">+ IVA • 10 giorni lavorativi</p>
            </div>

            <div className="border border-white/[.1] p-6 hover:border-white/20 transition-colors rounded">
              <h3 className="text-lg font-medium mb-4">Esecuzione, sviluppo e delivery</h3>
              <p className="text-white/60 mb-6">
                Supervisione continua del team di sviluppo, controllo qualità e consegna finale.
              </p>
              <p className="text-2xl font-medium">3%</p>
              <p className="text-sm text-white/40">del valore totale (min. €1.500 + IVA)</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-6 border-t border-white/[.1]">
        <div className="max-w-screen-xl mx-auto">
          <h2 className="text-3xl font-medium mb-12">FAQ</h2>
          <div className="max-w-2xl space-y-12">
            <div>
              <h3 className="text-lg font-medium mb-3">Siete sviluppatori?</h3>
              <p className="text-white/60">
                No, non siamo sviluppatori. Siamo consulenti specializzati nella gestione di progetti tech. 
                Il nostro ruolo è quello di guidare e coordinare il processo di sviluppo, selezionando i 
                migliori professionisti per ogni aspetto del progetto.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-3">Come funziona il processo?</h3>
              <p className="text-white/60">
                Iniziamo con un&apos;analisi dettagliata del tuo progetto, definiamo le risorse necessarie, 
                selezioniamo i fornitori più adatti e monitoriamo l&apos;intero processo di sviluppo fino alla 
                consegna finale.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer onContactClick={() => setIsFormOpen(true)} />
      <ContactForm 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
      />
    </div>
  );
}