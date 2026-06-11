const userModel = require('../models/user.model');
const bcrypt = require('bcryptjs');

async function createCashier(req, res) {

    try {

        if (req.user.role !== 'admin') {
            return res.status(403).json({
                message: "Admin Only"
            });
        }

        const { name, email, password } = req.body;

        const exist = await userModel.findOne({ email });

        if (exist) {
            return res.status(409).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            name,
            email,
            password: hashedPassword,
            role: 'cashier',
            shopName: req.user.shopName
        });

        return res.status(201).json({
            message: "Cashier created successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                shopName: user.shopName
            }
        });

    } catch (error) {

        return res.status(500).json({
            message: "Server Error",
            error: error.message
        });

    }
}

module.exports = {
    createCashier
};