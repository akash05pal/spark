
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string;
  subtext?: string;
  note?: string;
  children: React.ReactNode;
  glowColor: 'cyan' | 'red' | 'yellow' | 'orange' | 'purple';
  trend?: 'up' | 'down' | 'neutral';
}

const glowClasses = {
  cyan: "shadow-[0_0_20px_theme(colors.cyan.500/0.7)] border-cyan-400/50 hover:border-cyan-400",
  red: "shadow-[0_0_20px_theme(colors.red.500/0.7)] border-red-400/50 hover:border-red-400",
  yellow: "shadow-[0_0_20px_theme(colors.yellow.500/0.7)] border-yellow-400/50 hover:border-yellow-400",
  orange: "shadow-[0_0_20px_theme(colors.orange.500/0.7)] border-orange-400/50 hover:border-orange-400",
  purple: "shadow-[0_0_20px_theme(colors.purple.500/0.7)] border-purple-400/50 hover:border-purple-400",
};

const trendColors = {
  up: "text-green-400",
  down: "text-red-400",
  neutral: "text-slate-400",
};

export default function KpiCard({ title, value, subtext, note, children, glowColor, trend }: KpiCardProps) {
  return (
    <Card className={cn(
      "bg-slate-900/50 border backdrop-blur-sm transition-all duration-300",
      glowClasses[glowColor]
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-300">{title}</CardTitle>
        <div className="h-5 w-5 text-slate-400">{children}</div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-white">{value}</div>
        {subtext && (
          <p className={cn(
            "text-sm mt-1",
            trend ? trendColors[trend] : "text-slate-400"
          )}>
            {subtext}
          </p>
        )}
        {note && (
          <p className="text-xs text-muted-foreground mt-1 font-medium">
            {note}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
