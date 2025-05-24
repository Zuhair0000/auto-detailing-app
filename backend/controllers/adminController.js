const db = require("../config/db");
const { Parser } = require("json2csv");

exports.getAllBookings = async (req, res) => {
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

exports.getDeletedBookings = async (req, res) => {
  try {
    const [allDeletedBookings] = await db.query(
      "SELECT * FROM deleted_bookings"
    );

    res.json(allDeletedBookings);
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ message: "Time slot already booked." });
    }
    res.status(500).json({ message: "Server error", error: err });
  }
};

exports.deleteBooking = async (req, res) => {
  const { id } = req.params;

  try {
    const [bookings] = await db.query("SELECT * FROM bookings WHERE id = ?", [
      id,
    ]);

    if (bookings.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }
    const booking = bookings[0];

    console.log("Deleting booking:", booking);

    await db.query(
      "INSERT INTO deleted_bookings (name, phone, service, car_type, date, time) VALUES (?, ?, ?, ?, ?, ?)",
      [
        booking.name,
        booking.phone,
        booking.service,
        booking.car_type,
        booking.date,
        booking.time,
      ]
    );

    await db.query("DELETE FROM bookings WHERE id = ?", [id]);
  } catch (err) {
    console.log("Error deleteing: ", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.generateReports = async (req, res) => {
  try {
    const [bookings] = await db.query("SELECT * FROM bookings");
    const [deletedBookings] = await db.query("SELECT * FROM deleted_bookings");

    // const allBookings = [...bookings, ...deletedBookings];

    let csvContent = "Active Bookings\n";

    const fields = ["id", "name", "phone", "service", "date", "time"];
    const active = new Parser({ fields }).parse(bookings);
    const deleted = new Parser({ fields }).parse(deletedBookings);
    // const csv = parser.parse(allBookings);

    csvContent += active + "\n\nDeleted Bookings\n" + deleted;

    res.header("Content-Type", "text/csv");
    res.attachment("report.csv");
    res.send(csvContent);
  } catch (err) {
    res.status(500).json({ message: "Failed to generate report" });
  }
};
