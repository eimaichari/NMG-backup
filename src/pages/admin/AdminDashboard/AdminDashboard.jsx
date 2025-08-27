import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useProducts } from '../../../context/ProductContext';
import { Link, Navigate } from 'react-router-dom';
import styles from './AdminDashboard.module.css';

const AdminDashboard = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { products, loading: productsLoading, error, addProduct, deleteProduct, toggleAvailability } = useProducts();
  
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price_rands: '',
    image_url: '',
  });
  const [formError, setFormError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // New state for submission status

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent multiple clicks

    if (!formData.name || !formData.price_rands || !formData.image_url) {
      setFormError('Name, price, and image URL are required');
      return;
    }

    setIsSubmitting(true); // Start submitting
    setFormError(null);

    try {
      await addProduct(formData);
      setFormData({ name: '', description: '', price_rands: '', image_url: '' });
      setShowForm(false);
    } catch (err) {
      setFormError('Failed to add product');
    } finally {
      setIsSubmitting(false); // End submitting
    }
  };


  if (authLoading) {
    return <div className={styles.loading}>Authenticating...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.sectionTitle}>Admin Dashboard</h2>
      <button className={styles.addButton} onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Cancel' : 'Add Product +'}
      </button>

      {showForm && (
        <form className={styles.productForm} onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Product Name"
            className={styles.input}
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Product Description"
            className={styles.input}
          />
          <input
            type="number"
            name="price_rands"
            value={formData.price_rands}
            onChange={handleInputChange}
            placeholder="Price (Rands)"
            className={styles.input}
          />
          <input
            type="text"
            name="image_url"
            value={formData.image_url}
            onChange={handleInputChange}
            placeholder="Image URL"
            className={styles.input}
          />
          {formError && <p className={styles.error}>{formError}</p>}
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={isSubmitting} // Disable the button while submitting
          >
            {isSubmitting ? 'Adding...' : 'Add Product'}
          </button>
        </form>
      )}

      <div className={styles.productList}>
        <h3 className={styles.sectionTitle}>Products</h3>
        {error && <p className={styles.error}>{error}</p>}
        {productsLoading ? (
          <p className={styles.loading}>Loading products...</p>
        ) : (
          products.length > 0 ? (
            products.map((product) => (
              <div key={product.id} className={styles.productItem}>
                <img src={product.image_url} alt={product.name} className={styles.productThumb} />
                <div>
                  <span className={styles.productName}>{product.name}</span>
                  <p>{product.description}</p>
                  <p>Price: R{product.price_rands}</p>
                  <p>Status: {product.available ? 'Available' : 'Unavailable'}</p>
                </div>
                <div className={styles.actions}>
                  <button
                    onClick={() => toggleAvailability(product.id, product.available)}
                    className={styles.toggleButton}
                  >
                    {product.available ? 'Set Unavailable' : 'Set Available'}
                  </button>
                  <button onClick={() => deleteProduct(product.id)} className={styles.deleteButton}>
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No products available.</p>
          )
        )}
      </div>

      <Link to="/products" className={styles.continueShopping}>
        Back to Products
      </Link>
    </div>
  );
};

export default AdminDashboard;