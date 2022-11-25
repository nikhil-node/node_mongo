const express = require("express");
const tourController = require("../controllers/tourController");
const authController = require("../controllers/authController");
const reviewController = require("../controllers/reviewController");
const reviewRouter = require("./reviewRouter");
const router = express.Router(); // mounting router example step-1

/* Static json file example */
// router.param("id", tourController.checkId);

// router
//   .route("/")
//   .get(tourController.getAllTour)
//   .post(tourController.dataValidation, tourController.createTour); // mounting router example step-2
// router
//   .route("/:id")
//   .get(tourController.getTour)
//   .patch(tourController.updateTour);

/* Mongoose example */
// router.route(
//   "/:tourId/review",
//   authController.protect,
//   authController.restrictTo("user"),
//   reviewController.createReview
// );
router.use("/:tourId/review", reviewRouter);
router.route("/tour-stat").get(tourController.getTourStat);
router.route("/tour-plan/:year").get(tourController.getMonthlyPlan);
//Geospatial tour - tour withing your given range
router
  .route("/tour-within/:distance/center/:latlng/unit/:unit")
  .get(tourController.getToursWithin);
router
  .route("/tour-distance/:latlng/unit/:unit")
  .get(tourController.getDistance);
router
  .route("/")
  .get(authController.protect, tourController.getAllTour)
  .post(tourController.createTour);

router
  .route("/:id")
  .get(tourController.getTour)
  .patch(
    tourController.uploadTourImage,
    tourController.resizeTourImage,
    tourController.updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    tourController.deleteTour
  );

module.exports = router;
