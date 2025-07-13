#!/usr/bin/env python3
"""
INTELLIA Integrated Startup Script
Runs the FastAPI backend server for the Next.js frontend
"""

import subprocess
import sys
import os
import time
from pathlib import Path

def check_dependencies():
    """Check if required dependencies are installed"""
    try:
        import fastapi
        import uvicorn
        print("✅ FastAPI and uvicorn are installed")
    except ImportError:
        print("❌ FastAPI or uvicorn not found. Installing...")
        subprocess.run([sys.executable, "-m", "pip", "install", "fastapi", "uvicorn"])
    
    try:
        import neo4j
        print("✅ Neo4j driver is installed")
    except ImportError:
        print("❌ Neo4j driver not found. Installing...")
        subprocess.run([sys.executable, "-m", "pip", "install", "neo4j"])

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
    """Start the FastAPI backend server"""
    print("\n🚀 Starting INTELLIA Backend API Server...")
    print("📍 Backend will be available at: http://localhost:8000")
    print("📚 API Documentation: http://localhost:8000/docs")
    print("\nPress Ctrl+C to stop the server")
    print("-" * 50)
    
    try:
        # Start the FastAPI server
        subprocess.run([
            sys.executable, "-m", "uvicorn", 
            "api_server:app", 
            "--host", "0.0.0.0", 
            "--port", "8000",
            "--reload"
        ])
    except KeyboardInterrupt:
        print("\n\n🛑 Backend server stopped")
    except Exception as e:
        print(f"❌ Error starting backend: {e}")

def main():
    print("🎯 INTELLIA - Supply Chain Intelligence Platform")
    print("=" * 50)
    
    # Check dependencies
    check_dependencies()
    
    # Check environment
    if not check_env_file():
        return
    
    print("\n📋 Next Steps:")
    print("1. Backend API will start on http://localhost:8000")
    print("2. Frontend should be started separately:")
    print("   cd ../frontend-ui")
    print("   npm install")
    print("   npm run dev")
    print("3. Frontend will be available at http://localhost:9002")
    print("4. The frontend will automatically connect to the backend API")
    
    print("\n🔗 Integration Points:")
    print("- AI Assistant: Connected to RAG pipeline")
    print("- KPIs: Real-time data from Neo4j")
    print("- Charts: Dynamic data from backend")
    print("- Map View: Regional delay data")
    print("- Sidebar buttons: Will be connected to specific features")
    
    # Start backend
    start_backend()

if __name__ == "__main__":
    main() 