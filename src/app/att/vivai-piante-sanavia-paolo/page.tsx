"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Phone, Clock, X, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

const BUSINESS = {
	name: 'Vivai Piante Sanavia Paolo',
	addressLine: 'Via Celeseo, 4, 30030 Vigonovo VE',
	mapsUrl: 'https://www.google.com/maps?q=Via+Celeseo,+4,+30030+Vigonovo+VE',
	phone: '049 983 1961', // set by client
};

const IMAGES: { src: string; alt: string }[] = [
	{ src: 'https://ftsvghosbgqcsbdiibgv.supabase.co/storage/v1/object/public/images/2022-10-23%20(1).webp', alt: 'Vivai Piante Sanavia Paolo - vista 1' },
	{ src: 'https://ftsvghosbgqcsbdiibgv.supabase.co/storage/v1/object/public/images/2022-10-23.webp', alt: 'Vivai Piante Sanavia Paolo - vista 2' },
	{ src: 'https://ftsvghosbgqcsbdiibgv.supabase.co/storage/v1/object/public/images/sanavia%20paolo.png', alt: 'Vivai Piante Sanavia Paolo - dettaglio' },
];

// Orari settimanali (Lunedì -> Domenica)
const HOURS: { day: string; open?: string; close?: string }[] = [
	{ day: 'Lunedì', open: '08:00', close: '18:00' },
	{ day: 'Martedì', open: '08:00', close: '18:00' },
	{ day: 'Mercoledì', open: '08:00', close: '18:00' },
	{ day: 'Giovedì', open: '08:00', close: '18:00' },
	{ day: 'Venerdì', open: '08:00', close: '18:00' },
	{ day: 'Sabato' },
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

export default function VivaioSanaviaPage() {
	const phoneHref = BUSINESS.phone.replace(/\s+/g, '');
	const status = minutesUntilClose(new Date());
	const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
	const [currentEmoji, setCurrentEmoji] = useState(0);
	const [currentImage, setCurrentImage] = useState(0);

	const emojis = ['🚀', '⚡', '🔥', '✨', '💎', '🎯', '🌟', '🎨'];

	// Auto-scroll del carosello immagini
	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentImage((prev) => (prev + 1) % IMAGES.length);
		}, 4000);
		return () => clearInterval(interval);
	}, []);

	// Auto-rotazione emoji
	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentEmoji((prev) => (prev + 1) % emojis.length);
		}, 3000);
		return () => clearInterval(interval);
	}, [emojis.length]);

	const nextImage = () => {
		setCurrentImage((prev) => (prev + 1) % IMAGES.length);
	};

	const prevImage = () => {
		setCurrentImage((prev) => (prev - 1 + IMAGES.length) % IMAGES.length);
	};



	return (
		<div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-emerald-50 text-gray-900">
			{/* Header / Logo */}
			<header className="sticky top-0 z-30 backdrop-blur bg-white/70 border-b">
				<div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
					<div className="text-2xl sm:text-3xl font-extrabold tracking-tight">
						<span className="text-emerald-600">Vivai</span> Piante Sanavia <span className="text-emerald-600">Paolo</span>
					</div>
					<div className="hidden sm:flex items-center gap-3 text-sm">
						<Link href={BUSINESS.mapsUrl} target="_blank" className="text-emerald-700 hover:text-emerald-800 underline-offset-2 hover:underline">Indicazioni</Link>
						{BUSINESS.phone ? (
							<a href={`tel:${phoneHref}`} className="inline-flex items-center gap-2 rounded-full bg-emerald-600 text-white px-4 py-2 hover:bg-emerald-700 transition-colors">
								<Phone size={18} />
								Chiama
							</a>
						) : null}
					</div>
				</div>
			</header>

			<main className="mx-auto max-w-6xl px-4">
				{/* Hero Carousel */}
				<section className="py-6 sm:py-10">
					<div className="max-w-5xl mx-auto relative">
						<div className="flex items-center justify-center">
							<button
								onClick={prevImage}
								className="absolute left-0 z-20 rounded-full shadow-xl bg-white/80 backdrop-blur-sm border-2 hover:border-emerald-500/50 hover:bg-emerald-50/50 transition-all duration-300 hover:scale-110 p-3"
							>
								<ChevronLeft className="w-5 h-5" />
							</button>

							{/* Container con overflow hidden per animazioni smooth */}
							<div className="w-full max-w-4xl mx-16 min-h-[300px] relative overflow-hidden">
								<div 
									className="flex transition-transform duration-700 ease-in-out"
									style={{ transform: `translateX(-${currentImage * 100}%)` }}
								>
									{IMAGES.map((img, index) => (
										<div key={index} className="w-full flex-shrink-0">
											<div className="mx-2">
												<div 
													className="aspect-[16/9] rounded-lg overflow-hidden shadow-md bg-emerald-100 cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
													onClick={() => setFullscreenImage(img.src)}
												>
													<Image
														src={img.src}
														alt={img.alt}
														loading="lazy"
														decoding="async"
														className="h-full w-full object-cover"
													/>
												</div>
											</div>
										</div>
									))}
								</div>
							</div>

							<button
								onClick={nextImage}
								className="absolute right-0 z-20 rounded-full shadow-xl bg-white/80 backdrop-blur-sm border-2 hover:border-emerald-500/50 hover:bg-emerald-50/50 transition-all duration-300 hover:scale-110 p-3"
							>
								<ChevronRight className="w-5 h-5" />
							</button>
						</div>

						{/* Indicatori migliorati */}
						<div className="flex justify-center mt-8 gap-3">
							{IMAGES.map((_, index) => (
								<button
									key={index}
									onClick={() => setCurrentImage(index)}
									className={`relative transition-all duration-300 ${
										index === currentImage 
											? "w-8 h-3" 
											: "w-3 h-3 hover:w-4"
									}`}
								>
									<div className={`w-full h-full rounded-full transition-all duration-300 ${
										index === currentImage 
											? "bg-emerald-600 shadow-lg shadow-emerald-600/40" 
											: "bg-gray-300 hover:bg-gray-400"
									}`}></div>
									
									{/* Ring effect per indicatore attivo */}
									{index === currentImage && (
										<div className="absolute inset-0 rounded-full border-2 border-emerald-600/30 scale-150 animate-pulse"></div>
									)}
								</button>
							))}
						</div>

						{/* Progress bar */}
						<div className="mt-6 max-w-md mx-auto">
							<div className="w-full bg-gray-200 rounded-full h-1">
								<div 
									className="bg-gradient-to-r from-emerald-600 to-emerald-500 h-1 rounded-full transition-all duration-700 ease-out"
									style={{ width: `${((currentImage + 1) / IMAGES.length) * 100}%` }}
								></div>
							</div>
							<p className="text-center text-sm text-gray-500 mt-2">
								{currentImage + 1} di {IMAGES.length}
							</p>
						</div>
					</div>
					<p className="text-xs text-gray-500 mt-4 text-center">Clicca su un&apos;immagine per ingrandirla.</p>
				</section>

				{/* Copy and CTAs */}
				<section className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 pb-12">
					<div className="lg:col-span-2 space-y-6">
						<h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">{BUSINESS.name}</h1>
						<div className="space-y-4">
							<p className="text-xl text-gray-800 leading-relaxed">
								Nel cuore di Vigonovo, a Celeseo, il nostro vivaio rappresenta da anni un punto di riferimento per chi cerca piante di qualità superiore e consulenza esperta.
							</p>
							<p className="text-lg text-gray-700 leading-relaxed">
								Ogni pianta che coltiviamo è selezionata con cura e passione, dalle varietà ornamentali più raffinate alle essenze da esterno più resistenti. Che tu stia progettando un giardino, arredando un terrazzo o realizzando un progetto paesaggistico, troverai qui la soluzione perfetta per dare vita ai tuoi spazi verdi.
							</p>
							<p className="text-lg text-gray-700 leading-relaxed">
								La nostra esperienza nel settore florovivaistico ci permette di offrire non solo piante sane e robuste, ma anche consigli personalizzati per la cura e la manutenzione, garantendo che ogni acquisto sia un investimento duraturo per la bellezza del tuo ambiente.
							</p>
						</div>
					</div>
					<aside className="lg:col-span-1">
						<div className="rounded-2xl border bg-white p-5 shadow-md">
							<p className="text-sm text-gray-500">Indirizzo</p>
							<p className="font-semibold">{BUSINESS.addressLine}</p>
							<div className="mt-4">
								<p className="text-sm text-gray-500">Telefono</p>
								<a href={`tel:${phoneHref}`} className="font-semibold text-emerald-700 hover:underline">{BUSINESS.phone}</a>
							</div>
							<div className="mt-4 flex flex-col gap-3">
								<Link href={BUSINESS.mapsUrl} target="_blank" className="inline-flex justify-center items-center rounded-full border border-emerald-200 bg-emerald-50 text-emerald-800 px-4 py-2 hover:bg-emerald-100">Apri su Google Maps</Link>
								{BUSINESS.phone ? (
									<a href={`tel:${phoneHref}`} className="inline-flex justify-center items-center rounded-full bg-emerald-600 text-white px-4 py-2 hover:bg-emerald-700">Chiama ora</a>
								) : (
									<span className="text-xs text-gray-500">Numero in aggiornamento</span>
								)}
							</div>
						</div>

						{/* Orari */}
						<div className="mt-6 rounded-2xl border bg-white p-5 shadow-md">
							<div className="flex items-center gap-2 mb-3">
								<Clock className="text-emerald-600" size={18} />
								<p className="font-semibold">Orari</p>
							</div>
							<div className="mb-4 text-sm">
								{status.isOpen ? (
									<p className="text-emerald-700 font-medium">Aperto ora, chiude tra {formatMinutes(status.minutesLeft)} (alle {status.closeTimeLabel})</p>
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
							<div className="text-lg font-bold text-gray-800 mb-2">
								<span className="text-emerald-600">Vivai</span> Piante Sanavia <span className="text-emerald-600">Paolo</span>
							</div>
							<div className="text-sm text-gray-600 space-y-1">
								<p>{BUSINESS.addressLine}</p>
								<p>
									<a href={`tel:${phoneHref}`} className="text-emerald-700 hover:underline">
										{BUSINESS.phone}
									</a>
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
				<a href={`tel:${phoneHref}`} className="fixed bottom-5 right-5 z-40 inline-flex items-center justify-center rounded-full bg-emerald-600 text-white w-14 h-14 shadow-lg hover:bg-emerald-700 active:scale-95 transition">
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
