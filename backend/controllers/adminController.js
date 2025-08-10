const db = require("../config/db");
const { Parser } = require("json2csv");
const bcrypt = require("bcryptjs");

exports.getAllBookings = async (req, res) => {
  try {
    const [allBookings] = await db.query(`
  SELECT 
    b.id, 
    c.name, 
    c.phone, 
    s.name AS service, 
    ct.type, 
    b.date, 
    b.time, 
    b.status,
    ROUND(s.base_price * ct.price_multiplier, 2) AS total_price
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
exports.getDeletedBookings = async (req, res) => {
  try {
    const [allDeletedBookings] = await db.query(`
     SELECT 
    b.id, 
    c.name, 
    c.phone, 
    s.name AS service, 
    ct.type, 
    b.date, 
    b.time, 
    b.status,
    ROUND(s.base_price * ct.price_multiplier, 2) AS total_price
  FROM bookings b
  JOIN customers c ON b.customer_id = c.id
  JOIN services s ON b.service_id = s.id
  JOIN car_types ct ON b.car_type_id = ct.id
  WHERE b.is_deleted = TRUE
    `);

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

    await db.query("UPDATE bookings SET is_deleted = TRUE WHERE id = ?", [id]);

    res.json({ message: "Booking marked as deleted" });
  } catch (err) {
    console.error("Error deleting booking:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.generateReports = async (req, res) => {
  try {
    // Active bookings
    const [bookings] = await db.query(`
      SELECT 
        b.id, 
        c.name, 
        c.phone, 
        s.name AS service, 
        b.date, 
        b.time
      FROM bookings b
      JOIN customers c ON b.customer_id = c.id
      JOIN services s ON b.service_id = s.id
      WHERE b.is_deleted = FALSE
    `);

    // Deleted bookings
    const [deletedBookings] = await db.query(`
      SELECT 
        b.id, 
        c.name, 
        c.phone, 
        s.name AS service, 
        b.date, 
        b.time
      FROM bookings b
      JOIN customers c ON b.customer_id = c.id
      JOIN services s ON b.service_id = s.id
      WHERE b.is_deleted = TRUE
    `);

    const fields = ["id", "name", "phone", "service", "date", "time"];
    const parser = new Parser({ fields });

    const activeCSV = parser.parse(bookings);
    const deletedCSV = parser.parse(deletedBookings);

    let csvContent = "Active Bookings\n";
    csvContent += activeCSV + "\n\nDeleted Bookings\n" + deletedCSV;

    res.header("Content-Type", "text/csv");
    res.attachment("report.csv");
    res.send(csvContent);
  } catch (err) {
    console.error("Error generating report:", err);
    res.status(500).json({ message: "Failed to generate report" });
  }
};

exports.getAllWorkers = async (req, res) => {
  try {
    const [allWrokers] = await db.query(
      "SELECT * FROM users WHERE role = 'worker'"
    );

    res.json(allWrokers);
  } catch (err) {
    console.error("Error in getAllWorkers:", err); // Log full error
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getAllcustomers = async (req, res) => {
  try {
    const [allCustomers] = await db.query("SELECT * FROM customers");

    res.json(allCustomers);
  } catch (err) {
    console.error("Error in getAllCustomers:", err); // Log full error
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.addNewWorker = async (req, res) => {
  const { name, phone, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [existongWorker] = await db.query(
      "SELECT * FROM users WHERE username = ? AND phone = ? AND role = 'worker'",
      [name, phone]
    );

    if (existongWorker.length > 0) {
      res.json({ message: "Worker already exist" });
      return;
    }

    await db.query(
      "INSERT INTO users (username, phone, password) VALUES (?, ?, ?)",
      [name, phone, hashedPassword]
    );

    return res.json({ message: "Worker registered successfully!" });
  } catch (err) {
    console.error("Error in registering new worker:", err); // Log full error
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
