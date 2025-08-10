const express = require("express");
const {
  getAllBookings,
  getDeletedBookings,
  deleteBooking,
  generateReports,
  getAllWorkers,
  getAllcustomers,
  addNewWorker,
} = require("../controllers/adminController");

const { authMiddleware } = require("../middleware/auth");
// adjust path if needed

const router = express.Router();

router.get("/bookings", authMiddleware(["admin"]), getAllBookings);
router.get("/bookings/deleted", authMiddleware(["admin"]), getDeletedBookings);
router.delete("/bookings/:id", authMiddleware(["admin"]), deleteBooking);
router.get("/report", authMiddleware(["admin"]), generateReports);
router.get("/allWorkers", authMiddleware(["admin"]), getAllWorkers);
router.get("/allCustomers", authMiddleware(["admin"]), getAllcustomers);
router.post("/addWorker", authMiddleware(["admin"]), addNewWorker);

module.exports = router;
