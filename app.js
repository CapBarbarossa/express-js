// It's conventional to have all express setup in app.js

// Import the express module
const express = require('express');
// Import the fs module
const fs = require('fs');
// Import Morgan module, it's a good module for logging information about a certain request.
const morgan = require('morgan');

// Assign the express functions to app variable in order to use all express functions.
const app = express();

// files
const TOURS_SIMPLE_FILE = `${__dirname}/dev-data/data/tours-simple.json`;

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

/**
 * We can create our own middleware by using the app.use method.
 * The 3rd @param is alway @next
 */
app.use((req, res, next) => {
  console.log('Hello from the middleware ❤');
  // we have to always call the next() function.
  next();
});

app.use((req, res, next) => {
  //Gets time of request.
  req.requestTime = new Date().toISOString();
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

const tours = JSON.parse(fs.readFileSync(TOURS_SIMPLE_FILE));

/**
 * Define all @routeHandlers all together.
 */

// Route handlers for tours

const getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
};

const getTourById = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);

  //   if (id > tours.length) {
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'invalid id',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

const createTour = (req, res) => {
  //req.body is what we have access to because we added middleware.
  //   console.log(req.body);

  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);
  fs.writeFile(TOURS_SIMPLE_FILE, JSON.stringify(tours), (err) => {
    // Status 201 means 'created'
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  });
};

const updateTour = (req, res) => {
  // This is just more of the same code, we take the id, find the tour, and make the changes, then save the file again.

  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'invalid id',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...',
    },
  });
};

const deleteTour = (req, res) => {
  // This is just more of the same code, we take the id, find the tour, and make the changes, then save the file again.

  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'invalid id',
    });
  }

  // 204 means no content.
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

// Route handlers for users

const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

const getUserById = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

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

/**
 * Another way to gather all actions and routes and make the code easier to maintain is to use the @route function of @app.
 */

// Routes for tours
app.route('/api/v1/tours').get(getAllTours).post(createTour);

app
  .route('/api/v1/tours/:id')
  .get(getTourById)
  .patch(updateTour)
  .delete(deleteTour);

// Routs for users.

app.route('/api/v1/users').get(getAllUsers).post(createUser);

app
  .route('/api/v1/users/:id')
  .get(getUserById)
  .patch(updateUser)
  .delete(deleteUser);

// -------------------------------------------------------

const port = 3000;
// Start up the server, assign the port and a callback function as soon as the server starts listening.
app.listen(port, () => {
  console.log(`App listening on port ${port}...`);
});
