// src/server.js
const Hapi = require('@hapi/hapi');
const routes = require('./routes/books');  // Import routes dari books.js

const init = async () => {
    const server = Hapi.server({
        port: 9000,
        host: 'localhost',
    });

    server.route(routes);  // Menghubungkan route ke server
    return server;  // Mengembalikan server tanpa memulai server
};

// Menjalankan server jika file ini dieksekusi secara langsung
if (require.main === module) {
    (async () => {
        const server = await init();
        await server.start();
        console.log('Server running on %s', server.info.uri);
    })();
}

module.exports = init;
