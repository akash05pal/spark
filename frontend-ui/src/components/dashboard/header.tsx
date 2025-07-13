
'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Bell, Menu } from 'lucide-react';
import Sidebar from './sidebar';
import LiveClock from './live-clock';

export default function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-slate-800 bg-[#0A0F26]/80 px-4 backdrop-blur-sm sm:px-6">
      <div className="flex items-center gap-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline" className="sm:hidden bg-transparent border-slate-700">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="sm:max-w-xs bg-[#0A0F26] border-r border-slate-800 p-0">
            <Sidebar isMobile />
          </SheetContent>
        </Sheet>
        <div className="hidden md:flex items-baseline gap-2">
            <h1 className="text-xl font-bold text-white tracking-wider">
              INTELLIA
            </h1>
            <p className="text-xs text-muted-foreground tracking-wide">Central Intelligence Platform</p>
        </div>
      </div>

      <div className="flex flex-1 justify-end items-center gap-4">
        <LiveClock />
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-800">
            <Bell className="h-5 w-5 text-slate-400" />
        </Button>
        <Avatar className="h-9 w-9">
            <AvatarImage src="/man.png" alt="User" />
            <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
