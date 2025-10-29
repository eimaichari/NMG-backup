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
const axios = require('axios');

// Get your UniOne API Key from Firebase environment config
// Run: firebase functions:config:set unione.key="YOUR_UNIONE_API_KEY"
const UNIONE_API_KEY = functions.config().unione.key;
const UNIONE_API_URL = 'https://api.unione.io/en/transactional/api/v1/email/send.json';

/**
 * Sends an order confirmation email using UniOne when a new order is created.
 */
exports.sendOrderConfirmation = functions.firestore
  .document('orders/{orderId}')
  .onCreate(async (snap, context) => {
    const orderData = snap.data();
    const customerEmail = orderData.userEmail;
    const customerName = orderData.userName;
    const orderTotal = orderData.totalAmount;
    const orderId = context.params.orderId;

    // 1. Construct the UniOne API Payload
    const payload = {
      message: {
        // Your verified sending email address
        from_email: "noreply@nmgzembeta.com", 
        subject: `Your Order ${orderId} is Confirmed!`,
        recipients: [{ email: customerEmail }],

        // Use your UniOne Template
        template_id: 'your_order_confirmation_template_id', // Replace with your template ID
        // Pass dynamic data to your template
        global_substitutions: {
          ORDER_ID: orderId,
          CUSTOMER_NAME: customerName,
          ORDER_TOTAL: orderTotal,
        }
      }
    };

    // 2. Send the Request to UniOne
    try {
      const response = await axios.post(UNIONE_API_URL, payload, {
        headers: {
          'X-API-KEY': UNIONE_API_KEY,
          'Content-Type': 'application/json'
        }
      });

      console.log(`Email sent successfully for Order ${orderId}:`, response.data);
      return response.data;

    } catch (error) {
      console.error(`Error sending email for Order ${orderId}:`, error.message);
      return null;
    }
  });