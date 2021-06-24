// Import the tour model
const Tour = require('../models/tour-model');
const APIFeatures = require('../utils/api-features');

exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
};

/**
 * Define all @routeHandlers all together.
 */

// Route handlers for tours

exports.getAllTours = async (req, res) => {
    try {
        // BUILD QUERY

        const features = new APIFeatures(Tour.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();

        // EXECUTE QUERY

        const tours = await features.query;

        res.status(200).json({
            status: 'success',
            results: tours.length,
            data: {
                tours,
            },
        });
    } catch (err) {
        res.status(404).json({
            status: 'failed',
            message: err,
        });
    }
};

exports.getTourById = async (req, res) => {
    try {
        // Tour.findOne({ _id: req.params.id });
        const tour = await Tour.findById(req.params.id);
        res.status(200).json({
            status: 'success',
            data: {
                tour,
            },
        });
    } catch (err) {
        res.status(404).json({
            status: 'failed',
            message: err,
        });
    }
};

exports.createTour = async (req, res) => {
    try {
        const newTour = await Tour.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: 'error',
            message: 'Invalid data sent',
        });
    }
};

exports.updateTour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        res.status(200).json({
            status: 'success',
            data: {
                tour,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: 'error',
            message: err,
        });
    }
};

exports.deleteTour = async (req, res) => {
    // This is just more of the same code, we take the id, find the tour, and make the changes, then save the file again.
    try {
        const tour = await Tour.findByIdAndRemove(req.params.id);
        // 204 means no content.
        res.status(200).json({
            status: 'success',
            tour,
        });
    } catch (err) {
        res.status(400).json({
            status: 'failed',
            message: err,
        });
    }
};

exports.getTourStats = async (req, res) => {
    try {
        const stats = await Tour.aggregate([
            {
                $match: { ratingsAvarage: { $gte: 4.5 } },
            },
            {
                $group: {
                    // We can use the _id as the basis of analysis, if we put difficulty for example, it's going to show data based on that.
                    _id: { $toUpper: '$difficulty' },
                    numOfTours: { $sum: 1 },
                    numOfRatings: { $sum: '$ratingsQuantity' },
                    avgRating: { $avg: '$ratingsAvarage' },
                    avgPrice: { $avg: '$price' },
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' },
                },
            },
            {
                $sort: { avgPrice: 1 },
            },
            // {
            // We can repeat stages of aggregation
            // $match: { _id: { $ne: 'EASY' } },
            // },
        ]);

        res.status(200).json({
            status: 'success',
            data: {
                stats,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: 'failed',
            message: err,
        });
    }
};

exports.getMonthlyPlan = async (req, res) => {
    try {
        const year = req.params.year * 1; // 2021

        const plan = await Tour.aggregate([
            {
                $unwind: '$startDates',
            },
            {
                $match: {
                    startDates: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`),
                    },
                },
            },
            {
                $group: {
                    _id: { $month: '$startDates' },
                    numOfTours: { $sum: 1 },
                    tours: {
                        $push: {
                            name: '$name',
                            duration: '$duration',
                        },
                    },
                },
            },
            {
                $addFields: {
                    month: '$_id',
                },
            },
            {
                $project: {
                    _id: 0,
                },
            },
            {
                $sort: {
                    month: 1,
                    // numOfTours: -1,
                },
            },
            {
                $limit: 12,
            },
        ]);

        res.status(200).json({
            status: 'success',
            count: plan.length,
            data: {
                plan,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: 'failed',
            message: err,
        });
    }
};

// exports.getMonthlyPlan = async (req, res) => {
//     try {
//         const year = req.params.year * 1; // 2021

//         const plan = await Tour.aggregate([
//             {
//                 $unwind: '$startDates',
//             },
//             {
//                 $match: {
//                     startDates: {
//                         $gte: new Date(`${year}-01-01`),
//                         $lte: new Date(`${year}-12-31`),
//                     },
//                 },
//             },
//             {
//                 $group: {
//                     _id: { $month: '$startDates' },
//                     numTourStarts: { $sum: 1 },
//                     tours: { $push: '$name' },
//                 },
//             },
//             {
//                 $addFields: { month: '$_id' },
//             },
//             {
//                 $project: {
//                     _id: 0,
//                 },
//             },
//             {
//                 $sort: { numTourStarts: -1 },
//             },
//             {
//                 $limit: 12,
//             },
//         ]);

//         res.status(200).json({
//             status: 'success',
//             data: {
//                 plan,
//             },
//         });
//     } catch (err) {
//         res.status(404).json({
//             status: 'fail',
//             message: err,
//         });
//     }
// };
