const Booking = require("../models/bookingModel");
const Car = require("../models/carModel");

// Get all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create booking
exports.createBooking = async (req, res) => {
  try {
    const { customerName, carNumber, startDate, endDate } = req.body;

    const car = await Car.findOne({ carNumber });
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    const conflict = await Booking.findOne({
      carNumber,
      startDate: { $lte: endDate },
      endDate: { $gte: startDate },
    });

    if (conflict) {
      return res.status(400).json({ message: "Date conflict" });
    }

    const days =
      (new Date(endDate) - new Date(startDate)) /
      (1000 * 60 * 60 * 24);

    const totalAmount = Math.round(days * car.pricePerDay);

    const booking = new Booking({
      customerName,
      carNumber,
      startDate,
      endDate,
      totalAmount,
    });

    await booking.save();

    // 🔥 Tự động chuyển trạng thái xe sang 'rented'
    await Car.findOneAndUpdate({ carNumber }, { status: "rented" });

    res.status(201).json({ message: "Booking created", booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update booking
exports.updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.bookingId,
      req.body,
      { new: true }
    );
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete booking
exports.deleteBooking = async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.bookingId);
    res.json({ message: "Booking deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Render Bookings page
exports.renderBookings = async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.render("bookings", { bookings });
  } catch (err) {
    res.send("Error loading page");
  }
};

