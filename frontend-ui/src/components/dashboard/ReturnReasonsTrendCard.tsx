import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceArea } from "recharts";
import { mockChartData } from "@/lib/mock-data";

const COLORS = {
  damaged: "#5eead4", // cyan
  wrong_item: "#818cf8", // indigo
  unwanted: "#f472b6", // pink
};

const data = mockChartData.return_reasons;
const allValues = data.flatMap(d => [d.damaged, d.wrong_item, d.unwanted]);
const min = Math.min(...allValues);
const max = Math.max(...allValues);
const avg = (allValues.reduce((a, b) => a + b, 0) / allValues.length).toFixed(2);

export default function ReturnReasonsTrendCard() {
  // For the timeline indicator
  const months = data.map(d => d.month);
  const currentIdx = Math.floor(months.length / 2);
  const currentMonth = months[currentIdx];

  return (
    <Card className="bg-gradient-to-br from-[#181f3a] to-[#232946] rounded-2xl shadow-2xl border-none p-0 overflow-hidden">
      <CardContent className="p-6 pb-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2 mb-2">
          <div>
            <div className="text-white text-xl font-bold leading-tight">Return Reasons Over Time</div>
            <div className="text-slate-400 text-xs font-medium tracking-wide">Summary Statistics</div>
          </div>
          <div className="flex gap-6 text-slate-200 text-xs font-semibold mt-2 md:mt-0">
            <div><span className="block text-lg font-bold text-white">{min}</span>Min</div>
            <div><span className="block text-lg font-bold text-white">{max}</span>Max</div>
            <div><span className="block text-lg font-bold text-white">{avg}</span>Average</div>
            <div><span className="block text-lg font-bold text-white">1</span>Day</div>
            <div><span className="block text-lg font-bold text-white">{months.length}</span>Week</div>
          </div>
        </div>
        {/* Chart */}
        <div className="relative h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="areaDamaged" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.damaged} stopOpacity={0.18}/>
                  <stop offset="95%" stopColor={COLORS.damaged} stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="areaWrong" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.wrong_item} stopOpacity={0.18}/>
                  <stop offset="95%" stopColor={COLORS.wrong_item} stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="areaUnwanted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.unwanted} stopOpacity={0.18}/>
                  <stop offset="95%" stopColor={COLORS.unwanted} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#232946" />
              <XAxis dataKey="month" stroke="#bfc9e0" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#bfc9e0" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ background: "#232946", border: "none", borderRadius: 12, color: "#fff" }}
                labelStyle={{ color: "#a5b4fc", fontWeight: 600 }}
                itemStyle={{ fontWeight: 500 }}
                formatter={(value, name) => [
                  value,
                  typeof name === "string"
                    ? name.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
                    : name
                ]}
              />
              <Line type="monotone" dataKey="damaged" stroke={COLORS.damaged} strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 7 }} fillOpacity={1} fill="url(#areaDamaged)" />
              <Line type="monotone" dataKey="wrong_item" stroke={COLORS.wrong_item} strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 7 }} fillOpacity={1} fill="url(#areaWrong)" />
              <Line type="monotone" dataKey="unwanted" stroke={COLORS.unwanted} strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 7 }} fillOpacity={1} fill="url(#areaUnwanted)" />
              {/* Optional: Highlight current point */}
              <ReferenceArea x1={months[currentIdx]} x2={months[currentIdx]} stroke="#60a5fa" strokeOpacity={0.2} />
            </LineChart>
          </ResponsiveContainer>
          {/* Timeline indicator */}
          <div className="absolute left-0 right-0 bottom-0 flex flex-col items-center">
            <div className="w-full h-1 bg-gradient-to-r from-cyan-400/60 via-indigo-400/60 to-pink-400/60 rounded-full relative">
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-gradient-to-br from-cyan-400 to-indigo-400 rounded-full border-2 border-white shadow-lg flex items-center justify-center"
                style={{ marginTop: -6 }}
              >
                <span className="text-xs text-white font-bold">{currentMonth}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 