"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Code, Database, Zap, Globe, Shield, Smartphone, BarChart3, Users, MessageSquare, CheckCircle, Link, Layers, ShoppingCart } from "lucide-react";
import { FloatingChatButton } from "@/components/chat/FloatingChatButton";
import { ChatWidget } from "@/components/chat/ChatWidget";

export default function Home() {
  const [currentCard, setCurrentCard] = useState(0);
  const [currentCTA, setCurrentCTA] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [initialChatMessage, setInitialChatMessage] = useState<string | undefined>();

  // Card del carosello con potenziali richieste
  const requestCards = [
    {
      text: "Voglio un gestionale per la mia azienda che sincronizzi tutto in tempo reale",
      icon: <BarChart3 className="w-6 h-6" />,
    },
    {
      text: "Ho bisogno di una piattaforma e-commerce con pagamenti integrati",
      icon: <Globe className="w-6 h-6" />,
    },
    {
      text: "Cerco un'app web per gestire i miei clienti e progetti",
      icon: <Users className="w-6 h-6" />,
    },
    {
      text: "Vorrei digitalizzare i processi della mia startup",
      icon: <Zap className="w-6 h-6" />,
    },
    {
      text: "Serve un dashboard analytics per i nostri dati business",
      icon: <BarChart3 className="w-6 h-6" />,
    },
    {
      text: "Voglio un sistema di prenotazioni online per il mio business",
      icon: <Database className="w-6 h-6" />,
    },
    {
      text: "Ho bisogno di un'app mobile-first per i miei utenti",
      icon: <Smartphone className="w-6 h-6" />,
    },
    {
      text: "Cerco una piattaforma di learning management personalizzata",
      icon: <Code className="w-6 h-6" />,
    },
    {
      text: "Serve un tool interno per automatizzare i workflow",
      icon: <Zap className="w-6 h-6" />,
    },
    {
      text: "Voglio integrare AI e automazioni nel mio prodotto esistente",
      icon: <MessageSquare className="w-6 h-6" />,
    },
    {
      text: "Ho bisogno di un sistema di autenticazione sicuro e scalabile",
      icon: <Shield className="w-6 h-6" />,
    },
    {
      text: "Cerco una soluzione custom per inventory management",
      icon: <Database className="w-6 h-6" />,
    },
  ];

  // Progetti di esempio
  const exampleProjects = [
    {
      title: "Booking Rifugi & Hotels",
      description: "Sistema prenotazioni per rifugi alpini con pagamenti Stripe, calendario disponibilità e gestione tariffe stagionali",
      tech: ["Next.js", "Supabase", "Stripe Connect", "Maps API"],
    },
    {
      title: "E-commerce Multi-Vendor",
      description: "Marketplace con commissioni automatiche, split payments tra venditori e pagamenti differiti",
      tech: ["Next.js", "PostgreSQL", "Stripe Marketplace", "AWS"],
    },
    {
      title: "SaaS Subscription Platform",
      description: "Piattaforma abbonamenti ricorrenti con trial gratuiti, upgrade/downgrade e fatturazione automatica",
      tech: ["Next.js", "Supabase", "Stripe Billing", "Webhooks"],
    },
    {
      title: "Booking Ristoranti Premium",
      description: "Sistema prenotazioni con depositi cauzionali, menu digitali e pagamenti contactless al tavolo",
      tech: ["Next.js", "Real-time DB", "Stripe Terminal", "QR Codes"],
    },
    {
      title: "Piattaforma Eventi & Tickets",
      description: "Vendita biglietti online con QR codes, check-in digitale e rimborsi automatici per cancellazioni",
      tech: ["Next.js", "PostgreSQL", "Stripe", "PDF Generation"],
    },
    {
      title: "Coworking Space Manager",
      description: "Gestione spazi condivisi con booking sale riunioni, pagamenti orari e accesso controllato",
      tech: ["React", "Supabase", "Stripe", "IoT Integration"],
    },
    {
      title: "Fitness Studio Booking",
      description: "Prenotazioni lezioni fitness con pacchetti crediti, pagamenti ricorrenti e wearable sync",
      tech: ["Next.js", "Supabase", "Stripe", "Health APIs"],
    },
    {
      title: "Servizi Professionali Hub",
      description: "Marketplace consulenti con booking video-call, pagamenti escrow e sistema reviews verificate",
      tech: ["Next.js", "PostgreSQL", "Stripe Connect", "Video SDK"],
    },
    {
      title: "Car Sharing Platform",
      description: "Condivisione auto peer-to-peer con depositi cauzionali, assicurazioni integrate e tracking GPS",
      tech: ["React Native", "Supabase", "Stripe", "GPS Tracking"],
    },
    {
      title: "Medical Appointments",
      description: "Prenotazioni visite mediche con pagamenti anticipati, teleconsulti e integrazione cartelle cliniche",
      tech: ["Next.js", "HIPAA DB", "Stripe", "Telemedicine"],
    },
    {
      title: "Rental Equipment Manager",
      description: "Noleggio attrezzature con caluzioni dinamiche, tracking availability e damage assessment",
      tech: ["Next.js", "PostgreSQL", "Stripe", "Image Recognition"],
    },
    {
      title: "Learning Marketplace",
      description: "Corsi online con revenue sharing, certificazioni digitali e live streaming integrato",
      tech: ["Next.js", "Supabase", "Stripe Connect", "Video Platform"],
    },
  ];

  // Testi CTA rotanti
  const ctaTexts = [
    "Raccontaci la tua idea",
    "Raccontaci il tuo progetto", 
    "Raccontaci la tua esigenza"
  ];

  // Auto-scroll del carosello
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCard((prev) => (prev + 1) % requestCards.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [requestCards.length]);

  // Auto-rotazione CTA
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCTA((prev) => (prev + 1) % ctaTexts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [ctaTexts.length]);

  const nextCard = () => {
    setCurrentCard((prev) => (prev + 1) % requestCards.length);
  };

  const prevCard = () => {
    setCurrentCard((prev) => (prev - 1 + requestCards.length) % requestCards.length);
  };

  const openChat = (message?: string) => {
    setInitialChatMessage(message);
    setIsChatOpen(true);
  };

  const closeChat = () => {
    setIsChatOpen(false);
    setInitialChatMessage(undefined);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold flex items-center">
                tec<span className="relative inline-block">
                  <span className="font-black text-primary decoration-primary/60 decoration-2 underline-offset-4 relative text-3xl">
                    <span className="">H</span>
                  </span>
                </span>ero
              </h1>
            </div>
            <Button 
              className="rounded-full px-6"
              onClick={() => openChat("Ciao! Vorrei iniziare un progetto con voi")}
            >
              Inizia
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20"></div>
        <div className="container mx-auto px-4 py-24 sm:py-32 relative">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              <span className="inline-block animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                Progetti tech da{" "}
              </span>
              <span className="inline-block text-muted-foreground animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                zero
              </span>
              <span className="inline-block animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                {" "}a{" "}
              </span>
              <span className="relative inline-block animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
                <span className="font-black text-primary underline decoration-primary/60 decoration-4 underline-offset-8 relative">
                  <span className="">hero</span>
                  {/* Effetto scintilla */}
                  <span className="absolute -top-2 -right-2 text-primary/70 animate-sparkle text-lg">✨</span>
                  <span className="absolute -bottom-1 -left-1 text-primary/50 animate-sparkle-delayed text-sm">⭐</span>
                </span>
                {/* Ring effect pulsante */}
                <div className="absolute inset-0 rounded-lg border-2 border-primary/30 animate-ping-slow scale-110"></div>
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground mb-12 leading-relaxed animate-fade-in-up" style={{ animationDelay: '1.2s' }}>
              Trasformiamo le tue idee in soluzioni digitali concrete.
              <br className="hidden sm:block" />
              Stack moderno, modularità, partnership.
            </p>
                          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up" style={{ animationDelay: '1.6s' }}>
                <Button 
                  size="lg" 
                  className="text-lg px-8 py-6 rounded-full hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-xl relative overflow-hidden"
                  onClick={() => openChat("Ciao! Vorrei raccontarvi la mia idea di progetto")}
                >
                  <div className="relative">
                    {ctaTexts.map((text, index) => (
                      <span
                        key={index}
                        className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
                          index === currentCTA 
                            ? 'opacity-100 transform translate-y-0' 
                            : index === (currentCTA - 1 + ctaTexts.length) % ctaTexts.length
                            ? 'opacity-0 transform -translate-y-full'
                            : 'opacity-0 transform translate-y-full'
                        }`}
                      >
                        {text}
                      </span>
                    ))}
                    {/* Span invisibile per mantenere la dimensione */}
                    <span className="opacity-0 pointer-events-none">
                      Raccontaci la tua esigenza
                    </span>
                  </div>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-lg px-8 py-6 rounded-full hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-xl border-primary/30 hover:border-primary/60 hover:bg-primary/5"
                  onClick={() => openChat("Ciao! Vorrei raccontarvi il mio progetto")}
                >
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Chatta col nostro Bot
                </Button>
              </div>
              <p className="text-sm text-muted-foreground/80 mt-6 animate-fade-in-up" style={{ animationDelay: '2s' }}>
                oppure mandaci una mail come una volta:  
                <a href="mailto:scrivici@techero.xyz" className="ml-1 underline hover:text-primary transition-colors">
                  scrivici@techero.xyz
                </a>
              </p>
          </div>
        </div>
      </section>

      {/* Carosello delle richieste */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Cosa potresti chiederci
            </h2>
            <p className="text-lg text-muted-foreground">
              Esempi di richieste che riceviamo ogni giorno
            </p>
          </div>

          <div className="max-w-5xl mx-auto relative">
            <div className="flex items-center justify-center">
              <Button
                variant="outline"
                size="icon"
                onClick={prevCard}
                className="absolute left-0 z-20 rounded-full shadow-xl bg-background/80 backdrop-blur-sm border-2 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 hover:scale-110"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>

              {/* Container con overflow hidden per animazioni smooth */}
              <div className="w-full max-w-3xl mx-16 min-h-[240px] relative overflow-hidden">
                <div 
                  className="flex transition-transform duration-700 ease-in-out"
                  style={{ transform: `translateX(-${currentCard * 100}%)` }}
                >
                  {requestCards.map((card, index) => (
                    <div key={index} className="w-full flex-shrink-0">
                      <Card className="mx-2 border-2 bg-gradient-to-br from-card via-card to-muted/30 hover:shadow-2xl transition-all duration-500 group">
                        <CardContent className="p-8 text-center min-h-[200px] flex flex-col justify-center">
                          {/* Icona animata */}
                          <div className="flex justify-center mb-6">
                            <div className="relative">
                              <div className="p-4 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 text-primary group-hover:from-primary/30 group-hover:to-primary/10 transition-all duration-500 group-hover:scale-110">
                                <div className="transform transition-transform duration-500 group-hover:rotate-12">
                                  {card.icon}
                                </div>
                              </div>
                              {/* Ring effect */}
                              <div className="absolute inset-0 rounded-full border-2 border-primary/0 group-hover:border-primary/20 transition-all duration-500 scale-110 group-hover:scale-125"></div>
                            </div>
                          </div>
                          
                          {/* Testo con effetto typing */}
                          <div className="relative">
                            <p className="text-lg sm:text-xl italic text-foreground leading-relaxed font-medium">
                              <span className="inline-block">&quot;</span>
                              <span className="inline-block transition-all duration-300 group-hover:text-primary/90">
                                {card.text}
                              </span>
                              <span className="inline-block">&quot;</span>
                            </p>
                            
                            {/* Underscore blinking effect */}
                            <span className="inline-block w-0.5 h-6 bg-primary ml-1 animate-pulse"></span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={nextCard}
                className="absolute right-0 z-20 rounded-full shadow-xl bg-background/80 backdrop-blur-sm border-2 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 hover:scale-110"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>

            {/* Indicatori migliorati */}
            <div className="flex justify-center mt-8 gap-3">
              {requestCards.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentCard(index)}
                  className={`relative transition-all duration-300 ${
                    index === currentCard 
                      ? "w-8 h-3" 
                      : "w-3 h-3 hover:w-4"
                  }`}
                >
                  <div className={`w-full h-full rounded-full transition-all duration-300 ${
                    index === currentCard 
                      ? "bg-primary shadow-lg shadow-primary/40" 
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}></div>
                  
                  {/* Ring effect per indicatore attivo */}
                  {index === currentCard && (
                    <div className="absolute inset-0 rounded-full border-2 border-primary/30 scale-150 animate-pulse"></div>
                  )}
                </button>
              ))}
            </div>

            {/* Progress bar */}
            <div className="mt-6 max-w-md mx-auto">
              <div className="w-full bg-muted/30 rounded-full h-1">
                <div 
                  className="bg-gradient-to-r from-primary to-primary/60 h-1 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${((currentCard + 1) / requestCards.length) * 100}%` }}
                ></div>
              </div>
              <p className="text-center text-sm text-muted-foreground mt-2">
                {currentCard + 1} di {requestCards.length}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sezione Progetti */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Progetti che realizziamo
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Esempi di soluzioni che sviluppiamo per i nostri clienti.
              Dal concept al deploy, ogni progetto è unico.
            </p>
          </div>

          {/* Griglia a muro di mattoni */}
          <div className="relative">
            {/* Prima riga */}
            <div className="flex flex-wrap justify-center gap-4 mb-4">
              {exampleProjects.slice(0, 4).map((project, index) => (
                <Card 
                  key={index} 
                  className="group relative overflow-hidden border-2 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 hover:border-primary/50 hover:-translate-y-2"
                  style={{
                    width: 'clamp(280px, 30vw, 350px)',
                    background: 'linear-gradient(135deg, var(--card) 0%, var(--muted) 100%)'
                  }}
                >
                  {/* Effetto retroilluminazione */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:via-primary/10 group-hover:to-primary/5 transition-all duration-500 pointer-events-none" />
                  
                  <CardContent className="p-6 relative z-10">
                    <h3 className="text-lg font-bold mb-3 group-hover:text-primary transition-colors duration-300">
                      {project.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 leading-relaxed line-clamp-3">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {project.tech.slice(0, 3).map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="px-2 py-1 bg-muted/50 rounded-md text-xs font-medium group-hover:bg-primary/10 transition-colors"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.tech.length > 3 && (
                        <span className="px-2 py-1 bg-muted/50 rounded-md text-xs font-medium">
                          +{project.tech.length - 3}
                        </span>
                      )}
                    </div>
                    <div className="flex justify-center">
                      <Button 
                        size="sm" 
                        className="text-xs px-4 rounded-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                        onClick={() => openChat(`Ciao! Sono interessato a un progetto simile a: ${project.title}`)}
                      >
                        Cerchi qualcosa di simile?
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Seconda riga - sfalsata */}
            <div className="flex flex-wrap justify-center gap-4 mb-4" style={{ transform: 'translateX(clamp(-100px, -15vw, -175px))' }}>
              {exampleProjects.slice(4, 7).map((project, index) => (
                <Card 
                  key={index + 3} 
                  className="group relative overflow-hidden border-2 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 hover:border-primary/50 hover:-translate-y-2"
                  style={{
                    width: 'clamp(280px, 30vw, 350px)',
                    background: 'linear-gradient(135deg, var(--card) 0%, var(--muted) 100%)'
                  }}
                >
                  {/* Effetto retroilluminazione */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:via-primary/10 group-hover:to-primary/5 transition-all duration-500 pointer-events-none" />
                  
                  <CardContent className="p-6 relative z-10">
                    <h3 className="text-lg font-bold mb-3 group-hover:text-primary transition-colors duration-300">
                      {project.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 leading-relaxed line-clamp-3">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {project.tech.slice(0, 3).map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="px-2 py-1 bg-muted/50 rounded-md text-xs font-medium group-hover:bg-primary/10 transition-colors"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.tech.length > 3 && (
                        <span className="px-2 py-1 bg-muted/50 rounded-md text-xs font-medium">
                          +{project.tech.length - 3}
                        </span>
                      )}
                    </div>
                    <div className="flex justify-center">
                      <Button 
                        size="sm" 
                        className="text-xs px-4 rounded-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                        onClick={() => openChat(`Ciao! Sono interessato a un progetto simile a: ${project.title}`)}
                      >
                        Cerchi qualcosa di simile?
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Terza riga - allineata come la prima */}
            <div className="flex flex-wrap justify-center gap-4 mb-4">
              {exampleProjects.slice(7, 11).map((project, index) => (
                <Card 
                  key={index + 6} 
                  className="group relative overflow-hidden border-2 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 hover:border-primary/50 hover:-translate-y-2"
                  style={{
                    width: 'clamp(280px, 30vw, 350px)',
                    background: 'linear-gradient(135deg, var(--card) 0%, var(--muted) 100%)'
                  }}
                >
                  {/* Effetto retroilluminazione */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:via-primary/10 group-hover:to-primary/5 transition-all duration-500 pointer-events-none" />
                  
                  <CardContent className="p-6 relative z-10">
                    <h3 className="text-lg font-bold mb-3 group-hover:text-primary transition-colors duration-300">
                      {project.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 leading-relaxed line-clamp-3">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {project.tech.slice(0, 3).map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="px-2 py-1 bg-muted/50 rounded-md text-xs font-medium group-hover:bg-primary/10 transition-colors"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.tech.length > 3 && (
                        <span className="px-2 py-1 bg-muted/50 rounded-md text-xs font-medium">
                          +{project.tech.length - 3}
                        </span>
                      )}
                    </div>
                    <div className="flex justify-center">
                      <Button 
                        size="sm" 
                        className="text-xs px-4 rounded-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                        onClick={() => openChat(`Ciao! Sono interessato a un progetto simile a: ${project.title}`)}
                      >
                        Cerchi qualcosa di simile?
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quarta riga - sfalsata */}
            <div className="flex flex-wrap justify-center gap-4" style={{ transform: 'translateX(clamp(-100px, -15vw, -175px))' }}>
              {exampleProjects.slice(11, 12).map((project, index) => (
                <Card 
                  key={index + 11} 
                  className="group relative overflow-hidden border-2 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 hover:border-primary/50 hover:-translate-y-2"
                  style={{
                    width: 'clamp(280px, 30vw, 350px)',
                    background: 'linear-gradient(135deg, var(--card) 0%, var(--muted) 100%)'
                  }}
                >
                  {/* Effetto retroilluminazione */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:via-primary/10 group-hover:to-primary/5 transition-all duration-500 pointer-events-none" />
                  
                  <CardContent className="p-6 relative z-10">
                    <h3 className="text-lg font-bold mb-3 group-hover:text-primary transition-colors duration-300">
                      {project.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 leading-relaxed line-clamp-3">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {project.tech.slice(0, 3).map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="px-2 py-1 bg-muted/50 rounded-md text-xs font-medium group-hover:bg-primary/10 transition-colors"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.tech.length > 3 && (
                        <span className="px-2 py-1 bg-muted/50 rounded-md text-xs font-medium">
                          +{project.tech.length - 3}
                        </span>
                      )}
                    </div>
                    <div className="flex justify-center">
                      <Button 
                        size="sm" 
                        className="text-xs px-4 rounded-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                        onClick={() => openChat(`Ciao! Sono interessato a un progetto simile a: ${project.title}`)}
                      >
                        Cerchi qualcosa di simile?
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>


        </div>
      </section>

      {/* Sezione Come lo realizziamo */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Come lo realizziamo
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Il nostro processo consolidato in 6 passaggi. Dalla prima idea al prodotto finale,
              ti accompagniamo in ogni fase con trasparenza totale.
            </p>
          </div>

          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              
              {/* Passaggio 1 - Bot Chat */}
              <Card className="group relative overflow-hidden border-2 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 hover:border-primary/50 hover:-translate-y-2 bg-gradient-to-br from-card via-card to-muted/30">
                {/* Effetto retroilluminazione Vercel-style */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:via-primary/10 group-hover:to-primary/5 transition-all duration-500 pointer-events-none" />
                
                <CardContent className="p-8 relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-500/5 flex items-center justify-center text-blue-600 group-hover:from-blue-500/30 group-hover:to-blue-500/10 transition-all duration-500">
                      <span className="text-xl font-bold">1</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-blue-600" />
                      <h3 className="text-xl font-bold group-hover:text-primary transition-colors duration-300">
                        Chat con il nostro Bot
                      </h3>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Il nostro bot intelligente ti guida nella definizione del progetto, raccogliendo tutti i 
                    dettagli tecnici e funzionali necessari. È disponibile 24/7 e capisce esattamente cosa ti serve.
                  </p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Analisi dei requisiti funzionali</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Definizione scope tecnico</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Prime stime di budget e tempi</span>
                    </div>
                  </div>

                  <Button 
                    size="sm" 
                    className="w-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-300 hover:scale-105 shadow-lg text-white"
                    onClick={() => openChat("Ciao! Vorrei iniziare a delineare il mio progetto con il vostro bot")}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Chatta subito col Bot
                  </Button>
                </CardContent>
              </Card>

              {/* Passaggio 2 - Call di approfondimento */}
              <Card className="group relative overflow-hidden border-2 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20 hover:border-green-500/50 hover:-translate-y-2 bg-gradient-to-br from-card via-card to-muted/30">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 via-green-500/0 to-green-500/0 group-hover:from-green-500/5 group-hover:via-green-500/10 group-hover:to-green-500/5 transition-all duration-500 pointer-events-none" />
                
                <CardContent className="p-8 relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500/20 to-green-500/5 flex items-center justify-center text-green-600 group-hover:from-green-500/30 group-hover:to-green-500/10 transition-all duration-500">
                      <span className="text-xl font-bold">2</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-green-600" />
                      <h3 className="text-xl font-bold group-hover:text-green-600 transition-colors duration-300">
                        Call di approfondimento
                      </h3>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Una videocall di 30-45 minuti con il nostro team per approfondire gli aspetti tecnici, 
                    discutere l&apos;architettura ideale e definire insieme la roadmap di sviluppo.
                  </p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Analisi tecnica approfondita</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Definizione architettura</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Planning milestone e sprint</span>
                    </div>
                  </div>

                  <div className="w-full h-10 rounded-full bg-muted/30 flex items-center justify-center text-sm text-muted-foreground">
                    Dopo la chat col bot
                  </div>
                </CardContent>
              </Card>

              {/* Passaggio 3 - Offerta vincolante */}
              <Card className="group relative overflow-hidden border-2 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 hover:border-purple-500/50 hover:-translate-y-2 bg-gradient-to-br from-card via-card to-muted/30">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-purple-500/0 to-purple-500/0 group-hover:from-purple-500/5 group-hover:via-purple-500/10 group-hover:to-purple-500/5 transition-all duration-500 pointer-events-none" />
                
                <CardContent className="p-8 relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/20 to-purple-500/5 flex items-center justify-center text-purple-600 group-hover:from-purple-500/30 group-hover:to-purple-500/10 transition-all duration-500">
                      <span className="text-xl font-bold">3</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-purple-600" />
                      <h3 className="text-xl font-bold group-hover:text-purple-600 transition-colors duration-300">
                        Offerta vincolante
                      </h3>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Ricevi una proposta dettagliata con prezzo fisso, timeline precisa e specifiche tecniche complete. 
                    Niente sorprese: quello che vedi è quello che paghi.
                  </p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Prezzo fisso.</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Timeline progettuale</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Specifiche tecniche di implementazione</span>
                    </div>
                  </div>

                  <div className="w-full h-10 rounded-full bg-muted/30 flex items-center justify-center text-sm text-muted-foreground">
                    Entro 48h dalla call
                  </div>
                </CardContent>
              </Card>

              {/* Passaggio 4 - Sviluppo con updates */}
              <Card className="group relative overflow-hidden border-2 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/20 hover:border-orange-500/50 hover:-translate-y-2 bg-gradient-to-br from-card via-card to-muted/30">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 via-orange-500/0 to-orange-500/0 group-hover:from-orange-500/5 group-hover:via-orange-500/10 group-hover:to-orange-500/5 transition-all duration-500 pointer-events-none" />
                
                <CardContent className="p-8 relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500/20 to-orange-500/5 flex items-center justify-center text-orange-600 group-hover:from-orange-500/30 group-hover:to-orange-500/10 transition-all duration-500">
                      <span className="text-xl font-bold">4</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Code className="w-5 h-5 text-orange-600" />
                      <h3 className="text-xl font-bold group-hover:text-orange-600 transition-colors duration-300">
                        Sviluppo e aggiornamenti
                      </h3>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Iniziamo lo sviluppo e ti teniamo sempre aggiornato. Ricevi un link personalizzato per 
                    seguire i progressi in tempo reale e testare le funzionalità man mano che vengono implementate.
                  </p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Aggiornamento avanzamenti</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Link di test dedicato</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Feedback continuo</span>
                    </div>
                  </div>

                  <div className="w-full h-10 rounded-full bg-muted/30 flex items-center justify-center text-sm text-muted-foreground">
                    Dopo l&apos;accettazione
                  </div>
                </CardContent>
              </Card>

              {/* Passaggio 5 - Test e finalizzazione */}
              <Card className="group relative overflow-hidden border-2 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20 hover:border-cyan-500/50 hover:-translate-y-2 bg-gradient-to-br from-card via-card to-muted/30">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 via-cyan-500/0 to-cyan-500/0 group-hover:from-cyan-500/5 group-hover:via-cyan-500/10 group-hover:to-cyan-500/5 transition-all duration-500 pointer-events-none" />
                
                <CardContent className="p-8 relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 flex items-center justify-center text-cyan-600 group-hover:from-cyan-500/30 group-hover:to-cyan-500/10 transition-all duration-500">
                      <span className="text-xl font-bold">5</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-cyan-600" />
                      <h3 className="text-xl font-bold group-hover:text-cyan-600 transition-colors duration-300">
                        Test e finalizzazione
                      </h3>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Fase finale di testing approfondito su tutti i dispositivi e browser. Risolviamo ogni bug, 
                    ottimizziamo le performance e ci assicuriamo che tutto funzioni perfettamente.
                  </p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Testing</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Ottimizzazione</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Bug fixing</span>
                    </div>
                  </div>

                  <div className="w-full h-10 rounded-full bg-muted/30 flex items-center justify-center text-sm text-muted-foreground">
                    Ultima settimana
                  </div>
                </CardContent>
              </Card>

              {/* Passaggio 6 - Deploy e monitoraggio */}
              <Card className="group relative overflow-hidden border-2 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/20 hover:border-emerald-500/50 hover:-translate-y-2 bg-gradient-to-br from-card via-card to-muted/30">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 via-emerald-500/0 to-emerald-500/0 group-hover:from-emerald-500/5 group-hover:via-emerald-500/10 group-hover:to-emerald-500/5 transition-all duration-500 pointer-events-none" />
                
                <CardContent className="p-8 relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 flex items-center justify-center text-emerald-600 group-hover:from-emerald-500/30 group-hover:to-emerald-500/10 transition-all duration-500">
                      <span className="text-xl font-bold">6</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-emerald-600" />
                      <h3 className="text-xl font-bold group-hover:text-emerald-600 transition-colors duration-300">
                        Deploy e monitoraggio
                      </h3>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Pubblichiamo il tuo progetto in produzione e lo monitoriamo attivamente per 30 giorni. 
                    Siamo sempre disponibili per fix urgenti e piccoli aggiustamenti.
                  </p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Deploy in produzione</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Monitoraggio 30 giorni</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Support incluso</span>
                    </div>
                  </div>

                  <div className="w-full h-10 rounded-full bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 flex items-center justify-center text-sm font-medium text-emerald-700">
                    🎉 Progetto LIVE!
                  </div>
                </CardContent>
              </Card>

            </div>

          </div>
        </div>
      </section>

      {/* Stack Tecnologico */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Il nostro stack tecnologico
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Tecnologie moderne e affidabili per costruire soluzioni scalabili, 
              performanti e <span className="font-semibold text-foreground">GDPR compliant</span>.
            </p>
          </div>

          {/* Core Stack */}
          <div className="mb-16">
            <h3 className="text-2xl font-semibold text-center mb-8">Core Technologies</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center group-hover:from-primary/30 group-hover:to-primary/10 transition-all">
                    <Code className="w-8 h-8 text-primary" />
                  </div>
                  <h4 className="text-xl font-bold mb-3">Next.js</h4>
                  <p className="text-muted-foreground">
                    Framework React per applicazioni web moderne, SSR e performance ottimali
                  </p>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center group-hover:from-primary/30 group-hover:to-primary/10 transition-all">
                    <Database className="w-8 h-8 text-primary" />
                  </div>
                  <h4 className="text-xl font-bold mb-3">Supabase</h4>
                  <p className="text-muted-foreground">
                    PostgreSQL gestito con auth, real-time e API REST/GraphQL integrate
                  </p>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center group-hover:from-primary/30 group-hover:to-primary/10 transition-all">
                    <Zap className="w-8 h-8 text-primary" />
                  </div>
                  <h4 className="text-xl font-bold mb-3">Vercel</h4>
                  <p className="text-muted-foreground">
                    Deploy automatici, CDN globale e performance monitoring integrato
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Integrazioni e Servizi */}
          <div className="mb-16">
            <h3 className="text-2xl font-semibold text-center mb-8">Integrazioni & Servizi</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
              {[
                { name: "Stripe", description: "Pagamenti sicuri", icon: <CheckCircle className="w-5 h-5" /> },
                { name: "Airtable", description: "Database flessibili", icon: <Database className="w-5 h-5" /> },
                { name: "HubSpot", description: "CRM e marketing", icon: <Users className="w-5 h-5" /> },
                { name: "Custom APIs", description: "Connettori personalizzati", icon: <Link className="w-5 h-5" /> },
                { name: "AWS Services", description: "Cloud infrastructure", icon: <Globe className="w-5 h-5" /> },
                { name: "SendGrid", description: "Email transazionali", icon: <MessageSquare className="w-5 h-5" /> },
                { name: "Twilio", description: "SMS e comunicazioni", icon: <Smartphone className="w-5 h-5" /> },
                { name: "Google APIs", description: "Maps, Analytics, Drive", icon: <Layers className="w-5 h-5" /> },
              ].map((service, index) => (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-primary">{service.icon}</div>
                      <h5 className="font-semibold text-sm">{service.name}</h5>
                    </div>
                    <p className="text-xs text-muted-foreground">{service.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* GDPR & Security */}
          <div className="relative">
            <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="p-8 text-center">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                    <Shield className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4">Conformità GDPR garantita</h3>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
                  Ogni soluzione che sviluppiamo rispetta i più alti standard di privacy e sicurezza, 
                  con implementazione completa delle normative GDPR europee.
                </p>
                <div className="flex flex-wrap justify-center gap-4 text-sm">
                  <span className="flex items-center gap-2 bg-background/60 px-3 py-1 rounded-full">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Consensi privacy
                  </span>
                  <span className="flex items-center gap-2 bg-background/60 px-3 py-1 rounded-full">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Data encryption
                  </span>
                  <span className="flex items-center gap-2 bg-background/60 px-3 py-1 rounded-full">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Right to be forgotten
                  </span>
                  <span className="flex items-center gap-2 bg-background/60 px-3 py-1 rounded-full">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Audit trails
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Sezione Investimento */}
      <section className="py-20 bg-muted/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-muted-foreground/80 italic">
              &quot;Di che investimento parliamo?&quot;
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              La domanda che tutti ci fanno. Ecco la nostra risposta.
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            {/* Card principale con pricing approach */}
            <Card className="mb-12 border-2 bg-gradient-to-br from-card to-card/50">
              <CardContent className="p-8 sm:p-12">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div>
                    <h3 className="text-2xl font-bold mb-6">
                      Investimento basato sul valore, non sulle ore.
                    </h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      Non fatturiamo &quot;a tempo&quot; perché crediamo che il valore di un progetto 
                      non si misuri in ore, ma nei risultati che genera.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      Ogni progetto è valutato in base alla <span className="font-semibold text-foreground">complessità tecnica</span>, 
                      al <span className="font-semibold text-foreground">valore strategico</span> e ai 
                      <span className="font-semibold text-foreground"> tempi di sviluppo</span> a disposizione.
                    </p>
                  </div>
                  <div className="relative">
                    <div className="p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-primary mb-2">€ 2K - 40K+</div>
                        <p className="text-sm text-muted-foreground mb-4">Range tipico dei nostri progetti</p>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>MVP/Prototipo</span>
                            <span className="font-semibold">€ 2K - 6K</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Piattaforma completa</span>
                            <span className="font-semibold">€ 6K - 18K</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Sistema enterprise</span>
                            <span className="font-semibold">€ 15K+</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Grid con i vantaggi */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              <Card className="group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mb-4 group-hover:bg-green-500/20 transition-colors">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  </div>
                  <h4 className="font-semibold mb-3">Preventivo fisso</h4>
                  <p className="text-sm text-muted-foreground">
                    Prezzo concordato prima di iniziare. Niente sorprese o costi nascosti.
                  </p>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                    <Layers className="w-6 h-6 text-blue-500" />
                  </div>
                  <h4 className="font-semibold mb-3">Sviluppo agile</h4>
                  <p className="text-sm text-muted-foreground">
                    Iterazioni settimanali con feedback costante. Vedi i progressi in tempo reale.
                  </p>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-colors">
                    <Shield className="w-6 h-6 text-purple-500" />
                  </div>
                  <h4 className="font-semibold mb-3">Garanzia 3 mesi</h4>
                  <p className="text-sm text-muted-foreground">
                    Bug fixing e piccoli aggiustamenti inclusi nei primi 3 mesi dopo il lancio.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Call to action informativa */}
            {/* <div className="text-center bg-gradient-to-r from-muted/30 to-muted/20 rounded-2xl p-8">
              <h3 className="text-xl font-semibold mb-4">
                Vuoi un preventivo preciso?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Raccontaci il tuo progetto in una call di 30 minuti. 
                Ti daremo una stima dettagliata e un piano di sviluppo personalizzato.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  size="lg" 
                  className="px-8 rounded-full"
                  onClick={() => openChat("Ciao! Vorrei prenotare una call per discutere del mio progetto e avere un preventivo")}
                >
                  Prenota call
                </Button>
                {/* <Button variant="outline" size="lg" className="px-8 rounded-full">
                  Esempi di preventivi
                </Button> 
              </div>
            </div> */}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Portfolio
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              I progetti che abbiamo realizzato. Soluzioni reali, clienti soddisfatti.
            </p>
          </div>

          {/* Carosello Portfolio */}
          <div className="relative max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              
              {/* EU Dashboard Card */}
              <Card className="group relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer bg-gradient-to-br from-card via-card to-muted/30">
                <div 
                  className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:via-primary/10 group-hover:to-primary/5 transition-all duration-500 pointer-events-none" 
                />
                
                {/* Mockup grafico EU Dashboard */}
                <div className="relative h-48 bg-gradient-to-br from-blue-500/10 via-green-500/10 to-purple-500/10 overflow-hidden">
                  <div className="absolute inset-0 p-4">
                    {/* Simulazione header dashboard */}
                    <div className="w-full h-6 bg-gradient-to-r from-primary/20 to-primary/10 rounded mb-4"></div>
                    
                    {/* Simulazione stats cards */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="h-8 bg-blue-500/20 rounded"></div>
                      <div className="h-8 bg-green-500/20 rounded"></div>
                    </div>
                    
                    {/* Simulazione grafico */}
                    <div className="relative h-20 bg-gradient-to-t from-primary/30 to-transparent rounded">
                      <div className="absolute bottom-0 left-2 w-2 h-8 bg-blue-500/60 rounded-t"></div>
                      <div className="absolute bottom-0 left-6 w-2 h-12 bg-green-500/60 rounded-t"></div>
                      <div className="absolute bottom-0 left-10 w-2 h-6 bg-yellow-500/60 rounded-t"></div>
                      <div className="absolute bottom-0 left-14 w-2 h-10 bg-red-500/60 rounded-t"></div>
                      <div className="absolute bottom-0 left-18 w-2 h-14 bg-purple-500/60 rounded-t"></div>
                    </div>
                  </div>
                  
                  {/* Badge "LIVE" */}
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                    LIVE
                  </div>
                </div>

                <CardContent className="p-6 relative z-10">
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">
                    EU Dashboard Eurostat
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                    Dashboard interattiva con dati ufficiali Eurostat. 10 metriche economiche dell&apos;UE 
                    con grafici dinamici e statistiche in tempo reale.
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-2 py-1 bg-blue-500/10 text-blue-600 rounded-md text-xs font-medium">
                      Next.js
                    </span>
                    <span className="px-2 py-1 bg-green-500/10 text-green-600 rounded-md text-xs font-medium">
                      Recharts
                    </span>
                    <span className="px-2 py-1 bg-purple-500/10 text-purple-600 rounded-md text-xs font-medium">
                      Eurostat API
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <Button 
                      size="sm" 
                      className="text-xs px-4 rounded-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300 hover:scale-105 shadow-lg"
                      onClick={() => window.open('/eu-dashboard', '_blank')}
                    >
                      Visualizza Dashboard →
                    </Button>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Globe className="w-3 h-3" />
                      Demo
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Progetto 2 - E-commerce Platform */}
              <Card className="group relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer bg-gradient-to-br from-card via-card to-muted/30">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:via-primary/10 group-hover:to-primary/5 transition-all duration-500 pointer-events-none" />
                
                {/* Mockup E-commerce */}
                <div className="relative h-48 bg-gradient-to-br from-emerald-500/10 via-blue-500/10 to-violet-500/10 overflow-hidden">
                  <div className="absolute inset-0 p-4">
                    {/* Header e-commerce */}
                    <div className="flex justify-between items-center mb-4">
                      <div className="w-16 h-4 bg-emerald-500/30 rounded"></div>
                      <div className="w-8 h-4 bg-blue-500/30 rounded"></div>
                    </div>
                    
                    {/* Grid prodotti */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="h-12 bg-gradient-to-br from-emerald-500/20 to-emerald-500/10 rounded"></div>
                      <div className="h-12 bg-gradient-to-br from-blue-500/20 to-blue-500/10 rounded"></div>
                      <div className="h-12 bg-gradient-to-br from-violet-500/20 to-violet-500/10 rounded"></div>
                      <div className="h-12 bg-gradient-to-br from-orange-500/20 to-orange-500/10 rounded"></div>
                      <div className="h-12 bg-gradient-to-br from-pink-500/20 to-pink-500/10 rounded"></div>
                      <div className="h-12 bg-gradient-to-br from-cyan-500/20 to-cyan-500/10 rounded"></div>
                    </div>
                  </div>
                  
                  <div className="absolute top-4 right-4 bg-violet-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    SHOP
                  </div>
                </div>

                <CardContent className="p-6 relative z-10">
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">
                    Marketplace Multi-Vendor
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                    Piattaforma e-commerce completa con gestione multi-vendor, pagamenti Stripe, 
                    inventory tracking e dashboard analytics.
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-2 py-1 bg-emerald-500/10 text-emerald-600 rounded-md text-xs font-medium">
                      React
                    </span>
                    <span className="px-2 py-1 bg-blue-500/10 text-blue-600 rounded-md text-xs font-medium">
                      Stripe
                    </span>
                    <span className="px-2 py-1 bg-violet-500/10 text-violet-600 rounded-md text-xs font-medium">
                      PostgreSQL
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <Button 
                      size="sm" 
                      className="text-xs px-4 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 hover:scale-105 shadow-lg text-white"
                      onClick={() => openChat("Ciao! Sono interessato a un marketplace come quello nel vostro portfolio")}
                    >
                      Richiedi Info →
                    </Button>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <ShoppingCart className="w-3 h-3" />
                      E-commerce
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Progetto 3 - SaaS Platform */}
              <Card className="group relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer bg-gradient-to-br from-card via-card to-muted/30">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:via-primary/10 group-hover:to-primary/5 transition-all duration-500 pointer-events-none" />
                
                {/* Mockup SaaS */}
                <div className="relative h-48 bg-gradient-to-br from-indigo-500/10 via-cyan-500/10 to-teal-500/10 overflow-hidden">
                  <div className="absolute inset-0 p-4">
                    {/* Dashboard SaaS */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-6 h-6 bg-indigo-500/30 rounded-full"></div>
                      <div className="w-20 h-3 bg-indigo-500/20 rounded"></div>
                    </div>
                    
                    {/* Metrics */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="p-2 bg-gradient-to-br from-indigo-500/20 to-indigo-500/10 rounded">
                        <div className="w-8 h-2 bg-indigo-500/40 rounded mb-1"></div>
                        <div className="w-12 h-3 bg-indigo-500/60 rounded"></div>
                      </div>
                      <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-cyan-500/10 rounded">
                        <div className="w-8 h-2 bg-cyan-500/40 rounded mb-1"></div>
                        <div className="w-12 h-3 bg-cyan-500/60 rounded"></div>
                      </div>
                    </div>
                    
                    {/* Chart area */}
                    <div className="h-16 bg-gradient-to-t from-teal-500/20 to-transparent rounded relative">
                      <svg className="w-full h-full" viewBox="0 0 100 30">
                        <polyline 
                          fill="none" 
                          stroke="rgb(6 182 212)" 
                          strokeWidth="1.5" 
                          points="0,25 20,20 40,15 60,10 80,8 100,5"
                          opacity="0.7"
                        />
                      </svg>
                    </div>
                  </div>
                  
                  <div className="absolute top-4 right-4 bg-indigo-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    SaaS
                  </div>
                </div>

                <CardContent className="p-6 relative z-10">
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">
                    Analytics SaaS Platform
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                    Piattaforma SaaS con dashboard analytics, subscription billing, 
                    real-time data processing e integrazione AI.
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-2 py-1 bg-indigo-500/10 text-indigo-600 rounded-md text-xs font-medium">
                      Next.js
                    </span>
                    <span className="px-2 py-1 bg-cyan-500/10 text-cyan-600 rounded-md text-xs font-medium">
                      Supabase
                    </span>
                    <span className="px-2 py-1 bg-teal-500/10 text-teal-600 rounded-md text-xs font-medium">
                      OpenAI
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <Button 
                      size="sm" 
                      className="text-xs px-4 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 transition-all duration-300 hover:scale-105 shadow-lg text-white"
                      onClick={() => openChat("Ciao! Vorrei sviluppare una piattaforma SaaS simile a quella nel portfolio")}
                    >
                      Discuti Progetto →
                    </Button>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <BarChart3 className="w-3 h-3" />
                      Analytics
                    </div>
                  </div>
                </CardContent>
              </Card>

            </div>
          </div>
        </div>
      </section>

      {/* Sezione Partnership */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Partnership
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Conosci qualcuno che potrebbe aver bisogno dei nostri servizi? 
              Aiutaci a crescere e ricevi una commissione per ogni progetto che ci porti.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="group relative overflow-hidden border-2 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 hover:border-primary/50 bg-gradient-to-br from-card via-card to-muted/30">
              {/* Effetto retroilluminazione Vercel-style */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:via-primary/10 group-hover:to-primary/5 transition-all duration-500 pointer-events-none" />
              
              <CardContent className="p-8 sm:p-12 relative z-10">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  
                  {/* Lato sinistro - Info programma */}
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500/20 to-green-500/5 flex items-center justify-center group-hover:from-green-500/30 group-hover:to-green-500/10 transition-all duration-500">
                        <Users className="w-6 h-6 text-green-600" />
                      </div>
                      <h3 className="text-2xl font-bold group-hover:text-primary transition-colors duration-300">
                        Diventa nostro Partner
                      </h3>
                    </div>
                    
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      Cerchiamo appassionati di tecnologia, consulenti, freelancer e professionisti 
                      che vogliano consigliare i nostri servizi alla loro rete di contatti.
                    </p>
                    
                    <div className="space-y-4 mb-8">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-sm">Commissione solo a successo</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-sm">Supporto completo nel processo di vendita</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-sm">Materiali marketing e presentazioni pronte</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-sm">Referral tracking trasparente</span>
                      </div>
                    </div>

                    <Button 
                      size="lg" 
                      className="w-full sm:w-auto px-8 py-6 text-lg rounded-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-all duration-300 hover:scale-105 shadow-lg text-white"
                      onClick={() => openChat("Ciao! Vorrei sottoporti un progetto per il programma partnership")}
                    >
                      <Users className="w-5 h-5 mr-2" />
                      Sottoponi un progetto
                    </Button>
                  </div>

                  {/* Lato destro - Dettagli commissione */}
                  <div className="relative">
                    <div className="p-8 rounded-2xl bg-gradient-to-br from-green-500/5 to-green-500/10 border border-green-500/20 group-hover:from-green-500/10 group-hover:to-green-500/15 transition-all duration-500">
                      <div className="text-center mb-6">
                        <div className="text-4xl font-bold text-green-600 mb-2">15%</div>
                        <p className="text-lg font-semibold text-foreground">di commissione</p>
                        <p className="text-sm text-muted-foreground">su ogni progetto portato</p>
                      </div>
                      
                      <div className="space-y-4 mb-6">
                        <div className="flex justify-between items-center py-2 border-b border-muted/30">
                          <span className="text-sm text-muted-foreground">Commissione minima</span>
                          <span className="font-semibold text-green-600">€ 500</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-muted/30">
                          <span className="text-sm text-muted-foreground">Progetto da € 5.000</span>
                          <span className="font-semibold">€ 750</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-muted/30">
                          <span className="text-sm text-muted-foreground">Progetto da € 10.000</span>
                          <span className="font-semibold">€ 1.500</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-sm text-muted-foreground">Progetto da € 20.000</span>
                          <span className="font-semibold text-green-600">€ 3.000</span>
                        </div>
                      </div>
                      
                      <div className="bg-background/60 rounded-lg p-4 text-center">
                        <p className="text-xs text-muted-foreground mb-1">Pagamento commissione</p>
                        <p className="text-sm font-medium">Entro 7 giorni dal primo pagamento del cliente</p>
                      </div>
                    </div>
                    
                    {/* Badge "Solo a successo" */}
                    <div className="absolute -top-3 -right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                      Solo a successo
                    </div>
                  </div>
                </div>

                {/* Sezione informativa finale */}
                <div className="mt-12 pt-8 border-t border-muted/30">
                  <div className="text-center">
                    <p className="text-muted-foreground text-sm mb-4">
                      Come funziona? Semplice: ci presenti un potenziale cliente, 
                      se il progetto va in porto ricevi la tua commissione. 
                      Nessun rischio, solo opportunità.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="px-6 rounded-full border-green-500/30 hover:border-green-500/60 hover:bg-green-500/5"
                        onClick={() => openChat("Ciao! Vorrei sapere di più su come funziona il programma partnership")}
                      >
                        Come funziona?
                      </Button>
                      <span className="text-xs text-muted-foreground">
                        o scrivici: 
                        <a href="mailto:partnership@techero.xyz" className="ml-1 underline hover:text-primary transition-colors">
                          partnership@techero.xyz
                        </a>
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action finale */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Pronti a partire?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Raccontaci la tua idea e trasformiamola insieme in realtà.
          </p>
          <p className="text-sm text-muted-foreground/80 mb-8">
            oppure mandaci una mail come una volta: 
            <a href="mailto:scrivici@techero.xyz" className="ml-1 underline hover:text-primary transition-colors">
              scrivici@techero.xyz
            </a>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="px-8 py-6 text-lg rounded-full hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-xl"
              onClick={() => openChat("Ciao! Sono pronto a partire con il mio progetto")}
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              Chatta col nostro Bot
            </Button>
            {/* <Button 
              variant="outline" 
              size="lg" 
              className="px-8 py-6 text-lg rounded-full hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-xl border-primary/30 hover:border-primary/60 hover:bg-primary/5"
              onClick={() => openChat("Ciao! Vorrei prenotare una call per discutere del mio progetto")}
            >
              Prenota una call
            </Button> */}
          </div>
        </div>
      </section>

      {/* Footer semplice */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              © 2025 tecHero. Progetti tech da zero a hero.
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Chat Button */}
      <FloatingChatButton 
        onClick={() => openChat()} 
        isVisible={!isChatOpen} 
      />

      {/* Chat Widget */}
      <ChatWidget 
        isOpen={isChatOpen}
        onClose={closeChat}
        initialMessage={initialChatMessage}
      />
    </div>
  );
}