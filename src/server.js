const Hapi = require('@hapi/hapi');
const routes = require('./routes/books');  // Import routes dari books.js

const init = async () => {
    const server = Hapi.server({
        port: 9000,
        host: 'localhost',
    });

    server.route(routes);  // Menghubungkan route ke server

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();
