Smart Helpdesk with Agentic Triage
This is a full-stack MERN application built to fulfill the Wexa AI Fresher Assignment. It's a smart helpdesk system where users can create support tickets, and an AI agent performs the initial triage by classifying the ticket, retrieving relevant knowledge base articles, and drafting a reply. The application is fully containerized with Docker for easy setup and deployment.

Architecture
The application follows a classic MERN stack architecture, containerized with Docker for consistency across development and production environments.

Frontend (Client): A React single-page application built with Vite and styled with Tailwind CSS. It is served by a lightweight Nginx server in production to handle static file serving and reverse-proxying API requests.

Backend (API): A Node.js and Express server that provides a RESTful API for all application logic, including user authentication, ticket management, and the agentic workflow.

Database: A MongoDB database to store all application data, including users, tickets, and knowledge base articles.

Docker: Docker Compose is used to orchestrate all three services (client, api, mongo), creating a unified network for seamless communication.

How the AI Agent Works
The AI agent is a backend service that automates the initial handling of new support tickets. It is not a chatbot but a workflow that assists human agents.

Trigger: The agent is triggered automatically whenever a user creates a new ticket.

Classification: It analyzes the ticket's title and description using a list of predefined keywords to predict a category (tech, billing, shipping, or other).

Knowledge Retrieval: It performs a text-based search on the MongoDB database to find the top 3 most relevant Knowledge Base articles.

Reply Drafting: It generates a templated reply that includes the titles of the retrieved articles, providing a starting point for a human agent.

Decision Making: It calculates a confidence score. If the score is above a configurable threshold (and auto-close is enabled), it can resolve the ticket automatically. Otherwise, it sets the ticket's status to waiting_human for review.

Auditing: Every step the agent takes is logged in an audit timeline, which is visible on the ticket detail page.

Getting Started
Prerequisites
Docker Desktop: You must have Docker and Docker Compose installed and running on your machine. You can download it from the Docker website.

1. Set Up Environment Variables
In the /backend directory, create a new file named .env. This file will store all your secret keys and configuration.

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

You must replace your_super_secret_and_long_random_string_here with your own secret key.

2. Run the Application
From the root directory of the project (where the docker-compose.yml file is), run the following command:

docker compose up --build

This command will build the Docker images for the frontend and backend, download the MongoDB image, and start all three containers.

3. Access the Application
Once the containers are running, open your web browser and navigate to:
http://localhost:5173

4. Seed the Database (Optional but Recommended)
To populate the application with sample users, tickets, and knowledge base articles, open a new terminal window and run the following command from the project's root directory:

docker compose exec api npm run seed

After seeding, you can log in with the following sample accounts:

User: user@example.com (password: 123456)

Admin: admin@example.com (password: 123456)

5. How to Stop the Application
To stop all running containers, go to the terminal where docker compose up is running and press Ctrl + C.

Testing
The project is set up with Vitest for both frontend and backend testing.

To run backend tests:

# From the /backend directory
npm test

To run frontend tests:

# From the /frontend directory
npm test
