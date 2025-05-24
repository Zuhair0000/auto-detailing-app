const express = require("express");
const router = express.Router();
const { book } = require("../controllers/customerController");

router.post("/booking", book);

module.exports = router;
