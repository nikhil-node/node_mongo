const express = require("express");
const tourController = require("../controllers/tourController");
const authController = require("../controllers/authController");

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
router.route("/tour-stat").get(tourController.getTourStat);
router.route("/tour-plan/:year").get(tourController.getMonthlyPlan);
router
  .route("/")
  .get(authController.protect, tourController.getAllTour)
  .post(tourController.createTour);

router
  .route("/:id")
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    tourController.deleteTour
  );

module.exports = router;
