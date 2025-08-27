import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../utils/useCart';
import { db } from '../../utils/firebase';
import { collection, addDoc, setDoc, doc, getDocs, writeBatch } from 'firebase/firestore';
import styles from './CheckoutPage.module.css';

const CheckoutPage = () => {
  const { user, isAuthenticated } = useAuth();
  const { cartItems, loading: cartLoading, error: cartError } = useCart();
  
  const [statusMessage, setStatusMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderId, setOrderId] = useState(`ORD-${Math.floor(Math.random() * 1000000)}`);

  const navigate = useNavigate();

  // This function will now handle the core logic of creating an order in Firestore
  const handleCheckout = async () => {
    // Check for authentication and cart items before proceeding
    if (!isAuthenticated || cartItems.length === 0) {
      setStatusMessage('Your cart is empty or you are not logged in.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Prepare order data
      const orderTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
      const simplifiedCart = cartItems.map(item => ({
        id: item.productId,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      }));

      const orderData = {
        userId: user.uid,
        userName: user.displayName || user.email,
        userEmail: user.email,
        items: simplifiedCart,
        totalAmount: orderTotal,
        orderDate: new Date().toISOString(),
        status: 'Pending Payment', // Initial status
      };

      // 2. Create the order in the main 'orders' collection
      // The addDoc() function creates a new document with an automatically generated ID.
      const orderDocRef = await addDoc(collection(db, 'orders'), orderData);
      const newOrderId = orderDocRef.id;

      // 3. Create the same order in the user's personal 'orders' sub-collection
      // We use the same ID from the main collection to keep them linked.
      await setDoc(doc(db, 'users', user.uid, 'orders', newOrderId), orderData);

      // 4. Clear the user's cart after the order is created
      // We use a batch write for efficiency to delete all items at once.
      const cartCollectionRef = collection(db, 'users', user.uid, 'cart');
      const snapshot = await getDocs(cartCollectionRef);
      const batch = writeBatch(db);

      snapshot.docs.forEach((document) => {
        batch.delete(document.ref);
      });

      await batch.commit();

      // Update UI with success message and new order ID
      setOrderId(newOrderId); // Set the real order ID from Firestore
      setStatusMessage('Order placed successfully! Your order number is: ' + newOrderId);
      setTimeout(() => {
        navigate('/products'); // Redirect to products page or a confirmation page
      }, 5000);

    } catch (error) {
      console.error('Error placing order:', error);
      setStatusMessage('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setStatusMessage('Proof of payment uploaded');
      // In a real application, you would handle the file upload to a storage service like Firebase Storage here.
      setTimeout(() => setStatusMessage(''), 3000);
    }
  };
  
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  if (cartLoading) {
    return <div className={styles.loading}>Loading cart...</div>;
  }

  if (cartError) {
    return <div className={styles.error}>{cartError}</div>;
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
                      src={item.image}
                      alt={item.name}
                      className={styles.cartThumb}
                    />
                    <div>
                      <span className={styles.cartName}>{item.name}</span>
                      <div className={styles.quantityControls}>
                        <span>{item.quantity}</span>
                      </div>
                      <span className={styles.cartPrice}>R{item.price}</span>
                      <span className={styles.cartSubtotal}>
                        Subtotal: R{item.price * item.quantity}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className={styles.cartTotal}>
              Total: R{calculateTotal()}
            </div>
          </div>
          <div className={styles.checkoutRight}>
            <h2 className={styles.sectionTitle}>Payment Details</h2>
            <p>
              To complete your purchase, kindly transfer the required amount to the following bank account:
            </p>
            <div className={styles.paymentDetails}>
              <p><strong>Account Name:</strong> NMG Zembeta Pty Ltd</p>
              <p><strong>Bank Name:</strong> Standard Bank</p>
              <p><strong>Account Number:</strong> 123456789</p>
              <p><strong>Branch Code:</strong> 051001</p>
              <p><strong>Reference:</strong> {orderId}</p>
            </div>
            <p>
              Once the transfer is complete, please upload a screenshot or proof of payment below to verify and process your order promptly. Thank you for your business.
            </p>
            <div className={styles.checkoutForm}>
              <input type="file" accept="image/*" onChange={handleFileUpload} disabled={isSubmitting} />
              <button 
                className={styles.submitButton}
                onClick={handleCheckout}
                disabled={isSubmitting || cartItems.length === 0}
              >
                {isSubmitting ? 'Processing...' : 'Complete Payment'}
              </button>
            </div>
          </div>
        </div>
      </section>
      {statusMessage && (
        <div className={`${styles.statusMessage} ${statusMessage.includes('Failed') ? styles.error : styles.success}`}>
          {statusMessage}
        </div>
      )}
    </main>
  );
};

export default CheckoutPage;
