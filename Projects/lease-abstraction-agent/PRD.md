# PRD - Lease Abstraction Agent

## Problem
Landlords of large properties (malls, data centers, apartment complexes) 
have no reliable way to track and enforce tenant obligations from lease 
agreements. They forget to send reminders, miss deadlines, and lose money 
when obligations like insurance certificates or property maintenance go 
untracked. Lease agreements also vary widely in format, making manual 
tracking impossible at scale.

## Users
- Primary: Landlords managing large properties
- Secondary: Tenants (interact via email/text, no login required)

## Solution
An agentic system that:
1. Extracts key obligations from any lease agreement (lease abstraction)
2. Creates and sends reminders to both parties automatically
3. Manages enforcement via email/text — tenants never need to log in
4. Verifies submitted documents (e.g. certificates of insurance, roof photos)
5. Files verified documents under the tenant's name in the database

## Example Flow
1. Agent emails tenant: "Please send a photo of your roof"
2. Tenant replies asking why
3. Agent references the lease abstraction and shows the agreed obligation
4. Tenant sends photo via email
5. Agent verifies it and files it in the database

## Tech Stack
- Agent: Google ADK + Claude Opus/Sonnet (Python)
- Backend: TypeScript + Node.js
- Frontend: Next.js
- Database: PostgreSQL
  - Lease abstraction
  - Enforcement (events + notification management)
  - Information management (file upload + verification)

## Current Status
- [ ] Data schema (Lucas)
- [ ] Lease abstraction agent
- [ ] Enforcement + reminder system
- [ ] Email/text management
- [ ] Document verification
- [ ] Frontend

## Goals

- **Primary:** speed of execution — get a thin slice live quickly, learn, then iterate (scope and polish follow traction).

## Success Metric
Get live and gain traction