from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(title="INTELLIA API", version="1.0.0")

# Configure CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:9002", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

# Lazy loading functions
def get_neo4j_client():
    """Lazy load Neo4j client only when needed"""
    from graph_db.neo4j_client import Neo4jClient
    NEO4J_URI = os.getenv('NEO4J_URI')
    NEO4J_USER = os.getenv('NEO4J_USER')
    NEO4J_PASSWORD = os.getenv('NEO4J_PASSWORD')
    return Neo4jClient(NEO4J_URI, NEO4J_USER, NEO4J_PASSWORD)

def get_rag_query():
    """Lazy load RAG query function only when needed"""
    from rag.rag_pipeline import rag_query
    return rag_query

@app.get("/")
async def root():
    return {"message": "INTELLIA API Server", "status": "running"}

@app.post("/api/query", response_model=QueryResponse)
async def process_query(request: QueryRequest):
    """Process NLP queries using RAG pipeline"""
    try:
        rag_query_func = get_rag_query()
        result = rag_query_func(request.query)
        return QueryResponse(result=result or "No response generated", sources=[])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Query processing failed: {str(e)}")

@app.get("/api/kpis", response_model=KPIResponse)
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
        
        # Low stock items (less than 50 units)
        low_stock_result = client.query("MATCH (i:Item) WHERE i.stock < 50 RETURN count(*) as count")
        low_stock_items = low_stock_result[0]['count'] if low_stock_result else 0
        
        # Return rate (using actual returns data)
        returns_result = client.query("MATCH (i:Item)-[:RETURNED_BY]->(c:Customer) RETURN count(*) as count")
        total_returns = returns_result[0]['count'] if returns_result else 0
        return_rate = (total_returns / total_shipments * 100) if total_shipments > 0 else 0
        
        client.close()
        
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
        client = get_neo4j_client()
        
        # Carrier performance data
        carrier_perf = client.query("""
            MATCH (i:Item)-[r:SHIPPED_VIA]->(c:Carrier)
            WITH c.name as carrier, 
                 count(*) as total_shipments,
                 sum(CASE WHEN r.delayed = 'yes' THEN 1 ELSE 0 END) as delayed_shipments
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
        
        # Return reasons data (from actual database)
        return_reasons_data = client.query("""
            MATCH (i:Item)-[r:RETURNED_BY]->(c:Customer)
            WITH r.reason as reason, count(*) as count
            RETURN reason, count
            ORDER BY count DESC
            LIMIT 10
        """)
        
        # Group return reasons by month (simplified for chart display)
        return_reasons = [
            {"month": "Jan", "damaged": 0, "wrong_item": 0, "unwanted": 0},
            {"month": "Feb", "damaged": 0, "wrong_item": 0, "unwanted": 0},
            {"month": "Mar", "damaged": 0, "wrong_item": 0, "unwanted": 0},
            {"month": "Apr", "damaged": 0, "wrong_item": 0, "unwanted": 0},
        ]
        
        # Map actual return reasons to chart categories
        for item in return_reasons_data:
            reason = item["reason"].lower()
            count = item["count"]
            
            if "damaged" in reason or "defective" in reason:
                return_reasons[0]["damaged"] += count
            elif "wrong" in reason or "not as described" in reason:
                return_reasons[0]["wrong_item"] += count
            else:
                return_reasons[0]["unwanted"] += count
        
        # Trends data (shipment delays over time)
        trends_data = client.query("""
            MATCH (i:Item)-[r:SHIPPED_VIA]->(c:Carrier)
            WITH c.name as carrier, 
                 count(*) as total,
                 sum(CASE WHEN r.delayed = 'yes' THEN 1 ELSE 0 END) as delayed
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
        
        client.close()
        
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
        client = get_neo4j_client()
        
        # Low stock items
        low_stock = client.query("""
            MATCH (i:Item) 
            WHERE i.stock < 50
            RETURN i.name as name, i.stock as stock, i.predicted_demand_next_week as demand
            ORDER BY i.stock ASC
            LIMIT 10
        """)
        
        # High demand items
        high_demand = client.query("""
            MATCH (i:Item) 
            WHERE i.predicted_demand_next_week > i.stock
            RETURN i.name as name, i.stock as stock, i.predicted_demand_next_week as demand
            ORDER BY (i.predicted_demand_next_week - i.stock) DESC
            LIMIT 10
        """)
        
        client.close()
        
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
        client = get_neo4j_client()
        
        # Supplier performance
        suppliers = client.query("""
            MATCH (s:Supplier)
            OPTIONAL MATCH (i:Item)-[:SUPPLIED_BY]->(s)
            WITH s, count(i) as item_count
            RETURN s.name as name, s.on_time_rate as on_time_rate, s.return_rate as return_rate, item_count
            ORDER BY s.on_time_rate DESC
        """)
        
        client.close()
        
        return {"suppliers": suppliers}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch suppliers data: {str(e)}")

@app.get("/api/logistics")
async def get_logistics_data():
    """Get logistics data"""
    try:
        client = get_neo4j_client()
        
        # Carrier delays
        delays = client.query("""
            MATCH (i:Item)-[r:SHIPPED_VIA]->(c:Carrier)
            WHERE r.delayed = true
            WITH c.name as carrier, count(*) as delay_count, collect(r.reason) as reasons
            RETURN carrier, delay_count, reasons
            ORDER BY delay_count DESC
        """)
        
        client.close()
        
        return {"delays": delays}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch logistics data: {str(e)}")

@app.get("/api/returns")
async def get_returns_data():
    """Get returns data"""
    try:
        client = get_neo4j_client()
        
        # Return reasons
        returns = client.query("""
            MATCH (i:Item)-[r:RETURNED_BY]->(c:Customer)
            WITH r.reason as reason, count(*) as count
            RETURN reason, count
            ORDER BY count DESC
        """)
        
        client.close()
        
        return {"returns": returns}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch returns data: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 