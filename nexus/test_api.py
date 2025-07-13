#!/usr/bin/env python3
"""
Test script to verify API endpoints
"""

import requests
import json
import time

def test_api():
    """Test the API endpoints"""
    base_url = "http://localhost:8000"
    
    print("🧪 Testing INTELLIA API Endpoints")
    print("=" * 50)
    
    # Test root endpoint
    try:
        response = requests.get(f"{base_url}/")
        print(f"✅ Root endpoint: {response.status_code}")
        print(f"   Response: {response.json()}")
    except Exception as e:
        print(f"❌ Root endpoint failed: {e}")
    
    # Test KPIs endpoint
    try:
        response = requests.get(f"{base_url}/api/kpis")
        print(f"\n✅ KPIs endpoint: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   Total Shipments: {data.get('total_shipments', 'N/A')}")
            print(f"   Delayed Shipments: {data.get('delayed_shipments', 'N/A')}")
            print(f"   Low Stock Items: {data.get('low_stock_items', 'N/A')}")
            print(f"   Return Rate: {data.get('return_rate', 'N/A')}%")
        else:
            print(f"   Error: {response.text}")
    except Exception as e:
        print(f"❌ KPIs endpoint failed: {e}")
    
    # Test charts endpoint
    try:
        response = requests.get(f"{base_url}/api/charts")
        print(f"\n✅ Charts endpoint: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   Carrier Performance: {len(data.get('carrier_performance', []))} carriers")
            print(f"   Return Reasons: {len(data.get('return_reasons', []))} months")
            print(f"   Trends Data: {len(data.get('trends_data', []))} trends")
        else:
            print(f"   Error: {response.text}")
    except Exception as e:
        print(f"❌ Charts endpoint failed: {e}")
    
    # Test map endpoint
    try:
        response = requests.get(f"{base_url}/api/map")
        print(f"\n✅ Map endpoint: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   Regions: {len(data.get('regions', []))} regions")
        else:
            print(f"   Error: {response.text}")
    except Exception as e:
        print(f"❌ Map endpoint failed: {e}")

if __name__ == "__main__":
    # Wait a moment for server to start
    print("⏳ Waiting for server to start...")
    time.sleep(3)
    test_api() 