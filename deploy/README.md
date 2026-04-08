# GramAI Advisor: Deployment Guide

This document explains how to deploy the GramAI Advisor system as independent microservices on Google Cloud Run using Python FastAPI.

## Architecture

1. **orchestrator-service**: Orchestrates calls to all sub-agents.
2. **crop-agent-service**: Recommends crops based on soil and climate.
3. **land-agent-service**: Analyzes land zones and usability.
4. **land-optimizer-service**: Allocates land for maximum ROI and cash flow.
5. **finance-agent-service**: Calculates ROI, profit, and loan eligibility.
6. **scheme-agent-service**: Fetches relevant government subsidies.
7. **document-agent-service**: Generates PDF reports.

## Prerequisites

- Google Cloud SDK (`gcloud`) installed and configured.
- Docker installed.
- A Google Cloud Project with Billing enabled.
- Vertex AI API enabled.

## Deployment Steps

### 1. Build and Push Docker Images

For each service (e.g., `orchestrator`):

```bash
cd deploy/orchestrator
gcloud builds submit --tag gcr.io/[PROJECT_ID]/orchestrator-service
```

### 2. Deploy to Cloud Run

```bash
gcloud run deploy orchestrator-service \
  --image gcr.io/[PROJECT_ID]/orchestrator-service \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars "GEMINI_API_KEY=[YOUR_KEY],CROP_AGENT_URL=[URL],LAND_AGENT_URL=[URL]..."
```

### 3. Environment Variables

Each service requires specific environment variables to communicate with other services. Ensure the `orchestrator-service` has the URLs of all sub-agents.

## Service Code (Python FastAPI)

The following files provide the implementation for each service.
