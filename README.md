# BELLE – Community Fashion Blogging App for Women  

**BELLE** (meaning *beauty* in French) is a modern **community-driven fashion blogging platform** where women can create, share, and engage with blogs about **hair, makeup, skincare, and dressing styles**.  

The project provides a seamless blogging experience with a **Django REST API backend** and a **React-powered frontend**, styled with a seductive **wine-red & rose-gold theme** for an elegant user experience.  

---

## ✨ Features  

### 🔮 Frontend (React)
- **User Authentication**  
  - Sign up / Login forms  
  - JWT token-based authentication & session management  

- **Dashboard**  
  - View all blogs created by the user  
  - Detailed view of blog posts (title, content, author, date)  

- **Blog Management**  
  - Create, edit, and delete blog posts  
  - Rich text editing with **React Quill**  
  - Image upload for posts  

- **Comments & Likes**  
  - Add and view comments under blogs  
  - Instagram-style like/unlike system  

- **Search & Categories**  
  - Search blogs by title  
  - Explore blogs by category: *Hair, Makeup, Skincare, Dressing*  

- **Responsive Design**  
  - Optimized for **desktop, tablet, and mobile**  

---

### ⚙️ Backend (Django + Django REST Framework)
- **User Authentication**  
  - Django’s built-in authentication  
  - JWT-based secure API access  

- **RESTful API Endpoints**  
  - CRUD operations for blogs & comments  
  - Secure endpoints with validation & error handling  

- **Database**  
  - **PostgreSQL** for reliable storage of blogs, users, and comments  

---

## 🛠️ Tech Stack  

- **Frontend**: React, Redux, Axios, React-Quill  
- **Backend**: Django, Django REST Framework  
- **Database**: PostgreSQL  
- **Authentication**: JWT (JSON Web Tokens)  
- **UI/Styling**: Tailwind CSS / Bootstrap / Material UI (optional)  

---

## 🗂️ App Structure  

### 🌍 Global Layout
- **Navbar**: Logo, Home, Post, Category, My Blogs, About, Search bar, Profile dropdown  
- **Sidebar**: Collapsible, same menu as navbar with profile & logout options  
- **Footer**: Social media icons (Instagram, Facebook, Twitter), legal info  

### 📄 Pages
1. **Home** – Hero carousel + latest blogs  
2. **Post Page** – Create/Edit blog with category, title, image & editor  
3. **Category Page** – Category-specific blog listings with pagination  
4. **My Blogs** – Manage user’s own blogs (edit/delete)  
5. **Profile Page** – Profile picture, bio, socials, change password, delete account  
6. **Blog Detail** – Blog content, likes, comments, related blogs  
7. **Auth Pages** – Custom-themed sign up & sign in forms  

---

## 🎨 Design & Theme  

- **Primary Color**: Deep Wine Red `#6B0010`  
- **Accent Color**: Rose Gold `#B76E79`  
- **Background**: Black gradient `#000000 → #0A0A0A`  
- **Cards/Fields**: Pearl White `#F5F5F5`  
- **Typography**: White & Light Gray with Rose Gold highlights  

✨ **Extra Seductive Styling**
- Hero carousel with dark overlay + wine-red headings  
- Rose gold hover glows & borders  
- Zoom-in blog thumbnails with subtle highlights  

---

## 🚀 Getting Started  

### 🔧 Prerequisites
- **Node.js** & npm  
- **Python 3.10+**  
- **PostgreSQL**  

### 📥 Clone Repository
```bash
git clone https://github.com/hamna-ali/BELLE.git
cd BELLE

