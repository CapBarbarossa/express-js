const fs = require('fs');

const mongoose = require('mongoose');

const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const Tour = require('../../models/tour-model');
const User = require('../../models/user-model');
const Review = require('../../models/review-model');

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

// Ready JSON file

const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/tours.json`, 'utf8')
);

const users = JSON.parse(
    fs.readFileSync(`${__dirname}/users.json`, 'utf8')
);

const reviews = JSON.parse(
    fs.readFileSync(`${__dirname}/reviews.json`, 'utf8')
);

const importData = async () => {
    try {
        await Tour.create(tours);
        await User.create(users, { validateBeforeSave: false });
        await Review.create(reviews, {validateBeforeSave : false});
        console.log('Data Created');
    } catch (err) {
        console.log(err);
    }
    process.exit();
};

const deleteData = async () => {
    try {
        await Tour.deleteMany();
        await User.deleteMany();
        await Review.deleteMany();
        console.log('Data Deleted');
    } catch (err) {
        console.log(err);
    }
    process.exit();
};

if (process.argv[2] === '--import') {
    importData();
} else if (process.argv[2] === '--delete') {
    deleteData();
}
