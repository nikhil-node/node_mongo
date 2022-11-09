/** static json file example */

//const fs = require("fs");
// const tour = JSON.parse(
//   fs.readFileSync(`${__dirname}/../text/tour-sample.json`, "utf-8")
// );

// // CheckId is middleware to check Id exist or not
// // used in > router.param
// exports.checkId = (req, res, next, val) => {
//   console.log(`Tour id is : ${val}`);
//   const Id = req.params.id * 1;
//   if (Id > tour.length) {
//     return res.status(404).json({
//       status: 404,
//       message: "tour not found-middleware",
//     });
//   }
//   next();
// };
// exports.dataValidation = (req, res, next) => {
//   if (!req.body.name && !req.body.price) {
//     return res.status(422).json({
//       status: 422,
//       message: "Data can not be blank",
//     });
//   }
//   next();
// };
// exports.getAllTour = (req, res) => {
//   res.status(200).json({
//     status: 200,
//     duration: res.duration - new Date().toISOString(),
//     count: tour.length,
//     data: tour,
//   });
// };

// exports.getTour = (req, res) => {
//   const id = req.params.id * 1;
//   const tourRec = tour.find((el) => el.id === id);
//   res.status(200).json({
//     status: 200,
//     data: tourRec,
//   });
// };
// exports.createTour = (req, res) => {
//   const Id = tour[tour.length - 1].id + 1;
//   const newTour = Object.assign({ id: Id }, req.body);

//   tour.push(newTour);
//   fs.writeFile(
//     `${__dirname}/text/tour-sample.json`,
//     JSON.stringify(tour),
//     (err) => {
//       res.status(201).json({
//         status: 201,
//         message: "Tour added successfully",
//         data: {
//           tour: newTour,
//         },
//       });
//     }
//   );
// };
// exports.updateTour = (req, res) => {
//   res.status(201).json({
//     status: 201,
//     message: "Tour updated successfully",
//   });
// };

/** Mongoose example */

const Tour = require("../models/tourModel");
const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchasync");
const AppError = require("../utils/appError");

exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);
  res.status(200).json({
    status: 200,
    data: {
      tour: newTour,
    },
  });
});

exports.getAllTour = catchAsync(async (req, res, next) => {
  /* Query string example-1 */
  // Filtering
  // const queryObj = { ...req.query };
  // const excludedFields = ["page", "limit", "sort", "fields"];

  // excludedFields.forEach((el) => delete queryObj[el]);

  // // Advance Filtering
  // let queryStr = JSON.stringify(queryObj);
  // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

  // let query = Tour.find(JSON.parse(queryStr));

  // Query Sorting
  // if (req.query.sort) {
  //   //Multiple field sorting togather
  //   const sortBy = req.query.sort.split(",").join(" ");
  //   query = query.sort(sortBy);
  // } else {
  //   query = query.sort("-createdAt");
  // }
  // Fields limiting
  // if (req.query.fields) {
  //   const fields = req.query.fields.split(",").join(" ");
  //   query = query.select(fields);
  // } else {
  //   query = query.select("-__v");
  // }

  //Pagination
  // const page = req.query.page * 1 || 1;
  // const limit = req.query.limit * 1 || 100;
  // const skip = (page - 1) * limit;

  // query = query.skip(skip).limit(limit);

  // //Throw an error if page not exist
  // if (req.query.page) {
  //   const numTours = await Tour.countDocuments();
  //   if (skip >= numTours) throw new Error("Page doesn`t exists");
  // }
  //Execute query using class
  const features = new APIFeatures(Tour, req.query)
    .filter()
    .sort()
    .limitFields()
    .pagination();

  const getAllTour = await features.query; // Using class
  //const getAllTour = await query; // Without class

  res.status(200).json({
    status: 200,
    results: getAllTour.length,
    data: {
      tour: getAllTour,
    },
  });
});
exports.getTour = catchAsync(async (req, res, next) => {
  const Id = req.params.id;
  const tour = await Tour.findById(Id).populate("reviews");

  if (!tour) {
    return next(new AppError("Tour not found with given ID", 404));
  }
  res.status(200).json({
    status: 200,
    data: {
      tour: tour,
    },
  });
});
exports.updateTour = catchAsync(async (req, res, next) => {
  const Id = req.params.id;
  const tourUpdate = await Tour.findByIdAndUpdate(Id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 200,
    message: "Tour updated successfully",
    data: {
      tour: tourUpdate,
    },
  });
});
exports.deleteTour = catchAsync(async (req, res, next) => {
  const Id = req.params.id;
  // eslint-disable-next-line no-unused-vars
  const del = await Tour.findByIdAndDelete(Id);
  res.status(200).json({
    status: 200,
    message: "Tour deleted successfully",
  });
});
// Tour stat
exports.getTourStat = catchAsync(async (req, res, next) => {
  const stat = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: "$difficulty",
        // _id: "$ratingsAverage",
        avgRating: { $avg: "$ratingsAverage" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
        totalTour: { $sum: 1 }, // get total
      },
    },
    {
      $sort: { totalTour: -1 },
    },
    // {
    //   $match: { _id: { $ne: "easy" } }, // Exclude easy difficulty
    // },
  ]);
  res.status(200).json({
    status: 200,
    data: {
      tour: stat,
    },
  });
});
exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: "$startDates", // unwind used to take first element of startDates array
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
        _id: { $month: "$startDates" },
        totalTours: { $sum: 1 },
        tour: { $push: "$name" },
      },
    },
    {
      $addFields: {
        month: "$_id",
      },
    },
    {
      $project: { _id: 0 },
    },
    {
      $sort: { month: 1 },
    },
    // {
    //   $limit: 6,
    // },
  ]);
  res.status(200).json({
    status: 200,
    data: {
      tour: plan,
    },
  });
});
