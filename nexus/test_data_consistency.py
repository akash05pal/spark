#!/usr/bin/env python3
"""
Test script to verify data consistency and show accurate counts
"""

import pandas as pd
import os

def test_data_consistency():
    """Test and display data consistency"""
    print("🔍 Data Consistency Test")
    print("=" * 50)
    
    # Load data files
    data_dir = os.path.join(os.path.dirname(__file__), 'data')
    
    # Returns data
    returns_df = pd.read_csv(os.path.join(data_dir, 'returns.csv'))
    total_returns = len(returns_df)
    return_reasons = returns_df['return_reason'].value_counts()
    
    print(f"📦 Returns Data:")
    print(f"   Total Returns: {total_returns}")
    print(f"   Unique Return Reasons: {len(return_reasons)}")
    print(f"   Top 5 Return Reasons:")
    for reason, count in return_reasons.head(5).items():
        print(f"     - {reason}: {count}")
    
    # Logistics data
    logistics_df = pd.read_csv(os.path.join(data_dir, 'logistics.csv'))
    total_shipments = len(logistics_df)
    delayed_shipments = len(logistics_df[logistics_df['delayed'] == 'yes'])
    
    print(f"\n🚚 Logistics Data:")
    print(f"   Total Shipments: {total_shipments}")
    print(f"   Delayed Shipments: {delayed_shipments}")
    print(f"   Delay Rate: {(delayed_shipments/total_shipments)*100:.1f}%")
    
    # Calculate accurate return rate
    actual_return_rate = (total_returns / total_shipments * 100) if total_shipments > 0 else 0
    print(f"\n📊 Accurate Return Rate:")
    print(f"   Return Rate: {actual_return_rate:.1f}% ({total_returns} returns out of {total_shipments} shipments)")
    
    # Inventory data
    inventory_df = pd.read_csv(os.path.join(data_dir, 'inventory.csv'))
    total_items = len(inventory_df)
    low_stock_items = len(inventory_df[inventory_df['stock'] < 50])
    
    print(f"\n📦 Inventory Data:")
    print(f"   Total Items: {total_items}")
    print(f"   Low Stock Items (<50): {low_stock_items}")
    print(f"   Low Stock Rate: {(low_stock_items/total_items)*100:.1f}%")
    
    print(f"\n✅ Data Consistency Summary:")
    print(f"   - Returns: {total_returns} records")
    print(f"   - Shipments: {total_shipments} records")
    print(f"   - Return Rate: {actual_return_rate:.1f}%")
    print(f"   - Delay Rate: {(delayed_shipments/total_shipments)*100:.1f}%")
    print(f"   - Low Stock Rate: {(low_stock_items/total_items)*100:.1f}%")

if __name__ == "__main__":
    test_data_consistency() 