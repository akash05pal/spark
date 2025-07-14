'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { apiService, KPIResponse, LogisticsData, ReturnsData, InventoryData, SuppliersData } from '@/lib/api';
import { UserRole } from './role-selector';
import { Truck, Undo2, Boxes, TrendingUp, TrendingDown, AlertTriangle, Package, Clock } from 'lucide-react';

interface RoleDashboardsProps {
  role: UserRole;
}

export default function RoleDashboards({ role }: RoleDashboardsProps) {
  const [kpis, setKpis] = useState<KPIResponse | null>(null);
  const [logisticsData, setLogisticsData] = useState<LogisticsData | null>(null);
  const [returnsData, setReturnsData] = useState<ReturnsData | null>(null);
  const [inventoryData, setInventoryData] = useState<InventoryData | null>(null);
  const [suppliersData, setSuppliersData] = useState<SuppliersData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [kpisData] = await Promise.all([
          apiService.getKPIs(),
        ]);

        setKpis(kpisData);

        // Fetch role-specific data
        if (role === 'LogisticsManager') {
          const logistics = await apiService.getLogisticsData();
          setLogisticsData(logistics);
        } else if (role === 'ReturnsManager') {
          const returns = await apiService.getReturnsData();
          setReturnsData(returns);
        } else if (role === 'InventoryAnalyst') {
          const [inventory, suppliers] = await Promise.all([
            apiService.getInventoryData(),
            apiService.getSuppliersData()
          ]);
          setInventoryData(inventory);
          setSuppliersData(suppliers);
        }
        setError(null);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setError('Failed to load role-specific data. Please check your backend connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [role]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="h-4 bg-gray-700 rounded w-1/3 animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[...Array(2)].map((_, j) => (
                  <div key={j} className="h-8 bg-gray-700 rounded animate-pulse"></div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Connection Error</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="text-red-400 mb-2">⚠️ Backend Connection Failed</div>
              <div className="text-sm text-gray-400 mb-4">{error}</div>
              <div className="text-xs text-gray-500">
                Make sure your backend server is running and Neo4j is connected.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  switch (role) {
    case 'LogisticsManager':
      return <LogisticsManagerDashboard kpis={kpis} logisticsData={logisticsData} />;
    case 'ReturnsManager':
      return <ReturnsManagerDashboard kpis={kpis} returnsData={returnsData} />;
    case 'InventoryAnalyst':
      return <InventoryAnalystDashboard kpis={kpis} inventoryData={inventoryData} suppliersData={suppliersData} />;
    default:
      return <GeneralDashboard kpis={kpis} />;
  }
}

function LogisticsManagerDashboard({ kpis, logisticsData }: { kpis: KPIResponse | null; logisticsData: LogisticsData | null }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-blue-400" />
            Forward Shipments Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <div className="text-2xl font-bold text-blue-400">{kpis?.total_shipments || 0}</div>
              <div className="text-sm text-gray-400">Total Shipments</div>
            </div>
            <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/20">
              <div className="text-2xl font-bold text-green-400">
                {kpis ? kpis.total_shipments - kpis.delayed_shipments : 0}
              </div>
              <div className="text-sm text-gray-400">On Time</div>
            </div>
            <div className="text-center p-4 bg-red-500/10 rounded-lg border border-red-500/20">
              <div className="text-2xl font-bold text-red-400">{kpis?.delayed_shipments || 0}</div>
              <div className="text-sm text-gray-400">Delayed</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Carrier Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {logisticsData?.delays.slice(0, 5).map((delay, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <Truck className="w-4 h-4 text-blue-400" />
                  <div>
                    <div className="font-medium">{delay.carrier}</div>
                    <div className="text-sm text-gray-400">{delay.delay_count} delays</div>
                  </div>
                </div>
                <Badge variant="destructive">{delay.delay_count}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ReturnsManagerDashboard({ kpis, returnsData }: { kpis: KPIResponse | null; returnsData: ReturnsData | null }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Undo2 className="w-5 h-5 text-orange-400" />
            Returns Processing Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-orange-500/10 rounded-lg border border-orange-500/20">
              <div className="text-2xl font-bold text-orange-400">{kpis?.return_rate || 0}%</div>
              <div className="text-sm text-gray-400">Return Rate</div>
            </div>
            <div className="text-center p-4 bg-red-500/10 rounded-lg border border-red-500/20">
              <div className="text-2xl font-bold text-red-400">2</div>
              <div className="text-sm text-gray-400">SLA Breached</div>
            </div>
            <div className="text-center p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
              <div className="text-2xl font-bold text-yellow-400">1</div>
              <div className="text-sm text-gray-400">Nearing SLA</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Return Reasons</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {returnsData?.returns.slice(0, 5).map((returnItem, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <Package className="w-4 h-4 text-orange-400" />
                  <div>
                    <div className="font-medium capitalize">{returnItem.reason}</div>
                    <div className="text-sm text-gray-400">{returnItem.count} returns</div>
                  </div>
                </div>
                <Badge variant="secondary">{returnItem.count}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function InventoryAnalystDashboard({ kpis, inventoryData, suppliersData }: { 
  kpis: KPIResponse | null; 
  inventoryData: InventoryData | null; 
  suppliersData: SuppliersData | null; 
}) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Boxes className="w-5 h-5 text-green-400" />
            Inventory Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/20">
              <div className="text-2xl font-bold text-green-400">{kpis?.low_stock_items || 0}</div>
              <div className="text-sm text-gray-400">Low Stock Items</div>
            </div>
            <div className="text-center p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
              <div className="text-2xl font-bold text-yellow-400">
                {inventoryData?.high_demand_items.length || 0}
              </div>
              <div className="text-sm text-gray-400">High Demand</div>
            </div>
            <div className="text-center p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <div className="text-2xl font-bold text-blue-400">
                {suppliersData?.suppliers.length || 0}
              </div>
              <div className="text-sm text-gray-400">Active Suppliers</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Low Stock Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {inventoryData?.low_stock_items.slice(0, 5).map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-gray-400">Stock: {item.stock}</div>
                    </div>
                  </div>
                  <Badge variant="destructive">Low</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Suppliers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {suppliersData?.suppliers.slice(0, 5).map((supplier, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <div>
                      <div className="font-medium">{supplier.name}</div>
                      <div className="text-sm text-gray-400">{supplier.on_time_rate}% on-time</div>
                    </div>
                  </div>
                  <Badge variant="outline">{supplier.item_count} items</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function GeneralDashboard({ kpis }: { kpis: KPIResponse | null }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            General Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <div className="text-2xl font-bold text-blue-400">{kpis?.total_shipments || 0}</div>
              <div className="text-sm text-gray-400">Total Shipments</div>
            </div>
            <div className="text-center p-4 bg-red-500/10 rounded-lg border border-red-500/20">
              <div className="text-2xl font-bold text-red-400">{kpis?.delayed_shipments || 0}</div>
              <div className="text-sm text-gray-400">Delayed</div>
            </div>
            <div className="text-center p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
              <div className="text-2xl font-bold text-yellow-400">{kpis?.low_stock_items || 0}</div>
              <div className="text-sm text-gray-400">Low Stock</div>
            </div>
            <div className="text-center p-4 bg-orange-500/10 rounded-lg border border-orange-500/20">
              <div className="text-2xl font-bold text-orange-400">{kpis?.return_rate || 0}%</div>
              <div className="text-sm text-gray-400">Return Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 