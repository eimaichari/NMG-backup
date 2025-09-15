import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useProducts } from '../../context/ProductContext';
import { db } from '../../utils/firebase';
import { collection, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import styles from './ProductsPage.module.css';
import { Link } from 'react-router-dom';

const ProductsPage = () => {
  const { user, isAuthenticated } = useAuth();
  const { products, loading: productsLoading, error } = useProducts();
  
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [statusMessage, setStatusMessage] = useState('');
  const [addingProducts, setAddingProducts] = useState(new Set()); 
  const [currentSlides, setCurrentSlides] = useState({});

  const categories = ['All', ...new Set(products.map((p) => p.category).filter(Boolean))];

  useEffect(() => {
    const intervals = {};
    products.forEach((product) => {
      if ((product.image_urls || [product.image_url]).length > 1) {
        intervals[product.id] = setInterval(() => {
          setCurrentSlides(prev => ({
            ...prev,
            [product.id]: (prev[product.id] || 0) + 1 >= (product.image_urls || [product.image_url]).length ? 0 : (prev[product.id] || 0) + 1
          }));
        }, 3000);
      }
    });
    return () => Object.values(intervals).forEach(clearInterval);
  }, [products]);

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
          image: product.image_urls?.[0] || product.image_url, // CHANGED: Use first image_url if available
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

  const handlePrev = (productId) => {
    setCurrentSlides(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) - 1 < 0 ? (products.find(p => p.id === productId).image_urls || [products.find(p => p.id === productId).image_url]).length - 1 : (prev[productId] || 0) - 1
    }));
  };

  const handleNext = (productId) => {
    setCurrentSlides(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1 >= (products.find(p => p.id === productId).image_urls || [products.find(p => p.id === productId).image_url]).length ? 0 : (prev[productId] || 0) + 1
    }));
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
                    <Link to={`/products/${product.id}`} className={styles.productLink}>
                      <div className={styles.carousel}>
                        {(product.image_urls || [product.image_url]).map((url, index) => (
                          <img
                            key={index}
                            src={url}
                            alt={`${product.name} ${index + 1}`}
                            className={`${styles.productImage} ${currentSlides[product.id] === index ? styles.active : ''}`} // CHANGED: Added active class for carousel
                            style={{ display: currentSlides[product.id] === index ? 'block' : 'none' }}
                          />
                        ))}
                        {(product.image_urls || [product.image_url]).length > 1 && (
                          <>
                            <button className={styles.prev} onClick={() => handlePrev(product.id)}>❮</button>
                            <button className={styles.next} onClick={() => handleNext(product.id)}>❯</button>
                          </>
                        )}
                      </div>
                      <h3 className={styles.productName}>{product.name}</h3>
                      <p className={styles.productDescription}>{product.description}</p>
                      <p className={styles.productPrice}>R{product.price_rands}</p>
                    </Link>
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