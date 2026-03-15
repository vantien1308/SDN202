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

exports.googleCallback = (req, res) => {
    const user = req.user;
    if (!user) return res.redirect('/login');

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "1d" });
    
    // Inject token into returning client's localStorage
    res.send(`
        <html>
            <body>
                <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
                <script>
                    localStorage.setItem('token', '${token}');
                    localStorage.setItem('user', JSON.stringify({ username: '${user.username}', role: '${user.role}' }));
                    Swal.fire({
                        icon: 'success',
                        title: 'Google Login',
                        text: 'Logged in successfully!',
                        timer: 1500,
                        showConfirmButton: false
                    }).then(() => {
                        window.location.href = '/';
                    });
                </script>
            </body>
        </html>
    `);
};
