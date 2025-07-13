'use client';
import { useEffect, useState } from 'react';
import AiAssistant from "@/components/dashboard/ai-assistant";
import { Charts } from "@/components/dashboard/charts";
import KpiCard from "@/components/dashboard/kpi-card";
import MapView from "@/components/dashboard/map-view";
import { Button } from "@/components/ui/button";
import { Boxes, Download, Send, Share2, Truck, Undo2, Workflow } from "lucide-react";
import { apiService, KPIResponse } from "@/lib/api";
import { mockKPIData } from "@/lib/mock-data";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { useRef } from "react";

export default function Dashboard() {
  const [kpis, setKpis] = useState<KPIResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKPIs = async () => {
      try {
        const data = await apiService.getKPIs();
        setKpis(data);
      } catch (error) {
        console.error('Failed to fetch KPIs:', error);
        // Fallback to mock data if API fails
        setKpis(mockKPIData);
      } finally {
        setLoading(false);
      }
    };

    fetchKPIs();
  }, []);

  // Calculate derived values
  const delayRate = kpis ? (kpis.delayed_shipments / kpis.total_shipments * 100) : 0;
  const criticalItems = kpis ? Math.floor(kpis.low_stock_items * 0.3) : 0; // 30% of low stock items are critical
  const onTimeShipments = kpis ? kpis.total_shipments - kpis.delayed_shipments : 0;

  return (
    <div className="flex flex-col gap-6">
      <AiAssistant />
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          title="Total Shipments"
          value={loading ? "Loading..." : kpis?.total_shipments.toLocaleString() || "0"}
          subtext={`${onTimeShipments.toLocaleString()} on time`}
          note={kpis && delayRate > 50 ? "High delay rate" : undefined}
          glowColor="cyan"
          trend={kpis && delayRate > 50 ? "down" : "neutral"}
        >
            <Send />
        </KpiCard>
        <KpiCard
          title="Delayed Shipments"
          value={loading ? "Loading..." : kpis?.delayed_shipments.toLocaleString() || "0"}
          subtext={`${delayRate.toFixed(1)}% of total`}
          note={kpis && delayRate > 50 ? "Critical" : delayRate > 20 ? "Warning" : undefined}
          glowColor="red"
          trend="down"
        >
            <Truck />
        </KpiCard>
        <KpiCard
          title="Low Stock Items"
          value={loading ? "Loading..." : kpis?.low_stock_items.toLocaleString() || "0"}
          subtext={`${criticalItems} critical`}
          note={kpis && kpis.low_stock_items > 100 ? "High risk" : undefined}
          glowColor="yellow"
          trend={kpis && kpis.low_stock_items > 100 ? "down" : "neutral"}
        >
            <Boxes />
        </KpiCard>
        <KpiCard
          title="Return Rate"
          value={loading ? "Loading..." : "12.0%"}
          subtext={"120 returns out of 1000 shipments"}
          note={kpis && 12.0 > 20 ? "Above threshold" : undefined}
          glowColor="orange"
          trend={kpis && 12.0 > 20 ? "down" : "neutral"}
        >
            <Undo2 />
        </KpiCard>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <Charts />
        </div>
        <div className="xl:col-span-2">
          <MapView />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center text-center">
            <div className="p-4 bg-slate-900 rounded-full mb-4">
              <Share2 className="w-8 h-8 text-cyan-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Knowledge Graph</h3>
            <p className="text-sm text-muted-foreground mb-4">Visualize connections between items, suppliers, and warehouses.</p>
            <a
              href="http://localhost:7474/browser/preview/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-transparent border border-purple-500 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300 rounded-lg px-4 py-2 font-medium transition-colors duration-200"
            >
              <Workflow className="mr-2 h-4 w-4 inline-block align-middle" /> Explore Graph
            </a>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center text-center">
            <div className="p-4 bg-slate-900 rounded-full mb-4">
              <Download className="w-8 h-8 text-cyan-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Download Reports</h3>
            <p className="text-sm text-muted-foreground mb-4">Export summary, returns, or delay heatmaps.</p>
            <Popover>
              <PopoverTrigger asChild>
            <Button variant="outline" className="bg-transparent border-purple-500 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300">
                <Download className="mr-2 h-4 w-4" /> Download
            </Button>
              </PopoverTrigger>
              <PopoverContent align="center" className="w-48 p-2 bg-slate-900 border border-slate-700">
                <div className="flex flex-col gap-2">
                  <button
                    className="w-full px-3 py-2 rounded text-left text-slate-100 hover:bg-slate-800 transition"
                    onClick={() => {
                      // Generate CSV
                      const csv = `Region,Delays,Total Shipments,Delay Rate (%)\nCentral,140,482,29\nEast,122,430,28.4\nNorth,144,557,25.9\nSouth,127,491,25.9\nWest,138,429,32.2`;
                      const blob = new Blob([csv], { type: 'text/csv' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'report.csv';
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                    }}
                  >
                    📄 Download CSV
                  </button>
                  <button
                    className="w-full px-3 py-2 rounded text-left text-slate-100 hover:bg-slate-800 transition"
                    onClick={async () => {
                      // Generate PDF (simple, using jsPDF if available)
                      const jsPDF = (await import('jspdf')).default;
                      const doc = new jsPDF();
                      doc.text('Regional Summary Report', 10, 10);
                      doc.text('Region  Delays  Total Shipments  Delay Rate (%)', 10, 20);
                      doc.text('Central  140  482  29', 10, 30);
                      doc.text('East     122  430  28.4', 10, 40);
                      doc.text('North    144  557  25.9', 10, 50);
                      doc.text('South    127  491  25.9', 10, 60);
                      doc.text('West     138  429  32.2', 10, 70);
                      doc.save('report.pdf');
                    }}
                  >
                    📝 Download PDF
                  </button>
                </div>
              </PopoverContent>
            </Popover>
        </div>
      </div>
       <footer className="text-center text-sm text-muted-foreground py-4">
        Powered by INTELLIA – Supply Chain Intelligence Platform | v1.0
      </footer>
    </div>
  );
}
