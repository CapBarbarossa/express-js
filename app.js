// It's conventional to have all express setup in app.js

// Import the express module
const express = require('express');

// Assign the express functions to app variable in order to use all express functions.
const app = express();

/**
 * We start defining @routes , which is how an application responds to client requests, so to a certain @url as well as the @HTTP @method
 *
 */

// Get request, the function handles the request
// app.get('URL', callbackFunction(req, res) {});
app.get('/', (req, res) => {
  res
    // Set the status, default is 200.
    .status(200)
    // Set the json response, which handles setting the headers and format data.
    .json({ message: 'Hello from the server side!', app: 'natours' });
});

// Post request, the function handles the request to the same url as the get request, but with a different result.
app.post('/', (req, res) => {
  res.send('You can post to this endpoint...');
});

const port = 3000;
// Start up the server, assign the port and a callback function as soon as the server starts listening.
app.listen(port, () => {
  console.log(`App listening on port ${port}...`);
});
