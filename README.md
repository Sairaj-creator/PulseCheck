# PulseCheck

PulseCheck is a robust, containerized service-health dashboard. While the application itself provides a simple and effective way to monitor uptime and response times of various targets, the core focus of this project is its **God-Tier CI/CD Pipeline**.

## Features

- **Service Health Dashboard**: Express API and React frontend to monitor target URLs, track response times, and calculate uptime percentages.
- **Dockerized Architecture**: Multi-stage Docker builds for the frontend and backend, orchestrated seamlessly with Docker Compose.
- **Advanced CI/CD with Jenkins**:
  - Fully automated pipeline: Lint → Test → Build → Push → Deploy.
  - SHA-based image tagging for precise version control.
  - Health-check gated deployments ensuring zero-downtime and automatic rollback to the last known-good state on failure.
- **Slack Alerting**: Automated notifications for pipeline status, deployment rollbacks, and application monitoring alerts.

## Project Structure

- `/backend`: Node.js Express API with SQLite for storing health check metrics.
- `/frontend`: React dashboard for visualizing target statuses.
- `Jenkinsfile`: The heart of the deployment pipeline.
- `docker-compose.yml`: Local development and deployment orchestration.

## Getting Started

*(Detailed setup instructions will be available in BUILD_LOG.md upon pipeline completion)*

1. Clone the repository.
2. Setup environment variables based on `.env.example`.
3. Run `docker-compose up` to start the application locally.

## CI/CD Pipeline

The Jenkins pipeline is designed to be fully self-hosted and robust. It includes linting, testing, building Docker images, pushing them to Docker Hub with Git SHA tags, and securely deploying to a target host with built-in rollback capabilities based on health checks.
