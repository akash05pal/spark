
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BrainCircuit,
  Boxes,
  Truck,
  Undo2,
  TrendingUp,
  Map,
  Share2,
  Download,
  LayoutDashboard,
  Handshake,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface SidebarProps {
  isMobile?: boolean;
}

const navItems = [
  { href: '#', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '#', icon: BrainCircuit, label: 'AI-Powered Insights' },
  { href: '#', icon: Boxes, label: 'Inventory' },
  { href: '#', icon: Undo2, label: 'Returns' },
  { href: '#', icon: Truck, label: 'Logistics' },
  { href: '#', icon: Handshake, label: 'Suppliers' },
  { href: '#', icon: TrendingUp, label: 'Trends' },
  { href: '#', icon: Map, label: 'Map View' },
  { href: '#', icon: Share2, label: 'Knowledge Graph' },
  { href: '#', icon: Download, label: 'Download Reports' },
];

const SidebarLink = ({ item, isMobile }: { item: typeof navItems[0], isMobile: boolean }) => {
    const pathname = usePathname();
    const isActive = pathname === item.href;
    const linkClasses = cn(
        'flex h-10 w-10 items-center justify-center rounded-lg text-slate-400 transition-all duration-300 hover:bg-slate-800 hover:text-cyan-400 hover:scale-110',
        isActive && 'bg-gradient-to-r from-cyan-500/20 to-purple-600/20 text-white shadow-[0_0_15px_theme(colors.cyan.500/0.5)]',
        isMobile && 'w-full h-auto p-4 justify-start gap-4 text-base'
    );
    const Icon = item.icon;

    if (isMobile) {
        return (
             <Link href={item.href} className={linkClasses}>
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
            </Link>
        )
    }

    return (
        <TooltipProvider delayDuration={0}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Link href={item.href} className={linkClasses}>
                        <Icon className="h-5 w-5" />
                        <span className="sr-only">{item.label}</span>
                    </Link>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-slate-800 border-slate-700 text-white">
                    {item.label}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}


export default function Sidebar({ isMobile = false }: SidebarProps) {
  return (
    <aside className={cn(
      "h-screen bg-[#0A0F26] transition-all duration-300 border-r border-slate-800",
      isMobile ? "w-full" : "hidden sm:flex sm:flex-col sm:w-20",
    )}>
      <div className="flex h-16 items-center justify-center border-b border-slate-800">
        <Link href="/" className="flex items-center justify-center rounded-lg h-10 w-10 bg-slate-900 border border-purple-500/50 text-cyan-400 shadow-[0_0_20px_theme(colors.purple.500/0.5)] transition-all hover:shadow-[0_0_30px_theme(colors.cyan.500/0.7)]">
          <BrainCircuit className="h-6 w-6" />
          <span className="sr-only">INTELLIA</span>
        </Link>
      </div>
      <nav className={cn("flex flex-col items-center gap-4 px-2 py-4", isMobile && "p-4")}>
        {navItems.map((item) => (
          <SidebarLink key={item.label} item={item} isMobile={isMobile} />
        ))}
      </nav>
    </aside>
  );
}
