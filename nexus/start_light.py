#!/usr/bin/env python3
"""
INTELLIA Light Startup Script
Runs the memory-optimized FastAPI backend server
"""

import subprocess
import sys
import os
from pathlib import Path

def check_env_file():
    """Check if .env file exists"""
    env_path = Path(".env")
    if not env_path.exists():
        print("❌ .env file not found!")
        print("Please create a .env file with the following content:")
        print("""
OPENAI_API_KEY=your_openai_api_key_here
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=your_password
        """)
        return False
    print("✅ .env file found")
    return True

def start_backend():
    """Start the lightweight FastAPI backend server"""
    print("\n🚀 Starting INTELLIA Light Backend API Server...")
    print("📍 Backend will be available at: http://localhost:8000")
    print("📚 API Documentation: http://localhost:8000/docs")
    print("💡 Using memory-optimized server")
    print("\nPress Ctrl+C to stop the server")
    print("-" * 50)
    
    try:
        # Start the lightweight FastAPI server
        subprocess.run([
            sys.executable, "-m", "uvicorn", 
            "api_server_light:app", 
            "--host", "0.0.0.0", 
            "--port", "8000",
            "--reload"
        ])
    except KeyboardInterrupt:
        print("\n\n🛑 Backend server stopped")
    except Exception as e:
        print(f"❌ Error starting backend: {e}")

def main():
    print("🎯 INTELLIA - Supply Chain Intelligence Platform (Light Version)")
    print("=" * 60)
    
    # Check environment
    if not check_env_file():
        return
    
    print("\n📋 System Status:")
    print("✅ Frontend: http://localhost:9002 (should be running)")
    print("🔄 Backend: Starting on http://localhost:8000")
    print("🔗 API Docs: http://localhost:8000/docs")
    
    print("\n🔗 Integration Features:")
    print("- AI Assistant: Connected to RAG pipeline")
    print("- KPIs: Real-time data from Neo4j")
    print("- Charts: Dynamic data from backend")
    print("- Map View: Regional delay data")
    
    print("\n💡 Memory Optimization:")
    print("- Lazy loading of heavy dependencies")
    print("- Reduced memory footprint")
    print("- Faster startup time")
    
    # Start backend
    start_backend()

if __name__ == "__main__":
    main() 