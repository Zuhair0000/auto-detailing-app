const express = require("express");
const {
  updateBookingStatus,
  getBookings,
} = require("../controllers/WorkerController");
const { authMiddleware } = require("../middleware/auth");
const router = express.Router();

router.get("/bookings", authMiddleware(["worker"]), getBookings);
router.put(
  "/bookings/:id/status",
  authMiddleware(["worker"]),
  updateBookingStatus
);

module.exports = router;
