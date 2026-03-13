const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "super_secret_car_rental_key_123"; // IN PRODUCTION, USE ENVIRONMENT VARIABLE

exports.register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const newUser = new User({ username, email, password, role });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: "Invalid email or password" });

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

        // Generate JWT
        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "1d" });

        res.json({ token, user: { username: user.username, role: user.role } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
