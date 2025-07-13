
'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { generateCompetitorInsights } from '@/ai/flows/generate-competitor-insights';
import { Lightbulb, Zap, BarChart } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

const insightIcons = {
    "Market Trends": BarChart,
    "Sentiment Analysis": Zap,
    "Feature Comparison": Lightbulb
};

export default function AiInsights() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [insights, setInsights] = useState<any[]>([]);

  const handleGenerateInsights = async () => {
    setIsProcessing(true);
    setInsights([]);
    try {
      const result = await generateCompetitorInsights({ competitor: 'Apple Inc.' });
      setInsights(result.insights);
    } catch (error) {
      console.error("Error generating insights:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="border-border/40 flex-1 flex flex-col">
      <CardHeader>
        <CardTitle>AI Insights</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col flex-grow">
         <Button onClick={handleGenerateInsights} disabled={isProcessing}>
            {isProcessing ? 'Generating...' : 'Generate Insights'}
         </Button>

         <div className="mt-6 flex-grow space-y-4">
            {isProcessing && (
                <>
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                </>
            )}
            {insights.map((insight, index) => {
                const Icon = insightIcons[insight.title as keyof typeof insightIcons] || Lightbulb;
                return (
                    <div key={index} className="flex gap-4 p-4 rounded-lg bg-secondary/30">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Icon className="h-5 w-5" />
                        </div>
                        <div>
                            <h4 className="font-semibold">{insight.title}</h4>
                            <p className="text-sm text-muted-foreground">{insight.summary}</p>
                        </div>
                    </div>
                )
            })}
         </div>
      </CardContent>
    </Card>
  );
}
