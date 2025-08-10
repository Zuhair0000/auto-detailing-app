const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    let user = null;
    let role = null;
    let source = "";

    const [userRows] = await db.query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    if (userRows.length > 0) {
      user = userRows[0];
      role = user.role;
      source = "user";
    }

    // const user = rows[0];

    if (!user) {
      const [customerRows] = await db.query(
        "SELECT * FROM customers WHERE name = ?",
        [username]
      );

      if (customerRows.length > 0) {
        user = customerRows[0];
        role = user.role;
        source = "customer";
      }
    }

    if (!user) {
      res.status(401).json({ message: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET ||
        "1ee3cb67d2c1aa5d842a8ded076a6ebf4f7bdb9a288ce7289c958e2e427fb58fb18b436201eda7dd23daf09886b04e3f7874f0db6995063366b1878ae77a5f7f",
      { expiresIn: "1h" }
    );

    // 🧠 Add the correct ID based on user type
    const response = {
      token,
      role: user.role,
    };

    if (source === "customer") {
      response.customer = {
        id: user.id,
        name: user.name,
        phone: user.phone,
      };
    } else {
      response.userId = user.id;
    }

    res.json(response);
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.signup = async (req, res) => {
  const { username, phone, password } = req.body;

  if (!username || !phone || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const [existingUser] = await db.query(
      "SELECT * FROM customers WHERE name =? AND phone = ?",
      [username, phone]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ message: "Customer already registered" });
    }

    await db.query(
      "INSERT INTO customers (name, phone, password) VALUES (?, ?, ?)",
      [username, phone, hashedPassword]
    );

    const [rows] = await db.query(
      "SELECT * FROM customers WHERE name = ? AND phone = ?",
      [username, phone]
    );

    const customer = rows[0];

    const token = jwt.sign(
      { id: customer.id, role: "customer" },
      process.env.JWT_SECRET || "fallbacksecret",
      { expiresIn: "1h" }
    );

    res.status(201).json({
      token,
      role: "customer",
      customer: {
        id: customer.id,
        name: customer.name,
        phone: customer.phone,
      },
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
