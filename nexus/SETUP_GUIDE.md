# INTELLIA Setup Guide for Teammates

## Prerequisites

1. **Python 3.8+** installed
2. **Neo4j Desktop** or **Neo4j Community Edition** installed
3. **Git** for cloning the repository

## Step-by-Step Setup

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd nexus
```

### 2. Create Virtual Environment (Recommended)
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

**If you get `ModuleNotFoundError: No module named 'dotenv'`, run:**
```bash
pip install python-dotenv
```

### 4. Install Neo4j
- Download Neo4j Desktop from: https://neo4j.com/download/
- Create a new database
- Set a password (remember this for step 6)

### 5. Create Environment File
Create a `.env` file in the `nexus` directory:
```env
OPENAI_API_KEY=your_openai_api_key_here
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=your_neo4j_password
```

### 6. Start Neo4j Database
- Open Neo4j Desktop
- Start your database
- Verify it's running on `bolt://localhost:7687`

### 7. Initialize Data
```bash
python init_data.py
```

### 8. Test Connection
```bash
python test_neo4j.py
```

### 9. Start Backend Server
```bash
python start_integrated.py
```

### 10. Start Frontend (in new terminal)
```bash
cd ../frontend-ui
npm install
npm run dev
```

## Access Points
- **Frontend**: http://localhost:9002
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Neo4j Browser**: http://localhost:7474

## Troubleshooting

### Common Issues

1. **ModuleNotFoundError: No module named 'dotenv'**
   ```bash
   pip install python-dotenv
   ```

2. **Neo4j Connection Failed**
   - Verify Neo4j is running
   - Check credentials in `.env` file
   - Ensure port 7687 is available

3. **Port Already in Use**
   - Kill existing processes on ports 8000, 9002, 7687
   - Or change ports in configuration files

4. **Frontend Build Errors**
   ```bash
   cd frontend-ui
   rm -rf node_modules package-lock.json
   npm install
   ```

## New Features Added

### ✅ Feature 1: Priority Handling & Return Alerts
- Forward shipments = High Priority (Red badge)
- Return shipments = Medium Priority (72h SLA)
- SLA breach alerts (🟠 Nearing, 🔴 Breached)
- Filter by priority (All/High/Medium)

### ✅ Feature 2: Mobile-First Dashboard
- Quick-glance cards with icons
- Collapsible filters
- Touch-friendly interface
- Summary stats for on-ground use

### ✅ Feature 3: Role-Based Views
- **Logistics Manager**: Forward shipments & carrier performance
- **Returns Manager**: Returns processing & SLA tracking  
- **Inventory Analyst**: Stock levels & supplier performance
- **General**: All data & comprehensive view

## Usage

1. **Switch Roles**: Use the role selector at the top
2. **Toggle Views**: Switch between Desktop and Mobile modes
3. **Priority Alerts**: Monitor SLA breaches and priority shipments
4. **Mobile Dashboard**: Use for quick on-ground checks

## Data Structure

The system uses:
- **Neo4j Graph Database**: For relationships between entities
- **CSV Data Files**: For initial data loading
- **FastAPI Backend**: For API endpoints
- **Next.js Frontend**: For responsive UI

## Support

For issues:
1. Check this guide
2. Review API docs at http://localhost:8000/docs
3. Check browser console for frontend errors
4. Review backend logs for API errors 