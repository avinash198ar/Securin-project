# Frontend (React + Vite + Tailwind via CDN)

## Setup
1. `cd frontend`
2. `npm install`
3. Run dev server: `npm run dev` (defaults to http://localhost:5173)
4. Backend proxy is configured for `/api` -> `http://localhost:3000`

## Features
- Table columns: Title, Cuisine, Rating, Total Time, Serves
- Cell-level filters hitting `/api/recipes/search`
- Drawer with Title, Cuisine, Description, Total/Prep/Cook time
- Nutrients rendered as a small table
- Pagination: 15–50 per page
- Fallback: "No results found" & "No data available"
