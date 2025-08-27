/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// const {setGlobalOptions} = require("firebase-functions");
// const {onRequest} = require("firebase-functions/https");
// const logger = require("firebase-functions/logger");

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
// setGlobalOptions({ maxInstances: 10 });

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


// The Firebase Admin SDK to access Firestore.
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

// Configure the email transport using Nodemailer
// Replace with your own email service credentials.
const mailTransport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: functions.config().email.user,
    pass: functions.config().email.pass,
  },
});

/**
 * Sends an email to the user and the admin when a new order is created.
 */
exports.sendOrderConfirmationEmail = functions.firestore
  .document("orders/{orderId}")
  .onCreate(async (snap, context) => {
    const orderData = snap.data();
    const orderId = context.params.orderId;

    // Email to the user
    const userMailOptions = {
      from: "Your Store Name <yekhutiel@example.com>", // Replace with your store's email
      to: orderData.userEmail,
      subject: `Order Confirmation: ${orderId}`,
      html: `
        <p>Hi ${orderData.userName},</p>
        <p>Thank you for your order! Your order number is <strong>${orderId}</strong>.</p>
        <p>We will notify you once your payment has been processed.</p>
        <p>Order Summary:</p>
        <ul>
          ${orderData.items.map(item => `<li>${item.name} (x${item.quantity}) - R${item.price}</li>`).join('')}
        </ul>
        <p>Total: <strong>R${orderData.totalAmount}</strong></p>
        <p>Sincerely,</p>
        <p>The NMG Team</p>
      `,
    };

    // Email to the admin
    const adminMailOptions = {
      from: "Your Store Name <yekhutiel@example.com>", // Replace with your store's email
      to: "kutigrace9@gmail.com",
      subject: `New Order Received: ${orderId}`,
      html: `
        <p>A new order has been placed!</p>
        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>Customer:</strong> ${orderData.userName} (${orderData.userEmail})</p>
        <p><strong>Total Amount:</strong> R${orderData.totalAmount}</p>
        <p><strong>Items:</strong></p>
        <ul>
          ${orderData.items.map(item => `<li>${item.name} (x${item.quantity}) - R${item.price}</li>`).join('')}
        </ul>
      `,
    };

    try {
      await mailTransport.sendMail(userMailOptions);
      functions.logger.log('Confirmation email sent to user:', orderData.userEmail);
      await mailTransport.sendMail(adminMailOptions);
      functions.logger.log('Order notification email sent to admin.');
    } catch (error) {
      functions.logger.error('Failed to send email:', error);
    }
    return null;
  });