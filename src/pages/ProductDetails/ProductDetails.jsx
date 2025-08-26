import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './ProductDetails.module.css';

const ProductDetails = () => {
  const { id } = useParams();
  const productId = parseInt(id, 10);

  // Mock products data (same as ProductsPage)
  const products = [
    { id: 1, category: 'laundry', name: 'Eco-Friendly Detergent', description: 'Biodegradable and effective on tough stains.', price: 15.99, image: '/images/laundry-detergent.jpg' },
    { id: 2, category: 'laundry', name: 'Fabric Softener', description: 'Keeps clothes soft and fresh.', price: 9.99, image: '/images/fabric-softener.jpg' },
    { id: 3, category: 'laundry', name: 'Stain Remover', description: 'Removes stubborn stains easily.', price: 7.49, image: '/images/stain-remover.jpg' },
    { id: 4, category: 'pies-noodles', name: 'Chicken Pie', description: 'Delicious homemade chicken pie.', price: 5.99, image: '/images/chicken-pie.jpg' },
    { id: 5, category: 'pies-noodles', name: 'Vegetable Noodles', description: 'Healthy and flavorful noodles.', price: 4.49, image: '/images/vegetable-noodles.jpg' },
    { id: 6, category: 'pies-noodles', name: 'Beef Pie', description: 'Savory beef pie with rich filling.', price: 6.49, image: '/images/beef-pie.jpg' },
    { id: 7, category: 'lunchbox', name: 'Kids Lunchbox Set', description: 'Colorful and practical lunchbox.', price: 12.99, image: '/images/kids-lunchbox.jpg' },
    { id: 8, category: 'lunchbox', name: 'Insulated Lunch Bag', description: 'Keeps food warm or cold.', price: 18.99, image: '/images/insulated-lunchbag.jpg' },
    { id: 9, category: 'lunchbox', name: 'Party Pack Snacks', description: 'Assorted snacks for parties.', price: 10.99, image: '/images/party-snacks.jpg' },
    { id: 10, category: 'gifts', name: 'Custom Embroidered Mug', description: 'Personalized mug with embroidery.', price: 14.99, image: '/images/embroidered-mug.jpg' },
    { id: 11, category: 'gifts', name: 'Branded Keychain', description: 'Custom branded keychain.', price: 5.99, image: '/images/keychain.jpg' },
    { id: 12, category: 'gifts', name: 'Gift Basket', description: 'Assorted goodies in a basket.', price: 29.99, image: '/images/gift-basket.jpg' },
    { id: 13, category: 'supply', name: 'Office Stationery Set', description: 'Pens, notebooks, and more.', price: 19.99, image: '/images/stationery-set.jpg' },
    { id: 14, category: 'supply', name: 'Corporate Notebooks', description: 'Branded notebooks for business.', price: 8.99, image: '/images/notebooks.jpg' },
    { id: 15, category: 'supply', name: 'Delivery Supplies', description: 'Packaging materials.', price: 25.99, image: '/images/delivery-supplies.jpg' },
  ];

  const product = products.find(p => p.id === productId);

  const relatedProducts = products
    .filter(p => p.category === product?.category && p.id !== productId)
    .slice(0, 3); // Limit to 3 for display

  useEffect(() => {
    document.body.classList.add('loaded');

    // Mock GSAP/ScrollTrigger if needed
    // gsap.from(`.${styles.productCard}`, { opacity: 0, y: 50, stagger: 0.1 });

    return () => {
      document.body.classList.remove('loaded');
    };
  }, []);

  if (!product) {
    return (
      <main>
        <section className={`${styles.productDetails} section`}>
          <div className="container">
            <p>Product not found.</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <>
      {/* TopNavigation component will go here */}

      <main>
        <section className={`${styles.productDetails} section`}>
          <div className="container">
            <div id="product-info" className={styles.productInfo}>
              <img src={product.image} alt={product.name} className={styles.productImage} />
              <h2 className={styles.productName}>{product.name}</h2>
              <p className={styles.productDescription}>{product.description}</p>
              <p className={styles.productPrice}>${product.price.toFixed(2)}</p>
              <button className={styles.addToCart}>Add to Cart</button>
            </div>
          </div>
        </section>

        <section className={`${styles.relatedProducts} section`}>
          <div className="container">
            <h3>You may also like</h3>
            <div id="related-products" className={styles.productGrid}>
              {relatedProducts.map(rel => (
                <div key={rel.id} className={styles.productCard}>
                  <img src={rel.image} alt={rel.name} className={styles.productImage} />
                  <h4 className={styles.productName}>{rel.name}</h4>
                  <p className={styles.productPrice}>${rel.price.toFixed(2)}</p>
                  <button className={styles.addToCart}>Add to Cart</button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer component will go here */}
    </>
  );
};

export default ProductDetails;