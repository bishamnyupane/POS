const salesModel = require('../models/sales.model');
const productModel = require('../models/product.model');
const userModel = require('../models/user.model');
const mongoose = require('mongoose');

async function resolveShopName(req) {
    if (req.user.shopName) return req.user.shopName;
    const user = await userModel.findById(req.user.id).select('shopName');
    return user?.shopName;
}

async function createSale(req, res) {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const {
            items,
            customerName,
            customerPhone,
            discount = 0,
            tax = 0,
            paymentMethod = 'cash'
        } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({
                message: "No items provided"
            });
        }

        let subtotal = 0;
        const saleItems = [];

        // Validate products + stock check
        for (const item of items) {
            const product = await productModel.findById(item.product).session(session);

            if (!product) {
                throw new Error(`Product not found: ${item.product}`);
            }

            if (product.stock < item.quantity) {
                throw new Error(`Insufficient stock for ${product.name}`);
            }

            const itemTotal = product.price * item.quantity;

            subtotal += itemTotal;

            saleItems.push({
                product: product._id,
                productName: product.name,
                quantity: item.quantity,
                price: product.price,
                total: itemTotal
            });

            // 🧠 deduct stock
            product.stock -= item.quantity;
            await product.save({ session });
        }

        const totalAmount = subtotal - discount + tax;

        // 🧾 generate invoice number (simple version)
        const count = await salesModel.countDocuments();
        const invoiceNumber = `INV-${Date.now()}-${count + 1}`;

        const sale = await salesModel.create([{
            invoiceNumber,
            items: saleItems,
            customerName,
            customerPhone,
            subtotal,
            discount,
            tax,
            totalAmount,
            paymentMethod,
            paymentStatus: 'paid',
            createdBy: req.user.id
        }], { session });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            message: "Sale created successfully",
            sale: sale[0]
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        res.status(400).json({
            message: error.message
        });
    }
}

async function getAllSales(req, res) {
     try {
        // Return all sales created by users in the same shop
        const shopName = await resolveShopName(req);
        if (!shopName) {
            return res.status(400).json({ message: 'Shop name is required' });
        }

        const shopUsers = await userModel.find({ shopName }).select('_id');
        const shopUserIds = shopUsers.map((u) => u._id);

        const sales = await salesModel.find({ createdBy: { $in: shopUserIds } })
            .populate('items.product', 'name price')
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({ message: 'Sales fetched successfully', count: sales.length, sales });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}


async function getSaleById(req, res) {
     try {
        const { id } = req.params;

        if(!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid sale id"
            });
        }

        const sale = await salesModel.findById(id)
            .populate('items.product', 'name price barcode')
            .populate('createdBy', 'name email');

        if (!sale) {
            return res.status(404).json({
                message: "Sale not found"
            });
        }

        // Allow any user from the same shop to view this sale
        const shopName = await resolveShopName(req);
        if (!shopName) {
            return res.status(400).json({ message: 'Shop name is required' });
        }

        const shopUsers = await userModel.find({ shopName }).select('_id');
        const shopUserIds = shopUsers.map((u) => u._id.toString());

        const creatorId = sale.createdBy._id ? sale.createdBy._id.toString() : sale.createdBy.toString();
        if (!shopUserIds.includes(creatorId)) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        res.status(200).json({
            message: "Sale fetched successfully",
            sale
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

module.exports = { createSale , getAllSales, getSaleById};