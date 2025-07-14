'use client';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { apiService, PriorityResponse, ShipmentData } from '@/lib/api';
import { AlertTriangle, Clock, Package, Truck, Undo2, Zap } from 'lucide-react';

export default function PriorityHandling() {
  const [priorityData, setPriorityData] = useState<PriorityResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'high' | 'medium'>('all');

  useEffect(() => {
    const fetchPriorityData = async () => {
      try {
        const data = await apiService.getPriorityData();
        setPriorityData(data);
        setError(null);
      } catch (error) {
        console.error('Failed to fetch priority data:', error);
        setError('Failed to load priority data. Please check your backend connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchPriorityData();
  }, []);

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Zap className="w-4 h-4 text-red-500" />;
      case 'medium':
        return <Clock className="w-4 h-4 text-orange-500" />;
      default:
        return <Package className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSLAStatusBadge = (slaStatus: string) => {
    switch (slaStatus) {
      case 'breached':
        return <Badge variant="destructive" className="text-xs">🔴 SLA Breach</Badge>;
      case 'nearing':
        return <Badge variant="secondary" className="text-xs bg-orange-500">🟠 Nearing SLA</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">✅ Normal</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'in-transit':
        return <Truck className="w-4 h-4 text-blue-500" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'pending':
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      default:
        return <Package className="w-4 h-4 text-gray-500" />;
    }
  };

  const filteredShipments = priorityData?.shipments.filter(shipment => {
    if (filter === 'all') return true;
    return shipment.priority === filter;
  }) || [];

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Priority Handling</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-700 rounded w-1/4"></div>
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            Priority Handling
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-red-400 mb-2">⚠️ Connection Error</div>
            <div className="text-sm text-gray-400 mb-4">{error}</div>
            <div className="text-xs text-gray-500">
              Make sure your backend server is running and Neo4j is connected.
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            Priority Handling
          </CardTitle>
          <div className="flex items-center gap-2">
            <Select value={filter} onValueChange={(value: 'all' | 'high' | 'medium') => setFilter(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-3 bg-red-500/10 rounded-lg border border-red-500/20">
            <div className="text-2xl font-bold text-red-400">{priorityData?.summary.high_priority || 0}</div>
            <div className="text-xs text-gray-400">High Priority</div>
          </div>
          <div className="text-center p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
            <div className="text-2xl font-bold text-orange-400">{priorityData?.summary.medium_priority || 0}</div>
            <div className="text-xs text-gray-400">Medium Priority</div>
          </div>
          <div className="text-center p-3 bg-red-600/10 rounded-lg border border-red-600/20">
            <div className="text-2xl font-bold text-red-500">{priorityData?.summary.sla_breached || 0}</div>
            <div className="text-xs text-gray-400">SLA Breached</div>
          </div>
          <div className="text-center p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
            <div className="text-2xl font-bold text-yellow-400">{priorityData?.summary.sla_nearing || 0}</div>
            <div className="text-xs text-gray-400">Nearing SLA</div>
          </div>
        </div>

        {/* Shipments List */}
        <div className="space-y-3">
          {filteredShipments.map((shipment) => (
            <div
              key={shipment.shipment_id}
              className="p-4 border border-gray-700 rounded-lg hover:border-gray-600 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                  {getPriorityIcon(shipment.priority)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-sm font-medium">{shipment.shipment_id}</span>
                      {getSLAStatusBadge(shipment.sla_status)}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      {shipment.shipment_type === 'forward' ? (
                        <Truck className="w-3 h-3" />
                      ) : (
                        <Undo2 className="w-3 h-3" />
                      )}
                      <span className="capitalize">{shipment.shipment_type}</span>
                      <span>•</span>
                      <span className="capitalize">{shipment.status}</span>
                      {shipment.sla_hours_remaining !== undefined && shipment.sla_hours_remaining !== null && (
                        <>
                          <span>•</span>
                          <span>{shipment.sla_hours_remaining.toFixed(1)}h remaining</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(shipment.status)}
                  <Badge 
                    variant={shipment.priority === 'high' ? 'destructive' : 'secondary'}
                    className="text-xs"
                  >
                    {shipment.priority.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredShipments.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            No shipments found for the selected filter.
          </div>
        )}
      </CardContent>
    </Card>
  );
} 