const { nanoid } = require('nanoid');
const books = require('../models/books.js');

// Handler untuk menambahkan buku
const addBookHandler = (request, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

    // Validasi jika nama buku tidak diisi
    if (!name) {
        return h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        }).code(400);
    }

    // Validasi jika readPage lebih besar dari pageCount
    if (readPage > pageCount) {
        return h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        }).code(400);
    }

    // Membuat buku baru
    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = pageCount === readPage;

    const newBook = {
        id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt,
    };

    books.push(newBook);

    // Buku berhasil ditambahkan
    return h.response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
            bookId: id,
        },
    }).code(201);
};

// Handler untuk mendapatkan semua buku
const getAllBooksHandler = (request, h) => {
    let filteredBooks = books;

    // Mengambil query parameter dari request
    const { name, reading, finished } = request.query;

    // Filter berdasarkan nama buku (case-insensitive)
    if (name !== undefined) {
        filteredBooks = filteredBooks.filter((book) =>
            book.name.toLowerCase().includes(name.toLowerCase())
        );
    }

    // Filter berdasarkan status membaca (reading)
    if (reading !== undefined) {
        const isReading = reading === '1';  // 1 untuk true, 0 untuk false
        filteredBooks = filteredBooks.filter((book) => book.reading === isReading);
    }

    // Filter berdasarkan status selesai dibaca (finished)
    if (finished !== undefined) {
        const isFinished = finished === '1';  // 1 untuk true, 0 untuk false
        filteredBooks = filteredBooks.filter((book) => book.finished === isFinished);
    }

    // Mengembalikan respons dengan hanya id, name, dan publisher
    const response = h.response({
        status: 'success',
        data: {
            books: filteredBooks.map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher,
            })),
        },
    });
    response.code(200);
    return response;
};





// Handler untuk mendapatkan buku berdasarkan ID
const getBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const book = books.find((b) => b.id === bookId);

    // Jika buku tidak ditemukan
    if (!book) {
        return h.response({
            status: 'fail',
            message: 'Buku tidak ditemukan',
        }).code(404);
    }

    // Jika buku ditemukan
    return {
        status: 'success',
        data: {
            book,
        },
    };
};

// Handler untuk memperbarui buku berdasarkan ID
const updateBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

    const bookIndex = books.findIndex((b) => b.id === bookId);

    // Jika buku tidak ditemukan
    if (bookIndex === -1) {
        return h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Id tidak ditemukan',
        }).code(404);
    }

    // Validasi jika nama buku tidak diisi
    if (!name) {
        return h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        }).code(400);
    }

    // Validasi jika readPage lebih besar dari pageCount
    if (readPage > pageCount) {
        return h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        }).code(400);
    }

    // Memperbarui buku
    books[bookIndex] = {
        ...books[bookIndex],
        name, year, author, summary, publisher, pageCount, readPage, reading,
        finished: pageCount === readPage,
        updatedAt: new Date().toISOString(),
    };

    return h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
    }).code(200);
};

// Handler untuk menghapus buku berdasarkan ID
const deleteBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const bookIndex = books.findIndex((b) => b.id === bookId);

    // Jika buku tidak ditemukan
    if (bookIndex === -1) {
        return h.response({
            status: 'fail',
            message: 'Buku gagal dihapus. Id tidak ditemukan',
        }).code(404);
    }

    // Menghapus buku dari array
    books.splice(bookIndex, 1);

    return h.response({
        status: 'success',
        message: 'Buku berhasil dihapus',
    }).code(200);
};

module.exports = {
    addBookHandler,
    getAllBooksHandler,
    getBookByIdHandler,
    updateBookByIdHandler,
    deleteBookByIdHandler
};
