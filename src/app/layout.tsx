import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'tecHero - Project Management per Progetti Tech',
  description: 'Gestiamo il tuo progetto tecnologico dall\'idea alla realizzazione, selezionando i migliori talenti e puntando all\'assoluta eccellenza.',
  keywords: 'project management, tech, sviluppo software, consulenza IT, gestione progetti',
  openGraph: {
    title: 'tecHero - Project Management per Progetti Tech',
    description: 'Trasformiamo le tue idee in prodotti tech completi.',
    //images: ['/og-image.jpg'],
    type: 'website',
    locale: 'it_IT',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'tecHero - Project Management per Progetti Tech',
    description: 'Trasformiamo le tue idee in prodotti tech completi.',
    //images: ['/og-image.jpg'],
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
