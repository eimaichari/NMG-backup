import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useProducts } from '../../../context/ProductContext';
import { Link, Navigate } from 'react-router-dom';
import { storage } from '../../../utils/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import styles from './AdminDashboard.module.css';

const AdminDashboard = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { products, categories, loading: productsLoading, error, addProduct, addCategory, deleteProduct, toggleAvailability, updateProduct } = useProducts();
  
  const [showForm, setShowForm] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [editProductId, setEditProductId] = useState(null); // State to track which product is being edited
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    price_rands: '',
    image_urls: ['', '', ''], // CHANGED: Initialized as array for multiple images
    category: '',
  });
  const [imageFiles, setImageFiles] = useState([null, null, null]); // CHANGED: Array for multiple image files
  const [formError, setFormError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle text inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle file upload for multiple images
  // REMOVED: Old handleImageChange that only handled one file
  // ADDED: New handleImageChange to support multiple image uploads
  const handleImageChange = (e, index) => {
    if (e.target.files[0]) {
      const newImageFiles = [...imageFiles];
      newImageFiles[index] = e.target.files[0];
      setImageFiles(newImageFiles);
    }
  };

  // Submit product (add or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    // CHANGED: Updated validation to check at least one image file
    if (!formData.name || !formData.price_rands || !formData.category || !imageFiles.some(file => file !== null)) {
      setFormError('Name, price, category, and at least one image are required');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      // Upload images to Firebase Storage
      const imageUrls = await Promise.all(imageFiles.map(async (file, index) => {
        if (file) {
          const imageRef = ref(storage, `products-services/${Date.now()}_${index}_${file.name}`);
          await uploadBytes(imageRef, file);
          return await getDownloadURL(imageRef);
        }
        return formData.image_urls[index] || ''; // Preserve existing URLs if no new file
      }));

      const productData = { ...formData, image_urls: imageUrls.filter(url => url) };

      if (editProductId) {
        await updateProduct(editProductId, productData);
        setEditProductId(null);
      } else {
        await addProduct(productData);
      }

      // RESET FORM: Clear form data after submission
      setFormData({ id: '', name: '', description: '', price_rands: '', image_urls: ['', '', ''], category: '' });
      setImageFiles([null, null, null]);
      setShowForm(false);
    } catch (err) {
      setFormError('Failed to save product: ' + err.message); // ADDED: Include error message for debugging
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit button click
  // CHANGED: Ensure form is shown and pre-filled when editing
  const handleEdit = (product) => {
    setEditProductId(product.id);
    setFormData({
      id: product.id,
      name: product.name,
      description: product.description,
      price_rands: product.price_rands,
      image_urls: product.image_urls || [product.image_url || '', '', ''], // Handle single image_url or array
      category: product.category,
    });
    setImageFiles([null, null, null]); // Clear image files for new uploads
    setShowForm(true); // Ensure form is visible
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory) return;
    await addCategory(newCategory);
    setNewCategory("");
  };

  if (authLoading) return <div className={styles.loading}>Authenticating...</div>;
  if (!isAuthenticated) return <Navigate to="/login" />;

  return (
    <div className={styles.container}>
      <h2 className={styles.sectionTitle}>Admin Dashboard</h2>

      <button className={styles.addButton} onClick={() => { setShowForm(true); setEditProductId(null); }}>
        {showForm ? 'Cancel' : 'Add Product +'}
      </button>

      {showForm && (
        <form className={styles.productForm} onSubmit={handleSubmit}>
          <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Product Name" className={styles.input} />
          <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Product Description" className={styles.input} />
          <input type="number" name="price_rands" value={formData.price_rands} onChange={handleInputChange} placeholder="Price (Rands)" className={styles.input} />

          <select name="category" value={formData.category} onChange={handleInputChange} className={styles.input}>
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>

          <div className={styles.newCategory}>
            <input type="text" placeholder="New Category" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className={styles.input} />
            <button onClick={handleAddCategory} type="button" className={styles.submitButton}>+ Add Category</button>
          </div>

          <div className={styles.imageUploads}>
            {formData.image_urls.map((url, index) => (
              <div key={index} className={styles.imageUpload}>
                <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, index)} className={styles.input} />
                {url && <img src={url} alt={`Preview ${index + 1}`} className={styles.imagePreview} />}
              </div>
            ))}
          </div>

          {formError && <p className={styles.error}>{formError}</p>}
          <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : editProductId ? 'Update Product' : 'Add Product'}
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
                <div className={styles.productImages}>
                  {(product.image_urls || [product.image_url]).map((url, index) => (
                    <img key={index} src={url} alt={`${product.name} ${index + 1}`} className={styles.productThumb} />
                  ))}
                </div>
                <div>
                  <span className={styles.productName}>{product.name}</span>
                  <p>{product.description}</p>
                  <p>Price: R{product.price_rands}</p>
                  <p>Category: {product.category}</p>
                  <p>Status: {product.available ? 'Available' : 'Unavailable'}</p>
                </div>
                <div className={styles.actions}>
                  <button onClick={() => handleEdit(product)} className={styles.toggleButton}>Edit</button>
                  <button onClick={() => toggleAvailability(product.id, product.available)} className={styles.toggleButton}>
                    {product.available ? 'Set Unavailable' : 'Set Available'}
                  </button>
                  <button onClick={() => deleteProduct(product.id)} className={styles.deleteButton}>Delete</button>
                </div>
              </div>
            ))
          ) : (
            <p>No products available.</p>
          )
        )}
      </div>

      <Link to="/products" className={styles.continueShopping}>Back to Products</Link>
    </div>
  );
};

export default AdminDashboard;