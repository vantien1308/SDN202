const jwt = require("jsonwebtoken");

const JWT_SECRET = "super_secret_car_rental_key_123";

/**
 * Middleware to verify a JWT token.
 * It checks the 'Authorization' header for a Bearer token.
 */
exports.verifyToken = (req, res, next) => {
    const tokenHeader = req.header("Authorization");
    if (!tokenHeader) return res.status(401).json({ message: "Access denied. No token provided." });

    // Token usually comes in the form "Bearer <token>"
    const token = tokenHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Access denied. Token missing from Header." });

    try {
        const verified = jwt.verify(token, JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ message: "Invalid token" });
    }
};

/**
 * Middleware to restrict access to ADMIN only.
 * This should be used AFTER verifyToken.
 */
exports.isAdmin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403).json({ message: "Access denied. Admins only." });
    }
};
