
'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

export default function LiveClock() {
    const [time, setTime] = useState<Date | null>(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        setTime(new Date());
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    if (!isMounted || !time) {
        return (
            <div className="hidden sm:flex items-center gap-2 bg-slate-800/50 text-slate-300 text-sm px-3 py-1.5 rounded-lg">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
            </div>
        );
    }

    return (
        <div className="hidden sm:flex items-center gap-2 bg-slate-800/50 text-slate-300 text-sm px-3 py-1.5 rounded-lg">
            <span>{format(time, 'MMM d, yyyy')}</span>
            <span className="font-mono bg-slate-900 px-2 py-0.5 rounded">{format(time, 'HH:mm:ss')}</span>
        </div>
    );
}
