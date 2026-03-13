const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const carRoutes = require("./routes/carRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const carController = require("./controllers/carController");
const bookingController = require("./controllers/bookingController");

const app = express();

// CORE MIDDLEWARE
app.use(express.json());
app.use(cors()); // Allow Cross-Origin Resource Sharing

// 🔥 VIEW CONFIGURATION
app.set("view engine", "ejs");
app.set("views", "./views");

// 🏁 UI ROUTES
app.get("/", carController.renderHome);
app.get("/bookings-dashboard", bookingController.renderBookings);
app.get("/login", (req, res) => res.render("login"));
app.get("/register", (req, res) => res.render("register"));

// ⚡ API ROUTES
app.use("/auth", authRoutes);
app.use("/cars", carRoutes);
app.use("/bookings", bookingRoutes);

// MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/carRentalDB")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
