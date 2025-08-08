Mini Library - Book Management System

Simple web application for managing a small library collection. Users can browse books, add new ones and search through the collection


FEATURES:
View All Books: Display all books with title, author and genre

Add New Books: Simple form to add books to the library

Search Functionality: Search books by the title or author

Delete Books: Remove books from the collection

Reset Library: Restore default book collection

Responsive Design: Works on desktop and mobile devices

TECHNOLOGY STACK
Frontend: HTML, CSS JavaScript
Backend: Node.js with Express.js
Database: JSON file (books.json)


DATABASE MODES
The application uses a simple JSON structure to store book data:

json:
{
    "books": [
        {
            "id": 1,
            "title": "Book Title",
            "author": "Author Name",
            "year": 2024,
            "genre": "Fiction"
        }
    ]
}


BOOK ENTITY PROPERTIES
id: Unique identifier
title: Book title
author: Author name
year: Publication year
genre: Book genre


BACKEND API ENDPOINTS
Base URL:: http://localhost:3000/api

Method: GET
Endpoint: /books
Description: Get all books
Request body: None

Method: GET
Endpoint: /books/search?query=term
Description: Search books by title or author
Request body: None

Method: POST
Endpoint: /books
Description: Add a new book
Request Body: { title, author, year, genre }

Method: DELETE
Endpoint: /books/:id
Description: Delete a book by ID
Request Body: None


EXAMPLE API CALLS:
Get all books:
GET http://localhost:3000/api/books

Search for books:
GET http://localhost:3000/api/books/search?query=tolkien

Add a new book:
POST http://localhost:3000/api/books
Content-Type: application/json

{
    "title": "The Hobbit",
    "author": "J.R.R. Tolkien",
    "year": 1937,
    "genre": "Fantasy"
}


PROJECT STRUCTURE
MINI-LIBRARY/
    Backend/
        server.js
        package.json
        data/
            books.json
    
    Frontend/
        index.html
        style.css
        script.js
    README.md


INSTALATION AND SETUP:
Node.js
npm
Web browser

Step by Step instruction:
1. Clone or download te Project from Github:
git clone <repository-url>
cd mini-library

2. Backend setup:
cd Backend
npm install
mkdir data
npm start
(the backend server will start on "http://localhost:3000")

3. Frontend Setup:
    1. Install "Live Server" extension in VS Code
    2. Open the Frontend folder in VS Code
    3. Right-click on "index.html"
    4. Select "Open with Live Server"

(Still trying)
DEPLOYMENT OPTIONS
Frontend Deployment:
Vercel

Backend Deployment:
Render


