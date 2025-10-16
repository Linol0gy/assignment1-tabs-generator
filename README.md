# Assignment 1 - HTML5 Tabs Generator

## Project Information
- Course: CSE3CWA/CSE5006
- Student Name: jiawenqi song
- Student Number: 22503977
- Submission Date: Week 4, 2025

## Project Description
This is a Next.js web application that generates HTML5 code with inline CSS and JavaScript. The generated code can be used in MOODLE LMS without any external dependencies.

## Main Features
1. Generate HTML tabs with custom content
2. Dark and Light theme support
3. Save user preferences using cookies and localStorage
4. Responsive design with hamburger menu
5. Maximum 15 tabs, minimum 1 tab

## Technology Used
- Next.js 15.5.0
- TypeScript
- Tailwind CSS (for development only)
- React

## How to Install and Run
1. Make sure you have Node.js installed (version 22 or higher)
2. Open terminal in the project folder
3. Run these commands:
```bash
npm install
npm run dev
```
4. Open browser and go to http://localhost:3000

## Project Structure
```
assignment1-tabs-generator/
├── app/                    # All pages
│   ├── layout.tsx         # Main layout
│   ├── page.tsx           # Home page
│   ├── about/             # About page
│   ├── tabs/              # Tabs generator page
│   ├── pre-lab-questions/ # Placeholder page
│   ├── escape-room/       # Placeholder page
│   ├── coding-races/      # Placeholder page
│   └── court-room/        # Placeholder page
├── components/            # React components
│   ├── Header.tsx        # Page header
│   ├── Footer.tsx        # Page footer
│   ├── Navigation.tsx    # Hamburger menu
│   ├── ThemeToggle.tsx   # Dark/Light mode button
│   ├── TabsBuilder.tsx   # Main tabs component
│   └── OutputDisplay.tsx # Shows generated HTML
├── hooks/                # Custom React hooks
│   └── useTheme.tsx     # Theme management
├── lib/                  # Helper functions
│   └── generateHTML.ts  # HTML generation logic
└── public/              # Static files
    └── demo-video.mp4   # Tutorial video
```

## How to Use the Application

### Step 1: Navigate to Tabs Page
1. Click the hamburger menu (three lines) in top right corner
2. Select "Tabs" from the menu

### Step 2: Create Tabs
1. Click [+] button to add a new tab
2. Click [-] button to remove a tab
3. Click on tab header to change its name
4. Click on a tab and type content in the text area

### Step 3: Generate HTML Code
1. Click "Output" button
2. The HTML code will appear in the output area
3. Click "Copy Code" button to copy
4. Save the code as an .html file
5. Open the file in any web browser

## Important Requirements Met
- User Interface: Navigation, Header, Footer, About Page
- Themes: Dark Mode and Light Mode with localStorage
- Hamburger Menu: With CSS transform animation
- Tabs Operations: Add, remove, edit tabs with localStorage
- Output: Generates HTML with inline CSS only (no classes)
- GitHub: Multiple commits and feature branches

## Assignment 2 Enhancements

- **Court Room scenario** with staged compliance tasks, automated message escalation, manual timer, and distraction feed.
- **Session persistence** – a "Save Session Snapshot" button stores the current Court Room state via a Prisma-backed API.
- **RESTful CRUD API** under `/api/outputs` for listing, creating, updating, and removing generated outputs.
- **SQLite + Prisma ORM** integration with automated client generation and reusable singleton client.
- **Automated testing** expanded to cover API endpoints, Court Room flows, and HTML generation across the three scenarios.
- **Docker-ready deployment pipeline** with a multi-stage production image.
- **Runtime instrumentation** hooks that trace outbound `fetch` calls (viewable during `npm run dev` or automated tests).
- **Serverless scaffold** (`lambda/generate-output/index.mjs`) that can be deployed to AWS Lambda to serve stored HTML snapshots dynamically.

## Database & Prisma Setup

1. Copy `.env.example` to `.env` and adjust if required (default uses SQLite at `prisma/dev.db`):
   ```bash
   cp .env.example .env
   ```
