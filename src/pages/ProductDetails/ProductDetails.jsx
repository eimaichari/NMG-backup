import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useProducts } from '../../context/ProductContext';
import { db } from '../../utils/firebase';
import { collection, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import styles from './ProductDetails.module.css';

const ProductDetailsPage = () => {
  const { id } = useParams(); // Get the ID from the URL
  const { products, loading: productsLoading, error } = useProducts();
  const { user, isAuthenticated } = useAuth();
  
  const [statusMessage, setStatusMessage] = useState('');
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Find the product that matches the URL ID
  const product = products.find(p => p.id === id);

  // Filter for related products (excluding the current one)
  const relatedProducts = products.filter(p => p.id !== id).slice(0, 3);

  const addToCart = async (item) => {
    if (!isAuthenticated) {
      setStatusMessage('Please sign in to add items to your cart.');
      setTimeout(() => setStatusMessage(''), 3000);
      return;
    }
    
    setIsAddingToCart(true);

    try {
      const userCartRef = collection(db, 'users', user.uid, 'cart');
      const productRef = doc(userCartRef, String(item.id));

      const docSnap = await getDoc(productRef);

      if (docSnap.exists()) {
        const newQuantity = docSnap.data().quantity + 1;
        await updateDoc(productRef, { quantity: newQuantity });
        setStatusMessage(`${item.name} quantity updated in cart.`);
      } else {
        await setDoc(productRef, {
          productId: item.id,
          name: item.name,
          price: item.price_rands,
          image: item.image_url,
          quantity: 1,
          addedAt: new Date().toISOString(),
        });
        setStatusMessage(`${item.name} added to cart.`);
      }

    } catch (err) {
      console.error("Error adding to cart:", err);
      setStatusMessage('Failed to add item to cart. Please try again.');
    } finally {
      setIsAddingToCart(false);
      setTimeout(() => setStatusMessage(''), 3000);
    }
  };

  // Handle loading and product not found states
  if (productsLoading) {
    return <div>Loading product details...</div>;
  }
  if (!product) {
    return <div>Product not found.</div>;
  }

  return (
    <main>
      {/* Product Details Section */}
      <section className={styles.productDetailsSection}>
        <div className={styles.container}>
          <div className={styles.detailsWrap}>
            <div className={styles.productImageWrapper}>
              <img
                src={product.image_url}
                alt={product.name}
                className={styles.productImage}
              />
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
                  {isAddingToCart ? 'Adding to Cart...' : 'Add to Cart'}
                </button>
              </div>
            </div>
          </div>
          {statusMessage && (
            <div className={`${styles.statusMessage} ${statusMessage.includes('Failed') ? styles.error : styles.success}`}>
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
                <Link to={`/products/${item.id}`}>
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className={styles.productImage}
                  />
                  <h3 className={styles.productName}>{item.name}</h3>
                  <p className={styles.productDescription}>{item.description}</p>
                  <p className={styles.productPrice}>R{item.price_rands}</p>
                </Link>
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