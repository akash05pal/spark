"use client";
import { useEffect, useState, useRef } from "react";
import { apiService } from "@/lib/api";
import { mockMapData } from "@/lib/mock-data";

const INDIA_REGIONS = [
  { name: "North", lat: 28.7, lon: 77.1 },
  { name: "South", lat: 13.1, lon: 80.3 },
  { name: "East", lat: 22.6, lon: 88.4 },
  { name: "West", lat: 19.1, lon: 72.9 },
  { name: "Central", lat: 23.3, lon: 77.4 },
];
const CARRIERS = ["CarrierX", "CarrierY", "CarrierZ", "CarrierA", "CarrierB"];

function getColor(delayRate: number) {
  // RdYlGn_r: red (high) to green (low)
  // 0-20: green, 20-30: yellow, 30+: red, interpolate
  if (delayRate > 80) return "#a50026";
  if (delayRate > 60) return "#f46d43";
  if (delayRate > 40) return "#fee08b";
  if (delayRate > 30) return "#ffffbf";
  if (delayRate > 20) return "#d9ef8b";
  if (delayRate > 10) return "#66bd63";
  return "#1a9850";
}

function getMarkerSize(delays: number) {
  // Scale marker size between 6 and 16 (smaller than before)
  return 6 + Math.min(10, Math.max(0, delays / 4));
}

