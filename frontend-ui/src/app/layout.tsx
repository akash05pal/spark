
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Sidebar from '@/components/dashboard/sidebar';
import Header from '@/components/dashboard/header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'INTELLIA: Central Intelligence Platform',
  description: 'Intelligent monitoring of supply chain data using AI/ML, Knowledge Graphs, and LLMs.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-background text-foreground`}>
        <div className="flex min-h-screen w-full bg-[#0A0F26]">
          <Sidebar />
          <div className="flex flex-1 flex-col">
            <Header />
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
              {children}
            </main>
          </div>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
