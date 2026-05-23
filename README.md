# BELLE – AI-Powered Community Fashion Blogging Platform

BELLE is a modern community-driven fashion blogging platform designed for women to create, share, and explore content related to skincare, makeup, haircare, and fashion styling.

Built with a Django REST Framework backend and a React frontend, BELLE combines social blogging features with AI-powered assistance to enhance content creation and user engagement.

---

# Features

## User Authentication
- Secure user registration and login
- JWT-based authentication and session management
- User profile management with profile image, bio, and social links

---

## Blog Management
- Create, edit, and delete blog posts
- Rich text editor integration using React Quill
- Upload blog cover images
- Categorize blogs into:
  - Haircare
  - Makeup
  - Skincare
  - Dressing & Fashion

---

## AI Writing Assistant
BELLE includes an AI-powered assistant integrated directly into the blogging workflow.

### AI Features
- Generate blog ideas and content suggestions
- Writing assistance for improving readability and structure
- SEO optimization suggestions
- Beauty and fashion content inspiration
- Context-aware AI responses for user-specific queries

---

## AI Chatbot
The platform also includes an intelligent chatbot system capable of responding to user-specific beauty and fashion queries.

### Example Use Cases
- Skincare recommendations
- Makeup suggestions
- Fashion styling tips
- Content inspiration
- Personalized beauty guidance

---

## Social Features
- Like and unlike blog posts
- Comment system for discussions and interaction
- Search blogs by title or category
- Explore blogs from the community

---

## Responsive User Interface
- Fully responsive design for desktop, tablet, and mobile devices
- Elegant UI with modern styling and smooth interactions
- Dashboard experience for content creators

---

# Backend Architecture

## Django REST Framework Backend
- RESTful API architecture
- Secure CRUD operations for blogs, comments, and profiles
- JWT-secured endpoints
- Input validation and error handling
- Media upload handling

## Database & Cloud Services
- PostgreSQL database hosted on Supabase
- Cloud storage integration for user-uploaded media
- Backup and recovery support for production data

---

# Technology Stack

## Frontend
- React
- Axios
- React Quill
- CSS / Tailwind / Bootstrap

## Backend
- Django
- Django REST Framework
- Simple JWT Authentication

## Database & Cloud
- PostgreSQL
- Supabase Storage

## AI Integration
- OpenAI API

---

# Application Structure

## Main Pages
- Home Page
- Blog Detail Page
- Create/Edit Blog Page
- Category Browsing
- User Dashboard
- Profile Management
- Authentication Pages

## Navigation
- Responsive Navbar
- Search functionality
- Sidebar navigation
- Profile dropdown and account controls

---

# Design System

## Theme Colors
- Primary: Deep Wine Red `#6B0010`
- Accent: Rose Gold `#B76E79`
- Background: Dark Gradient
- Typography: White and soft gray tones

## UI Highlights
- Elegant card-based layout
- Interactive hover effects
- Responsive blog grids
- Modern typography and spacing

---

# Getting Started

## Prerequisites
- Node.js and npm
- Python 3.10+
- PostgreSQL

---

# Clone Repository

```bash
git clone https://github.com/hamna-ali/BELLE.git
cd BELLE
