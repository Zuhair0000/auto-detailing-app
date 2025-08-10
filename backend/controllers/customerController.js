const db = require("../config/db");

exports.book = async (req, res) => {
  const { name, phone, service_id, car_type, date, time } = req.body;

  try {
    // 🔹 Check for existing booking (not deleted)
    const [existing] = await db.query(
      `SELECT * FROM bookings 
       WHERE service_id = ? AND date = ? AND time = ? AND is_deleted = FALSE`,
      [service_id, date, time]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        message: "This service is already booked, Try another time!",
      });
    }

    // 🔹 Get service base price
    const [[serviceData]] = await db.query(
      "SELECT base_price FROM services WHERE id = ?",
      [service_id]
    );
    if (!serviceData)
      return res.status(400).json({ message: "Service not found" });

    // 🔹 Find or create customer
    const [[existingCustomer]] = await db.query(
      "SELECT id FROM customers WHERE name = ? AND phone = ?",
      [name, phone]
    );

    let customer_id;
    if (existingCustomer) {
      customer_id = existingCustomer.id;
    } else {
      const [result] = await db.query(
        "INSERT INTO customers (name, phone) VALUES (?, ?)",
        [name, phone]
      );
      customer_id = result.insertId;
    }

    // 🔹 Insert booking with customer_id
    await db.query(
      `INSERT INTO bookings 
      (customer_id, service_id, car_type_id, date, time, is_deleted) 
      VALUES (?, ?, ?, ?, ?, FALSE)`,
      [customer_id, service_id, car_type, date, time]
    );

    res.json({ message: "Booking created" });
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
};

// Generate timeslots
const generateTimeSlots = (start = 9, end = 21) => {
  const slots = [];
  for (let hour = start; hour < end; hour++) {
    slots.push(`${hour.toString().padStart(2, "0")}:00:00`);
  }
  return slots;
};

// Example: /api/customer/me

// Get available times
exports.getAvailableSlots = async (req, res) => {
  const { date, service } = req.query;

  if (!date || !service) {
    return res.status(400).json({ message: "Date and Service are required" });
  }

  try {
    const allSlots = generateTimeSlots();

    const [rows] = await db.query(
      `SELECT time FROM bookings 
       WHERE date = ? AND service_id = ? AND is_deleted = FALSE`,
      [date, service]
    );
    const bookedTimes = rows.map((row) => row.time);

    const availableSlots = allSlots.filter(
      (time) => !bookedTimes.includes(time)
    );
    res.json({ slots: availableSlots });
  } catch (err) {
    console.error("Error fetching slots:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all services
exports.getAllServices = async (req, res) => {
  try {
    const [services] = await db.query("SELECT * FROM services");
    res.json(services);
  } catch (err) {
    console.error("Error fetching services:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all car types
exports.getCarTypes = async (req, res) => {
  try {
    const [car_types] = await db.query("SELECT * FROM car_types");
    res.json(car_types);
  } catch (err) {
    console.error("Error fetching car types:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get calculated price
exports.getPrice = async (req, res) => {
  const { service, car_type } = req.query;
  try {
    const [[serviceData]] = await db.query(
      "SELECT base_price FROM services WHERE id = ?",
      [service]
    );
    if (!serviceData)
      return res.status(400).json({ message: "Service not found" });

    const [[carTypeData]] = await db.query(
      "SELECT price_multiplier FROM car_types WHERE id = ?",
      [car_type]
    );
    if (!carTypeData)
      return res.status(400).json({ message: "Car type not found" });

    const finalPrice = (
      serviceData.base_price * carTypeData.price_multiplier
    ).toFixed(2);
    res.json({ price: finalPrice });
  } catch (error) {
    console.error("Price calculation error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all services with all car type combinations
exports.getServicesWithCarTypes = async (req, res) => {
  try {
    const [services] = await db.query(
      "SELECT id, name, base_price FROM services"
    );
    const [carTypes] = await db.query(
      "SELECT id, type, price_multiplier FROM car_types"
    );

    const servicesWithCarTypes = services.map((service) => ({
      ...service,
      carTypes: carTypes.map((carType) => ({
        id: carType.id,
        name: carType.type,
        price: service.base_price * carType.price_multiplier,
      })),
    }));

    res.json(servicesWithCarTypes);
  } catch (err) {
    console.error("Error fetching services with car types:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET /api/bookings/customer/:customerId
exports.getCustomerBookings = async (req, res) => {
  try {
    console.log("Request params:", req.params);
    console.log("Request customer info:", req.customer);

    const { id } = req.params;

    if (parseInt(id) != req.customer.customerId) {
      console.log("Forbidden access attempt");
      return res.status(403).json({ message: "Forbidden" });
    }

    console.log("Running DB query...");

    const [rows] = await db.query(
      "SELECT * FROM bookings WHERE customer_id = ?",
      [id]
    );

    console.log("Query result:", rows);

    res.json(rows);
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ message: "Server error" });
  }
};
