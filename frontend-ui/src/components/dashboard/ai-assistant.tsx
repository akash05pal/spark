
'use client';
import React,{ useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BrainCircuit, Sparkles, X } from 'lucide-react';
import { cn } from '@/lib/utils';
// import Lottie from "lottie-react";
import AnimatedBlob from './AnimatedBlob';
// import animationData from "./ai-animation.json";
import { apiService } from '@/lib/api';
import { HtmlRenderer } from '@/components/ui/html-renderer';

export default function AiAssistant() {
  const [query, setQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsProcessing(true);
    setResult(null);
    setError(null);
    
    try {
      const response = await apiService.processQuery(query);
      setResult(response.result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while processing your query');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    setResult(null);
  };

  const showResultPanel = isProcessing || result;

  return (
    <Card className="bg-slate-900/50 border border-slate-800 shadow-xl overflow-hidden">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <div className="flex flex-col">
                <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
                  <Sparkles className="h-8 w-8 text-cyan-400" />
                  INTELLIA AI Assistant
                </h2>
                <p className="text-sm text-muted-foreground mt-2">
                  Ask anything about shipments, delays, returns, or supplier performance...
                </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 flex items-center gap-2">
                <Input
                placeholder="e.g., 'Show me all delayed shipments...'"
                className="flex-1 bg-slate-900 border-slate-700 h-12 text-base"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={isProcessing}
                />
                <Button
                type="submit"
                size="lg"
                className="h-12 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold hover:opacity-90 transition-opacity"
                disabled={isProcessing || !query.trim()}
                >
                {isProcessing ? (
                    <>
                       
                        Processing...
                    </>
                ) : (
                    <>
                    <BrainCircuit className="mr-2 h-5 w-5" />
                    Submit
                    </>
                )}
                </Button>
            </form>
          </div>
          <div className="relative hidden md:flex items-center justify-center h-48">
             <AnimatedBlob 
              isProcessing={isProcessing} 
              className={cn("transition-all duration-500", isProcessing ? 'scale-110' : 'scale-100')}
              />
                
            </div>
          </div>
        

        {showResultPanel && (
            <div className='mt-6'>
                {isProcessing && !result &&
                  <div className="flex flex-col items-center justify-center gap-4 p-8">
                    <p className="text-center text-muted-foreground animate-pulse">Processing your query...</p>
                  </div>
                }
                {error && (
                    <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg">
                        <p className="text-red-400 text-sm">{error}</p>
                    </div>
                )}
                {result && (
                    <>
                        <div className="w-full min-h-[12rem] max-h-96 bg-slate-950/70 border border-slate-700 rounded-lg p-4 overflow-y-auto">
                            <HtmlRenderer html={result} />
                        </div>
                        <Button onClick={handleClear} variant="outline" className="mt-4 bg-transparent border-slate-700 hover:bg-slate-800">
                            <X className="mr-2 h-4 w-4" />
                            Start New Query
                        </Button>
                    </>
                )}
            </div>
        )}

      </CardContent>
    </Card>
  );
}
