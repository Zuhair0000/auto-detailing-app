const db = require("../config/db");

exports.getBookings = async (req, res) => {
  try {
    const [allBookings] = await db.query("SELECT * from bookings");

    res.json(allBookings);
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ message: "Time slot already booked." });
    }
    res.status(500).json({ message: "Server error", error: err });
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
