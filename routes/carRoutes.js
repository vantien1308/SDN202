const express = require("express");
const router = express.Router();
const carController = require("../controllers/carController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

router.get("/", carController.getAllCars);

// Protected routes (Admins only)
router.post("/", verifyToken, isAdmin, carController.createCar);
router.put("/:carId", verifyToken, isAdmin, carController.updateCar);
router.delete("/:carId", verifyToken, isAdmin, carController.deleteCar);

module.exports = router;
