import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useProducts } from '../../context/ProductContext';
import { db } from '../../utils/firebase';
import { collection, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import styles from './ProductsPage.module.css';
import { Link } from 'react-router-dom'; // Import Link

const ProductsPage = () => {
  const { user, isAuthenticated } = useAuth();
  const { products, loading: productsLoading, error } = useProducts();
  
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [statusMessage, setStatusMessage] = useState('');
  const [addingProducts, setAddingProducts] = useState(new Set()); 

  const categories = ['All', ...new Set(products.map((p) => p.category).filter(Boolean))];

  const addToCart = async (product) => {
    if (!isAuthenticated) {
      setStatusMessage('Please sign in to add items to your cart.');
      setTimeout(() => setStatusMessage(''), 3000);
      return;
    }
    
    setAddingProducts(prev => new Set(prev).add(product.id));

    try {
      const userCartRef = collection(db, 'users', user.uid, 'cart');
      const productRef = doc(userCartRef, String(product.id));

      const docSnap = await getDoc(productRef);

      if (docSnap.exists()) {
        const newQuantity = docSnap.data().quantity + 1;
        await updateDoc(productRef, { quantity: newQuantity });
        setStatusMessage(`${product.name} quantity updated in cart.`);
      } else {
        await setDoc(productRef, {
          productId: product.id,
          name: product.name,
          price: product.price_rands,
          image: product.image_url,
          quantity: 1,
          addedAt: new Date().toISOString(),
        });
        setStatusMessage(`${product.name} added to cart.`);
      }

    } catch (err) {
      console.error("Error adding to cart:", err);
      setStatusMessage('Failed to add item to cart. Please try again.');
    } finally {
      setAddingProducts(prev => {
        const newSet = new Set(prev);
        newSet.delete(product.id);
        return newSet;
      });
      setTimeout(() => setStatusMessage(''), 3000);
    }
  };

  const filterProducts = () => {
    if (selectedCategory === 'All') {
      return products;
    }
    return products.filter((product) => product.category === selectedCategory);
  };

  return (
    <main>
      <section className={styles.productsHero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Our Products</h1>
          <p className={styles.heroSubtitle}>
            Browse our range of high-quality products across categories.
          </p>
        </div>
      </section>

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
          {productsLoading ? (
            <div className={styles.loading}>Loading products...</div>
          ) : error ? (
            <div className={styles.error}>Error: {error}</div>
          ) : (
            <div className={styles.productGrid}>
              {filterProducts().length > 0 ? (
                filterProducts().map((product) => (
                  <div key={product.id} className={styles.productCard}>
                    {/* Wrap the product card content in a Link */}
                    <Link to={`/products/${product.id}`} className={styles.productLink}>
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className={styles.productImage}
                      />
                      <h3 className={styles.productName}>{product.name}</h3>
                      <p className={styles.productDescription}>{product.description}</p>
                      <p className={styles.productPrice}>R{product.price_rands}</p>
                    </Link>
                    {/* Keep the button outside the link */}
                    <button
                      className={styles.addToCart}
                      disabled={addingProducts.has(product.id)} 
                      onClick={() => addToCart(product)}
                    >
                      {addingProducts.has(product.id) ? 'Adding to Cart...' : 'Add to Cart'}
                    </button>
                  </div>
                ))
              ) : (
                <p>No products found for this category.</p>
              )}
            </div>
          )}
          {statusMessage && (
            <div className={`${styles.statusMessage} ${statusMessage.includes('Failed') ? styles.error : styles.success}`}>
              {statusMessage}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default ProductsPage;
