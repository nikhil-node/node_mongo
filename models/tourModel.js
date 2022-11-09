const mongoose = require("mongoose");
const slugify = require("slugify");
// const User = require("./userModel");
const tourSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name"],
      unique: true,
      trim: true,
      maxlength: [40, "A tour name must have less or equal then 40 characters"],
      minlength: [10, "A tour name must have more or equal then 10 characters"],
      // validate: [validator.isAlpha, 'Tour name must only contain characters']
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, "A tour must have a duration"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have a group size"],
    },
    difficulty: {
      type: String,
      required: [true, "A tour must have a difficulty"],
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "Difficulty is either: easy, medium, difficult",
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "A tour must have a price"],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // this only points to current doc on NEW document creation
          return val < this.price;
        },
        message: "Discount price ({VALUE}) should be below regular price",
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, "A tour must have a description"],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, "A tour must have a cover image"],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secreteTour: {
      type: Boolean,
      default: false,
    },
    // guides: Array, // for embadded schema example
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ], // Reference schema example
    startLocation: {
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: ["Number"],
      address: String,
      description: String,
    },
    locations: {
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: ["Number"],
      address: String,
      description: String,
      day: Number,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});
tourSchema.virtual("reviews", {
  ref: "review",
  foreignField: "tour",
  localField: "_id",
});
//Document Middleware befor save and Create
tourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
// Embadded schema example
// tourSchema.pre("save", async function (next) {
//   const guidePromise = this.guides.map(async (id) => await User.findById(id));
//   this.guides = await Promise.all(guidePromise);
//   next();
// });
//Query Middleware
tourSchema.pre("/^find/", function (next) {
  //Apply for all find method i.e find,findOne,findAndDelete etc
  //tourSchema.pre("find", function (next) { // Apply for find method only
  this.find({ secreteTour: { $ne: true } });
  next();
});
tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: "guides",
    select: "-__v -passwordChangedAt", //Exclude fields from relation data object
  });
  next();
});
// Apply after receiving data
tourSchema.post("/^find/", (docs, next) => {
  next();
});
//Aggrigation middleware
tourSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { secreteTour: { $ne: true } } });
  next();
});
const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
