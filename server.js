/* eslint-disable no-console */
const mongoose = require('mongoose');

const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
    console.log('UNCAUGHT EXCEPTION! Shutting down...');
    console.log(`Error: ${err.name}, Message: ${err.message}`);
    process.exit(1);
});

dotenv.config({ path: './config.env' });

const app = require('./app');

const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
    })
    .then(() => console.log('DATABASE CONNECTED'));

const port = process.env.PORT;
// Start the server, assign the port and a callback function as soon as the server starts listening.
const server = app.listen(port, () => {
    console.log(`App listening on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION! Shutting down...');
    console.log(`Error: ${err.name}, Message: ${err.message}, Stack: ${err.stack}`);
    server.close(() => {
        process.exit(1);
    });
});
