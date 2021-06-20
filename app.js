// It's conventional to have all express setup in app.js

// Import the express module
const express = require('express');

// Import Morgan module, it's a good module for logging information about a certain request.
const morgan = require('morgan');

// Assign the express functions to app variable in order to use all express functions.
const app = express();

// Import the routers.

const tourRouter = require('./routes/tour-routes');
const userRouter = require('./routes/user-routes');

/**
 * Adding @Middleware to the app.
 * Middleware is a function that can modify the incoming request data.
 * Stands between requests and responses
 * It's a step that the request goes through while it's being processed, and that would be adding the data to the request from the body.
 * Every request in the cycle goes through all middleware in the order there're defined.
 */
app.use(express.json());

// Example log : GET /api/v1/tours 200 3.001 ms - 8640
app.use(morgan('dev'));

// In order to serve static files into the app like HTML that's in the public folder, we need to use the Static middleware.
app.use(
    express.static(
        `${__dirname}/public`
    )
);

/**
 * We can create our own middleware by using the app.use method.
 * The 3rd @param is alway @next
 */
app.use((req, res, next) => {
    console.log(
        'Hello from the middleware 👋'
    );
    // we have to always call the next() function.
    next();
});

app.use((req, res, next) => {
    //Gets time of request.
    req.requestTime =
        new Date().toISOString();
    next();
});

/**
 * We start defining @routes , which is how an application responds to client requests, so to a certain @url as well as the @HTTP @method
 *
 */

// // Get request, the function handles the request
// // app.get('URL', route handler {});
// app.get('/', (req, res) => {
//   res
//     // Set the status, default is 200.
//     .status(200)
//     // Set the json response, which handles setting the headers and format data.
//     .json({ message: 'Hello from the server side!', app: 'natours' });
// });

// // Post request, the function handles the request to the same url as the get request, but with a different result.
// app.post('/', (req, res) => {
//   res.send('You can post to this endpoint...');
// });

/**
 * @Get request for tours
 */
// app.get('/api/v1/tours', getAllTours);

/**
 * @Get request for a tour with ID
 * the /:x is a variable we can use.
 * we can do "/x/y/z?", the ? marks a parameter as optional
 */
// app.get('/api/v1/tours/:id', getTourById);

/**
 * @POST request for a tour
 * */
// app.post('/api/v1/tours', createTour);

/**
 * @PATCH request for a tour
 * Patch request expects only the properies that should be updated in the object.
 * @PUT requests expect the entire object to be updated.
 */
// app.patch('/api/v1/tours/:id', updateTour);

/**
 * @DELETE request for a tour
 */
// app.delete('/api/v1/tours/:id', deleteTour);

// By using this middleware, we are defining a route-specific midlleware that only works on this URL after the rest of the middleware
app.use('/api/v1/tours', tourRouter);

app.use('/api/v1/users', userRouter);

// -------------------------------------------------------

module.exports = app;