export default function IndiaMap() {
  const [mapInitialized, setMapInitialized] = useState(false);
  const [markerData, setMarkerData] = useState<any[]>([]);
  const [regionSummary, setRegionSummary] = useState<any[]>([]);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    let isMounted = true;
    const initializeMap = async () => {
      try {
        const [L] = await Promise.all([
          import("leaflet"),
          import("leaflet/dist/leaflet.css"),
        ]);
        if (!isMounted || !mapRef.current || mapInstanceRef.current) return;
        const map = L.map(mapRef.current, {
          center: [23.0, 80.0],
          zoom: 5,
          zoomControl: true,
          scrollWheelZoom: true,
        });
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "&copy; OpenStreetMap contributors",
          maxZoom: 19,
        }).addTo(map);
        mapInstanceRef.current = map;
        setMapInitialized(true);
        await fetchAndAddMarkers(L, map);
      } catch (error) {
        console.error("Failed to initialize map:", error);
      }
    };
    const fetchAndAddMarkers = async (L: any, map: any) => {
      // Simulate API data as in the Python code
      let allMarkers: any[] = [];
      for (const region of INDIA_REGIONS) {
        for (const carrier of CARRIERS) {
          const delays = Math.floor(Math.random() * 40 + 10);
          const total_shipments = Math.floor(Math.random() * 100 + 50);
          const delay_rate = (delays / total_shipments) * 100;
          // Slight random spread for realism
          const lat = region.lat + (Math.random() - 0.5) * 2;
          const lon = region.lon + (Math.random() - 0.5) * 2;
          allMarkers.push({
            region: region.name,
            carrier,
            lat,
            lon,
            delays,
            total_shipments,
            delay_rate,
            color: getColor(delay_rate),
            size: getMarkerSize(delays),
          });
        }
      }
      setMarkerData(allMarkers);
      // Add markers to map
      const bounds = L.latLngBounds(allMarkers.map((r) => [r.lat, r.lon]));
      map.fitBounds(bounds);
      allMarkers.forEach((marker) => {
        const circle = L.circleMarker([marker.lat, marker.lon], {
          radius: marker.size,
          color: marker.color,
          fillColor: marker.color,
          fillOpacity: 0.8,
          weight: 2,
        }).addTo(map);
        circle.bindTooltip(
          `<div class="font-semibold">${marker.region}</div>
           <div>Carrier: <b>${marker.carrier}</b></div>
           <div>Delays: <b>${marker.delays}</b></div>
           <div>Delay Rate: <b>${marker.delay_rate.toFixed(1)}%</b></div>`,
          { direction: "top", offset: [0, -10], className: "bg-white text-gray-800 rounded px-2 py-1 shadow-lg border" }
        );
      });
      // Regional summary
      const summary: Record<string, { delays: number; total_shipments: number }> = {};
      for (const marker of allMarkers) {
        if (!summary[marker.region]) summary[marker.region] = { delays: 0, total_shipments: 0 };
        summary[marker.region].delays += marker.delays;
        summary[marker.region].total_shipments += marker.total_shipments;
      }
      const summaryArr = Object.entries(summary).map(([region, vals]) => ({
        region,
        delays: vals.delays,
        total_shipments: vals.total_shipments,
        delay_rate: vals.total_shipments ? ((vals.delays / vals.total_shipments) * 100).toFixed(1) : "0.0",
      }));
      setRegionSummary(summaryArr);
    };
    initializeMap();
    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Colorbar legend (SVG)
  const colorbar = (
    <svg width="180" height="16" style={{ display: 'block' }}>
      <defs>
        <linearGradient id="colorbar-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1a9850" />
          <stop offset="20%" stopColor="#66bd63" />
          <stop offset="40%" stopColor="#d9ef8b" />
          <stop offset="60%" stopColor="#ffffbf" />
          <stop offset="80%" stopColor="#fee08b" />
          <stop offset="90%" stopColor="#f46d43" />
          <stop offset="100%" stopColor="#a50026" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="180" height="16" fill="url(#colorbar-gradient)" />
      <text x="0" y="28" fontSize="12" fill="#444">0%</text>
      <text x="80" y="28" fontSize="12" fill="#444">50%</text>
      <text x="160" y="28" fontSize="12" fill="#444">100%</text>
    </svg>
  );

  return (
    <>
      <div className="relative w-full aspect-video bg-white rounded-lg overflow-hidden border border-gray-200">
        <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-transparent to-white/20" />
        <div
          ref={mapRef}
          className="w-full h-full"
          style={{ minHeight: 320, borderRadius: 12 }}
        />
        {!mapInitialized && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80">
            <span className="text-gray-600">Loading map...</span>
          </div>
        )}
        {/* Colorbar legend in top right */}
        <div className="absolute right-4 top-4 bg-white/90 rounded shadow p-2 flex flex-col items-center border border-gray-200">
          <span className="text-xs text-gray-700 font-semibold mb-1">Delay Rate</span>
          {colorbar}
        </div>
      </div>
      {/* Legend and summary */}
      <div className="flex flex-col lg:flex-row gap-4 mt-2">
        <div className="flex-1 min-w-0">
          <div
            className="rounded-xl bg-slate-800/80 shadow-lg border border-blue-900/30 p-4 mb-4"
          >
            <div className="mb-3">
              <span
                className="block text-lg font-bold text-white mb-1"
                style={{ letterSpacing: 0.5 }}
              >
                Delay Rate Legend
              </span>
              <span
                className="block w-12 h-1 rounded bg-blue-500 mb-2"
                style={{ boxShadow: '0 2px 8px 0 rgba(0, 123, 255, 0.15)' }}
              />
            </div>
            <div className="flex flex-col gap-1 text-sm">
              <span><span className="inline-block w-3 h-3 rounded-full mr-1" style={{ background: '#a50026' }} /> <span className="text-slate-100">Red: High delay rate (&gt;80%)</span></span>
              <span><span className="inline-block w-3 h-3 rounded-full mr-1" style={{ background: '#f46d43' }} /> <span className="text-slate-100">Orange: Medium delay rate (40-80%)</span></span>
              <span><span className="inline-block w-3 h-3 rounded-full mr-1" style={{ background: '#1a9850' }} /> <span className="text-slate-100">Green: Low delay rate (&lt;40%)</span></span>
            </div>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div
            className="rounded-xl bg-slate-800/80 shadow-lg border border-blue-900/30 p-4"
          >
            <div className="mb-3">
              <span
                className="block text-lg font-bold text-white mb-1"
                style={{ letterSpacing: 0.5 }}
              >
                Regional Summary
              </span>
              <span
                className="block w-12 h-1 rounded bg-blue-500 mb-2"
                style={{ boxShadow: '0 2px 8px 0 rgba(0, 123, 255, 0.15)' }}
              />
            </div>
            <div className="overflow-x-auto max-w-full">
              <table className="w-full text-xs text-slate-100 bg-slate-900 rounded-lg border border-slate-700 table-fixed">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="px-2 py-1 text-left w-1/4">Region</th>
                    <th className="px-2 py-1 text-right w-1/4">Delays</th>
                    <th className="px-2 py-1 text-right w-1/4">Total</th>
                    <th className="px-2 py-1 text-right w-1/4">Rate (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {regionSummary.map((region) => (
                    <tr key={region.region} className="border-b border-slate-800 hover:bg-slate-800/40">
                      <td className="px-2 py-1 font-semibold truncate">{region.region}</td>
                      <td className="px-2 py-1 text-right">{region.delays}</td>
                      <td className="px-2 py-1 text-right">{region.total_shipments}</td>
                      <td className="px-2 py-1 text-right font-bold">{region.delay_rate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 