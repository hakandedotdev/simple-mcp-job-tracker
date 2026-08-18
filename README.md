# Job Tracker

Personal job application tracker built with Next.js. Track company, role, status, CV/cover letter file paths, and feedback notes. Data is stored locally in `data/jobs.json`.

## Getting Started

Start the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## MCP setup (for Cursor agents)

A local MCP server exposes the job tracker REST API to Cursor agents on the same machine.

### Prerequisites

1. Install dependencies: `npm install`
2. Start the app: `npm run dev` (API must be running on port 3000)

### Connect in Cursor

This repo includes [`.cursor/mcp.json`](.cursor/mcp.json). Reload Cursor or open **Settings → MCP** — the `job-tracker` server should show as connected.

To override the API URL, set `JOB_TRACKER_API_URL` in `.cursor/mcp.json` (default: `http://localhost:3000`).

### Available tools

| Tool | Description |
|------|-------------|
| `list_jobs` | List all applications |
| `get_job` | Get one job by `id` |
| `add_job` | Add a job (`company`, `role` required) |
| `update_job` | Update a job by `id` (e.g. change `status`) |
| `delete_job` | Delete a job by `id` |

Status values: `wishlist`, `applied`, `interviewing`, `offer`, `rejected`, `withdrawn`.

### Troubleshooting

If MCP tools fail with a connection error, confirm `npm run dev` is running and reachable at `http://localhost:3000/api/jobs`.

Run the MCP server manually for debugging:

```bash
npm run mcp
```

## API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/jobs` | List jobs |
| POST | `/api/jobs` | Create job |
| GET | `/api/jobs/:id` | Get job |
| PATCH | `/api/jobs/:id` | Update job |
| DELETE | `/api/jobs/:id` | Delete job |
