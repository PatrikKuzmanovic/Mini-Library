const API_BASE_URL = 'http://localhost:3000/api';

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.toString().replace(/[&<>"']/g, m => map[m]);
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing app...');
    loadAllBooks();

    const searchBtn = document.getElementById('searchBtn');
    const clearBtn = document.getElementById('clearBtn');
    const addBookForm = document.getElementById('addBookForm');
    const searchInput = document.getElementById('searchInput');

    if (searchBtn) {
        searchBtn.addEventListener('click', searchBooks);
        console.log('Search button listener attached');
    } else {
        console.error('Search button not found!');
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', clearSearch);
        console.log('Clear button listener attached');
    } else {
        console.error('Clear button not found!');
    }

    if (addBookForm) {
        addBookForm.addEventListener('submit', addBook);
        console.log('Form submit listener attached');
    } else {
        console.error('Add book form not found!');
    }

    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                searchBooks();
            }
        });
        console.log('Search input listener attached');
    } else {
        console.error('Search input not found!');
    }
});

async function loadAllBooks() {
    try {
        console.log('Fetching books from:', `${API_BASE_URL}/books`);
        const response = await fetch(`${API_BASE_URL}/books`);

        if (!response.ok) {
            throw new Error('Failed to fetch books');
        }

        const books = await response.json();
        console.log('Books loaded:', books);
        displayBooks(books);
    } catch (error) {
        console.error('Error loading books:', error);
        showMessage('Failed to load books. Please make sure the server is running.', 'error');
    }
}

function displayBooks(books) {
    const container = document.getElementById('booksContainer');
    const noResults = document.getElementById('noResults');

    console.log('displayBooks called with', books.length, 'books');

    if (!container) {
        console.error('booksContainer element not found!');
        return;
    }

    if (!books || books.length === 0) {
        container.innerHTML = '';
        if (noResults) {
            noResults.style.display = 'block';
        }
    } else {
        if (noResults) {
            noResults.style.display = 'none';
        }

        const booksHTML = books.map(book => `
            <div class="book-card">
                <button class="delete-btn" onclick="deleteBook(${book.id})" title="Delete book">×</button>
                <h3>${escapeHtml(book.title)}</h3>
                <p class="author">by ${escapeHtml(book.author)}</p>
                <p class="year">Published: ${book.year}</p>
                <span class="genre">${escapeHtml(book.genre || 'Unknown')}</span>
            </div>
        `).join('');
        
        console.log('Setting innerHTML with', books.length, 'book cards');
        container.innerHTML = booksHTML;
        console.log('Books displayed successfully');
    }
}

async function addBook(event) {
    event.preventDefault();
    console.log('Adding new book...');

    const formData = new FormData(event.target);
    const bookData = {
        title: formData.get('title'),
        author: formData.get('author'),
        year: formData.get('year'),
        genre: formData.get('genre') || 'Unknown'
    };

    console.log('Book data to send:', bookData);

    try {
        const response = await fetch(`${API_BASE_URL}/books`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to add book');
        }

        const newBook = await response.json();
        console.log('Book added successfully:', newBook);
        showMessage('Book added successfully!', 'success');

        event.target.reset();
        loadAllBooks();
        document.getElementById('searchInput').value = '';

    } catch (error) {
        console.error('Error adding book:', error);
        showMessage(error.message || 'Failed to add book', 'error');
    }
}

async function searchBooks() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.trim();

    console.log('Searching for:', query);

    if (!query) {
        loadAllBooks();
        return;
    }

    try {
        const searchUrl = `${API_BASE_URL}/books/search?query=${encodeURIComponent(query)}`;
        console.log('Search URL:', searchUrl);

        const response = await fetch(searchUrl);

        console.log('Search response status:', response.status);

        if (!response.ok) {
            throw new Error('Search Failed');
        }

        const books = await response.json();
        console.log('Search results found:', books.length, 'books');
        console.log('Books found:', books);

        displayBooks(books);

        if (books.length === 0) {
            showMessage('No books found matching your search', 'error');
        } else {
            showMessage(`Found ${books.length} book(s) matching your search`, 'success');
        }
    } catch (error) {
        console.error('Error searching books:', error);
        showMessage('Search failed. Please try again.', 'error');
    }
}

