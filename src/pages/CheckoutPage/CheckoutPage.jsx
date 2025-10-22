import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../utils/useCart";
import { db, storage } from "../../utils/firebase";
import {
  collection,
  addDoc,
  setDoc,
  doc,
  getDocs,
  writeBatch,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import styles from "./CheckoutPage.module.css";

const CheckoutPage = () => {
  const { user, isAuthenticated } = useAuth();
  const { cartItems, loading: cartLoading, error: cartError } = useCart();

  const [statusMessage, setStatusMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderId, setOrderId] = useState(
    `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`
  );
  const [proofFile, setProofFile] = useState(null);

  const navigate = useNavigate();

  // Handle file selection
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        setStatusMessage("❌ Please upload a valid image or PDF file.");
        setTimeout(() => setStatusMessage(''), 3000);
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setStatusMessage("❌ File size must be less than 5MB.");
        setTimeout(() => setStatusMessage(''), 3000);
        return;
      }

      setProofFile(file);
      setStatusMessage("✅ Proof of payment file selected.");
      setTimeout(() => setStatusMessage(''), 3000);
    }
  };

  const handleCheckout = async () => {
    // Validation checks
    if (!isAuthenticated) {
      setStatusMessage("❌ Please sign in to complete your order.");
      setTimeout(() => navigate('/auth/signin'), 2000);
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      setStatusMessage("❌ Your cart is empty.");
      return;
    }

    if (!proofFile) {
      setStatusMessage("❌ Please upload proof of payment before proceeding.");
      setTimeout(() => setStatusMessage(''), 3000);
      return;
    }

    setIsSubmitting(true);
    setStatusMessage("⏳ Processing your order...");

    try {
      // 1. Upload proof of payment file
      console.log("Uploading proof of payment...");
      const timestamp = Date.now();
      const fileName = `${timestamp}_${proofFile.name}`;
      const storageRef = ref(storage, `payments/${user.uid}/${fileName}`);
      
      await uploadBytes(storageRef, proofFile);
      const downloadURL = await getDownloadURL(storageRef);
      console.log("Proof uploaded successfully:", downloadURL);

      // 2. Calculate order total
      const orderTotal = cartItems.reduce(
        (total, item) => total + (item.price || 0) * (item.quantity || 0),
        0
      );

      // 3. Prepare simplified cart items
      const simplifiedCart = cartItems.map((item) => ({
        productId: item.productId || item.id,
        name: item.name || 'Unknown Product',
        quantity: item.quantity || 1,
        price: item.price || 0,
        image: item.image || '',
      }));

      // 4. Prepare order data
      const orderData = {
        userId: user.uid,
        userName: user.displayName || user.fullName || user.email,
        userEmail: user.email,
        items: simplifiedCart,
        totalAmount: orderTotal,
        orderDate: serverTimestamp(),
        status: "Pending Payment Verification",
        proofOfPayment: downloadURL,
        orderId: orderId,
        createdAt: serverTimestamp(),
      };

      console.log("Creating order with data:", orderData);

      // 5. Create order in main orders collection
      const orderDocRef = await addDoc(collection(db, "orders"), orderData);
      const newOrderId = orderDocRef.id;
      console.log("Order created with ID:", newOrderId);

      // 6. Save order in user sub-collection
      await setDoc(
        doc(db, "users", user.uid, "orders", newOrderId),
        { ...orderData, orderId: newOrderId }
      );
      console.log("Order saved to user subcollection");

      // 7. Clear user cart
      const cartCollectionRef = collection(db, "users", user.uid, "cart");
      const snapshot = await getDocs(cartCollectionRef);
      
      if (!snapshot.empty) {
        const batch = writeBatch(db);
        snapshot.docs.forEach((document) => batch.delete(document.ref));
        await batch.commit();
        console.log("Cart cleared successfully");
      }

      // ✅ Success
      setOrderId(newOrderId);
      setStatusMessage(
        `✅ Order placed successfully! Your order ID is: ${newOrderId}. Redirecting to products...`
      );
      
      setTimeout(() => {
        navigate("/products");
      }, 4000);
      
    } catch (error) {
      console.error("Error placing order:", error);
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);
      
      let errorMessage = "❌ Failed to place order. ";
      
      if (error.code === 'permission-denied') {
        errorMessage += "Permission denied. Please check your account permissions.";
      } else if (error.code === 'unauthenticated') {
        errorMessage += "Authentication required. Please sign in again.";
      } else if (error.message.includes('network')) {
        errorMessage += "Network error. Please check your connection.";
      } else {
        errorMessage += `Error: ${error.message}`;
      }
      
      setStatusMessage(errorMessage);
      setTimeout(() => setStatusMessage(''), 6000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + (item.price || 0) * (item.quantity || 0),
      0
    );
  };

  if (cartLoading) {
    return <div className={styles.loading}>⏳ Loading cart...</div>;
  }

  if (cartError) {
    return <div className={styles.error}>❌ {cartError}</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className={styles.error}>
        ❌ Please sign in to access checkout.
      </div>
    );
  }

  return (
    <main>
      <section className={styles.checkoutSection}>
        <div className={styles.checkoutContainer}>
          <div className={styles.checkoutLeft}>
            <h1 className={styles.sectionTitle}>Your Cart</h1>
            <div className={styles.cartItems}>
              {cartItems.length === 0 ? (
                <p>Your cart is empty</p>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className={styles.cartItem}>
                    <img
                      src={item.image || '/placeholder-image.jpg'}
                      alt={item.name}
                      className={styles.cartThumb}
                      onError={(e) => {
                        e.target.src = '/placeholder-image.jpg';
                      }}
                    />
                    <div>
                      <span className={styles.cartName}>{item.name}</span>
                      <div className={styles.quantityControls}>
                        <span>Qty: {item.quantity}</span>
                      </div>
                      <span className={styles.cartPrice}>R{item.price}</span>
                      <span className={styles.cartSubtotal}>
                        Subtotal: R{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className={styles.cartTotal}>
              Total: R{calculateTotal().toFixed(2)}
            </div>
          </div>

          <div className={styles.checkoutRight}>
            <h2 className={styles.sectionTitle}>Payment Details</h2>
            <p>
              To complete your purchase, kindly transfer the required amount to
              the following bank account:
            </p>
            <div className={styles.paymentDetails}>
              <p>
                <strong>Account Name:</strong> NMG Zembeta Pty Ltd
              </p>
              <p>
                <strong>Bank Name:</strong> Standard Bank
              </p>
              <p>
                <strong>Account Number:</strong> 123456789
              </p>
              <p>
                <strong>Branch Code:</strong> 051001
              </p>
              <p>
                <strong>Reference:</strong> {orderId}
              </p>
            </div>
            <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#FFB703' }}>
              ⚠️ <strong>Important:</strong> Please use the reference number above when making your payment so we can verify it quickly.
            </p>
            <p>
              Once the transfer is complete, please upload a screenshot or proof
              of payment below to verify and process your order promptly.
            </p>
            <div className={styles.checkoutForm}>
              <label htmlFor="proofUpload" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                Upload Proof of Payment (Image or PDF, max 5MB)
              </label>
              <input
                id="proofUpload"
                type="file"
                accept="image/*,application/pdf"
                onChange={handleFileUpload}
                disabled={isSubmitting}
              />
              {proofFile && (
                <p style={{ fontSize: '0.9rem', color: '#2EC4B6', marginTop: '0.5rem' }}>
                  Selected: {proofFile.name}
                </p>
              )}
              <button
                className={styles.submitButton}
                onClick={handleCheckout}
                disabled={isSubmitting || cartItems.length === 0 || !proofFile}
              >
                {isSubmitting ? "⏳ Processing..." : "Complete Payment"}
              </button>
            </div>
          </div>
        </div>
      </section>
      {statusMessage && (
        <div
          className={`${styles.statusMessage} ${
            statusMessage.includes("❌") || statusMessage.includes("Failed")
              ? styles.error
              : styles.success
          }`}
        >
          {statusMessage}
        </div>
      )}
    </main>
  );
};

export default CheckoutPage;