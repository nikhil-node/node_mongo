const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Tour = require("../models/tourModel");
const User = require("../models/userModel");
const Review = require("../models/reviewModel");

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Coonection successful");
  });
/** READ JSON FILE */
const tours = JSON.parse(
  //fs.readFileSync(`${__dirname}/tour-sample.json`, "utf-8")
  fs.readFileSync(`${__dirname}/tours.json`, "utf-8")
);
const users = JSON.parse(
  //fs.readFileSync(`${__dirname}/tour-sample.json`, "utf-8")
  fs.readFileSync(`${__dirname}/users.json`, "utf-8")
);
const reviews = JSON.parse(
  //fs.readFileSync(`${__dirname}/tour-sample.json`, "utf-8")
  fs.readFileSync(`${__dirname}/reviews.json`, "utf-8")
);
/** Import data into database */
const importData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    console.log("all data loaded into database");
    process.exit();
  } catch (err) {
    console.log(err);
  }
};
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log("all data deleted");
    process.exit();
  } catch (err) {
    console.log(err);
  }
};
if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}
console.log(process.argv);
