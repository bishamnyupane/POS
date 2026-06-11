const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const userModel = require('./models/user.model');
const productModel = require('./models/product.model');
const salesModel = require('./models/sales.model');
const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');
const productRoutes = require('./routes/product.routes');
const salesRoutes = require('./routes/sales.routes');


const app = express();
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(null, false);
        }
    },
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());



app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/sales', salesRoutes);
module.exports = app;