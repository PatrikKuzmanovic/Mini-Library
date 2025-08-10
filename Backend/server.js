const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
//const PORT = 3000;

app.use(cors());
app.use(express.json());

//app.use(express.static(path.join(__dirname, '..', 'Frontend')));

const booksFilePath = path.join(__dirname, 'data', 'books.json');

function initializeBooks() {
    if (!fs.existsSync(booksFilePath)) {
        const dataDir = path.join(__dirname, 'data');
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }

        const initialData = {
            books: [
                { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald", year: 1925, genre: "Fiction" },
                { id: 2, title: "To Kill a Mockingbird", author: "Harper Lee", year: 1960, genre: "Fiction" },
                { id: 3, title: "1984", author: "George Orwell", year: 1949, genre: "Science Fiction" },
                { id: 4, title: "Pride and Prejudice", author: "Jane Austen", year: 1813, genre: "Romance" },
                { id: 5, title: "The Catcher in the Rye", author: "J.D. Salinger", year: 1951, genre: "Fiction" },
                { id: 6, title: "The Hobbit", author: "J.R.R. Tolkien", year: 1937, genre: "Fantasy" },
                { id: 7, title: "Harry Potter and the Philosopher's Stone", author: "J.K. Rowling", year: 1997, genre: "Fantasy" },
                { id: 8, title: "The Lord of the Rings", author: "J.R.R. Tolkien", year: 1954, genre: "Fantasy" }
            ]
        };

        fs.writeFileSync(booksFilePath, JSON.stringify(initialData, null, 2));
        console.log('Initialized books.json with defalt data');
    }
}

initializeBooks();

function readBooks() {
    try {
        const data = fs.readFileSync(booksFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading book file:', error);
        return { books: [] };
    }
}

function writeBooks(data) {
    try {
        fs.writeFileSync(booksFilePath, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing books file:', error);
        return false;
    }
}

app.get('/api/books', (req, res) => {
    const data = readBooks();
    res.json(data.books);
});

app.get('/api/books/search', (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ error: 'Search query is required' });
    }

    const data = readBooks();
    const searchTerm = query.toLowerCase().trim();

    console.log('Searching for:', searchTerm);

    const filteredBooks = data.books.filter(book => {
        const titleMatch = book.title.toLowerCase().includes(searchTerm);
        const authorMatch = book.author.toLowerCase().includes(searchTerm);
        return titleMatch || authorMatch;
    });

    res.json(filteredBooks);
});

app.post('/api/books', (req, res) => {
    const { title, author, year, genre } = req.body;

    if (!title || !author || !year) {
        return res.status(400).json({ error: 'Title, author, and year are required' });
    }

    const data = readBooks();

    const newId = data.books.length > 0
    ? Math.max(...data.books.map(b => b.id)) + 1
    : 1;

    const newBook = {
        id: newId,
        title: title.trim(),
        author: author.trim(),
        year: parseInt(year),
        genre: genre ? genre.trim() : 'Unknown'
    };

    data.books.push(newBook);

    if (writeBooks(data)) {
        res.status(201).json(newBook);
    } else {
        res.status(500).json({ error: 'Failed to save book' });
    }
});

app.delete('/api/books/:id', (req, res) => {
    const bookId = parseInt(req.params.id);

    const data = readBooks();
    const bookIndex = data.books.findIndex(b => b.id === bookId);

    if (bookIndex === -1) {
        return res.status(404).json({ error: 'Book not found' });
    }

    data.books.splice(bookIndex, 1);

    if (writeBooks(data)) {
        res.json({ message: 'Book deleted sucessfully' });
    } else {
        res.status(500).json({ error: 'Failed to delete book' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log('Available endpoints:');
    console.log('  GET  /api/books - Get all books');
    console.log('  GET  /api/books/search?query=term - Search books');
    console.log('  POST /api/books - Add a new book');
    console.log('  DELETE /api/books/:id - Delete a book');
});