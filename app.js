require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const carRoutes = require("./routes/carRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const carController = require("./controllers/carController");
const bookingController = require("./controllers/bookingController");

const session = require("express-session");
const passport = require("passport");
require("./config/passport");

const app = express();

// CORE MIDDLEWARE
app.use(express.json());
app.use(cors()); // Allow Cross-Origin Resource Sharing
app.use(session({
    secret: process.env.SESSION_SECRET || "car_rental_session_secret",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

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
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log("Server running"))
