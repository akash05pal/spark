#!/usr/bin/env python3
"""
Simple backend test script to check if the API is working
"""

import requests
import json
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_backend():
    """Test the backend API endpoints"""
    base_url = "http://localhost:8000"
    
    print("🔍 Testing INTELLIA Backend API...")
    print("=" * 50)
    
    # Test 1: Root endpoint
    try:
        response = requests.get(f"{base_url}/")
        if response.status_code == 200:
            print("✅ Root endpoint: OK")
            print(f"   Response: {response.json()}")
        else:
            print(f"❌ Root endpoint: Failed ({response.status_code})")
    except requests.exceptions.ConnectionError:
        print("❌ Root endpoint: Connection failed - Backend not running")
        return False
    except Exception as e:
        print(f"❌ Root endpoint: Error - {e}")
        return False
    
    # Test 2: KPIs endpoint
    try:
        response = requests.get(f"{base_url}/api/kpis")
        if response.status_code == 200:
            print("✅ KPIs endpoint: OK")
            data = response.json()
            print(f"   Total shipments: {data.get('total_shipments', 'N/A')}")
            print(f"   Delayed shipments: {data.get('delayed_shipments', 'N/A')}")
        else:
            print(f"❌ KPIs endpoint: Failed ({response.status_code})")
            print(f"   Error: {response.text}")
    except Exception as e:
        print(f"❌ KPIs endpoint: Error - {e}")
    
    # Test 3: Priority endpoint
    try:
        response = requests.get(f"{base_url}/api/priority")
        if response.status_code == 200:
            print("✅ Priority endpoint: OK")
            data = response.json()
            print(f"   Total shipments: {data.get('summary', {}).get('total_shipments', 'N/A')}")
        else:
            print(f"❌ Priority endpoint: Failed ({response.status_code})")
            print(f"   Error: {response.text}")
    except Exception as e:
        print(f"❌ Priority endpoint: Error - {e}")
    
    # Test 4: Charts endpoint
    try:
        response = requests.get(f"{base_url}/api/charts")
        if response.status_code == 200:
            print("✅ Charts endpoint: OK")
        else:
            print(f"❌ Charts endpoint: Failed ({response.status_code})")
            print(f"   Error: {response.text}")
    except Exception as e:
        print(f"❌ Charts endpoint: Error - {e}")
    
    print("\n" + "=" * 50)
    print("🎯 Backend Test Complete!")
    
    return True

def check_neo4j_connection():
    """Check if Neo4j is accessible"""
    print("\n🔍 Checking Neo4j Connection...")
    print("=" * 30)
    
    try:
        from graph_db.neo4j_client import Neo4jClient
        import os
        
        uri = os.getenv('NEO4J_URI')
        user = os.getenv('NEO4J_USER')
        password = os.getenv('NEO4J_PASSWORD')
        
        if not all([uri, user, password]):
            print("❌ Missing Neo4j environment variables")
            print("   Please check your .env file")
            return False
        
        print(f"   URI: {uri}")
        print(f"   User: {user}")
        print(f"   Password: {'*' * len(password) if password else 'Not set'}")
        
        client = Neo4jClient(uri, user, password)
        
        # Test connection
        result = client.query("RETURN 1 as test")
        if result and len(result) > 0:
            print("✅ Neo4j connection: OK")
            client.close()
            return True
        else:
            print("❌ Neo4j connection: No response")
            client.close()
            return False
            
    except Exception as e:
        print(f"❌ Neo4j connection: Error - {e}")
        return False

if __name__ == "__main__":
    print("🚀 INTELLIA Backend Diagnostic Tool")
    print("=" * 50)
    
    # Check Neo4j first
    neo4j_ok = check_neo4j_connection()
    
    if neo4j_ok:
        print("\n✅ Neo4j is connected - testing API endpoints...")
        test_backend()
    else:
        print("\n❌ Neo4j connection failed - API endpoints will likely fail")
        print("   Please start Neo4j and check your .env file")
        print("\n   Still testing API endpoints...")
        test_backend()
    
    print("\n📋 Next Steps:")
    print("1. If Neo4j failed: Start Neo4j and check .env file")
    print("2. If API failed: Check if backend server is running")
    print("3. If all OK: Your backend is ready!") 