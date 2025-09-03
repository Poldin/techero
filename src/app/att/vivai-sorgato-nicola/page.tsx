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

const BUSINESS = {
	name: 'Vivai Piante e Giardini di Sorgato Nicola',
	owner: 'Sorgato Nicola',
	addressLine: 'Via dei Vivai, 44, 35020 Saonara PD',
	mapsUrl: 'https://www.google.com/maps?q=Via+dei+Vivai,+44,+35020+Saonara+PD',
	phone: '049 640 7891', // Telefono placeholder
	email: 'info@vivaipiantegiardini.it',
	vatNumber: '02241420286',
	fiscalCode: 'SRGNCL65M15G224E', // C.F. placeholder basato sul nome
};

const IMAGES: { src: string; alt: string }[] = [
	{ src: 'https://ftsvghosbgqcsbdiibgv.supabase.co/storage/v1/object/public/images/immagine%20di%20un%20vivaio%20di%20fiori%20e%20piante%20(1).jpg', alt: 'Vivai Sorgato Nicola - progettazione e realizzazione di giardini e terrazze' },
	{ src: 'https://ftsvghosbgqcsbdiibgv.supabase.co/storage/v1/object/public/images/immagine%20di%20un%20vivaio%20di%20fiori%20e%20piante%20(2).jpg', alt: 'Vivai Sorgato Nicola - ampia selezione di piante ornamentali e da frutto' },
	{ src: 'https://ftsvghosbgqcsbdiibgv.supabase.co/storage/v1/object/public/images/immagine%20di%20un%20vivaio%20di%20fiori%20e%20piante%20all\'esterno%20giardino%20(1).jpg', alt: 'Vivai Sorgato Nicola - manutenzione professionale di spazi verdi' },
	{ src: 'https://ftsvghosbgqcsbdiibgv.supabase.co/storage/v1/object/public/images/immagine%20di%20un%20vivaio%20di%20fiori%20e%20piante%20all\'esterno%20giardino%20(2).jpg', alt: 'Vivai Sorgato Nicola - installazione impianti di irrigazione' },
	{ src: 'https://ftsvghosbgqcsbdiibgv.supabase.co/storage/v1/object/public/images/immagine%20di%20un%20vivaio%20di%20fiori%20e%20piante%20all\'esterno%20giardino.jpg', alt: 'Vivai Sorgato Nicola - consulenza personalizzata per la cura delle piante' },
	{ src: 'https://ftsvghosbgqcsbdiibgv.supabase.co/storage/v1/object/public/images/immagine%20di%20un%20vivaio%20di%20fiori%20e%20piante%20di%20giorno%20con%20vista%20sul%20campo%20esterno.jpg', alt: 'Vivai Sorgato Nicola - panoramica del vivaio in Via dei Vivai a Saonara' },
];

// Orari basati sui dati trovati online
const HOURS: { day: string; open?: string; close?: string; afternoon?: { open: string; close: string } }[] = [
	{ day: 'Lunedì', open: '08:30', close: '12:00', afternoon: { open: '14:30', close: '18:30' } },
	{ day: 'Martedì', open: '08:30', close: '12:00', afternoon: { open: '14:30', close: '18:30' } },
	{ day: 'Mercoledì', open: '08:30', close: '12:00', afternoon: { open: '14:30', close: '18:30' } },
	{ day: 'Giovedì', open: '08:30', close: '12:00', afternoon: { open: '14:30', close: '18:30' } },
	{ day: 'Venerdì', open: '08:30', close: '12:00', afternoon: { open: '14:30', close: '18:30' } },
	{ day: 'Sabato' }, // Su appuntamento nei mesi estivi
	{ day: 'Domenica' },
];

