const jwt = require("jsonwebtoken");

async function authCheck(req, res, next) {

    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decoded = await jwt.verify(
            token,
            process.env.JWT_SECRET || process.env.JWT_secret,
        );
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
}

module.exports = { authCheck };