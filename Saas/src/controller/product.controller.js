const mongoose = require('mongoose');
const productModel = require('../models/product.model');
const userModel = require('../models/user.model');

async function resolveShopName(req) {
    if (req.user.shopName) {
        return req.user.shopName;
    }

    const user = await userModel.findById(req.user.id).select('shopName');
    return user?.shopName;
}

async function createProduct(req, res) {

    const {
        name,
        price,
        costPrice,
        stock,
        category,
        barcode
    } = req.body;

    const shopName = await resolveShopName(req);

    if (!shopName) {
        return res.status(400).json({
            message: 'Shop name is required'
        });
    }

    const existingProduct = await productModel.findOne({
        name,
        shopName
    });

    if (existingProduct) {
        return res.status(409).json({
            message: "Product already exists"
        });
    }

    if (!name || !price || !costPrice) {
        return res.status(400).json({
            message: "Name, price and cost price are required"
        });
    }

    const product = await productModel.create({
        name,
        price,
        costPrice,
        stock,
        category,
        barcode,
        shopName,
        createdBy: req.user.id
    });

    res.status(201).json({
        message: "Product created successfully",
        product: product
    });
}
 
async function getProducts(req, res) {

    const shopName = await resolveShopName(req);

    if (!shopName) {
        return res.status(400).json({
            message: 'Shop name is required'
        });
    }

    const shopUsers = await userModel.find({ shopName }).select('_id');
    const shopUserIds = shopUsers.map((user) => user._id);

    const products = await productModel.find({
        $or: [
            { shopName },
            { shopName: { $exists: false }, createdBy: { $in: shopUserIds } },
            { shopName: null, createdBy: { $in: shopUserIds } }
        ]
    });

    res.status(200).json({
        message: "Products retrieved successfully",
        products: products  
    });

}

async function getProductById(req, res) {

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            message: "Invalid product id"
        });
    }

    const shopName = await resolveShopName(req);

    if (!shopName) {
        return res.status(400).json({
            message: 'Shop name is required'
        });
    }

    const shopUsers = await userModel.find({ shopName }).select('_id');
    const shopUserIds = shopUsers.map((user) => user._id);

    const product = await productModel.findOne({
        _id: id,
        $or: [
            { shopName },
            { shopName: { $exists: false }, createdBy: { $in: shopUserIds } },
            { shopName: null, createdBy: { $in: shopUserIds } }
        ]
    });


    if (!product) {
        return res.status(404).json({
            message: "Product not found"
        });
    }
    


    res.status(200).json({
        message: "Product retrieved successfully",
        product
    });

}

async function updateProduct(req, res) {
    const { id } = req.params;

    const {
        name,
        price,
        costPrice,
        stock,
        category,
        barcode
    } = req.body;

    const updateData = {};

    const shopName = await resolveShopName(req);

    if (!shopName) {
        return res.status(400).json({
            message: 'Shop name is required'
        });
    }

    if (name !== undefined) updateData.name = name;
    if (price !== undefined) updateData.price = price;
    if (costPrice !== undefined) updateData.costPrice = costPrice;
    if (stock !== undefined) updateData.stock = stock;
    if (category !== undefined) updateData.category = category;
    if (barcode !== undefined) updateData.barcode = barcode;

    const updatedProduct = await productModel.findOneAndUpdate(
        { _id: id, createdBy: req.user.id, shopName },   // filter
        updateData,                            // update
        {
            new: true,                          // return updated document
            runValidators: true                 // enforce schema rules
        }
    );

    if (!updatedProduct) {
        return res.status(404).json({
            message: "Product not found"
        });
    }

    res.status(200).json({
        message: "Product updated successfully",
        product: updatedProduct
    });
}


async function deleteProduct(req, res) {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            message: "Invalid product id"
        });
    }

    const shopName = await resolveShopName(req);

    if (!shopName) {
        return res.status(400).json({
            message: 'Shop name is required'
        });
    }

    const deletedProduct = await productModel.findOneAndDelete({
        _id: id,
        createdBy: req.user.id,
        shopName
    });

    if (!deletedProduct) {
        return res.status(404).json({
            message: "Product not found"
        });
    }

    res.status(200).json({
        message: "Product deleted successfully",
        product: deletedProduct
    });
}

module.exports = { createProduct, getProducts, getProductById , updateProduct, deleteProduct};

