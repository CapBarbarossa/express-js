// Import the fs module
const fs = require('fs');

// files
const TOURS_SIMPLE_FILE = `${__dirname}/../dev-data/data/tours-simple.json`;

// Read json files
const tours = JSON.parse(
    fs.readFileSync(TOURS_SIMPLE_FILE)
);

exports.checkID = (
    req,
    res,
    next,
    val
) => {
    if (
        req.params.id * 1 >
        tours.length
    ) {
        return res.status(404).json({
            status: 'fail',
            message: 'invalid id',
        });
    }
    next();
};

exports.checkBody = (
    req,
    res,
    next
) => {
    if (
        !req.body.name ||
        !req.body.price
    ) {
        return res.status(404).json({
            status: 'fail',
            message:
                'missing name or price',
        });
    }
    next();
};

/**
 * Define all @routeHandlers all together.
 */

// Route handlers for tours

exports.getAllTours = (req, res) => {
    console.log(req.requestTime);
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours,
        },
    });
};

exports.getTourById = (req, res) => {
    res.status(200).json({
        status: 'success',
        data: {
            tour,
        },
    });
};

exports.createTour = (req, res) => {
    //req.body is what we have access to because we added middleware.
    //   console.log(req.body);

    const newId =
        tours[tours.length - 1].id + 1;
    const newTour = Object.assign(
        { id: newId },
        req.body
    );

    tours.push(newTour);
    fs.writeFile(
        TOURS_SIMPLE_FILE,
        JSON.stringify(tours),
        (err) => {
            // Status 201 means 'created'
            res.status(201).json({
                status: 'success',
                data: {
                    tour: newTour,
                },
            });
        }
    );
};

exports.updateTour = (req, res) => {
    // This is just more of the same code, we take the id, find the tour, and make the changes, then save the file again.

    res.status(200).json({
        status: 'success',
        data: {
            tour: '<Updated tour here...',
        },
    });
};

exports.deleteTour = (req, res) => {
    // This is just more of the same code, we take the id, find the tour, and make the changes, then save the file again.

    // 204 means no content.
    res.status(204).json({
        status: 'success',
        data: null,
    });
};
