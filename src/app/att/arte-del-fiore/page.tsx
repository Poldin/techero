"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Phone, Clock, X } from 'lucide-react';
import Image from 'next/image';
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import ContactForm from "@/components/ContactForm";

const BUSINESS = {
	name: 'Arte del Fiore',
	owner: 'Dante Daniela',
	addressLine: 'Via Oberdan Guglielmo, 1, 35122 Padova PD',
	mapsUrl: 'https://www.google.com/maps?q=Via+Oberdan+Guglielmo,+1,+35122+Padova+PD',
	phone: '049 875 2024',
	email: 'info@artedelfiore.it', // Email placeholder
	vatNumber: '02213870286',
	fiscalCode: 'DNTDNL70A01G224X', // C.F. placeholder basato sul nome
};

const IMAGES: { src: string; alt: string }[] = [
	{ src: 'https://ftsvghosbgqcsbdiibgv.supabase.co/storage/v1/object/public/images/immagine%20di%20un%20vivaio%20di%20fiori%20e%20piante%20(1).jpg', alt: 'Arte del Fiore - creazioni artistiche floreali nel cuore di Padova' },
	{ src: 'https://ftsvghosbgqcsbdiibgv.supabase.co/storage/v1/object/public/images/immagine%20di%20un%20vivaio%20di%20fiori%20e%20piante%20(2).jpg', alt: 'Arte del Fiore - composizioni floreali eleganti e raffinate' },
	{ src: 'https://ftsvghosbgqcsbdiibgv.supabase.co/storage/v1/object/public/images/immagine%20di%20un%20vivaio%20di%20fiori%20e%20piante%20all\'esterno%20giardino%20(1).jpg', alt: 'Arte del Fiore - fiori freschi e piante di qualità superiore' },
	{ src: 'https://ftsvghosbgqcsbdiibgv.supabase.co/storage/v1/object/public/images/immagine%20di%20un%20vivaio%20di%20fiori%20e%20piante%20all\'esterno%20giardino%20(2).jpg', alt: 'Arte del Fiore - servizio consegna a domicilio e in giornata' },
	{ src: 'https://ftsvghosbgqcsbdiibgv.supabase.co/storage/v1/object/public/images/immagine%20di%20un%20vivaio%20di%20fiori%20e%20piante%20all\'esterno%20giardino.jpg', alt: 'Arte del Fiore - ambiente artistico e creativo in Via Oberdan' },
	{ src: 'https://ftsvghosbgqcsbdiibgv.supabase.co/storage/v1/object/public/images/immagine%20di%20un%20vivaio%20di%20fiori%20e%20piante%20di%20giorno%20con%20vista%20sul%20campo%20esterno.jpg', alt: 'Arte del Fiore - panoramica della fioreria artistica a Padova' },
];

// Orari basati sui dati trovati online (con variante sabato aperto)
const HOURS: { day: string; open?: string; close?: string }[] = [
	{ day: 'Lunedì', open: '09:00', close: '19:00' },
	{ day: 'Martedì', open: '09:00', close: '19:00' },
	{ day: 'Mercoledì', open: '09:00', close: '19:00' },
	{ day: 'Giovedì', open: '09:00', close: '19:00' },
	{ day: 'Venerdì', open: '09:00', close: '19:00' },
	{ day: 'Sabato', open: '09:00', close: '19:00' },
	{ day: 'Domenica' },
];

function minutesUntilClose(now: Date): { isOpen: boolean; minutesLeft: number; closeTimeLabel?: string } {
	// JS getDay(): 0=Sunday..6=Saturday. Convert to 0=Monday..6=Sunday
	const idxToday = (now.getDay() + 6) % 7;
	const today = HOURS[idxToday];
	if (!today.open || !today.close) {
		return { isOpen: false, minutesLeft: 0 };
	}
	const [openH, openM] = today.open.split(':').map(Number);
	const [closeH, closeM] = today.close.split(':').map(Number);
	const openDate = new Date(now);
	openDate.setHours(openH, openM, 0, 0);
	const closeDate = new Date(now);
	closeDate.setHours(closeH, closeM, 0, 0);
	if (now >= openDate && now < closeDate) {
		const diffMs = closeDate.getTime() - now.getTime();
		const minutesLeft = Math.max(0, Math.round(diffMs / 60000));
		return { isOpen: true, minutesLeft, closeTimeLabel: today.close };
	}
	return { isOpen: false, minutesLeft: 0 };
}

