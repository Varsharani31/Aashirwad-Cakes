import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// -------------------------
// PLACE ORDER
// -------------------------
export const placeOrder = async (req, res) => {
    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount, // total amount from frontend
            address: req.body.address,
            status: "Processing", // default status
            payment: true // since payment is assumed done
        });

        await newOrder.save();

        // Clear user's cart
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        res.json({
            success: true,
            message: "Order placed successfully",
            orderId: newOrder._id
        });
    } catch (error) {
        console.error("❌ Error placing order:", error);
        res.json({ success: false, message: "Error placing order" });
    }
};

// -------------------------
// VERIFY ORDER
// -------------------------
export const verifyOrder = async (req, res) => {
    const { orderId } = req.body;
    try {
        await orderModel.findByIdAndUpdate(orderId, { payment: true });
        res.json({ success: true, message: "Order verified successfully" });
    } catch (error) {
        console.error("❌ Error verifying order:", error);
        res.json({ success: false, message: "Error verifying order" });
    }
};

// -------------------------
// USER ORDERS
// -------------------------
export const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.body.userId });
        res.json({ success: true, data: orders });
    } catch (error) {
        console.error("❌ Error fetching user orders:", error);
        res.json({ success: false, message: "Error fetching user orders" });
    }
};

// -------------------------
// LIST ALL ORDERS (ADMIN)
// -------------------------
export const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, data: orders });
    } catch (error) {
        console.error("❌ Error fetching orders:", error);
        res.json({ success: false, message: "Error fetching orders" });
    }
};

// -------------------------
// UPDATE ORDER STATUS + SEND EMAIL
// -------------------------
export const updateStatus = async (req, res) => {
    const { orderId, status, email } = req.body;

    try {
        const order = await orderModel.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        );

        // ✅ Send email if provided
        if (email) {
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true, // true for port 465
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            let subject, text;
            if (status === "Accepted") {
                subject = "Your Order Has Been Accepted!";
                text = `Hello,\n\nYour order (ID: ${orderId}) has been accepted and is now being processed.\n\nThank you for shopping with us!\n\n— Online Cake Hub`;
            } else if (status === "Rejected") {
                subject = "Your Order Has Been Rejected";
                text = `Hello,\n\nWe’re sorry to inform you that your order (ID: ${orderId}) has been rejected.\n\nPlease contact our support for more details.\n\n— Online Cake Hub`;
            } else {
                subject = `Your Order Status Has Been Updated to ${status}`;
                text = `Hello,\n\nYour order (ID: ${orderId}) status is now: ${status}.\n\nThank you for choosing Online Cake Hub!`;
            }

            await transporter.sendMail({
                from: `"Online Cake Hub" <${process.env.EMAIL_USER}>`,
                to: email,
                subject,
                text
            });

            console.log("✅ Email sent successfully to:", email);
        }

        res.json({ success: true, message: "Order status updated successfully", order });
    } catch (error) {
        console.error("❌ Error updating order status:", error);
        res.json({ success: false, message: "Error updating status" });
    }
};
