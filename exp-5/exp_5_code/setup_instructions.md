# Post Composer Mini-Project Manual

This project contains a React/Vite frontend and a Spring Boot backend with an in-memory H2 database.

## Prerequisites

- Java 17 or newer
- Node.js 14 or newer and npm

## Run With Two VS Code Terminal Tabs

Open the `exp_5_code` folder in VS Code. Create two terminal tabs and keep both running.
The commands below assume the terminal is already inside `exp_5_code`.
If your prompt ends with `Full Stack %`, use the workspace-root commands shown below instead.

### Terminal 1: Backend

Mac/Linux:

```bash
cd backend
sh gradlew bootRun
```

From the `Full Stack` workspace root:

```bash
cd exp-5/exp_5_code/backend
sh gradlew bootRun
```

Windows PowerShell:

```powershell
cd backend
./gradlew.bat bootRun
```

The backend runs at `http://localhost:8080`.

### Terminal 2: Frontend

Open a **new terminal tab**. Do not run this from the backend directory.

```bash
cd frontend
npm install
xattr -dr com.apple.quarantine node_modules
npm run dev
```

From the `Full Stack` workspace root:

```bash
cd exp-5/exp_5_code/frontend
npm install
xattr -dr com.apple.quarantine node_modules
npm run dev
```

The frontend runs at `http://localhost:5173`.

Open the frontend URL in a browser after both terminals are running.

## Application Flow

1. Select a social platform.
2. Type a post and review the word count.
3. Click **Post** to save it.
4. Edit or delete posts from the Recent Posts list.

## Troubleshooting

- If port `8080` or `5173` is already in use, stop the existing process or run the frontend with `npm run dev -- --port 5174`.
- If dependencies are missing, run `npm install` inside `frontend`.
- If Java is not found, install a JDK 17+ distribution and restart VS Code.