function formatMinutes(mins: number): string {
	const h = Math.floor(mins / 60);
	const m = mins % 60;
	if (h > 0 && m > 0) return `${h}h ${m}m`;
	if (h > 0) return `${h}h`;
	return `${m}m`;
}

export default function ArteDelFiorePage() {
	const phoneHref = BUSINESS.phone.replace(/\s+/g, '');
	const status = minutesUntilClose(new Date());
	const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
	const [currentEmoji, setCurrentEmoji] = useState(0);

	const emojis = ['🎨', '🌹', '💐', '🌺', '🌸', '🎭', '✨', '🖼️'];

	// Plugin autoplay per il carosello
	const plugin = useRef(
		Autoplay({ delay: 4000, stopOnInteraction: true })
	);

	// Auto-rotazione emoji
	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentEmoji((prev) => (prev + 1) % emojis.length);
		}, 3000);
		return () => clearInterval(interval);
	}, [emojis.length]);

	return (
		<div className="min-h-screen bg-gradient-to-b from-fuchsia-50 via-white to-purple-50 text-gray-900">
			{/* Header / Logo */}
			<header className="sticky top-0 z-30 backdrop-blur bg-white/70 border-b">
				<div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
					<div className="text-2xl sm:text-3xl font-bold tracking-wide flex items-center gap-2">
						<span className="bg-gradient-to-r from-fuchsia-600 to-purple-800 bg-clip-text text-transparent">🎨 Arte</span> 
						<span className="text-gray-800 font-extrabold italic">del Fiore</span>
					</div>
					<div className="hidden sm:flex items-center gap-3 text-sm">
						<Link href={BUSINESS.mapsUrl} target="_blank" className="text-fuchsia-700 hover:text-fuchsia-800 underline-offset-2 hover:underline">Indicazioni</Link>
						{BUSINESS.phone ? (
							<a href={`tel:${phoneHref}`} className="inline-flex items-center gap-2 rounded-full bg-fuchsia-600 text-white px-4 py-2 hover:bg-fuchsia-700 transition-colors">
								<Phone size={18} />
								Chiama
							</a>
						) : null}
					</div>
				</div>
			</header>

			<main className="mx-auto w-95vw sm:max-w-6xl px-2 sm:px-4">
				{/* Hero Carousel */}
				<section className="py-6 sm:py-10">
					<Carousel
						plugins={[plugin.current]}
						className="w-full max-w-[100vw] sm:max-w-4xl mx-auto"
						onMouseEnter={plugin.current.stop}
						onMouseLeave={plugin.current.reset}
						opts={{
							align: "center",
							loop: true,
						}}
					>
						<CarouselContent>
							{IMAGES.map((img, index) => (
								<CarouselItem key={index}>
									<div className="p-1 sm:p-2">
										<div 
											className="aspect-[3/4] sm:aspect-[16/9] rounded-lg overflow-hidden shadow-md bg-fuchsia-100 cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
											onClick={() => setFullscreenImage(img.src)}
										>
											<Image
												src={img.src}
												alt={img.alt}
												width={800}
												height={450}
												className="h-full w-full object-cover"
											/>
										</div>
									</div>
								</CarouselItem>
							))}
						</CarouselContent>
						<CarouselPrevious className="hidden sm:flex" />
						<CarouselNext className="hidden sm:flex" />
					</Carousel>
					<p className="text-xs text-gray-500 mt-4 text-center">Le immagini scorrono automaticamente. Clicca per ingrandire.</p>
				</section>

				{/* Copy and CTAs */}
				<section className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 pb-12">
					<div className="lg:col-span-2 space-y-6">
						<h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">{BUSINESS.name}</h1>
						<div className="space-y-4">
							<p className="text-xl text-gray-800 leading-relaxed">
								Situata nel cuore di Padova in Via Oberdan Guglielmo 1, Arte del Fiore di Daniela Dante rappresenta un&apos;oasi di creatività floreale, dove l&apos;arte si fonde con la natura per creare composizioni uniche e raffinate.
							</p>
							<p className="text-lg text-gray-700 leading-relaxed">
								La nostra fioreria si distingue per l&apos;approccio artistico alle composizioni floreali, trasformando ogni bouquet in una vera opera d&apos;arte. Con una vasta gamma di fiori freschi e piante selezionate, creiamo allestimenti personalizzati che esprimono emozioni e raccontano storie attraverso i colori e i profumi della natura.
							</p>
							<p className="text-lg text-gray-700 leading-relaxed">
								Offriamo un servizio completo che include acquisti in negozio per un&apos;esperienza diretta e personalizzata, consegna a domicilio per la massima comodità, e consegna in giornata per le esigenze più urgenti. La nostra passione per l&apos;arte floreale ci spinge a creare sempre soluzioni innovative e sorprendenti.
							</p>
							<p className="text-lg text-gray-700 leading-relaxed">
								Aperta dal lunedì al sabato fino alle 19:00, Arte del Fiore è il luogo ideale dove trovare l&apos;ispirazione perfetta per ogni occasione speciale. La nostra posizione centrale a Padova e l&apos;attenzione artistica ai dettagli rendono ogni visita un&apos;esperienza memorabile nel mondo dei fiori.
							</p>
						</div>
					</div>
					<aside className="lg:col-span-1">
						<div className="rounded-2xl border bg-white p-5 shadow-md">
							<p className="text-sm text-gray-500">Indirizzo</p>
							<p className="font-semibold">{BUSINESS.addressLine}</p>
							<div className="mt-4">
								<p className="text-sm text-gray-500">Telefono</p>
								<a href={`tel:${phoneHref}`} className="font-semibold text-fuchsia-700 hover:underline">{BUSINESS.phone}</a>
							</div>
							<div className="mt-4">
								<p className="text-sm text-gray-500">Titolare</p>
								<p className="font-semibold text-gray-700">{BUSINESS.owner}</p>
							</div>
							<div className="mt-4">
								<p className="text-sm text-gray-500">Email</p>
								<a href={`mailto:${BUSINESS.email}`} className="font-semibold text-fuchsia-700 hover:underline text-sm">{BUSINESS.email}</a>
							</div>
							<div className="mt-4 flex flex-col gap-3">
								<Link href={BUSINESS.mapsUrl} target="_blank" className="inline-flex justify-center items-center rounded-full border border-fuchsia-200 bg-fuchsia-50 text-fuchsia-800 px-4 py-2 hover:bg-fuchsia-100">Apri su Google Maps</Link>
								{BUSINESS.phone ? (
									<a href={`tel:${phoneHref}`} className="inline-flex justify-center items-center rounded-full bg-fuchsia-600 text-white px-4 py-2 hover:bg-fuchsia-700">Chiama ora</a>
								) : (
									<span className="text-xs text-gray-500">Numero in aggiornamento</span>
								)}
							</div>
						</div>

						{/* Servizi Artistici */}
						<div className="mt-6 rounded-2xl border bg-white p-5 shadow-md">
							<div className="flex items-center gap-2 mb-3">
								<span className="text-fuchsia-600 text-lg">🎨</span>
								<p className="font-semibold">Servizi Artistici</p>
							</div>
							<ul className="text-sm space-y-2 text-gray-700">
								<li>• Composizioni floreali artistiche</li>
								<li>• Bouquet personalizzati e creativi</li>
								<li>• Allestimenti per eventi speciali</li>
								<li>• Addobbi matrimoni e cerimonie</li>
								<li>• Acquisti in negozio</li>
								<li>• Consegna a domicilio</li>
								<li>• Consegna in giornata</li>
								<li>• Consulenza creativa personalizzata</li>
							</ul>
						</div>

						{/* Valutazioni */}
						<div className="mt-6 rounded-2xl border bg-white p-5 shadow-md">
							<div className="flex items-center gap-2 mb-3">
								<span className="text-fuchsia-600 text-lg">⭐</span>
								<p className="font-semibold">Valutazioni Clienti</p>
							</div>
							<div className="flex items-center gap-2 mb-2">
								<div className="flex text-yellow-400">
									<span>⭐⭐⭐⭐</span>
									<span className="text-gray-300">⭐</span>
								</div>
								<span className="text-sm text-gray-600">3.7/5</span>
							</div>
							<p className="text-xs text-gray-500">Basato su recensioni clienti</p>
						</div>

						{/* Orari */}
						<div className="mt-6 rounded-2xl border bg-white p-5 shadow-md">
							<div className="flex items-center gap-2 mb-3">
								<Clock className="text-fuchsia-600" size={18} />
								<p className="font-semibold">Orari</p>
							</div>
							<div className="mb-4 text-sm">
								{status.isOpen ? (
									<p className="text-fuchsia-700 font-medium">Aperto ora, chiude tra {formatMinutes(status.minutesLeft)} (alle {status.closeTimeLabel})</p>
								) : (
									<p className="text-gray-600 font-medium">Chiuso ora</p>
								)}
							</div>
							<ul className="text-sm divide-y">
								{HOURS.map((h, idx) => {
									const isToday = idx === (new Date().getDay() + 6) % 7;
									return (
										<li key={h.day} className={`flex items-center justify-between py-2 ${isToday ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
											<span className={isToday ? 'italic' : ''}>{h.day}</span>
											<span>{h.open && h.close ? `${h.open} - ${h.close}` : 'Chiuso'}</span>
										</li>
									);
								})}
							</ul>
							<p className="text-xs text-gray-500 mt-3">* Aperto anche il sabato per la vostra comodità. Orari potrebbero variare durante le festività.</p>
						</div>

						{/* Contact Form */}
						<ContactForm 
							recipientEmail={BUSINESS.email}
							businessName={BUSINESS.name}
						/>
					</aside>
				</section>
			</main>

			{/* Footer */}
			<footer className="bg-gray-50 border-t mt-12">
				<div className="mx-auto max-w-6xl px-4 py-8">
					<div className="flex flex-col items-center space-y-4">
						{/* Logo e contatti */}
						<div className="text-center">
							<div className="text-lg font-bold mb-2 flex items-center justify-center gap-2">
								<span className="bg-gradient-to-r from-fuchsia-600 to-purple-800 bg-clip-text text-transparent">🎨 Arte</span> 
								<span className="text-gray-800 font-extrabold italic">del Fiore</span>
							</div>
							<div className="text-sm text-gray-600 space-y-1">
								<p>{BUSINESS.addressLine}</p>
								<p>
									<a href={`tel:${phoneHref}`} className="text-fuchsia-700 hover:underline">
										{BUSINESS.phone}
									</a>
								</p>
								<p>
									<a href={`mailto:${BUSINESS.email}`} className="text-fuchsia-700 hover:underline text-sm">
										{BUSINESS.email}
									</a>
								</p>
								<p className="text-xs text-gray-500 mt-2">
									P.IVA: {BUSINESS.vatNumber} • C.F.: {BUSINESS.fiscalCode}
								</p>
							</div>
						</div>

						{/* Pulsante tecHero animato */}
						<Link 
							href="/" 
							target="_blank"
							className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-gray-800 text-white text-sm font-medium hover:bg-gray-700 transition-all duration-300 hover:scale-105 shadow-lg border border-gray-300"
						>
							<span className="text-lg relative overflow-hidden">
								<span 
									className="inline-block transition-all duration-500 ease-in-out transform-gpu hover:rotate-12"
									key={currentEmoji}
									style={{
										animation: 'fadeInScale 500ms ease-in-out'
									}}
								>
									{emojis[currentEmoji]}
								</span>
							</span>
							sviluppato da tecHero
						</Link>
						<style jsx>{`
							@keyframes fadeInScale {
								0% {
									opacity: 0;
									transform: scale(0.8) rotate(-10deg);
								}
								50% {
									opacity: 0.7;
									transform: scale(1.1) rotate(5deg);
								}
								100% {
									opacity: 1;
									transform: scale(1) rotate(0deg);
								}
							}

						`}</style>
					</div>
				</div>
			</footer>

			{/* Floating Call Button */}
			{BUSINESS.phone && (
				<a href={`tel:${phoneHref}`} className="fixed bottom-5 right-5 z-40 inline-flex items-center justify-center rounded-full bg-fuchsia-600 text-white w-14 h-14 shadow-lg hover:bg-fuchsia-700 active:scale-95 transition">
					<Phone />
				</a>
			)}

			{/* Fullscreen Image Modal */}
			{fullscreenImage && (
				<div 
					className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
					onClick={() => setFullscreenImage(null)}
				>
					<button 
						className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
						onClick={() => setFullscreenImage(null)}
					>
						<X size={32} />
					</button>
					<Image 
						src={fullscreenImage} 
						alt="Immagine ingrandita"
						className="max-w-full max-h-full object-contain"
						onClick={(e) => e.stopPropagation()}
						width={1000}
						height={1000}
					/>
				</div>
			)}
		</div>
	);
}
