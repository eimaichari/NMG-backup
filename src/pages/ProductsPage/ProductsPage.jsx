import React, { useEffect, useState } from 'react';
import styles from './ProductsPage.module.css';

const ProductsPage = () => {
  const [activeCategory, setActiveCategory] = useState('laundry');

  // Mock products data
  const products = [
    // Laundry
    { id: 1, category: 'laundry', name: 'Eco-Friendly Detergent', description: 'Biodegradable and effective on tough stains.', price: 15.99, image: '/images/laundry-detergent.jpg' },
    { id: 2, category: 'laundry', name: 'Fabric Softener', description: 'Keeps clothes soft and fresh.', price: 9.99, image: '/images/fabric-softener.jpg' },
    { id: 3, category: 'laundry', name: 'Stain Remover', description: 'Removes stubborn stains easily.', price: 7.49, image: '/images/stain-remover.jpg' },

    // Pies & Noodles
    { id: 4, category: 'pies-noodles', name: 'Chicken Pie', description: 'Delicious homemade chicken pie.', price: 5.99, image: '/images/chicken-pie.jpg' },
    { id: 5, category: 'pies-noodles', name: 'Vegetable Noodles', description: 'Healthy and flavorful noodles.', price: 4.49, image: '/images/vegetable-noodles.jpg' },
    { id: 6, category: 'pies-noodles', name: 'Beef Pie', description: 'Savory beef pie with rich filling.', price: 6.49, image: '/images/beef-pie.jpg' },

    // Lunchbox
    { id: 7, category: 'lunchbox', name: 'Kids Lunchbox Set', description: 'Colorful and practical lunchbox.', price: 12.99, image: '/images/kids-lunchbox.jpg' },
    { id: 8, category: 'lunchbox', name: 'Insulated Lunch Bag', description: 'Keeps food warm or cold.', price: 18.99, image: '/images/insulated-lunchbag.jpg' },
    { id: 9, category: 'lunchbox', name: 'Party Pack Snacks', description: 'Assorted snacks for parties.', price: 10.99, image: '/images/party-snacks.jpg' },

    // Gifts
    { id: 10, category: 'gifts', name: 'Custom Embroidered Mug', description: 'Personalized mug with embroidery.', price: 14.99, image: '/images/embroidered-mug.jpg' },
    { id: 11, category: 'gifts', name: 'Branded Keychain', description: 'Custom branded keychain.', price: 5.99, image: '/images/keychain.jpg' },
    { id: 12, category: 'gifts', name: 'Gift Basket', description: 'Assorted goodies in a basket.', price: 29.99, image: '/images/gift-basket.jpg' },

    // Supply
    { id: 13, category: 'supply', name: 'Office Stationery Set', description: 'Pens, notebooks, and more.', price: 19.99, image: '/images/stationery-set.jpg' },
    { id: 14, category: 'supply', name: 'Corporate Notebooks', description: 'Branded notebooks for business.', price: 8.99, image: '/images/notebooks.jpg' },
    { id: 15, category: 'supply', name: 'Delivery Supplies', description: 'Packaging materials.', price: 25.99, image: '/images/delivery-supplies.jpg' },
  ];

  const filteredProducts = products.filter(product => product.category === activeCategory);

  useEffect(() => {
    document.body.classList.add('loaded');

    // Handle tab clicks
    const tabs = document.querySelectorAll(`.${styles.tabButton}`);
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        setActiveCategory(tab.dataset.category);
      });
    });

    // Mock GSAP/ScrollTrigger animations if needed
    // gsap.from(`.${styles.productCard}`, { opacity: 0, y: 50, stagger: 0.1, scrollTrigger: { trigger: `.${styles.productGrid}` } });

    return () => {
      document.body.classList.remove('loaded');
      // Cleanup event listeners if necessary
    };
  }, []);

  return (
    <>
      {/* TopNavigation component will go here */}

      <main>
        <header className={`${styles.productsHero} section`}>
          <div className={`container ${styles.heroContent}`}>
            <h1 className={styles.heroTitle}>Our Products</h1>
            <p className={styles.heroSubtitle}>Browse our range of high-quality products across categories.</p>
          </div>
        </header>

        <section className={`${styles.productCategories} section`}>
          <div className="container">
            <div className={styles.categoryTabs}>
              <button className={`${styles.tabButton} active`} data-category="laundry">Laundry</button>
              <button className={styles.tabButton} data-category="pies-noodles">Pies & Noodles</button>
              <button className={styles.tabButton} data-category="lunchbox">Lunchbox</button>
              <button className={styles.tabButton} data-category="gifts">Gifts</button>
              <button className={styles.tabButton} data-category="supply">Supply</button>
            </div>

            <h2 className={styles.sectionTitle}>Featured Products</h2>
            <div className={styles.productGrid} id="product-grid">
              {filteredProducts.map(product => (
                <div key={product.id} className={styles.productCard}>
                  <img src={product.image} alt={product.name} className={styles.productImage} />
                  <h3 className={styles.productName}>{product.name}</h3>
                  <p className={styles.productDescription}>{product.description}</p>
                  <p className={styles.productPrice}>${product.price.toFixed(2)}</p>
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

export default ProductsPage;