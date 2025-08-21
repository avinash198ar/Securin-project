# Securin Assignment – Recipes (Full Stack)

This repo contains:
- `backend/`: Node.js + Express + MongoDB (data load + REST API)
- `frontend/`: React (Vite) + Tailwind via CDN

## Prerequisites
- Node.js 18+
- MongoDB running locally
- `US_recipes.json` dataset (place it at project root or adjust `.env`)

## Quick Start
```bash
# 1) Backend
cd backend
cp .env.example .env
npm install
# Place US_recipes.json at ../US_recipes.json (or edit RECIPES_JSON in .env)
npm run load    # parses JSON, converts NaN->null, loads into MongoDB
npm run dev     # starts API on http://localhost:3000

# 2) Frontend
cd ../frontend
npm install
npm run dev     # http://localhost:5173 (proxy to backend /api)
```

## API Examples
- `GET /api/recipes?page=1&limit=10`
- `GET /api/recipes/search?calories=<=400&title=pie&rating=>=4.5&total_time=<=120&cuisine=American`

## Notes
- Numeric fields (`rating`, `prep_time`, `cook_time`, `total_time`) with NaN are stored as `null`.
- `nutrients` kept as nested object.
