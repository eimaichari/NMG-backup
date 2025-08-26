import React, { useState } from 'react';
import styles from './CartPage.module.css';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Pies', price: 50, quantity: 1, thumbnail: '/images/pies.jpg' },
    { id: 2, name: 'Noodles', price: 20, quantity: 2, thumbnail: '/images/noodles.jpg' },
  ]);
  const [statusMessage, setStatusMessage] = useState('');

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

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <main>
      <section className={styles.cartSection}>
        <div className={styles.container}>
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
          <div className={styles.cartActions}>
            <button className={styles.submitButton}>Proceed to Checkout</button>
            <a href="#" className={styles.continueShopping}>
              Continue Shopping
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};

export default CartPage;