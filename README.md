# Capgemini IntelliAI — React Frontend

## Quick Start

### 1. Install
```bash
npm install
```

### 2. Configure API URL
Edit `.env`:
```
VITE_API_URL=http://localhost/Definitiv   # your PHP/any backend URL
```

### 3. Run
```bash
npm run dev
# Opens at http://localhost:3000
```

### 4. Build for production
```bash
npm run build
```

## How it works
- **No PHP dependency** — runs standalone with mock data
- **Real API** — set VITE_API_URL to any backend (Node.js, Python, .NET, etc.)
- **Services** — `src/services/` contain all API calls with mock fallback

## Pages
| Route | Page |
|---|---|
| `/` | Dashboard |
| `/data-volume` | Data Volume |
| `/user-table` | User Tables |
| `/realtime-extraction` | Realtime Extraction |
| `/import-report` | Import DB Report |
| `/table-fields` | Table Field Listing |
