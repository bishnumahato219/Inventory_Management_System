const express = require("express");
const router = express.Router();

const { register, login, getMe } = require("../controllers/authController");
const {protect} = require("../Helper/authMiddleware");


// Public
router.post("/register", register);
router.post("/login", login);

// Protected
router.get("/me", protect, getMe);

module.exports = router;