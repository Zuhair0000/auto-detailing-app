const express = require("express");
const db = require("../config/db");

const router = express.Router();
const {
  book,
  getAvailableSlots,
  getAllServices,
  getCarTypes,
  getPrice,
  getServicesWithCarTypes,
  getCustomerBookings,
} = require("../controllers/customerController");
const { verifyCustomer, authMiddleware } = require("../middleware/auth");

router.post("/booking", book);
router.get(
  "/booking/:id",
  authMiddleware(["customer"]),
  verifyCustomer,
  getCustomerBookings
);
router.get("/available-slots", getAvailableSlots);
router.get("/services", getAllServices);
router.get("/cartypes", getCarTypes);
router.get("/getprice", getPrice);
router.get("/homeservices", getServicesWithCarTypes);
router.get("/me", verifyCustomer, async (req, res) => {
  try {
    const customerId = req.customer?.customerId;
    if (!customerId) {
      return res
        .status(400)
        .json({ message: "Customer ID not found in request" });
    }

    const [rows] = await db.query("SELECT * FROM customers WHERE id = ?", [
      customerId,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching customer:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
