const db = require("../config/db");

exports.book = async (req, res) => {
  const { name, phone, service, car_type, date, time } = req.body;

  try {
    const [result] = await db.query(
      "INSERT INTO bookings (name, phone, service, car_type, date, time) VALUES (?, ?, ?, ?, ?, ?)",
      [name, phone, service, car_type, date, time]
    );

    res.json("Booking created");
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ message: "Time slot already booked." });
    }
    res.status(500).json({ message: "Server error", error: err });
  }
};
