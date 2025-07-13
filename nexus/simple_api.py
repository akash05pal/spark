from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any
import os
from dotenv import load_dotenv
from graph_db.neo4j_client import Neo4jClient

# Load environment variables
load_dotenv()

app = FastAPI(title="Simple INTELLIA API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:9002", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_neo4j_client():
    """Get Neo4j client"""
    NEO4J_URI = os.getenv('NEO4J_URI')
    NEO4J_USER = os.getenv('NEO4J_USER')
    NEO4J_PASSWORD = os.getenv('NEO4J_PASSWORD')
    return Neo4jClient(NEO4J_URI, NEO4J_USER, NEO4J_PASSWORD)

@app.get("/")
async def root():
    return {"message": "Simple INTELLIA API", "status": "running"}

@app.get("/api/kpis")
async def get_kpis():
    """Get KPI data from Neo4j"""
    try:
        client = get_neo4j_client()
        
        # Total shipments
        shipments_result = client.query("MATCH (i:Item)-[:SHIPPED_VIA]->(c:Carrier) RETURN count(*) as count")
        total_shipments = shipments_result[0]['count'] if shipments_result else 0
        
        # Delayed shipments
        delayed_result = client.query("MATCH (i:Item)-[r:SHIPPED_VIA]->(c:Carrier) WHERE r.delayed = 'yes' RETURN count(*) as count")
        delayed_shipments = delayed_result[0]['count'] if delayed_result else 0
        
        # Low stock items
        low_stock_result = client.query("MATCH (i:Item) WHERE i.stock < 50 RETURN count(*) as count")
        low_stock_items = low_stock_result[0]['count'] if low_stock_result else 0
        
        # Return rate
        returns_result = client.query("MATCH (i:Item)-[:RETURNED_BY]->(c:Customer) RETURN count(*) as count")
        total_returns = returns_result[0]['count'] if returns_result else 0
        return_rate = (total_returns / total_shipments * 100) if total_shipments > 0 else 0
        
        client.close()
        
        return {
            "total_shipments": total_shipments,
            "delayed_shipments": delayed_shipments,
            "low_stock_items": low_stock_items,
            "return_rate": round(return_rate, 1)
        }
    except Exception as e:
        return {"error": f"Failed to fetch KPIs: {str(e)}"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 