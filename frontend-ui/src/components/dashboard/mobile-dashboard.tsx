'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { apiService, KPIResponse } from '@/lib/api';
import { 
  Boxes, 
  Clock, 
  Package, 
  Truck, 
  Undo2, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  Filter,
  RefreshCw
} from 'lucide-react';

interface MobileStats {
  totalReturns: number;
  shipmentsInTransit: number;
  lowStockItems: number;
  delayedShipments: number;
}

export default function MobileDashboard() {
  const [kpis, setKpis] = useState<KPIResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await apiService.getKPIs();
        setKpis(data);
        setError(null);
      } catch (error) {
        console.error('Failed to fetch KPIs:', error);
        setError('Failed to load dashboard data. Please check your backend connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusIcon = (type: string, value: number, threshold: number) => {
    if (value > threshold) {
      return <TrendingDown className="w-4 h-4 text-red-500" />;
    }
    return <TrendingUp className="w-4 h-4 text-green-500" />;
  };

  const getStatusColor = (type: string, value: number, threshold: number) => {
    if (value > threshold) {
      return 'text-red-400';
    }
    return 'text-green-400';
  };

  if (loading) {
    return (
      <div className="space-y-4 p-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-700 rounded-lg animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4 p-4">
        <div className="text-center py-8">
          <div className="text-red-400 mb-2">⚠️ Connection Error</div>
          <div className="text-sm text-gray-400 mb-4">{error}</div>
          <div className="text-xs text-gray-500">
            Make sure your backend server is running and Neo4j is connected.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      {/* Header with Filter Button */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">On-Ground Dashboard</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          Filter
        </Button>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Total Returns */}
        <Card className="bg-red-500/10 border-red-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-red-400">
                  {kpis ? Math.round(kpis.return_rate * 10) : 0}
                </div>
                <div className="text-xs text-gray-400">Returns</div>
              </div>
              <Undo2 className="w-6 h-6 text-red-400" />
            </div>
            <div className="flex items-center gap-1 mt-2">
              {getStatusIcon('returns', kpis?.return_rate || 0, 15)}
              <span className={`text-xs ${getStatusColor('returns', kpis?.return_rate || 0, 15)}`}>
                {kpis?.return_rate || 0}%
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Shipments In Transit */}
        <Card className="bg-blue-500/10 border-blue-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-400">
                  {kpis ? kpis.total_shipments - kpis.delayed_shipments : 0}
                </div>
                <div className="text-xs text-gray-400">In Transit</div>
              </div>
              <Truck className="w-6 h-6 text-blue-400" />
            </div>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-xs text-green-400">Active</span>
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Items */}
        <Card className="bg-yellow-500/10 border-yellow-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-yellow-400">
                  {kpis?.low_stock_items || 0}
                </div>
                <div className="text-xs text-gray-400">Low Stock</div>
              </div>
              <Boxes className="w-6 h-6 text-yellow-400" />
            </div>
            <div className="flex items-center gap-1 mt-2">
              {getStatusIcon('stock', kpis?.low_stock_items || 0, 50)}
              <span className={`text-xs ${getStatusColor('stock', kpis?.low_stock_items || 0, 50)}`}>
                {kpis?.low_stock_items || 0} items
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Delayed Shipments */}
        <Card className="bg-orange-500/10 border-orange-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-orange-400">
                  {kpis?.delayed_shipments || 0}
                </div>
                <div className="text-xs text-gray-400">Delayed</div>
              </div>
              <AlertTriangle className="w-6 h-6 text-orange-400" />
            </div>
            <div className="flex items-center gap-1 mt-2">
              {getStatusIcon('delays', kpis?.delayed_shipments || 0, 20)}
              <span className={`text-xs ${getStatusColor('delays', kpis?.delayed_shipments || 0, 20)}`}>
                {kpis ? Math.round((kpis.delayed_shipments / kpis.total_shipments) * 100) : 0}%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Priority Alerts */}
      <Card className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border-red-500/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-red-400">Priority Alerts</h3>
            <Badge variant="destructive" className="text-xs">3 Active</Badge>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span>2 shipments SLA breached</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span>1 return nearing 72h limit</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span>5 items below safety stock</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" className="h-12">
          <Package className="w-4 h-4 mr-2" />
          View All
        </Button>
        <Button variant="outline" className="h-12">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Filters Panel (Collapsible) */}
      {showFilters && (
        <Card className="mt-4">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">Filters</h3>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" size="sm" className="justify-start">
                <Truck className="w-4 h-4 mr-2" />
                Forward
              </Button>
              <Button variant="outline" size="sm" className="justify-start">
                <Undo2 className="w-4 h-4 mr-2" />
                Returns
              </Button>
              <Button variant="outline" size="sm" className="justify-start">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Delayed
              </Button>
              <Button variant="outline" size="sm" className="justify-start">
                <Boxes className="w-4 h-4 mr-2" />
                Low Stock
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 