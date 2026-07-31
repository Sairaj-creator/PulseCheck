# PulseCheck — Master Build Prompt (God-Tier Edition, v2 — Tightened)

> **How to use this file:** Paste everything after the divider into Claude Code, a fresh Claude chat, or any coding agent, as your first message. The app is intentionally simple — the pipeline IS the project. Do not let effort drift into building a fancier dashboard than needed.

---

## MASTER PROMPT (copy from here down)

You are acting as a senior DevOps-leaning full-stack engineer. Build **PulseCheck** — a small containerized service-health dashboard, wrapped in a real, self-hosted Jenkins CI/CD pipeline that lints, tests, builds, pushes, deploys, verifies, and can roll back.

**Scope discipline is the point of this project.** The app must stay deliberately simple (ping URLs, show status, compute uptime %). All real engineering effort goes into the pipeline. If you find yourself adding app features instead of hardening the pipeline, stop and redirect.

Do not ask clarifying questions about scope — the spec below is complete. Only ask for secrets/credentials or a genuine judgment call with no reasonable default. Build layer by layer, in order. **After each layer, stop, run its tests, show me the output, flag any shortcut taken, and only then move to the next layer.**

### Tech stack (fixed)
- API: Node.js + Express (small `/status`, `/metrics` endpoints)
- Frontend: React (simple polling dashboard, no fancy state management needed)
- Database: SQLite (Postgres is overkill for uptime rows — use SQLite unless you have a specific reason not to; state the reason if you deviate)
- Containerization: Docker + Docker Compose (one `Dockerfile` per service: frontend, backend; db can be a volume-mounted SQLite file, no separate container needed)
- CI/CD: Jenkins, self-hosted via Docker (`docker run jenkins/jenkins:lts`), driven by a `Jenkinsfile` checked into the repo
- Registry: Docker Hub (free tier)
- Deploy target: a single host reachable via SSH (Railway/Render/Oracle free-tier VPS — your call, state which and why)
- Alerts: Slack (or Discord) incoming webhook

---

## THE 6 LAYERS (build strictly in this order)

### Layer 0 — App Skeleton
- Express API with:
  - `GET /health` — the app's own liveness check
  - `POST /targets` — register a URL to monitor (name, url, interval_seconds)
  - `GET /status` — current up/down state of all targets
  - `GET /metrics` — uptime % and avg response time per target, computed over a rolling window (e.g. last 100 checks or last 24h)
- A background poller (simple `setInterval`, no job queue needed) that pings each target, stores `{target_id, timestamp, success, response_time_ms}` in SQLite.
- React frontend: table of targets with green/red status dot, uptime %, and a basic response-time sparkline/graph.
- **Test:** unit tests for the uptime % calculation (`uptime% = (checks_passed / total_checks) * 100`) with a few known input sets (all-pass, all-fail, mixed, empty window). API integration test: register a target, mock a failed ping, confirm `/status` reflects "down" and `/metrics` reflects the correct uptime %.

### Layer 1 — Dockerize
- `Dockerfile` for the API, `Dockerfile` for the frontend (multi-stage build — build React, serve via a lightweight static server or nginx).
- `docker-compose.yml` that brings up frontend + backend with one command, SQLite file on a mounted volume so data survives container restarts.
- **Test:** `docker-compose up` from a clean clone boots both services; frontend loads and successfully hits the API; confirm the SQLite volume persists data across a `docker-compose down && docker-compose up`.

### Layer 2 — Secrets & Config (do this before touching Jenkins)
- Add a `.env.example` documenting every required variable (Docker Hub username, SSH host/user, Slack webhook URL) with **no real values**.
- Confirm `.gitignore` excludes `.env` and any credential files — check this explicitly, don't assume.
- **Test:** `git status` after adding a real local `.env` shows it as untracked/ignored, not staged.

### Layer 3 — Jenkins Pipeline: Lint → Test → Build → Push
- Run Jenkins itself in Docker locally. Write a `Jenkinsfile` with stages:
  1. **Lint** — ESLint on both frontend and backend
  2. **Test** — run the Layer 0 test suite
  3. **Build** — `docker build` both images
  4. **Push** — tag each image `yourimage:<git-commit-sha>` AND `yourimage:latest-candidate` (not `latest` yet — see Layer 4), push both tags to Docker Hub
- Use the Jenkins Credentials Binding plugin (`withCredentials`) to inject the Docker Hub token — it must never appear in the `Jenkinsfile` or any committed file.
- Add a `post { failure { ... } }` block that posts to the Slack webhook on any stage failure. This is the entire "self-monitoring" requirement — it is one stanza, not a separate architectural layer, so do not over-build it.
- **Test:** trigger the pipeline on a push with a deliberately broken test, confirm it fails at the Test stage and the Slack failure notification fires. Then fix it and confirm a clean run pushes both image tags to Docker Hub.

