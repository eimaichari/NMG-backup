import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAuth, signOut, deleteUser, updateProfile } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import styles from './ProfilePage.module.css';

const ProfilePage = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profilePic, setProfilePic] = useState(user?.photoURL || 'https://via.placeholder.com/40');
  const [uploadError, setUploadError] = useState(null);

  // Mock purchase history data
  const purchaseHistory = [
    {
      id: 1,
      name: 'Sample Product 1',
      price: 29.99,
      quantity: 2,
      date: '2025-08-20',
      thumbnail: 'https://via.placeholder.com/80',
    },
    {
      id: 2,
      name: 'Sample Product 2',
      price: 49.99,
      quantity: 1,
      date: '2025-08-15',
      thumbnail: 'https://via.placeholder.com/80',
    },
  ];

  const handleSignOut = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleDeleteProfile = async () => {
    if (window.confirm('Are you sure you want to delete your profile? This action cannot be undone.')) {
      try {
        const auth = getAuth();
        await deleteUser(auth.currentUser);
        navigate('/');
      } catch (error) {
        console.error('Delete profile error:', error);
        alert('Failed to delete profile. Please try again or re-authenticate.');
      }
    }
  };

  const handleProfilePicUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        // Placeholder for Firebase Storage upload
        // For actual implementation, use Firebase Storage to upload the file and get the URL
        const mockUrl = URL.createObjectURL(file); // Temporary local URL for demo
        setProfilePic(mockUrl);
        const auth = getAuth();
        await updateProfile(auth.currentUser, { photoURL: mockUrl });
      } catch (error) {
        setUploadError('Failed to upload profile picture.');
        console.error('Profile picture upload error:', error);
      }
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className={styles.container}>
        <h2>Please sign in to view your profile.</h2>
        <Link to="/signin" className={styles.continueShopping}>
          Go to Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.sectionTitle}>Your Profile</h2>

      <div className={styles.profileSection}>
        <img
          src={profilePic}
          alt="Profile"
          className={styles.profileIcon}
          onClick={toggleDropdown}
        />
        <div className={`${styles.dropdownMenu} ${dropdownOpen ? styles.active : ''}`}>
          <Link to="/profile" className={styles.dropdownLink}>
            Profile
          </Link>
          <Link to="/cart" className={styles.dropdownLink}>
            Cart
          </Link>
          <button onClick={handleSignOut} className={styles.dropdownLink}>
            Logout
          </button>
        </div>
        <div className={styles.profileInfo}>
          <p><strong>Name:</strong> {user.displayName || 'N/A'}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <label htmlFor="profilePicUpload" className={styles.uploadButton}>
            Upload New Picture
            <input
              id="profilePicUpload"
              type="file"
              accept="image/*"
              onChange={handleProfilePicUpload}
              className={styles.fileInput}
            />
          </label>
          {uploadError && <p className={styles.error}>{uploadError}</p>}
        </div>
      </div>

      <div className={styles.historySection}>
        <h3 className={styles.sectionTitle}>Purchase History</h3>
        {purchaseHistory.length > 0 ? (
          <div className={styles.historyList}>
            {purchaseHistory.map((item) => (
              <div key={item.id} className={styles.cartItem}>
                <img src={item.thumbnail} alt={item.name} className={styles.cartThumb} />
                <div>
                  <span className={styles.cartName}>{item.name}</span>
                  <p>Price: ${item.price.toFixed(2)}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p>Date: {item.date}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No purchase history available.</p>
        )}
      </div>

      <div className={styles.actions}>
        <button onClick={handleSignOut} className={styles.submitButton}>
          Logout
        </button>
        <button onClick={handleDeleteProfile} className={styles.deleteButton}>
          Delete Profile
        </button>
      </div>

      <Link to="/products" className={styles.continueShopping}>
        Continue Shopping
      </Link>
    </div>
  );
};

export default ProfilePage;