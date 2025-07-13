import React from 'react';

interface HtmlRendererProps {
  html: string;
  className?: string;
}

export function HtmlRenderer({ html, className = "" }: HtmlRendererProps) {
  // Function to transform HTML with proper styling
  const transformHtml = (htmlContent: string): string => {
    return htmlContent
      // Headings
      .replace(/<h1>/g, '<h1 class="text-2xl font-bold text-white mb-4 mt-6 first:mt-0">')
      .replace(/<h2>/g, '<h2 class="text-xl font-bold text-white mb-3 mt-5 first:mt-0">')
      .replace(/<h3>/g, '<h3 class="text-lg font-bold text-cyan-400 mb-2 mt-4 first:mt-0">')
      .replace(/<h4>/g, '<h4 class="text-base font-semibold text-purple-400 mb-2 mt-3 first:mt-0">')
      .replace(/<h5>/g, '<h5 class="text-sm font-semibold text-cyan-300 mb-2 mt-2 first:mt-0">')
      .replace(/<h6>/g, '<h6 class="text-xs font-semibold text-purple-300 mb-2 mt-2 first:mt-0">')
      
      // Paragraphs and text
      .replace(/<p>/g, '<p class="mb-3 text-slate-300 leading-relaxed">')
      .replace(/<strong>/g, '<strong class="font-bold text-white">')
      .replace(/<b>/g, '<b class="font-bold text-white">')
      .replace(/<em>/g, '<em class="italic text-cyan-300">')
      .replace(/<i>/g, '<i class="italic text-cyan-300">')
      .replace(/<code>/g, '<code class="bg-slate-800 px-2 py-1 rounded text-cyan-300 font-mono text-sm">')
      
      // Lists
      .replace(/<ul>/g, '<ul class="list-disc list-inside mb-4 space-y-1 text-slate-300 ml-4">')
      .replace(/<ol>/g, '<ol class="list-decimal list-inside mb-4 space-y-1 text-slate-300 ml-4">')
      .replace(/<li>/g, '<li class="text-slate-300 mb-1">')
      
      // Tables
      .replace(/<table>/g, '<table class="w-full border-collapse border border-slate-600 mb-4">')
      .replace(/<th>/g, '<th class="border border-slate-600 px-3 py-2 text-left bg-slate-800 text-white font-semibold">')
      .replace(/<td>/g, '<td class="border border-slate-600 px-3 py-2 text-slate-300">')
      
      // Blockquotes
      .replace(/<blockquote>/g, '<blockquote class="border-l-4 border-cyan-500 pl-4 py-2 mb-4 bg-slate-800/50 italic text-slate-300">')
      
      // Horizontal rules
      .replace(/<hr>/g, '<hr class="border-slate-600 my-6">')
      
      // Colored divs (for alerts, insights, etc.)
      .replace(/<div style="color: red;">/g, '<div class="bg-red-900/20 border border-red-500/50 p-4 rounded-lg mb-4 text-red-300">')
      .replace(/<div style="color: green;">/g, '<div class="bg-green-900/20 border border-green-500/50 p-4 rounded-lg mb-4 text-green-300">')
      .replace(/<div style="color: orange;">/g, '<div class="bg-orange-900/20 border border-orange-500/50 p-4 rounded-lg mb-4 text-orange-300">')
      .replace(/<div style="color: blue;">/g, '<div class="bg-blue-900/20 border border-blue-500/50 p-4 rounded-lg mb-4 text-blue-300">')
      .replace(/<div style="color: yellow;">/g, '<div class="bg-yellow-900/20 border border-yellow-500/50 p-4 rounded-lg mb-4 text-yellow-300">')
      .replace(/<div style="color: purple;">/g, '<div class="bg-purple-900/20 border border-purple-500/50 p-4 rounded-lg mb-4 text-purple-300">')
      .replace(/<div style="color: cyan;">/g, '<div class="bg-cyan-900/20 border border-cyan-500/50 p-4 rounded-lg mb-4 text-cyan-300">')
      .replace(/<div style="color: pink;">/g, '<div class="bg-pink-900/20 border border-pink-500/50 p-4 rounded-lg mb-4 text-pink-300">')
      
      // Additional color variations
      .replace(/<div style="color: red-500;">/g, '<div class="bg-red-900/20 border border-red-500/50 p-4 rounded-lg mb-4 text-red-300">')
      .replace(/<div style="color: green-500;">/g, '<div class="bg-green-900/20 border border-green-500/50 p-4 rounded-lg mb-4 text-green-300">')
      .replace(/<div style="color: orange-500;">/g, '<div class="bg-orange-900/20 border border-orange-500/50 p-4 rounded-lg mb-4 text-orange-300">')
      .replace(/<div style="color: blue-500;">/g, '<div class="bg-blue-900/20 border border-blue-500/50 p-4 rounded-lg mb-4 text-blue-300">')
      .replace(/<div style="color: yellow-500;">/g, '<div class="bg-yellow-900/20 border border-yellow-500/50 p-4 rounded-lg mb-4 text-yellow-300">')
      .replace(/<div style="color: purple-500;">/g, '<div class="bg-purple-900/20 border border-purple-500/50 p-4 rounded-lg mb-4 text-purple-300">')
      .replace(/<div style="color: cyan-500;">/g, '<div class="bg-cyan-900/20 border border-cyan-500/50 p-4 rounded-lg mb-4 text-cyan-300">')
      .replace(/<div style="color: pink-500;">/g, '<div class="bg-pink-900/20 border border-pink-500/50 p-4 rounded-lg mb-4 text-pink-300">')
      
      // Special sections for AI responses
      .replace(/<div style="color: red;">/g, '<div class="bg-red-900/20 border border-red-500/50 p-4 rounded-lg mb-4">')
      .replace(/<div style="color: green;">/g, '<div class="bg-green-900/20 border border-green-500/50 p-4 rounded-lg mb-4">')
      .replace(/<div style="color: orange;">/g, '<div class="bg-orange-900/20 border border-orange-500/50 p-4 rounded-lg mb-4">')
      .replace(/<div style="color: blue;">/g, '<div class="bg-blue-900/20 border border-blue-500/50 p-4 rounded-lg mb-4">')
      .replace(/<div style="color: yellow;">/g, '<div class="bg-yellow-900/20 border border-yellow-500/50 p-4 rounded-lg mb-4">')
      .replace(/<div style="color: purple;">/g, '<div class="bg-purple-900/20 border border-purple-500/50 p-4 rounded-lg mb-4">')
      .replace(/<div style="color: cyan;">/g, '<div class="bg-cyan-900/20 border border-cyan-500/50 p-4 rounded-lg mb-4">')
      .replace(/<div style="color: pink;">/g, '<div class="bg-pink-900/20 border border-pink-500/50 p-4 rounded-lg mb-4">')
      
      // Generic div styling
      .replace(/<div>/g, '<div class="mb-3">')
      
      // Links
      .replace(/<a href=/g, '<a class="text-cyan-400 hover:text-cyan-300 underline" href=')
      
      // Pre and code blocks
      .replace(/<pre>/g, '<pre class="bg-slate-800 p-4 rounded-lg mb-4 overflow-x-auto">')
      .replace(/<code>/g, '<code class="bg-slate-800 px-2 py-1 rounded text-cyan-300 font-mono text-sm">');
  };

  return (
    <div 
      className={`prose prose-invert max-w-none ${className}`}
      style={{
        lineHeight: '1.6',
      }}
      dangerouslySetInnerHTML={{ 
        __html: transformHtml(html)
      }}
    />
  );
} 