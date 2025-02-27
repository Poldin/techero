'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Check } from 'lucide-react';
import Image from 'next/image';
import Header from './landing/Header';
import Footer from './landing/Footer';
import ContactForm from './landing/contactform';
import Link from 'next/link';
import TechProducts from './landing/techproductsection';


// Rimuoviamo handleFormSubmit poiché il form gestisce internamente i dati
export default function Home() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const router = useRouter();

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

      {/* Pain & Relief Section */}
      <section className="py-20 px-6 border-t border-white/[.1] bg-gray-800">
        <div className="max-w-screen-xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Pain Points Column */}
            <div className="p-8 bg-gray-900 rounded border border-red-500/20 hover:border-red-500/40 transition-colors duration-300">
              <h2 className="text-2xl font-medium mb-6 text-red-400">
                Le sfide dei progetti tech
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-white/70">
                  <span className="text-red-400 mt-1">•</span>
                  <p>Progetti che si trascinano senza una fine apparente, consumando tempo e risorse preziose</p>
                </li>
                <li className="flex items-start gap-3 text-white/70">
                  <span className="text-red-400 mt-1">•</span>
                  <p>Budget che sfuggono al controllo, con costi che continuano ad aumentare senza risultati tangibili</p>
                </li>
                <li className="flex items-start gap-3 text-white/70">
                  <span className="text-red-400 mt-1">•</span>
                  <p>Frustrazione crescente dovuta a decisioni tecniche prese senza la giusta esperienza</p>
                </li>
                <li className="flex items-start gap-3 text-white/70">
                  <span className="text-red-400 mt-1">•</span>
                  <p>Risultati finali che non rispecchiano la visione iniziale del progetto</p>
                </li>
              </ul>
            </div>

            {/* Solution Column */}
            <div className="p-8 bg-gray-900 rounded border border-emerald-500/20 hover:border-emerald-500/40 transition-colors duration-300">
              <h2 className="text-2xl font-medium mb-6 text-emerald-400">
                La nostra soluzione
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-white/70">
                  <span className="text-emerald-400 mt-1">•</span>
                  <p>Esperienza concreta nella gestione di progetti tech, con una chiara roadmap per un controllo al dettaglio</p>
                </li>
                <li className="flex items-start gap-3 text-white/70">
                  <span className="text-emerald-400 mt-1">•</span>
                  <p>Competenza nel prevedere e gestire le sfide tecniche prima che diventino problemi</p>
                </li>
                <li className="flex items-start gap-3 text-white/70">
                  <span className="text-emerald-400 mt-1">•</span>
                  <p>Metodologia collaudata (a forza di cicatrici e porte in faccia.) che garantisce il rispetto di tempi e budget stabiliti</p>
                </li>
                <li className="flex items-start gap-3 text-white/70">
                  <span className="text-emerald-400 mt-1">•</span>
                  <p>Capacità di trasformare la visione iniziale in un prodotto concreto e coerente con le aspettative iniziali</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6 border-t border-white/[.1]"> 
        <div className="max-w-screen-xl mx-auto">
          <h2 className="text-3xl font-medium mb-12">I Nostri Servizi</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Analisi e Fattibilità */}
            <div className="border border-white/[.1] p-6 hover:border-white/20 transition-colors rounded">
              <h3 className="text-lg font-medium mb-4">Analisi e Fattibilità</h3>
              <p className="text-white/60 mb-6">
                Analisi preliminare del progetto, definizione delle risorse necessarie e tempistiche.
              </p>
              <p className="text-2xl font-medium mb-2">€1.500</p>
              <p className="text-sm text-white/40 mb-6">+ IVA • 10 giorni lavorativi</p>
              <button 
                onClick={() => router.push('/analisi-fattibilita')} 
                className="w-full inline-flex items-center justify-center gap-2 bg-white/10 text-white px-6 py-3 hover:bg-white/20 transition-colors rounded"
              >
                Approfondisci <ArrowRight size={18} className="transform rotate-45" />
              </button>
            </div>
            
            {/* Selezione Fornitori */}
            <div className="border border-white/[.1] p-6 hover:border-white/20 transition-colors rounded">
              <h3 className="text-lg font-medium mb-4">Selezione Fornitori</h3>
              <p className="text-white/60 mb-6">
                Ricerca e selezione dei migliori professionisti per il tuo progetto.
              </p>
              <p className="text-2xl font-medium mb-2">€1.500</p>
              <p className="text-sm text-white/40 mb-6">+ IVA • 10 giorni lavorativi</p>
              <button 
                onClick={() => router.push('/selezione-fornitori')} 
                className="w-full inline-flex items-center justify-center gap-2 bg-white/10 text-white px-6 py-3 hover:bg-white/20 transition-colors rounded"
              >
                Approfondisci <ArrowRight size={18} className="transform rotate-45" />
              </button>
            </div>

            {/* Esecuzione */}
            <div className="border border-white/[.1] p-6 hover:border-white/20 transition-colors rounded">
              <h3 className="text-lg font-medium mb-4">Esecuzione, sviluppo e delivery</h3>
              <p className="text-white/60 mb-6">
                Supervisione continua del team di sviluppo, controllo qualità e consegna finale.
              </p>
              <p className="text-2xl font-medium mb-2">12%</p>
              <p className="text-sm text-white/40 mb-6">del valore totale (min. €2.500 + IVA)</p>
              <button 
                onClick={() => router.push('/esecuzione-sviluppo-delivery')} 
                className="w-full inline-flex items-center justify-center gap-2 bg-white/10 text-white px-6 py-3 hover:bg-white/20 transition-colors rounded"
              >
                Approfondisci <ArrowRight size={18} className="transform rotate-45" />
              </button>
            </div>
          </div>
        </div>
        </section>


        {/* Tech Products Section */}
        <TechProducts />
      

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

      {/* Blog Section */}
        <section className="py-20 px-6 border-t border-white/[.1] bg-gray-800">
          <div className="max-w-screen-xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-5xl font-medium tracking-tight mb-6">
                  Racconto, ricerca, repeat.
                </h2>
                <p className="text-lg text-white/60 mb-8 max-w-xl">
                  Il nostro blog per condividere chi siamo e dove vogliamo arrivare. Segui il nostro percorso tra gestione progetti, tech e innovazione.
                </p>
                <Link 
                  href="/blog"
                  className="bg-white text-black px-6 py-3 inline-flex items-center gap-2 hover:bg-white/90 transition-colors rounded"
                >
                  Leggi il blog <ArrowRight size={18} />
                </Link>
              </div>
              <div className="relative w-full aspect-square md:aspect-video">
                <div className="absolute inset-0 rounded border border-white/[.1] hover:border-white/20 transition-colors bg-gray-900 p-8">
                  <div className="flex flex-col h-full">
                    <h3 className="text-2xl font-medium mb-4">NextJs + Supabase: lo stack tech senza compromessi</h3>
                    <p className="text-white/60 mb-6">Ogni progetto di sviluppo tech richiede scelte già dal giorno 0. La difficoltà di tali scelte sta nel tempo d&apos;impatto: solo aul finire del progetto si comprende se le scelte del momento 0 sono state vincenti. Non prima.</p>
                    <div className="mt-auto">
                      <span className="inline-flex items-center gap-2 text-white/80">
                        leggi <ArrowRight size={18} />
                      </span>
                    </div>
                  </div>
                </div>
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