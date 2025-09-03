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
	name: 'Michiflor S.r.l.',
	owner: 'Azienda Specializzata nel Commercio di Fiori e Piante',
	addressLine: 'Via Negrisia, 1, 35010 Vigonza PD',
	mapsUrl: 'https://www.google.com/maps?q=Via+Negrisia,+1,+35010+Vigonza+PD',
	phone: '049 809 6187',
	email: 'michiflor@legalmail.it',
	vatNumber: '03704220288',
	fiscalCode: '03704220288',
};

const IMAGES: { src: string; alt: string }[] = [
	{ src: 'https://ftsvghosbgqcsbdiibgv.supabase.co/storage/v1/object/public/images/immagine%20di%20un%20vivaio%20di%20fiori%20e%20piante%20(1).jpg', alt: 'Michiflor S.r.l. - assortimento di fiori e piante ornamentali' },
	{ src: 'https://ftsvghosbgqcsbdiibgv.supabase.co/storage/v1/object/public/images/immagine%20di%20un%20vivaio%20di%20fiori%20e%20piante%20(2).jpg', alt: 'Michiflor S.r.l. - varietà di piante da interno e esterno' },
	{ src: 'https://ftsvghosbgqcsbdiibgv.supabase.co/storage/v1/object/public/images/immagine%20di%20un%20vivaio%20di%20fiori%20e%20piante%20all\'esterno%20giardino%20(1).jpg', alt: 'Michiflor S.r.l. - esposizione piante da giardino' },
	{ src: 'https://ftsvghosbgqcsbdiibgv.supabase.co/storage/v1/object/public/images/immagine%20di%20un%20vivaio%20di%20fiori%20e%20piante%20all\'esterno%20giardino%20(2).jpg', alt: 'Michiflor S.r.l. - area espositiva esterna' },
	{ src: 'https://ftsvghosbgqcsbdiibgv.supabase.co/storage/v1/object/public/images/immagine%20di%20un%20vivaio%20di%20fiori%20e%20piante%20all\'esterno%20giardino.jpg', alt: 'Michiflor S.r.l. - giardino dimostrativo' },
	{ src: 'https://ftsvghosbgqcsbdiibgv.supabase.co/storage/v1/object/public/images/immagine%20di%20un%20vivaio%20di%20fiori%20e%20piante%20di%20giorno%20con%20vista%20sul%20campo%20esterno.jpg', alt: 'Michiflor S.r.l. - panoramica delle strutture commerciali' },
];

