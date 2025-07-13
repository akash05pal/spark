// Mock data for fallback when API is not available
export const mockKPIData = {
  total_shipments: 1000, // Based on actual logistics.csv data
  delayed_shipments: 522, // Based on actual data (52.2% of 1000)
  low_stock_items: 100, // Based on actual data (10% of 1000)
  return_rate: 12.0, // Set back to 100%
};

export const mockChartData = {
  carrier_performance: [
    { name: 'CarrierX', performance: 85, fill: "hsl(120, 70%, 60%)" },
    { name: 'CarrierY', performance: 92, fill: "hsl(200, 70%, 60%)" },
    { name: 'CarrierZ', performance: 78, fill: "hsl(300, 70%, 60%)" },
    { name: 'CarrierA', performance: 88, fill: "hsl(60, 70%, 60%)" },
    { name: 'CarrierB', performance: 95, fill: "hsl(180, 70%, 60%)" }
  ],
  return_reasons: [
    { month: 'Jan', damaged: 154, wrong_item: 140, unwanted: 137 }, // Based on actual return reasons
    { month: 'Feb', damaged: 152, wrong_item: 135, unwanted: 130 }, // Estimated distribution
    { month: 'Mar', damaged: 148, wrong_item: 138, unwanted: 132 }, // Estimated distribution
    { month: 'Apr', damaged: 150, wrong_item: 142, unwanted: 135 }  // Estimated distribution
  ],
  trends_data: [
    { carrier: 'CarrierX', total: 200, delayed: 30, delay_rate: 15.0 },
    { carrier: 'CarrierY', total: 180, delayed: 15, delay_rate: 8.3 },
    { carrier: 'CarrierZ', total: 220, delayed: 48, delay_rate: 21.8 },
    { carrier: 'CarrierA', total: 150, delayed: 18, delay_rate: 12.0 },
    { carrier: 'CarrierB', total: 250, delayed: 12, delay_rate: 4.8 }
  ]
};

export const mockMapData = {
  regions: [
    { name: 'North America', delay: 28, color: 'bg-orange-500' },
    { name: 'Europe', delay: 15, color: 'bg-green-500' },
    { name: 'Asia Pacific', delay: 35, color: 'bg-red-500' },
    { name: 'South America', delay: 22, color: 'bg-orange-500' },
    { name: 'Africa', delay: 18, color: 'bg-green-500' },
    { name: 'Middle East', delay: 31, color: 'bg-red-500' }
  ]
}; 