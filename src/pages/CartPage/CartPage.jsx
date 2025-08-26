import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../utils/useCart';
import styles from './CartPage.module.css';

const CartPage = () => {
  const { cartItems, loading, error, removeItem, increaseQuantity, decreaseQuantity } = useCart();
  const [statusMessage, setStatusMessage] = useState('');
  const navigate = useNavigate();

  const handleRemoveItem = async (id) => {
    await removeItem(id);
    setStatusMessage('Item removed from cart');
    setTimeout(() => setStatusMessage(''), 3000);
  };

  const handleIncreaseQuantity = async (id) => {
    await increaseQuantity(id);
  };

  const handleDecreaseQuantity = async (id) => {
    await decreaseQuantity(id);
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  if (loading) {
    return <div className={styles.loading}>Loading cart...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

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
                    src={item.image}
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
            <div className={`${styles.statusMessage} ${statusMessage.includes('removed') ? styles.success : styles.error}`}>
              {statusMessage}
            </div>
          )}
          <div className={styles.cartActions}>
            <button 
              className={styles.submitButton}
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout
            </button>
            <Link to="/products" className={styles.continueShopping}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default CartPage;