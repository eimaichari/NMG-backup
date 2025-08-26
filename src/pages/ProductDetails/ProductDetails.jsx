import React, { useState } from 'react';
import styles from './ProductDetails.module.css';

const ProductDetailsPage = () => {
  const [cart, setCart] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');

  // Mock data for the main product
  const product = {
    id: 1,
    name: 'Pies',
    description: 'Delicious homemade pies for resale, events, or meals. Perfectly baked with fresh ingredients.',
    price: 50,
    image: '/images/pies.jpg',
    category: 'Food',
  };

  // Mock data for related products
  const relatedProducts = [
    {
      id: 2,
      name: 'Noodles',
      description: 'Quick and tasty instant noodles for everyday convenience.',
      price: 20,
      image: '/images/noodles.jpg',
      category: 'Food',
    },
    {
      id: 3,
      name: 'Lunchbox Treats',
      description: 'Snack packs designed for school or office lunchboxes.',
      price: 30,
      image: '/images/lunch-box.jpg',
      category: 'Food',
    },
    {
      id: 4,
      name: 'Party Packs',
      description: 'Custom party packs for birthdays, schools, and events.',
      price: 100,
      image: '/images/party-packs.jpg',
      category: 'Food',
    },
  ];

  const addToCart = (item) => {
    setCart((prevCart) => [
      ...prevCart,
      { ...item, quantity: 1 },
    ]);
    setStatusMessage(`${item.name} added to cart`);
    setTimeout(() => setStatusMessage(''), 3000);
  };

  return (
    <main>
      {/* Product Details Section */}
      <section className={styles.productDetailsSection}>
        <div className={styles.container}>
          <div className={styles.detailsWrap}>
            <div className={styles.productImageWrapper}>
              <img
                src={product.image}
                alt={product.name}
                className={styles.productImage}
              />
            </div>
            <div className={styles.productInfo}>
              <h1 className={styles.productName}>{product.name}</h1>
              <p className={styles.productDescription}>{product.description}</p>
              <p className={styles.productPrice}>R{product.price}</p>
              <div className={styles.detailsActions}>
                <button
                  className={styles.addToCart}
                  onClick={() => addToCart(product)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
          {statusMessage && (
            <div className={`${styles.statusMessage} ${statusMessage ? styles.success : ''}`}>
              {statusMessage}
            </div>
          )}
        </div>
      </section>

      {/* Related Products Section */}
      <section className={styles.relatedProductsSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>You may also like</h2>
          <div className={styles.productGrid}>
            {relatedProducts.map((item) => (
              <div key={item.id} className={styles.productCard}>
                <img
                  src={item.image}
                  alt={item.name}
                  className={styles.productImage}
                />
                <h3 className={styles.productName}>{item.name}</h3>
                <p className={styles.productDescription}>{item.description}</p>
                <p className={styles.productPrice}>R{item.price}</p>
                <button
                  className={styles.addToCart}
                  onClick={() => addToCart(item)}
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default ProductDetailsPage;