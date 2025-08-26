import React, { useState } from 'react';
import styles from './ProductsPage.module.css';

const ProductsPage = () => {
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [statusMessage, setStatusMessage] = useState('');

  // Mock data for categories
  const categories = ['All', 'Laundry', 'Pies & Noodles', 'Lunchbox', 'Gifts', 'Supply'];

  // Mock data for products
  const products = [
    {
      id: 1,
      name: 'Pies',
      description: 'Delicious homemade pies for resale, events, or meals.',
      price: 50,
      image: '/images/pies.jpg',
      category: 'Pies & Noodles',
    },
    {
      id: 2,
      name: 'Noodles',
      description: 'Quick and tasty instant noodles for everyday convenience.',
      price: 20,
      image: '/images/noodles.jpg',
      category: 'Pies & Noodles',
    },
    {
      id: 3,
      name: 'Lunchbox Treats',
      description: 'Snack packs designed for school or office lunchboxes.',
      price: 30,
      image: '/images/lunch-box.jpg',
      category: 'Lunchbox',
    },
    {
      id: 4,
      name: 'Party Packs',
      description: 'Custom party packs for birthdays, schools, and events.',
      price: 100,
      image: '/images/party-packs.jpg',
      category: 'Lunchbox',
    },
    {
      id: 5,
      name: 'Embroidered Gifts',
      description: 'Custom embroidery and personalized promotional gifts.',
      price: 150,
      image: '/images/gift.jpg',
      category: 'Gifts',
    },
    {
      id: 6,
      name: 'Corporate Stationery',
      description: 'Branded corporate packs and office supplies.',
      price: 200,
      image: '/images/supply.jpg',
      category: 'Supply',
    },
    {
      id: 7,
      name: 'Laundry Service',
      description: 'Affordable and reliable laundry services.',
      price: 80,
      image: '/images/laundry.jpg',
      category: 'Laundry',
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

  const filterProducts = () => {
    if (selectedCategory === 'All') {
      return products;
    }
    return products.filter((product) => product.category === selectedCategory);
  };

  return (
    <main>
      {/* Products Hero Section */}
      <section className={styles.productsHero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Our Products</h1>
          <p className={styles.heroSubtitle}>
            Browse our range of high-quality products across categories.
          </p>
        </div>
      </section>

      {/* Category Tabs and Product Grid Section */}
      <section className={styles.productsSection}>
        <div className={styles.container}>
          <div className={styles.categoryTabs}>
            {categories.map((category) => (
              <button
                key={category}
                className={`${styles.tabButton} ${selectedCategory === category ? styles.active : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
          <h2 className={styles.sectionTitle}>Featured Products</h2>
          <div className={styles.productGrid}>
            {filterProducts().map((product) => (
              <div key={product.id} className={styles.productCard}>
                <img
                  src={product.image}
                  alt={product.name}
                  className={styles.productImage}
                />
                <h3 className={styles.productName}>{product.name}</h3>
                <p className={styles.productDescription}>{product.description}</p>
                <p className={styles.productPrice}>R{product.price}</p>
                <button
                  className={styles.addToCart}
                  onClick={() => addToCart(product)}
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
          {statusMessage && (
            <div className={`${styles.statusMessage} ${statusMessage ? styles.success : ''}`}>
              {statusMessage}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default ProductsPage;