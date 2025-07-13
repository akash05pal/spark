const API_BASE_URL = 'http://localhost:8000';

export interface QueryRequest {
  query: string;
}

export interface QueryResponse {
  result: string;
  sources?: string[];
}

export interface KPIResponse {
  total_shipments: number;
  delayed_shipments: number;
  low_stock_items: number;
  return_rate: number;
}

export interface ChartData {
  carrier_performance: Array<{
    name: string;
    performance: number;
    fill: string;
  }>;
  return_reasons: Array<{
    month: string;
    damaged: number;
    wrong_item: number;
    unwanted: number;
  }>;
  trends_data: Array<{
    carrier: string;
    total: number;
    delayed: number;
    delay_rate: number;
  }>;
}

export interface MapData {
  regions: Array<{
    name: string;
    delay: number;
    color: string;
  }>;
}

export interface InventoryData {
  low_stock_items: Array<{
    name: string;
    stock: number;
    demand: number;
  }>;
  high_demand_items: Array<{
    name: string;
    stock: number;
    demand: number;
  }>;
}

export interface SuppliersData {
  suppliers: Array<{
    name: string;
    on_time_rate: number;
    return_rate: number;
    item_count: number;
  }>;
}

export interface LogisticsData {
  delays: Array<{
    carrier: string;
    delay_count: number;
    reasons: string[];
  }>;
}

export interface ReturnsData {
  returns: Array<{
    reason: string;
    count: number;
  }>;
}

export interface ShipmentData {
  shipment_id: string;
  shipment_type: string;
  created_at: string;
  status: string;
  priority: string;
  sla_status: string;
  sla_hours_remaining?: number;
}

export interface PriorityResponse {
  shipments: ShipmentData[];
  summary: {
    total_shipments: number;
    high_priority: number;
    medium_priority: number;
    sla_breached: number;
    sla_nearing: number;
  };
}

// API service functions
export const apiService = {
  // AI Query
  async processQuery(query: string): Promise<QueryResponse> {
    const response = await fetch(`${API_BASE_URL}/api/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });
    
    if (!response.ok) {
      throw new Error(`Query failed: ${response.statusText}`);
    }
    
    return response.json();
  },

  // KPIs
  async getKPIs(): Promise<KPIResponse> {
    const response = await fetch(`${API_BASE_URL}/api/kpis`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch KPIs: ${response.statusText}`);
    }
    
    return response.json();
  },

  // Charts
  async getChartData(): Promise<ChartData> {
    const response = await fetch(`${API_BASE_URL}/api/charts`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch chart data: ${response.statusText}`);
    }
    
    return response.json();
  },

  // Map
  async getMapData(): Promise<MapData> {
    const response = await fetch(`${API_BASE_URL}/api/map`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch map data: ${response.statusText}`);
    }
    
    return response.json();
  },

  // Inventory
  async getInventoryData(): Promise<InventoryData> {
    const response = await fetch(`${API_BASE_URL}/api/inventory`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch inventory data: ${response.statusText}`);
    }
    
    return response.json();
  },

  // Suppliers
  async getSuppliersData(): Promise<SuppliersData> {
    const response = await fetch(`${API_BASE_URL}/api/suppliers`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch suppliers data: ${response.statusText}`);
    }
    
    return response.json();
  },

  // Logistics
  async getLogisticsData(): Promise<LogisticsData> {
    const response = await fetch(`${API_BASE_URL}/api/logistics`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch logistics data: ${response.statusText}`);
    }
    
    return response.json();
  },

  // Returns
  async getReturnsData(): Promise<ReturnsData> {
    const response = await fetch(`${API_BASE_URL}/api/returns`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch returns data: ${response.statusText}`);
    }
    
    return response.json();
  },

  // Priority
  async getPriorityData(): Promise<PriorityResponse> {
    const response = await fetch(`${API_BASE_URL}/api/priority`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch priority data: ${response.statusText}`);
    }
    
    return response.json();
  },
}; 