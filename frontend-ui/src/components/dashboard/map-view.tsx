
'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Map } from "lucide-react";
import dynamic from 'next/dynamic';

// Dynamically import the IndiaMap component with SSR disabled
const IndiaMap = dynamic(() => import('./IndiaMap'), { ssr: false });

export default function MapView() {
    return (
        <Card className="h-full bg-slate-900/50 border border-slate-800 flex flex-col">
            <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                    <Map className="w-6 h-6" />
          Regional Analysis
                </CardTitle>
            </CardHeader>
      <CardContent className="flex-grow flex flex-col gap-4">
        <IndiaMap />
            </CardContent>
        </Card>
  );
}
