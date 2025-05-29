![book-01-Converted-01-1024x428](https://github.com/user-attachments/assets/5565902c-5e4b-4b94-b735-348058beb444)

[![GitHub stars](https://img.shields.io/github/stars/iampawan/FlutterExampleApps.svg?style=social&label=Star)](https://github.com/amirziyacode)
[![GitHub forks](https://img.shields.io/github/forks/iampawan/FlutterExampleApps.svg?style=social&label=Fork)](https://github.com/amirziyacode?tab=repositories)

# 📚 Online Bookstore App

A full-stack **online bookstore** web application built with **Spring Boot** (backend) and **Next.js** (frontend). The platform allows users to browse and purchase books, chat with an AI assistant, and provides an admin panel for managing orders and content.

---

## 🚀 Features

### 👥 User Authentication
- Register and log in securely
- Passwords are hashed and stored securely
- JWT-based authentication

### 📖 Bookstore
- Browse all available books
- View book details
- Add books to cart and checkout
- Order history for users

### 🛠️ Admin Panel
- View and manage all orders
- Add, edit, and delete books
- (Optional) Manage users

### 🤖 AI Chatbot
- Integrated chatbot powered by AI (e.g., ChatGPT)
- Users can ask for book recommendations, help with the site, or general inquiries

---

## 🧱 Tech Stack

| Layer     | Technology         |
|-----------|--------------------|
| Frontend  | Next.js (React)    |
| Backend   | Spring Boot (Java) |
| Database  | PostgreSQL / MySQL |
| Auth      | JWT                |
| AI Chatbot| OpenAI API (or similar) |

---

## 📁 Project Structure

### Backend (Spring Boot)
- `/controllers` – REST API controllers
- `/models` – JPA entities like `User`, `Book`, `Order`
- `/services` – Business logic
- `/config` – Security & JWT configurations

### Frontend (Next.js)
- `/pages` – Routing (e.g., `/books`, `/login`, `/admin/orders`)
- `/components` – Reusable UI components (e.g., `Navbar`, `ChatBotWidget`, `BookCard`)
- `/utils` – Helpers like API clients and auth handlers

---

## 🔌 API Overview

| Method | Endpoint             | Description             |
|--------|----------------------|-------------------------|
| POST   | `/api/auth/register` | Register a new user     |
| POST   | `/api/auth/login`    | Login user              |
| GET    | `/api/books`         | List all books          |
| GET    | `/api/books/{id}`    | Book details            |
| POST   | `/api/orders`        | Create a new order      |
| GET    | `/api/admin/orders`  | Admin: list all orders  |

---

## 📸 Demo

🔗 [Live Demo](https://ai-book-store-jyd2.vercel.app/)

Visit the deployed version of the app to explore features like book browsing, AI chatbot, and admin panel (if authorized).

---

## 🧠 Future Enhancements
- Payment gateway integration
- Book ratings and reviews
- Personalized recommendations
- Notifications system

---

## 📦 Setup Instructions

### Frontend (Next.js)

1. Navigate to the frontend directory:
   ```bash
   git clone https://github.com/amirziyacode/Ai-BookStore
2. Install Packages:
```bash
  npm install --force
  npm run dev 
```
3. Visit the app in your browser at:
```text
http://localhost:3000
```
