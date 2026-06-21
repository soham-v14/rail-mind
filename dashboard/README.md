# RailMind Dashboard

The command center frontend for RailMind — a Next.js 16 application with React 19, TypeScript, Tailwind CSS v4, and Leaflet maps.

## Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | **Home** | Railway overview with stats cards, system status, feature links, and news updates |
| `/dashboard` | **Command Center** | Full operational dashboard with live map, CCTV, alerts, emergency recs, AI assistant |
| `/map` | **Live Map** | Full-screen interactive Leaflet map with trains, stations, and risk zones |
| `/alerts` | **Alerts & Incidents** | Active alerts and emergency recommendations side by side |
| `/cctv` | **Surveillance** | Dedicated CCTV feed viewer with camera switching |
| `/assistant` | **AI Assistant** | Conversational AI interface for railway queries |

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NEXT_PUBLIC_RISK_API` | No | `http://localhost:8001` | Backend URL for risk prediction |
| `NEXT_PUBLIC_EMERGENCY_API` | No | `http://localhost:8002` | Backend URL for emergency assessment |

## Getting Started

```bash
npm install
npm run dev
# Opens at http://localhost:3000
```

## Build

```bash
npm run build
npm start
```

## Deploy on Vercel

1. Set root directory to `dashboard/`
2. Add environment variables above
3. Deploy
