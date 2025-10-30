const functions = require("firebase-functions");
const nodemailer = require("nodemailer");

// Get email credentials from Firebase config
const EMAIL_USER = (functions.config().email && functions.config().email.user) || "";
const EMAIL_PASS = (functions.config().email && functions.config().email.pass) || "";

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

exports.sendOrderConfirmation = functions.firestore
  .document("orders/{orderId}")
  .onCreate(async (snap, context) => {
    const orderData = snap.data();
    const orderId = context.params.orderId;

    // Customer email details
    const mailOptionsCustomer = {
      from: EMAIL_USER,
      to: orderData.userEmail,
      subject: `Order Confirmation - ${orderId}`,
      text: `Hello ${orderData.userName},\n\nYour order (${orderId}) has been received. Total: ${orderData.totalAmount}.\n\nThank you for shopping with us!`,
    };

    // Admin email details
    const mailOptionsAdmin = {
      from: EMAIL_USER,
      to: "kutigrace9@gmail.com",
      subject: `New Order Received - ${orderId}`,
      text: `A new order has been placed.\n\nOrder ID: ${orderId}\nCustomer: ${orderData.userName}\nEmail: ${orderData.userEmail}\nTotal: ${orderData.totalAmount}`,
    };

    try {
      await transporter.sendMail(mailOptionsCustomer);
      await transporter.sendMail(mailOptionsAdmin);
      console.log(`Order confirmation emails sent for Order ${orderId}`);
      return null;
    } catch (error) {
      console.error(`Error sending order confirmation emails for Order ${orderId}:`, error);
      return null;
    }
  });
