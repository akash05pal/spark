from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import os
from dotenv import load_dotenv
from graph_db.neo4j_client import Neo4jClient
from rag.rag_pipeline import rag_query
import pandas as pd
import json
from flask import Flask, jsonify, send_file

# Load environment variables
load_dotenv()

app = FastAPI(title="INTELLIA API", version="1.0.0")
DATA_DIR = os.path.join(os.path.dirname(__file__), 'data')

# Configure CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:9002", "http://localhost:3000"],  # Next.js dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Neo4j client
NEO4J_URI = os.getenv('NEO4J_URI')
NEO4J_USER = os.getenv('NEO4J_USER')
NEO4J_PASSWORD = os.getenv('NEO4J_PASSWORD')

neo4j_client = Neo4jClient(NEO4J_URI, NEO4J_USER, NEO4J_PASSWORD)

# Pydantic models
class QueryRequest(BaseModel):
    query: str

class QueryResponse(BaseModel):
    result: str
    sources: Optional[List[str]] = None

class KPIResponse(BaseModel):
    total_shipments: int
    delayed_shipments: int
    low_stock_items: int
    return_rate: float

class ChartData(BaseModel):
    carrier_performance: List[Dict[str, Any]]
    return_reasons: List[Dict[str, Any]]
    trends_data: List[Dict[str, Any]]

class MapData(BaseModel):
    regions: List[Dict[str, Any]]

@app.get("/")
async def root():
    return {"message": "INTELLIA API Server", "status": "running"}

@app.post("/api/query", response_model=QueryResponse)
async def process_query(request: QueryRequest):
    """Process NLP queries using RAG pipeline"""
    try:
        result = rag_query(request.query)
        return QueryResponse(result=result, sources=[])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Query processing failed: {str(e)}")

