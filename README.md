# Smart Helpdesk with Agentic Triage

This is a full-stack MERN application built to fulfill the Wexa AI Fresher Assignment. It's a smart helpdesk system where users can create support tickets, and an AI agent performs the initial triage by classifying the ticket, retrieving relevant knowledge base articles, and drafting a reply. The application is fully containerized with Docker for easy setup and deployment.

---

## Architecture

The application follows a classic MERN stack architecture, containerized with Docker for consistency across development and production environments.

* **Frontend (Client):** A React single-page application built with Vite and styled with Tailwind CSS. It is served by a lightweight Nginx server in production to handle static file serving and reverse-proxying API requests.
* **Backend (API):** A Node.js and Express server that provides a RESTful API for all application logic, including user authentication, ticket management, and the agentic workflow.
* **Database:** A MongoDB database to store all application data, including users, tickets, and knowledge base articles.
* **Docker:** Docker Compose is used to orchestrate all three services (`client`, `api`, `mongo`), creating a unified network for seamless communication.

---

## How the AI Agent Works

The AI agent is a backend service that automates the initial handling of new support tickets. It is not a chatbot but a workflow that assists human agents.

1.  **Trigger:** The agent is triggered automatically whenever a user creates a new ticket.
2.  **Classification:** It analyzes the ticket's title and description using a list of predefined keywords to predict a category (`tech`, `billing`, `shipping`, or `other`).
3.  **Knowledge Retrieval:** It performs a text-based search on the MongoDB database to find the top 3 most relevant Knowledge Base articles.
4.  **Reply Drafting:** It generates a templated reply that includes the titles of the retrieved articles, providing a starting point for a human agent.
5.  **Decision Making:** It calculates a confidence score. If the score is above a configurable threshold (and auto-close is enabled), it can resolve the ticket automatically. Otherwise, it sets the ticket's status to `waiting_human` for review.
6.  **Auditing:** Every step the agent takes is logged in an audit timeline, which is visible on the ticket detail page.

---

## Getting Started (For Developers with Source Code)

This section is for developers who want to build the application from the source code.

### Prerequisites

* **Docker Desktop:** You must have Docker and Docker Compose installed and running on your machine. You can download it from the [Docker website](https://www.docker.com/products/docker-desktop/).

### 1. Set Up Environment Variables

In the `/backend` directory, create a new file named `.env`. This file will store all your secret keys and configuration.

```env
# backend/.env

# Server Port
PORT=8080

# MongoDB connection link for the Docker environment
MONGO_URI=mongodb://mongo:27017/helpdesk

# IMPORTANT: Change this to a long, random, and secret string
JWT_SECRET=your_super_secret_and_long_random_string_here

# Agent AI Configuration
STUB_MODE=true
AUTO_CLOSE_ENABLED=true
CONFIDENCE_THRESHOLD=0.75
```

**You must replace `your_super_secret_and_long_random_string_here` with your own secret key.**

### 2. Run the Application

From the **root directory** of the project (where the `docker-compose.yml` file is), run the following command:

```sh
docker compose up --build
```

This command will build the Docker images from the source code, download the MongoDB image, and start all three containers.

---

## Running from Docker Hub (For End Users)

This section is for users who want to run the application without needing the source code. This method pulls pre-built images directly from Docker Hub.

### Prerequisites

* **Docker Desktop:** You must have Docker and Docker Compose installed and running.

### 1. Create a Project Folder

Create a new, empty folder on your computer for the application files.

### 2. Create `docker-compose.yml`

Inside the new folder, create a file named `docker-compose.yml` and paste the following content. **Remember to replace `your-username` with your actual Docker Hub username.**

```yaml
services:
  client:
    image: your-username/helpdesk-client:latest
    ports:
      - "5173:80"

  api:
    image: your-username/helpdesk-api:latest
    ports:
      - "8080:8080"
    depends_on:
      - mongo
    env_file:
      - ./.env

  mongo:
    image: mongo:latest
    volumes:
      - mongo-data:/data/db

volumes:
  mongo-data:
```

### 3. Create `.env` file

In the same folder, create a file named `.env` and paste the configuration below.

```env
# Server Port
PORT=8080

# This points to the mongo service defined in docker-compose.yml
MONGO_URI=mongodb://mongo:27017/helpdesk

# IMPORTANT: You must create your own long, random secret key
JWT_SECRET=a-default-secret-key-that-should-be-changed

# Agent Configuration
STUB_MODE=true
AUTO_CLOSE_ENABLED=true
CONFIDENCE_THRESHOLD=0.75
```

### 4. Run the Application

Open a terminal in the folder containing these two files and run:

```sh
docker compose up -d
```

Docker will now download the images from Docker Hub and start the application.

---

## Common Steps for Both Methods

### Access the Application

Once the containers are running, open your web browser and navigate to:
**http://localhost:5173**

### Seed the Database (Optional but Recommended)

To populate the application with sample users and tickets, run the following command from your terminal:

```sh
docker compose exec api npm run seed
```

After seeding, you can log in with the following sample accounts:

* **User:** `user@example.com` (password: `123456`)
* **Admin:** `admin@example.com` (password: `123456`)

### How to Stop the Application

To stop all running containers, run the following command from your terminal:

```sh
docker compose down
```

---

## Testing

The project is set up with Vitest for both frontend and backend testing.

* **To run backend tests:**

  ```sh
  # From the /backend directory
  npm test
  ```

* **To run frontend tests:**

  ```sh
  # From the /frontend directory
  npm test
