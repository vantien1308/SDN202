const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

router.get("/", verifyToken, bookingController.getAllBookings);
router.post("/", verifyToken, bookingController.createBooking);
router.put("/:bookingId", verifyToken, bookingController.updateBooking);
router.delete("/:bookingId", verifyToken, isAdmin, bookingController.deleteBooking);

module.exports = router;
