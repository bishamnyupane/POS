const mongoose = require('mongoose');
const userModel = require('../models/user.model');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET || process.env.JWT_secret;

async function registerUser(req, res) {
    try {
    const { name, email, password,shopName } = req.body;

    const isUserExist = await userModel.findOne({ email: email });

    if (isUserExist) {
        return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        name,
        email,
        password: hashedPassword,
        role:'admin',
        shopName
    })


    const token = jwt.sign({
        id: user._id,
        role: user.role,
        shopName: user.shopName,
    }, JWT_SECRET);

    res.cookie("token", token);

    res.status(201).json({
        message: "User registered successfully",
        user:{
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            shopName: user.shopName,
        }
    });
    } catch (error) {
        console.error('registerUser:', error.message);
        return res.status(500).json({ message: 'Server error. Try again later.' });
    }
}



async function loginUser(req, res) {
    try {
    
    const { email, password } = req.body;

    const user = await userModel.findOne({
        email: email
    })


    if (!user){
        return res.status(401).json({
            message: "Invalid credentials"
        });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
        return res.status(401).json({
            message: "Invalid credentials"
        });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign({
        id: user._id,
        role: user.role,
        shopName: user.shopName
    }, JWT_SECRET);


    res.cookie("token", token);

    res.status(200).json({
        message: "User logged in successfully",
        user:{
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            shopName: user.shopName,
        }
    });
    } catch (error) {
        console.error('loginUser:', error.message);
        return res.status(500).json({ message: 'Server error. Try again later.' });
    }
}


async function logoutUser(req, res) {

    res.clearCookie("token");

    res.status(200).json({
        message: "User logged out successfully"
    });

}

module.exports = { registerUser, loginUser, logoutUser };

