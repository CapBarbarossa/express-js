const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');

const port = process.env.PORT;
// Start the server, assign the port and a callback function as soon as the server starts listening.
app.listen(port, () => {
    console.log(
        `App listening on port ${port}...`
    );
});
