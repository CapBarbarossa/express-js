// Define a class with API Features so it can be exported and modulated.
class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filter() {
        // 1A) FILTERING
        // eslint-disable-next-line node/no-unsupported-features/es-syntax
        const queryObj = { ...this.queryString };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach((el) => delete queryObj[el]);

        // 1B) ADVANCED FILTERING
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(
            /\b(gte|gt|lte|lt)\b/g,
            (match) => `$${match}`
        );

        this.query = this.query.find(JSON.parse(queryStr));

        return this;
    }

    sort() {
        // 2) SORTING
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort('-createdAt');
        }
        return this;
    }

    limitFields() {
        // 3) Field Limiting
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select('-__v');
        }

        return this;
    }

    paginate() {
        // 4) PAGINATION (Selecting page number and number of documents in a page.)

        const DEFAULT_PAGE_NUM = 1;
        const DEFAULT_RESULT_LIMIT = 100;

        const page = this.queryString.page * 1 || DEFAULT_PAGE_NUM;
        const limit = this.queryString.limit * 1 || DEFAULT_RESULT_LIMIT;
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);

        return this;
    }
}

module.exports = APIFeatures;