2. Generate the Prisma client and push the schema (creates the SQLite database and tables):
   ```bash
   npx prisma generate
   npx prisma db push
   ```
3. Use Prisma Studio for quick inspection:
   ```bash
   npx prisma studio
   ```

> **Note:** If you encounter an engine error while running `db push`, ensure the SQLite path is writable and retry. You can delete any partially created `prisma/dev.db` file and re-run the commands.

## REST API Endpoints

| Method | Endpoint                  | Description                                  |
|--------|---------------------------|----------------------------------------------|
| GET    | `/api/outputs`            | Lists saved session snapshots (newest first) |
| POST   | `/api/outputs`            | Creates a new snapshot (`scenario`, `html`)  |
| GET    | `/api/outputs/:id`        | Retrieves a single snapshot by ID            |
| PUT    | `/api/outputs/:id`        | Updates an existing snapshot                 |
| DELETE | `/api/outputs/:id`        | Removes a snapshot                           |

All endpoints return JSON, except for Lambda-driven dynamic pages (see below).

## Court Room Session Persistence

Inside the Court Room page you will find a **“Save Session Snapshot”** button. Pressing it gathers the current timer, stage completion state, and message log, then persists the generated HTML summary through the `/api/outputs` endpoint. Success or failure feedback is rendered inline with accessible status messaging.

## Docker Usage

Build and run the production image:

```bash
docker build -t tabs-generator .
docker run -p 3000:3000 --env-file .env tabs-generator
```

The container uses the production Next.js build and respects `DATABASE_URL`. Mount a persistent volume if you want to keep the SQLite file outside the container.

## Instrumentation

Next.js automatically executes `instrumentation.ts` on the server runtime. The current implementation wraps `fetch` and records timing information:

- Console output is emitted during development (`[instrumentation] fetch … ms`).
- The most recent traces are stored in `globalThis.__instrumentationTraces` for ad-hoc inspection (e.g., via the Node REPL or debugger).

Re-run `npm test` to see instrumentation logs produced by the API test suite.

- **Performance evidence**: Lighthouse report is available at `docs/lighthouse-report.png`. Re-run via Chrome DevTools Lighthouse panel or CLI to regenerate if required.

## Feedback & Cloud Deployment Checklist

- **Feedback collection**: Use `docs/feedback-plan.md` (see below) as a template to brief family, friends, and industry reviewers. Gather written notes and ensure each participant submits the ethical survey at <https://redcap.latrobe.edu.au/redcap/surveys/?s=PPEKFTMPXF4KKEFY>.
- **CI/testing**:
  - `npm test` covers Prisma CRUD, HTML generation, and Court Room logic.
  - Playwright end-to-end tests cover the Court Room workflow and Tabs generator output. Run them against a live dev server:
    ```bash
    npm run dev -- --hostname 0.0.0.0
    npx playwright install
    PLAYWRIGHT_BASE_URL=http://localhost:3000 npm run test:e2e
    ```
    The dev-server console will display instrumentation logs (`[instrumentation] fetch ...`) during the Playwright session.
  - Generate Lighthouse/JMeter evidence before submission. Example Lighthouse CLI usage:
    ```bash
    npx lighthouse http://localhost:3000 --view
    ```
- **Cloud deployment**: The Docker image can be pushed to any registry (e.g., GHCR/ECR). Deploy via services such as Render, Azure Web Apps, or AWS ECS. Ensure environment variables (`DATABASE_URL`, `OUTPUT_SERVICE_BASE_URL`) are set in the hosting platform.

## Serverless Lambda Scaffold

The folder `lambda/generate-output/index.mjs` contains a minimal AWS Lambda handler that fetches a saved snapshot via the REST API and returns the HTML body. Deploy it behind API Gateway to serve dynamic pages (`GET /outputs/{id}`) that stream the stored HTML back to the caller. Configure the environment variable `OUTPUT_SERVICE_BASE_URL` to point at your deployed Next.js base URL.

## Additional Documentation

- `docs/feedback-plan.md`: prompts and checklists for gathering qualitative feedback from the three audiences (family, friends, industry).
- `lambda/README.md`: quick-start deployment notes for packaging the Lambda function.
