const Car = require("../models/carModel");

// Add new car
exports.createCar = async (req, res) => {
  try {
    const car = new Car(req.body);
    await car.save();
    res.status(201).json({ message: "Car added!", car });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all cars
exports.getAllCars = async (req, res) => {
  try {
    const cars = await Car.find();
    res.json(cars);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Render homepage
exports.renderHome = async (req, res) => {
  try {
    const cars = await Car.find();
    res.render("index", { cars });
  } catch (err) {
    res.send("Error loading page");
  }
};

// Delete car
exports.deleteCar = async (req, res) => {
  try {
    await Car.findByIdAndDelete(req.params.carId);
    res.json({ message: "Car deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update car
exports.updateCar = async (req, res) => {
  try {
    const car = await Car.findByIdAndUpdate(req.params.carId, req.body, { new: true });
    res.json({ message: "Car updated successfully", car });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
