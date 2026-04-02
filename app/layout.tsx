import type { Metadata } from 'next'
import { Inter, Outfit } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
});

const outfit = Outfit({ 
  subsets: ["latin"],
  variable: '--font-outfit',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://genesis-resume.vercel.app'), // Replace with actual domain
  title: 'Genesis - AI Resume Intelligence',
  description: 'Transform your career with recruiter-grade AI insights and high-fidelity resume analysis.',
  keywords: ['resume', 'parser', 'ai', 'career', 'analysis', 'recruiter'],
  openGraph: {
    title: 'Genesis - AI Resume Intelligence',
    description: 'Recruiter-grade resume parsing and professional AI insights.',
    url: 'https://genesis-resume.vercel.app',
    siteName: 'Genesis',
    images: [
      {
        url: '/og-image.jpg', // Placeholder for actual OG image
        width: 1200,
        height: 630,
        alt: 'Genesis Platform Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
