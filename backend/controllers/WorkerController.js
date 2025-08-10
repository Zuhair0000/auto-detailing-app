const db = require("../config/db");

exports.getBookings = async (req, res) => {
  try {
    const [allBookings] = await db.query(`
      SELECT b.id, c.name, c.phone, s.name AS service, ct.type, b.date, b.time, b.status, ROUND(s.base_price * ct.price_multiplier, 2) AS total_price
      FROM bookings b
      JOIN customers c ON b.customer_id = c.id 
      JOIN services s ON b.service_id = s.id
      JOIN car_types ct ON b.car_type_id = ct.id
      WHERE b.is_deleted = FALSE
    `);

    res.json(allBookings);
  } catch (err) {
    console.error("Error in getAllBookings:", err); // Log full error
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.updateBookingStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    await db.query("UPDATE bookings SET status = ? WHERE id = ?", [status, id]);
    res.json({ message: "Status updated Successfully" });
  } catch (err) {
    console.log("Error updating status: ", err);
    res.status(500).json({ error: "Failed to update status" });
  }
};
