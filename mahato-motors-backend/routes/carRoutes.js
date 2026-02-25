const express = require("express");
const router = express.Router();

const { protect } = require("../Helper/authMiddleware");
const { allowRoles } = require("../Helper/roleMiddleware");
const upload = require("../Middleware/upload");

const {
  addCar,
  getCars,
  getCarById,
  updateCar,
  deleteCar
} = require("../controllers/carController");

// GET ALL CARS (Public / Logged-in)
router.get("/", getCars);
router.get("/", protect, allowRoles("manager", "admin", "employee"), getCars);



// ADD CAR (Manager only)

router.post(
  "/",
  protect,
  allowRoles("manager", "admin"), // admin can also manage everything
  upload.single("image"),
  addCar
);

// UPDATE CAR (Manager only)

router.put(
  "/:id",
  protect,
  allowRoles("manager", "admin"),
  upload.single("image"),
  updateCar
);

// DELETE CAR (Manager only)

router.delete(
  "/:id",
  protect,
  allowRoles("manager", "admin"),
  deleteCar
);



module.exports = router;