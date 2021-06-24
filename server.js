const mongoose = require('mongoose');

const dotenv = require('dotenv');

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
app.listen(port, () => {
    console.log(`App listening on port ${port}...`);
});
