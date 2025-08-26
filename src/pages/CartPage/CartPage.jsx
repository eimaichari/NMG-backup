import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './CartPage.module.css';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([
    // Mock cart data (using products from previous mocks)
    { id: 1, name: 'Eco-Friendly Detergent', price: 15.99, quantity: 2, image: '/images/laundry-detergent.jpg' },
    { id: 4, name: 'Chicken Pie', price: 5.99, quantity: 1, image: '/images/chicken-pie.jpg' },
    { id: 7, name: 'Kids Lunchbox Set', price: 12.99, quantity: 3, image: '/images/kids-lunchbox.jpg' },
  ]);

  useEffect(() => {
    document.body.classList.add('loaded');

    // Mock GSAP/ScrollTrigger if needed
    // gsap.from(`.${styles.cartItem}`, { opacity: 0, y: 50, stagger: 0.1 });

    return () => {
      document.body.classList.remove('loaded');
    };
  }, []);

  const updateQuantity = (id, delta) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  const handleCheckout = () => {
    // Mock checkout action
    alert('Proceeding to checkout...');
    // Or navigate to /checkout if implemented
  };

  return (
    <>
      {/* TopNavigation component will go here */}

      <main>
        <section className={`${styles.cart} section`}>
          <div className="container">
            <h2 className={styles.sectionTitle}>Your Cart</h2>
            <div id="cart-items" className={styles.cartItems}>
              {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
              ) : (
                cartItems.map(item => (
                  <div key={item.id} className={styles.cartItem}>
                    <img src={item.image} alt={item.name} className={styles.cartThumb} />
                    <div>
                      <span className={styles.cartName}>{item.name}</span>
                      <p className={styles.cartPrice}>R{item.price.toFixed(2)}</p>
                      <div className={styles.quantityControls}>
                        <button className={styles.qtyBtn} onClick={() => updateQuantity(item.id, -1)}>-</button>
                        <span>{item.quantity}</span>
                        <button className={styles.qtyBtn} onClick={() => updateQuantity(item.id, 1)}>+</button>
                      </div>
                      <button className={styles.removeItem} onClick={() => removeItem(item.id)}>Remove</button>
                    </div>
                    <span className={styles.cartSubtotal}>R{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))
              )}
            </div>
            <div className={styles.cartTotal}>
              <h3>Total: R<span id="total-price">{calculateTotal()}</span></h3>
            </div>
            <button id="proceed-to-checkout" className={styles.submitButton} onClick={handleCheckout}>Proceed to Checkout</button>
            <Link to="/products" className={styles.continueShopping}>Continue Shopping</Link>
          </div>
        </section>
      </main>

      {/* Footer component will go here */}
    </>
  );
};

export default CartPage;