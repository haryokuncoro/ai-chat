# AI Chat Application

A full-stack AI-powered chat application built with **Spring AI**, **Java 17**, and **Next.js**.

The application provides:

* AI Chat
* Streaming AI Responses (SSE)
* AI Code Review
* Session-based Conversations
* Multiple AI Providers
* Extensible AI Personas (Chat, Code Reviewer, Software Architect, etc.)

## Tech Stack

### Backend

* Java 17
* Spring Boot
* Spring AI
* Maven
* Server-Sent Events (SSE)

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS

---

# Features

* 💬 Standard AI Chat
* ⚡ Streaming Chat via SSE
* 🔍 AI Code Review
* 🧠 Conversation Memory using Sessions
* 🏗️ AI Personas (Java Mentor, Software Architect, Code Reviewer)
* 🔌 Provider Strategy Pattern for multiple LLM providers
* 🐳 Docker Compose Support

---

# Project Structure

```text
.
├── backend/
│   ├── src/
│   ├── Dockerfile
│   └── pom.xml
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml
│
└── README.md
```

---

# Quick Start

## Prerequisites

* Docker
* Docker Compose

## Environment Variables

Create a `.env` file in the project root:

```env
OPENAI_API_KEY=your_openai_api_key
```

---

## Run Entire Application

From the project root:

```bash
docker compose up --build
```

Backend:

```text
http://localhost:8080
```

Frontend:

```text
http://localhost:3000
```

---

## Stop Application

```bash
docker compose down
```

---

# Local Development

## Backend

```bash
cd backend
./mvnw spring-boot:run
```

## Frontend

```bash
cd frontend
npm install
npm run dev
```

---

# API Overview

| Endpoint             | Method | Description          |
| -------------------- | ------ | -------------------- |
| `/api/chat/sessions` | POST   | Create chat session  |
| `/api/chat`          | POST   | Standard chat        |
| `/api/chat/stream`   | POST   | Streaming chat (SSE) |
| `/api/review`        | POST   | AI code review       |

---

