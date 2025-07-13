
"use client"
import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Rectangle } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { apiService, ChartData } from "@/lib/api";
import { mockChartData } from "@/lib/mock-data";
import ReturnReasonsTrendCard from './ReturnReasonsTrendCard';

export function Charts() {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const data = await apiService.getChartData();
        setChartData(data);
      } catch (error) {
        console.error('Failed to fetch chart data:', error);
        // Fallback to mock data
        setChartData(mockChartData);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, []);

  const carrierPerformanceData = chartData?.carrier_performance || [
    { name: 'CarrierX', performance: 85, month: 'Mar' },
    { name: 'CarrierY', performance: 92, month: 'Apr' },
    { name: 'CarrierZ', performance: 78, month: 'May' },
    { name: 'CarrierA', performance: 88, month: 'Jun' },
    { name: 'CarrierB', performance: 95, month: 'Jul' }
  ];

  const returnReasonsData = chartData?.return_reasons || [
    { month: 'Loading...', damaged: 0, wrong_item: 0, unwanted: 0 }
];

const chartConfig = {
  performance: {
    label: "Performance",
  },
  damaged: {
    label: "Damaged",
    color: "hsl(var(--chart-5))",
  },
  wrong_item: {
    label: "Wrong Item",
    color: "hsl(var(--chart-3))",
  },
  unwanted: {
    label: "Unwanted",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

  // Find the max value for highlighting
  const maxPerformance = Math.max(...carrierPerformanceData.map(d => d.performance));

  // Custom bar shape: vertical rectangle with sharp corners, with a white dot at the top
  const PillBar = (props: any) => {
    const { x, y, width, height, isMax } = props;
    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill={isMax ? 'url(#hatchedBar)' : 'url(#barGradient)'}
        />
        {/* Dot at top */}
        <circle
          cx={x + width / 2}
          cy={y}
          r={6}
          fill="#fff"
          stroke="#232946"
          strokeWidth={2}
        />
      </g>
    );
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      <Card className="bg-slate-900/50 border border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Carrier Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={carrierPerformanceData} margin={{ top: 20, right: 10, left: -20, bottom: 30 }}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#334155" />
                    <stop offset="100%" stopColor="#1e293b" />
                  </linearGradient>
                  <pattern id="hatchedBar" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(30)">
                    <rect x="0" y="0" width="8" height="8" fill="#334155" />
                    <line x1="0" y1="0" x2="0" y2="8" stroke="#60a5fa" strokeWidth="2" />
                  </pattern>
                </defs>
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }}
                />
                <Tooltip
                  cursor={{ fill: '#232946' }}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar
                  dataKey="performance"
                  barSize={44}
                  shape={props => 
                    <PillBar
                      {...props}
                      isMax={props.payload.performance === maxPerformance}
                    /> 
                  } 
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
      <ReturnReasonsTrendCard />
    </div>
  )
}