function clearSearch() {
    console.log('Clearing search...');
    document.getElementById('searchInput').value = '';
    loadAllBooks();
}

window.deleteBook = async function(bookId) {
    if(!confirm('Are you sure you want to delete this book?')) {
        return;
    }

    console.log('Deleting book with ID:', bookId);

    try {
        const response = await fetch(`${API_BASE_URL}/books/${bookId}`, {
            method: 'DELETE'
        });

        if (!response.ok){
            throw new Error('Failed to delete book');
        }

        showMessage('Book deleted successfully!', 'success');
        loadAllBooks();
    } catch (error) {
        console.error('Error deleting book:', error);
        showMessage('Failed to delete book', 'error');
    }
}

// function showMessage(text, type) {
//     const messageEl = document.getElementById('message');
//     messageEl.textContent = text;
//     messageEl.className = `message ${type} show`;

//     setTimeout(() => {
//         messageEl.classList.remove('show');
//     }, 3000);
// }

function showMessage(text, type) {
    const messageEl = document.getElementById('message');

    if (window.messageTimeout) {
        clearTimeout(window.messageTimeout);
    }

    messageEl.className = 'message';

    messageEl.textContent = text;

    void messageEl.offsetWidth;

    messageEl.className = `message ${type} show`;

    window.messageTimeout = setTimeout(() => {
        messageEl.classList.remove('show');
    }, 3000)
}

window.resetLibrary = async function() {
    if (!confirm('This will delete all current books and restore the default library. Are you sure?')) {
        return;
    }

    const defaultBooks = [
        { title: "The Great Gatsby", author: "F. Scott Fitzgerald", year: 1925, genre: "Fiction" },
        { title: "To Kill a Mockingbird", author: "Harper Lee", year: 1960, genre: "Fiction" },
        { title: "1984", author: "George Orwell", year: 1949, genre: "Science Fiction" },
        { title: "Pride and Prejudice", author: "Jane Austen", year: 1813, genre: "Romance" },
        { title: "The Catcher in the Rye", author: "J.D. Salinger", year: 1951, genre: "Fiction" },
        { title: "The Hobbit", author: "J.R.R. Tolkien", year: 1937, genre: "Fantasy" },
        { title: "Harry Potter and the Philosopher's Stone", author: "J.K. Rowling", year: 1997, genre: "Fantasy" },
        { title: "The Lord of the Rings", author: "J.R.R. Tolkien", year: 1954, genre: "Fantasy" }
    ];

    try {
        const response = await fetch(`${API_BASE_URL}/books`);
        const currentBooks = await response.json();

        for (const book of currentBooks) {
            await fetch(`${API_BASE_URL}/books/${book.id}`, { method: 'DELETE' });
        }

        for (const book of defaultBooks) {
            await fetch(`${API_BASE_URL}/books`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(book)
            });
        }

        showMessage('Library reset to default books!', 'success');
        loadAllBooks();
    } catch (error) {
        console.error('Error resetting library:', error);
        showMessage('Failed to reset library', 'error');
    }
}

window.debugCheck = function() {
    const container = document.getElementById('booksContainer');
    console.log('Container element:', container);
    console.log('Container innerHTML length:', container ? container.innerHTML.length : 'null');
    console.log('Number of book cards:', container ? container.querySelectorAll('.book-card').length : 0);
    console.log('Container computed height:', container ? window.getComputedStyle(container).height : 'null');
    console.log('Container parent:', container ? container.parentElement : 'null');

    const bookCards = document.querySelectorAll('.book-card');
    bookCards.forEach((card, index) => {
        const styles = window.getComputedStyle(card);
        console.log(`Book ${index + 1} visibility:`, styles.display, styles.visibility, styles.opacity);
    });

    alert(`Debug Info:\n- Container exists: ${!!container}\n- Number of book cards: ${bookCards.length}\n- Check console for details`);

}

console.log('Script.js loaded successfully!');