const jwt = require("jsonwebtoken");

exports.authMiddleware = (roles = []) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ message: "No token provided" });

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET ||
          "1ee3cb67d2c1aa5d842a8ded076a6ebf4f7bdb9a288ce7289c958e2e427fb58fb18b436201eda7dd23daf09886b04e3f7874f0db6995063366b1878ae77a5f7f"
      );

      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: "Access denied" });
      }

      req.user = decoded;
      next();
    } catch (err) {
      res.status(401).json({ message: "Invalid token" });
    }
  };
};

// middlewares/authMiddleware.js

// middleware/verifyCustomer.js

exports.verifyCustomer = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: "Forbidden: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "customer") {
      return res.status(403).json({ message: "Forbidden: Not a customer" });
    }
    console.log("Decoded Token: ", decoded);

    // Attach decoded token info
    req.customer = {
      customerId: decoded.id, // make sure your token contains "id"
      name: decoded.name,
      phone: decoded.phone,
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};