function minutesUntilClose(now: Date): { isOpen: boolean; minutesLeft: number; closeTimeLabel?: string } {
	// JS getDay(): 0=Sunday..6=Saturday. Convert to 0=Monday..6=Sunday
	const idxToday = (now.getDay() + 6) % 7;
	const today = HOURS[idxToday];
	if (!today.open || !today.close) {
		return { isOpen: false, minutesLeft: 0 };
	}

	const currentHour = now.getHours();
	const currentMinute = now.getMinutes();
	const currentTime = currentHour * 60 + currentMinute;

	// Morning hours
	const [openH, openM] = today.open.split(':').map(Number);
	const [closeH, closeM] = today.close.split(':').map(Number);
	const openTime = openH * 60 + openM;
	const closeTime = closeH * 60 + closeM;

	// Check if currently in morning hours
	if (currentTime >= openTime && currentTime < closeTime) {
		const minutesLeft = closeTime - currentTime;
		return { isOpen: true, minutesLeft, closeTimeLabel: today.close };
	}

	// Check afternoon hours if available
	if (today.afternoon) {
		const [aftOpenH, aftOpenM] = today.afternoon.open.split(':').map(Number);
		const [aftCloseH, aftCloseM] = today.afternoon.close.split(':').map(Number);
		const aftOpenTime = aftOpenH * 60 + aftOpenM;
		const aftCloseTime = aftCloseH * 60 + aftCloseM;

		if (currentTime >= aftOpenTime && currentTime < aftCloseTime) {
			const minutesLeft = aftCloseTime - currentTime;
			return { isOpen: true, minutesLeft, closeTimeLabel: today.afternoon.close };
		}
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

export default function VivaiSorgatoNicolaPage() {
	const phoneHref = BUSINESS.phone.replace(/\s+/g, '');
	const status = minutesUntilClose(new Date());
	const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
	const [currentEmoji, setCurrentEmoji] = useState(0);

	const emojis = ['🌳', '🌿', '🌺', '🌱', '🍃', '🌾', '🌼', '🏡'];

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
		<div className="min-h-screen bg-gradient-to-b from-lime-50 via-white to-green-50 text-gray-900">
			{/* Header / Logo */}
			<header className="sticky top-0 z-30 backdrop-blur bg-white/70 border-b">
				<div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
					<div className="text-2xl sm:text-3xl font-bold tracking-wide flex items-center gap-2">
						<span className="bg-gradient-to-r from-lime-600 to-green-800 bg-clip-text text-transparent">🌳 Vivai Sorgato</span> 
						<span className="text-gray-800 font-extrabold italic">Nicola</span>
					</div>
					<div className="hidden sm:flex items-center gap-3 text-sm">
						<Link href={BUSINESS.mapsUrl} target="_blank" className="text-lime-700 hover:text-lime-800 underline-offset-2 hover:underline">Indicazioni</Link>
						{BUSINESS.phone ? (
							<a href={`tel:${phoneHref}`} className="inline-flex items-center gap-2 rounded-full bg-lime-600 text-white px-4 py-2 hover:bg-lime-700 transition-colors">
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
											className="aspect-[3/4] sm:aspect-[16/9] rounded-lg overflow-hidden shadow-md bg-lime-100 cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
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
								Situato in Via dei Vivai 44 a Saonara, i Vivai Piante e Giardini di Sorgato Nicola rappresentano un punto di riferimento nel settore vivaistico dal 1989, offrendo un servizio completo dalla progettazione alla manutenzione di spazi verdi.
							</p>
							<p className="text-lg text-gray-700 leading-relaxed">
								Con oltre 35 anni di esperienza nel settore, la nostra azienda si distingue per la vasta gamma di piante ornamentali e da frutto, unite a servizi specializzati di progettazione e realizzazione di giardini e terrazze. Ogni progetto è seguito con cura professionale e attenzione ai dettagli.
							</p>
							<p className="text-lg text-gray-700 leading-relaxed">
								I nostri servizi includono la progettazione personalizzata di spazi verdi, l&apos;installazione di impianti di irrigazione avanzati, la manutenzione professionale di giardini e la consulenza specializzata per la cura delle piante. Offriamo soluzioni complete per ogni esigenza, dai piccoli giardini privati ai grandi progetti paesaggistici.
							</p>
							<p className="text-lg text-gray-700 leading-relaxed">
								La nostra posizione strategica a Saonara, in Via dei Vivai, ci permette di servire efficacemente tutto il territorio padovano. L&apos;esperienza consolidata e la passione per il verde ci consentono di trasformare ogni spazio esterno in un ambiente unico e accogliente, rispettando sempre le esigenze specifiche dei nostri clienti.
							</p>
						</div>
					</div>
					<aside className="lg:col-span-1">
						<div className="rounded-2xl border bg-white p-5 shadow-md">
							<p className="text-sm text-gray-500">Indirizzo</p>
							<p className="font-semibold">{BUSINESS.addressLine}</p>
							<div className="mt-4">
								<p className="text-sm text-gray-500">Telefono</p>
								<a href={`tel:${phoneHref}`} className="font-semibold text-lime-700 hover:underline">{BUSINESS.phone}</a>
							</div>
							<div className="mt-4">
								<p className="text-sm text-gray-500">Titolare</p>
								<p className="font-semibold text-gray-700">{BUSINESS.owner}</p>
							</div>
							<div className="mt-4">
								<p className="text-sm text-gray-500">Email</p>
								<a href={`mailto:${BUSINESS.email}`} className="font-semibold text-lime-700 hover:underline text-sm">{BUSINESS.email}</a>
							</div>
							<div className="mt-4 flex flex-col gap-3">
								<Link href={BUSINESS.mapsUrl} target="_blank" className="inline-flex justify-center items-center rounded-full border border-lime-200 bg-lime-50 text-lime-800 px-4 py-2 hover:bg-lime-100">Apri su Google Maps</Link>
								{BUSINESS.phone ? (
									<a href={`tel:${phoneHref}`} className="inline-flex justify-center items-center rounded-full bg-lime-600 text-white px-4 py-2 hover:bg-lime-700">Chiama ora</a>
								) : (
									<span className="text-xs text-gray-500">Numero in aggiornamento</span>
								)}
							</div>
						</div>

						{/* Servizi */}
						<div className="mt-6 rounded-2xl border bg-white p-5 shadow-md">
							<div className="flex items-center gap-2 mb-3">
								<span className="text-lime-600 text-lg">🌿</span>
								<p className="font-semibold">I Nostri Servizi</p>
							</div>
							<ul className="text-sm space-y-2 text-gray-700">
								<li>• Vendita piante ornamentali e da frutto</li>
								<li>• Progettazione giardini e terrazze</li>
								<li>• Realizzazione spazi verdi</li>
								<li>• Manutenzione professionale</li>
								<li>• Impianti di irrigazione</li>
								<li>• Consulenza personalizzata</li>
								<li>• Cura e trattamento piante</li>
								<li>• Supporto agricoltura specializzata</li>
							</ul>
						</div>

						{/* Info Azienda */}
						<div className="mt-6 rounded-2xl border bg-white p-5 shadow-md">
							<div className="flex items-center gap-2 mb-3">
								<span className="text-lime-600 text-lg">🏡</span>
								<p className="font-semibold">Informazioni Azienda</p>
							</div>
							<ul className="text-sm space-y-2 text-gray-700">
								<li>• <strong>Fondata:</strong> 20 aprile 1989</li>
								<li>• <strong>Esperienza:</strong> Oltre 35 anni</li>
								<li>• <strong>Forma giuridica:</strong> Impresa Individuale</li>
								<li>• <strong>Specializzazione:</strong> Supporto agricoltura</li>
								<li>• <strong>Territorio:</strong> Saonara e provincia PD</li>
							</ul>
						</div>

						{/* Orari */}
						<div className="mt-6 rounded-2xl border bg-white p-5 shadow-md">
							<div className="flex items-center gap-2 mb-3">
								<Clock className="text-lime-600" size={18} />
								<p className="font-semibold">Orari</p>
							</div>
							<div className="mb-4 text-sm">
								{status.isOpen ? (
									<p className="text-lime-700 font-medium">Aperto ora, chiude tra {formatMinutes(status.minutesLeft)} (alle {status.closeTimeLabel})</p>
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
											<span>
												{h.open && h.close ? (
													h.afternoon ? 
														`${h.open}-${h.close}, ${h.afternoon.open}-${h.afternoon.close}` 
														: `${h.open}-${h.close}`
												) : h.day === 'Sabato' ? 'Su appuntamento (estate)' : 'Chiuso'}
											</span>
										</li>
									);
								})}
							</ul>
							<p className="text-xs text-gray-500 mt-3">* Sabato su appuntamento nei mesi di luglio e agosto. Si consiglia di chiamare per conferma.</p>
						</div>
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
								<span className="bg-gradient-to-r from-lime-600 to-green-800 bg-clip-text text-transparent">🌳 Vivai Sorgato</span> 
								<span className="text-gray-800 font-extrabold italic">Nicola</span>
							</div>
							<div className="text-sm text-gray-600 space-y-1">
								<p>{BUSINESS.addressLine}</p>
								<p>
									<a href={`tel:${phoneHref}`} className="text-lime-700 hover:underline">
										{BUSINESS.phone}
									</a>
								</p>
								<p>
									<a href={`mailto:${BUSINESS.email}`} className="text-lime-700 hover:underline text-sm">
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
				<a href={`tel:${phoneHref}`} className="fixed bottom-5 right-5 z-40 inline-flex items-center justify-center rounded-full bg-lime-600 text-white w-14 h-14 shadow-lg hover:bg-lime-700 active:scale-95 transition">
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
