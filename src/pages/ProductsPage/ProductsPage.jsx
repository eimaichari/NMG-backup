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

  // Helper function to get product images safely
  const getProductImages = (product) => {
    // Check if image_urls exists and is an array with items
    if (Array.isArray(product.image_urls) && product.image_urls.length > 0) {
      return product.image_urls.filter(url => url); // Filter out any null/undefined
    }
    // Fallback to single image_url if it exists
    if (product.image_url) {
      return [product.image_url];
    }
    // Return placeholder if no images
    return ['/placeholder-image.png']; // Make sure you have a placeholder image
  };

  useEffect(() => {
    const intervals = {};
    products.forEach((product) => {
      const images = getProductImages(product);
      if (images.length > 1) {
        intervals[product.id] = setInterval(() => {
          setCurrentSlides(prev => ({
            ...prev,
            [product.id]: ((prev[product.id] || 0) + 1) % images.length
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
      
      // Get the first valid image
      const productImages = getProductImages(product);
      const productImage = productImages[0];

      if (docSnap.exists()) {
        const newQuantity = docSnap.data().quantity + 1;
        await updateDoc(productRef, { quantity: newQuantity });
        setStatusMessage(`${product.name} quantity updated in cart.`);
      } else {
        await setDoc(productRef, {
          productId: product.id,
          name: product.name,
          price: product.price_rands,
          image: productImage,
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

  const handlePrev = (productId, e) => {
    e.preventDefault(); // Prevent link navigation
    e.stopPropagation();
    const product = products.find(p => p.id === productId);
    const images = getProductImages(product);
    setCurrentSlides(prev => ({
      ...prev,
      [productId]: ((prev[productId] || 0) - 1 + images.length) % images.length
    }));
  };

  const handleNext = (productId, e) => {
    e.preventDefault(); // Prevent link navigation
    e.stopPropagation();
    const product = products.find(p => p.id === productId);
    const images = getProductImages(product);
    setCurrentSlides(prev => ({
      ...prev,
      [productId]: ((prev[productId] || 0) + 1) % images.length
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
                filterProducts().map((product) => {
                  const images = getProductImages(product);
                  const currentSlide = currentSlides[product.id] || 0;
                  
                  return (
                    <div key={product.id} className={styles.productCard}>
                      <Link to={`/products/${product.id}`} className={styles.productLink}>
                        <div className={styles.carousel}>
                          {images.map((url, index) => (
                            <img
                              key={index}
                              src={url}
                              alt={`${product.name} ${index + 1}`}
                              className={`${styles.productImage} ${currentSlide === index ? styles.active : ''}`}
                              style={{ display: currentSlide === index ? 'block' : 'none' }}
                              onError={(e) => {
                                console.error(`Failed to load image: ${url}`);
                                e.target.src = '/placeholder-image.png'; // Fallback image
                              }}
                            />
                          ))}
                          {images.length > 1 && (
                            <>
                              <button 
                                className={styles.prev} 
                                onClick={(e) => handlePrev(product.id, e)}
                                type="button"
                              >
                                ❮
                              </button>
                              <button 
                                className={styles.next} 
                                onClick={(e) => handleNext(product.id, e)}
                                type="button"
                              >
                                ❯
                              </button>
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
                  );
                })
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