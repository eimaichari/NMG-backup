import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useProducts } from '../../context/ProductContext';
import { db } from '../../utils/firebase';
import { collection, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import styles from './ProductDetails.module.css';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const { products, loading: productsLoading, error } = useProducts();
  const { user, isAuthenticated } = useAuth();
  
  const [statusMessage, setStatusMessage] = useState('');
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const product = products.find(p => p.id === id);
  const relatedProducts = products.filter(p => p.id !== id).slice(0, 3);

  // Helper function to get product images safely
  const getProductImages = (prod) => {
    if (Array.isArray(prod?.image_urls) && prod.image_urls.length > 0) {
      return prod.image_urls.filter(url => url);
    }
    if (prod?.image_url) {
      return [prod.image_url];
    }
    return ['/placeholder-image.png'];
  };

  useEffect(() => {
    if (product) {
      const images = getProductImages(product);
      if (images.length > 1) {
        const interval = setInterval(() => {
          setCurrentSlide(prev => (prev + 1) % images.length);
        }, 3000);
        return () => clearInterval(interval);
      }
    }
  }, [product]);

  const addToCart = async (item) => {
    if (!isAuthenticated) {
      setStatusMessage('❌ Please sign in to add items to your cart.');
      setTimeout(() => setStatusMessage(''), 3000);
      return;
    }
    
    setIsAddingToCart(true);

    try {
      const userCartRef = collection(db, 'users', user.uid, 'cart');
      const productRef = doc(userCartRef, String(item.id));

      const docSnap = await getDoc(productRef);

      const productImages = getProductImages(item);
      const productImage = productImages[0];

      if (docSnap.exists()) {
        const newQuantity = docSnap.data().quantity + 1;
        await updateDoc(productRef, { quantity: newQuantity });
        setStatusMessage(`✅ ${item.name} quantity updated in cart! Checkout now before we run out of stock! 🔥`);
      } else {
        await setDoc(productRef, {
          productId: item.id,
          name: item.name,
          price: item.price_rands,
          image: productImage,
          quantity: 1,
          addedAt: new Date().toISOString(),
        });
        setStatusMessage(`✅ ${item.name} added to cart! Checkout now before we run out of stock! 🔥`);
      }

    } catch (err) {
      console.error("Error adding to cart:", err);
      setStatusMessage('❌ Failed to add item to cart. Please try again.');
    } finally {
      setIsAddingToCart(false);
      setTimeout(() => setStatusMessage(''), 5000); // Show for 5 seconds
    }
  };

  if (productsLoading) {
    return <div className={styles.loading}>⏳ Loading product details...</div>;
  }
  
  if (error) {
    return <div className={styles.error}>❌ Error loading products: {error}</div>;
  }
  
  if (!product) {
    return <div className={styles.error}>❌ Product not found.</div>;
  }

  const productImages = getProductImages(product);

  const handlePrev = () => {
    setCurrentSlide(prev => (prev - 1 < 0 ? productImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide(prev => (prev + 1) % productImages.length);
  };

  return (
    <main>
      <section className={styles.productDetailsSection}>
        <div className={styles.container}>
          <div className={styles.detailsWrap}>
            <div className={styles.productImageWrapper}>
              <div className={styles.carousel}>
                {productImages.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`${product.name} ${index + 1}`}
                    className={`${styles.productImage} ${currentSlide === index ? styles.active : ''}`}
                    style={{ display: currentSlide === index ? 'block' : 'none' }}
                    onError={(e) => {
                      console.error(`Failed to load image: ${url}`);
                      e.target.src = '/placeholder-image.png';
                    }}
                  />
                ))}
                {productImages.length > 1 && (
                  <>
                    <button className={styles.prev} onClick={handlePrev}>❮</button>
                    <button className={styles.next} onClick={handleNext}>❯</button>
                  </>
                )}
              </div>
            </div>
            <div className={styles.productInfo}>
              <h1 className={styles.productName}>{product.name}</h1>
              <p className={styles.productDescription}>{product.description}</p>
              <p className={styles.productPrice}>R{product.price_rands}</p>
              <div className={styles.detailsActions}>
                <button
                  className={styles.addToCart}
                  onClick={() => addToCart(product)}
                  disabled={isAddingToCart}
                >
                  {isAddingToCart ? '⏳ Adding to Cart...' : 'Add to Cart'}
                </button>
              </div>
            </div>
          </div>
          {statusMessage && (
            <div className={`${styles.statusMessage} ${statusMessage.includes('❌') || statusMessage.includes('Failed') ? styles.error : styles.success}`}>
              {statusMessage}
            </div>
          )}
        </div>
      </section>

      <section className={styles.relatedProductsSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>You may also like</h2>
          <div className={styles.productGrid}>
            {relatedProducts.map((item) => {
              const itemImages = getProductImages(item);
              return (
                <div key={item.id} className={styles.productCard}>
                  <Link to={`/products/${item.id}`}>
                    <img
                      src={itemImages[0]}
                      alt={item.name}
                      className={styles.productImage}
                      onError={(e) => {
                        e.target.src = '/placeholder-image.png';
                      }}
                    />
                    <h3 className={styles.productName}>{item.name}</h3>
                    <p className={styles.productDescription}>{item.description}</p>
                    <p className={styles.productPrice}>R{item.price_rands}</p>
                  </Link>
                  <button
                    className={styles.addToCart}
                    onClick={() => addToCart(item)}
                    disabled={isAddingToCart}
                  >
                    {isAddingToCart ? '⏳ Adding...' : 'Add to Cart'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
};

export default ProductDetailsPage;