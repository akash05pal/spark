# INTELLIA - Integrated Frontend-Backend System

## Overview
This is the integrated version of INTELLIA, combining the Next.js frontend with the Python backend (Neo4j + RAG + Vector Search).

## Architecture
```
┌─────────────────┐    HTTP/API    ┌─────────────────┐
│   Next.js       │ ◄────────────► │   FastAPI       │
│   Frontend      │                │   Backend       │
│   (Port 9002)   │                │   (Port 8000)   │
└─────────────────┘                └─────────────────┘
                                           │
                                           ▼
                                   ┌─────────────────┐
                                   │   Neo4j DB      │
                                   │   + RAG         │
                                   │   + Vector DB   │
                                   └─────────────────┘
```

## Quick Start

### 1. Backend Setup
```bash
cd nexus
pip install -r requirements.txt
python start_integrated.py
```

### 2. Frontend Setup
```bash
cd frontend-ui
npm install
npm run dev
```

### 3. Access the Application
- **Frontend**: http://localhost:9002
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## Integration Features

### ✅ Connected Components

1. **AI Assistant**
   - Connected to RAG pipeline
   - Real NLP queries processed by backend
   - Error handling and loading states

2. **KPI Cards**
   - Real-time data from Neo4j
   - Dynamic loading states
   - Automatic calculations

3. **Charts**
   - Carrier performance from database
   - Return reasons over time
   - Real data visualization

4. **Map View**
   - Regional delay data
   - Dynamic color coding
   - Real-time updates

### 🔄 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/query` | POST | Process NLP queries via RAG |
| `/api/kpis` | GET | Get real-time KPIs |
| `/api/charts` | GET | Get chart data |
| `/api/map` | GET | Get regional data |
| `/api/inventory` | GET | Get inventory data |
| `/api/suppliers` | GET | Get supplier data |
| `/api/logistics` | GET | Get logistics data |
| `/api/returns` | GET | Get returns data |

### 🎯 Sidebar Features (Ready for Connection)

The sidebar buttons are ready to be connected to specific features:

- **Dashboard**: Main overview (connected)
- **AI-Powered Insights**: AI Assistant (connected)
- **Inventory**: Inventory management
- **Returns**: Returns analysis
- **Logistics**: Logistics tracking
- **Suppliers**: Supplier management
- **Trends**: Trend analysis (connected)
- **Map View**: Geographic view (connected)
- **Knowledge Graph**: Graph visualization
- **Download Reports**: Report generation

## Development

### Backend Development
```bash
cd nexus
python api_server.py
```

### Frontend Development
```bash
cd frontend-ui
npm run dev
```

### Database Management
```bash
cd nexus
python init_data.py  # Reinitialize data
python test_neo4j.py # Test database connection
```

## Environment Variables

Create a `.env` file in the `nexus` directory:

```env
OPENAI_API_KEY=your_openai_api_key_here
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=your_password
```

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure backend is running on port 8000
   - Check CORS configuration in `api_server.py`

2. **Database Connection**
   - Verify Neo4j is running
   - Check credentials in `.env` file
   - Run `python test_neo4j.py`

3. **Frontend Not Loading**
   - Check if Next.js is running on port 9002
   - Verify all dependencies are installed

4. **API Errors**
   - Check backend logs
   - Verify API endpoints in browser dev tools
   - Test endpoints directly at http://localhost:8000/docs

## Next Steps

1. **Connect Sidebar Buttons**: Implement specific pages for each sidebar feature
2. **Add Authentication**: Implement user authentication
3. **Real-time Updates**: Add WebSocket connections for live data
4. **Advanced Visualizations**: Add more interactive charts and graphs
5. **Export Features**: Implement report generation and export

## File Structure

```
nexus/
├── api_server.py          # FastAPI backend server
├── start_integrated.py    # Startup script
├── requirements.txt       # Python dependencies
├── .env                   # Environment variables
├── data/                  # CSV data files
├── graph_db/              # Neo4j client
├── rag/                   # RAG pipeline
├── vector_db/             # Vector search
└── frontend/              # Streamlit app (legacy)

frontend-ui/
├── src/
│   ├── app/               # Next.js pages
│   ├── components/        # React components
│   ├── lib/
│   │   └── api.ts        # API service functions
│   └── types/            # TypeScript types
├── package.json          # Node.js dependencies
└── README.md            # Frontend documentation
```

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review API documentation at http://localhost:8000/docs
3. Check browser console for frontend errors
4. Review backend logs for API errors 