// Orari standard per commercio all'ingrosso di fiori e piante
const HOURS: { day: string; open?: string; close?: string; afternoon?: { open: string; close: string } }[] = [
	{ day: 'Lunedì', open: '08:30', close: '12:00', afternoon: { open: '14:00', close: '19:00' } },
	{ day: 'Martedì', open: '08:30', close: '12:00', afternoon: { open: '14:00', close: '19:00' } },
	{ day: 'Mercoledì', open: '08:30', close: '12:00', afternoon: { open: '14:00', close: '19:00' } },
	{ day: 'Giovedì', open: '08:30', close: '12:00', afternoon: { open: '14:00', close: '19:00' } },
	{ day: 'Venerdì', open: '08:30', close: '12:00', afternoon: { open: '14:00', close: '19:00' } },
	{ day: 'Sabato', open: '08:30', close: '12:00', afternoon: { open: '14:00', close: '19:00' } },
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

export default function MichiflorPage() {
	const phoneHref = BUSINESS.phone.replace(/\s+/g, '');
	const status = minutesUntilClose(new Date());
	const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
	const [currentEmoji, setCurrentEmoji] = useState(0);

	const emojis = ['🌺', '🌸', '🌼', '🌻', '🌷', '🌹', '💐', '🌿'];

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
		<div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-pink-50 text-gray-900">
			{/* Header / Logo */}
			<header className="sticky top-0 z-30 backdrop-blur bg-white/70 border-b">
				<div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
					<div className="text-2xl sm:text-3xl font-bold tracking-wide flex items-center gap-2">
						<span className="bg-gradient-to-r from-purple-600 to-pink-800 bg-clip-text text-transparent">🌺 Michiflor</span> 
						<span className="text-gray-800 font-extrabold italic">S.r.l.</span>
					</div>
					<div className="hidden sm:flex items-center gap-3 text-sm">
						<Link href={BUSINESS.mapsUrl} target="_blank" className="text-purple-700 hover:text-purple-800 underline-offset-2 hover:underline">Indicazioni</Link>
						{BUSINESS.phone ? (
							<a href={`tel:${phoneHref}`} className="inline-flex items-center gap-2 rounded-full bg-purple-600 text-white px-4 py-2 hover:bg-purple-700 transition-colors">
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
											className="aspect-[3/4] sm:aspect-[16/9] rounded-lg overflow-hidden shadow-md bg-purple-100 cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
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
								Situata nel cuore di Vigonza, Michiflor S.r.l. è una realtà consolidata nel commercio all&apos;ingrosso di fiori e piante, operativa dal 2002 e specializzata nella distribuzione di prodotti florovivaistici di qualità.
							</p>
							<p className="text-lg text-gray-700 leading-relaxed">
								Con sede in Via Negrisia 1, la nostra azienda si distingue per l&apos;ampia gamma di fiori freschi e piante ornamentali, servendo professionisti del settore, fioristi e garden center in tutto il territorio veneto. La nostra esperienza ventennale ci permette di garantire prodotti sempre freschi e di prima qualità.
							</p>
							<p className="text-lg text-gray-700 leading-relaxed">
								Michiflor S.r.l. offre un servizio completo che spazia dalla selezione accurata dei prodotti alla consulenza specializzata, supportando i nostri clienti nella scelta delle varietà più adatte alle loro esigenze. La nostra rete distributiva assicura tempestività nelle consegne e freschezza garantita.
							</p>
							<p className="text-lg text-gray-700 leading-relaxed">
								Grazie alla nostra posizione strategica a Vigonza e alla consolidata esperienza nel settore, rappresentiamo un partner affidabile per tutti i professionisti che desiderano offrire ai propri clienti fiori e piante di eccellente qualità, con il supporto di un servizio clienti dedicato e competente.
							</p>
						</div>
					</div>
					<aside className="lg:col-span-1">
						<div className="rounded-2xl border bg-white p-5 shadow-md">
							<p className="text-sm text-gray-500">Indirizzo</p>
							<p className="font-semibold">{BUSINESS.addressLine}</p>
							<div className="mt-4">
								<p className="text-sm text-gray-500">Telefono</p>
								<a href={`tel:${phoneHref}`} className="font-semibold text-purple-700 hover:underline">{BUSINESS.phone}</a>
							</div>
							<div className="mt-4">
								<p className="text-sm text-gray-500">PEC</p>
								<a href={`mailto:${BUSINESS.email}`} className="font-semibold text-purple-700 hover:underline text-sm">{BUSINESS.email}</a>
							</div>
							<div className="mt-4 flex flex-col gap-3">
								<Link href={BUSINESS.mapsUrl} target="_blank" className="inline-flex justify-center items-center rounded-full border border-purple-200 bg-purple-50 text-purple-800 px-4 py-2 hover:bg-purple-100">Apri su Google Maps</Link>
								{BUSINESS.phone ? (
									<a href={`tel:${phoneHref}`} className="inline-flex justify-center items-center rounded-full bg-purple-600 text-white px-4 py-2 hover:bg-purple-700">Chiama ora</a>
								) : (
									<span className="text-xs text-gray-500">Numero in aggiornamento</span>
								)}
							</div>
						</div>

						{/* Orari */}
						<div className="mt-6 rounded-2xl border bg-white p-5 shadow-md">
							<div className="flex items-center gap-2 mb-3">
								<Clock className="text-purple-600" size={18} />
								<p className="font-semibold">Orari</p>
							</div>
							<div className="mb-4 text-sm">
								{status.isOpen ? (
									<p className="text-purple-700 font-medium">Aperto ora, chiude tra {formatMinutes(status.minutesLeft)} (alle {status.closeTimeLabel})</p>
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
												) : 'Chiuso'}
											</span>
										</li>
									);
								})}
							</ul>
							<p className="text-xs text-gray-500 mt-3">* Gli orari potrebbero variare durante i periodi festivi. Si consiglia di chiamare per conferma.</p>
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
								<span className="bg-gradient-to-r from-purple-600 to-pink-800 bg-clip-text text-transparent">🌺 Michiflor</span> 
								<span className="text-gray-800 font-extrabold italic">S.r.l.</span>
							</div>
							<div className="text-sm text-gray-600 space-y-1">
								<p>{BUSINESS.addressLine}</p>
								<p>
									<a href={`tel:${phoneHref}`} className="text-purple-700 hover:underline">
										{BUSINESS.phone}
									</a>
								</p>
								<p>
									<a href={`mailto:${BUSINESS.email}`} className="text-purple-700 hover:underline text-sm">
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
				<a href={`tel:${phoneHref}`} className="fixed bottom-5 right-5 z-40 inline-flex items-center justify-center rounded-full bg-purple-600 text-white w-14 h-14 shadow-lg hover:bg-purple-700 active:scale-95 transition">
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
