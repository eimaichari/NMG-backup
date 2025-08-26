import React, { useState } from 'react';
import styles from './CheckoutPage.module.css';

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Pies', price: 50, quantity: 1, thumbnail: '/images/pies.jpg' },
    { id: 2, name: 'Noodles', price: 20, quantity: 2, thumbnail: '/images/noodles.jpg' },
  ]);
  const [statusMessage, setStatusMessage] = useState('');
  const [orderId] = useState(`ORD-${Math.floor(Math.random() * 1000000)}`);

  const handleIncreaseQuantity = (id) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handleDecreaseQuantity = (id) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const handleRemoveItem = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
    setStatusMessage('Item removed from cart');
    setTimeout(() => setStatusMessage(''), 3000);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setStatusMessage('Proof of payment uploaded');
      setTimeout(() => setStatusMessage(''), 3000);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

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
                      src={item.thumbnail}
                      alt={item.name}
                      className={styles.cartThumb}
                    />
                    <div>
                      <span className={styles.cartName}>{item.name}</span>
                      <div className={styles.quantityControls}>
                        <button
                          className={styles.qtyBtn}
                          onClick={() => handleDecreaseQuantity(item.id)}
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          className={styles.qtyBtn}
                          onClick={() => handleIncreaseQuantity(item.id)}
                        >
                          +
                        </button>
                      </div>
                      <span className={styles.cartPrice}>R{item.price}</span>
                      <span className={styles.cartSubtotal}>
                        Subtotal: R{item.price * item.quantity}
                      </span>
                    </div>
                    <button
                      className={styles.removeItem}
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>
            <div className={styles.cartTotal}>
              Total: R{calculateTotal()}
            </div>
            {statusMessage && (
              <div className={`${styles.statusMessage} ${statusMessage ? styles.success : ''}`}>
                {statusMessage}
              </div>
            )}
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
              <input type="file" accept="image/*" onChange={handleFileUpload} />
              <button className={styles.submitButton}>Complete Payment</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default CheckoutPage;