### Layer 4 — Deploy + Verified Rollback
This is the layer that proves real operational thinking — build the mechanism precisely as specified, do not hand-wave it:
- **Deploy stage:** SSH into the host (SSH key injected via Jenkins Credentials, never hardcoded), `docker pull` the new `<git-sha>` tagged images, stop the running containers, start the new ones.
- **Health-check gate:** after starting the new containers, curl `/health` a few times (e.g. 5 attempts, 3s apart). If it never returns 200:
  - Read the **last-known-good SHA** from a small file on the host (e.g. `/opt/pulsecheck/last_good_sha.txt`).
  - Re-pull and redeploy that SHA's images instead.
  - Fail the pipeline stage so it's visible in Jenkins, and post to Slack that a rollback occurred.
- **On success:** re-tag `latest` to point at the new SHA, and overwrite `last_good_sha.txt` with the new SHA. This is what makes rollback possible next time — write it down explicitly in your code comments, since "rollback" without a stored previous-good-state is just aspiration.
- **Test:** two runs. (1) Deploy a working build — confirm `last_good_sha.txt` updates and `latest` moves. (2) Deploy a deliberately broken build (e.g. one that fails `/health`) — confirm the pipeline detects it, redeploys the previous SHA, the app is back up on the old version, and Slack gets a rollback notice.

### Layer 5 — Chaos Check (manual, not tooling)
- Do **not** build chaos-engineering infrastructure (no Chaos Monkey, no fault-injection framework) — that is a distinct, larger project. One deliberate failure is sufficient evidence.
- With the full stack running "in production" (deployed via Layer 4), manually run `docker stop <backend-container>` (or block one monitored target's URL) and time how long it takes for:
  - The dashboard to show it as down
  - The Slack alert to fire
- Record the observed delay against your configured polling interval — this becomes evidence in `BUILD_LOG.md`, not a permanent piece of test infrastructure.
- **Test:** a single recorded run (screenshot description or terminal log) showing the down-detection and the Slack alert timestamp.

---

## AFTER EVERY LAYER — CHECKPOINT RITUAL
1. Run that layer's tests, paste the output.
2. 2–3 sentence plain-English summary of what was actually built.
3. Flag any shortcut taken (e.g., "SSH deploy uses a single static host, no blue/green — documented as a known limitation") so it doesn't quietly become undisclosed technical debt.

---

## FINAL DELIVERABLE — `BUILD_LOG.md`
Once all 6 layers pass, generate `BUILD_LOG.md` at the project root containing:
1. **Pipeline diagram** (ASCII or Mermaid): push → lint → test → build → push images → deploy → health-check → (rollback if needed) → Slack notify.
2. **What was built, layer by layer** — plain English, 2–4 sentences each, readable by a recruiter but detailed enough for a technical follow-up.
3. **The hardest problem solved** — expect this to be the rollback mechanism or the Jenkins-Docker-in-Docker networking setup; describe it honestly based on what actually cost the most time.
4. **The chaos-check evidence** from Layer 5 — what you killed, how long detection took, what the Slack alert looked like.
5. **A ready-to-paste resume bullet**, e.g.:
   > "Built a self-hosted Jenkins CI/CD pipeline in Docker that lints, tests, builds, and deploys a multi-container application on every push, with SHA-based image tagging, automated health-check-gated rollback to the last known-good build, and Slack alerting on both pipeline and application failures."
6. **"If I had more time" section** — 3-5 honest next steps (e.g., blue/green deploy, real chaos tooling, multi-host deploy) — more credible in an interview than pretending it's finished.
7. **Setup instructions** — env vars needed, `docker-compose up`, how to run Jenkins locally, how to trigger the pipeline, so a reviewer can reproduce it in under 15 minutes.

Do not write `BUILD_LOG.md` until Layer 5 is complete — it should describe what actually happened, including the recorded chaos-check timing, not what was planned.

---

## GROUND RULES THROUGHOUT
- No secret (Docker Hub token, SSH key, Slack webhook URL) may ever appear in a committed file — Jenkins Credentials Binding or environment injection only. Check `.gitignore` before writing any config with real values.
- Every image is tagged with its git SHA before it's ever tagged `latest` — `latest` only moves after a passing health check.
- Keep the app itself boring. If a change doesn't serve the pipeline story, don't build it.
- Commit after each layer passes, e.g. `feat(layer-4): health-check-gated rollback to last known-good SHA`.