@app.get("/api/kpis", response_model=KPIResponse)
async def get_kpis():
    """Get KPI data from Neo4j"""
    try:
        # Total shipments
        shipments_result = neo4j_client.query("MATCH (i:Item)-[:SHIPPED_VIA]->(c:Carrier) RETURN count(*) as count")
        total_shipments = shipments_result[0]['count'] if shipments_result else 0
        
        # Delayed shipments
        delayed_result = neo4j_client.query("MATCH (i:Item)-[r:SHIPPED_VIA]->(c:Carrier) WHERE r.delayed = true RETURN count(*) as count")
        delayed_shipments = delayed_result[0]['count'] if delayed_result else 0
        
        # Low stock items (less than 50 units)
        low_stock_result = neo4j_client.query("MATCH (i:Item) WHERE i.stock < 50 RETURN count(*) as count")
        low_stock_items = low_stock_result[0]['count'] if low_stock_result else 0
        
        # Return rate
        returns_result = neo4j_client.query("MATCH (i:Item)-[:RETURNED_BY]->(c:Customer) RETURN count(*) as count")
        total_returns = returns_result[0]['count'] if returns_result else 0
        return_rate = (total_returns / total_shipments * 100) if total_shipments > 0 else 0
        
        return KPIResponse(
            total_shipments=total_shipments,
            delayed_shipments=delayed_shipments,
            low_stock_items=low_stock_items,
            return_rate=round(return_rate, 1)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch KPIs: {str(e)}")

@app.get("/api/charts", response_model=ChartData)
async def get_chart_data():
    """Get chart data from Neo4j"""
    try:
        # Carrier performance data
        carrier_perf = neo4j_client.query("""
            MATCH (i:Item)-[r:SHIPPED_VIA]->(c:Carrier)
            WITH c.name as carrier, 
                 count(*) as total_shipments,
                 sum(CASE WHEN r.delayed = true THEN 1 ELSE 0 END) as delayed_shipments
            RETURN carrier, 
                   round((total_shipments - delayed_shipments) * 100.0 / total_shipments) as performance
            ORDER BY performance DESC
        """)
        
        carrier_performance = [
            {
                "name": item["carrier"],
                "performance": item["performance"],
                "fill": f"hsl({hash(item['carrier']) % 360}, 70%, 60%)"
            }
            for item in carrier_perf
        ]
        
        # Return reasons data (simplified - using mock data for now)
        return_reasons = [
            {"month": "Jan", "damaged": 30, "wrong_item": 15, "unwanted": 20},
            {"month": "Feb", "damaged": 45, "wrong_item": 20, "unwanted": 25},
            {"month": "Mar", "damaged": 35, "wrong_item": 18, "unwanted": 30},
            {"month": "Apr", "damaged": 50, "wrong_item": 25, "unwanted": 22},
        ]
        
        # Trends data (shipment delays over time)
        trends_data = neo4j_client.query("""
            MATCH (i:Item)-[r:SHIPPED_VIA]->(c:Carrier)
            WITH c.name as carrier, 
                 count(*) as total,
                 sum(CASE WHEN r.delayed = true THEN 1 ELSE 0 END) as delayed
            RETURN carrier, total, delayed
            ORDER BY delayed DESC
            LIMIT 5
        """)
        
        trends = [
            {
                "carrier": item["carrier"],
                "total": item["total"],
                "delayed": item["delayed"],
                "delay_rate": round((item["delayed"] / item["total"]) * 100, 1)
            }
            for item in trends_data
        ]
        
        return ChartData(
            carrier_performance=carrier_performance,
            return_reasons=return_reasons,
            trends_data=trends
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch chart data: {str(e)}")

@app.get("/api/map", response_model=MapData)
async def get_map_data():
    """Get map/regional data"""
    try:
        # Mock regional data (in real implementation, this would come from logistics data)
        regions = [
            {"name": "North America", "delay": 28, "color": "bg-orange-500"},
            {"name": "Europe", "delay": 15, "color": "bg-green-500"},
            {"name": "Asia Pacific", "delay": 35, "color": "bg-red-500"},
            {"name": "South America", "delay": 22, "color": "bg-orange-500"},
            {"name": "Africa", "delay": 18, "color": "bg-green-500"},
            {"name": "Middle East", "delay": 31, "color": "bg-red-500"},
        ]
        
        return MapData(regions=regions)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch map data: {str(e)}")

@app.get("/api/inventory")
async def get_inventory_data():
    """Get inventory data"""
    try:
        # Low stock items
        low_stock = neo4j_client.query("""
            MATCH (i:Item) 
            WHERE i.stock < 50
            RETURN i.name as name, i.stock as stock, i.predicted_demand_next_week as demand
            ORDER BY i.stock ASC
            LIMIT 10
        """)
        
        # High demand items
        high_demand = neo4j_client.query("""
            MATCH (i:Item) 
            WHERE i.predicted_demand_next_week > i.stock
            RETURN i.name as name, i.stock as stock, i.predicted_demand_next_week as demand
            ORDER BY (i.predicted_demand_next_week - i.stock) DESC
            LIMIT 10
        """)
        
        return {
            "low_stock_items": low_stock,
            "high_demand_items": high_demand
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch inventory data: {str(e)}")

@app.get("/api/suppliers")
async def get_suppliers_data():
    """Get suppliers data"""
    try:
        # Supplier performance
        suppliers = neo4j_client.query("""
            MATCH (s:Supplier)
            OPTIONAL MATCH (i:Item)-[:SUPPLIED_BY]->(s)
            WITH s, count(i) as item_count
            RETURN s.name as name, s.on_time_rate as on_time_rate, s.return_rate as return_rate, item_count
            ORDER BY s.on_time_rate DESC
        """)
        
        return {"suppliers": suppliers}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch suppliers data: {str(e)}")

@app.get("/api/logistics")
async def get_logistics_data():
    """Get logistics data"""
    try:
        # Carrier delays
        delays = neo4j_client.query("""
            MATCH (i:Item)-[r:SHIPPED_VIA]->(c:Carrier)
            WHERE r.delayed = true
            WITH c.name as carrier, count(*) as delay_count, collect(r.reason) as reasons
            RETURN carrier, delay_count, reasons
            ORDER BY delay_count DESC
        """)
        
        return {"delays": delays}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch logistics data: {str(e)}")

@app.get("/api/returns")
async def get_returns_data():
    """Get returns data"""
    try:
        # Return reasons
        returns = neo4j_client.query("""
            MATCH (i:Item)-[r:RETURNED_BY]->(c:Customer)
            WITH r.reason as reason, count(*) as count
            RETURN reason, count
            ORDER BY count DESC
        """)
        
        return {"returns": returns}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch returns data: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 