import React, { useState } from "react";
import styles from "./CheckoutPage.module.css";

// Mock cart data
const mockCart = [
  {
    id: 1,
    name: "Product 1",
    price: 250,
    quantity: 1,
    image: "/images/product1.jpg",
  },
  {
    id: 2,
    name: "Product 2",
    price: 400,
    quantity: 2,
    image: "/images/product2.jpg",
  },
];

const CheckoutPage = () => {
  const [cart, setCart] = useState(mockCart);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    account: "",
    branch: "",
    notes: "",
  });
  const [statusMessage, setStatusMessage] = useState("");

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <main>
      <section className={styles.checkout}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Your Cart</h2>

          <div>
            {cart.map((item) => (
              <div key={item.id} className={styles.cartItem}>
                <img
                  src={item.image}
                  alt={item.name}
                  className={styles.cartThumb}
                />
                <div>
                  <a href="#" className={styles.cartName}>
                    {item.name}
                  </a>
                  <div className={styles.cartPrice}>R{item.price}</div>
                  <div className={styles.quantityControls}>
                    <button className={styles.qtyBtn}>-</button>
                    <span>{item.quantity}</span>
                    <button className={styles.qtyBtn}>+</button>
                  </div>
                  <button className={styles.removeItem}>Remove</button>
                </div>
                <div className={styles.cartSubtotal}>
                  R{item.price * item.quantity}
                </div>
              </div>
            ))}
          </div>

          <div className={styles.cartTotal}>
            <h3>Total: R{totalPrice}</h3>
          </div>

          <h3>EFT Payment Details</h3>
          <form className={styles.eftForm}>
            <input type="text" placeholder="Full Name" required />
            <input type="email" placeholder="Email" required />
            <input type="text" placeholder="Bank Account Number" required />
            <input type="text" placeholder="Branch Code" required />
            <textarea placeholder="Additional Notes" rows="3"></textarea>
            <button type="submit" className={styles.submitButton}>
              Complete EFT Payment
            </button>
          </form>

          {statusMessage && (
            <p className={`${styles.eftNote} ${styles.success}`}>
              {statusMessage}
            </p>
          )}
        </div>
      </section>
    </main>
  );
};

export default CheckoutPage;
