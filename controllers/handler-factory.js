const catchAsync = require('../utils/catch-async');
const AppError = require('../utils/app-error');
const APIFeatures = require('../utils/api-features');

exports.deleteOne = (Model) =>
    catchAsync(async (req, res, next) => {
        // This is just more of the same code, we take the id, find the tour, and make the changes, then save the file again.
        const doc = await Model.findByIdAndDelete(req.params.id);

        if (!doc) {
            return next(new AppError('No document found with that ID', 404));
        }

        // 204 means no content.
        res.status(204).json({
            status: 'success',
            data: null,
        });
    });

exports.updateOne = (Model) =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!doc) {
            return next(new AppError('No document found with that ID', 404));
        }

        res.status(200).json({
            status: 'success',
            data: {
                doc,
            },
        });
    });

exports.createOne = (Model) =>
    catchAsync(async (req, res, next) => {
        const newDoc = await Model.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                document: newDoc,
            },
        });

        // next();
    });

exports.getOne = (Model, popOptions) =>
    catchAsync(async (req, res, next) => {
        let query = Model.findById(req.params.id);
        if (popOptions) query = query.populate(popOptions);
        const doc = await query;

        if (!doc) {
            return next(new AppError('No document found with that ID', 404));
        }

        res.status(200).json({
            status: 'success',
            data: {
                doc,
            },
        });

        // next();
    });

exports.getAll = (Model) =>
    catchAsync(async (req, res, next) => {

        // To allow for nested get Reviews on tour
        let filter = {};
        if (req.params.tourId) filter = { tour: req.params.tourId };

        // BUILD QUERY
        const features = new APIFeatures(Model.find(filter), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();

        // EXECUTE QUERY

        const docs = await features.query;

        res.status(200).json({
            status: 'success',
            results: docs.length,
            data: {
                docs,
            },
        });

        // next();
    });

