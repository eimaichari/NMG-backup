import React, { useState, useEffect } from 'react';
import { db } from '../../../utils/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useOrders } from '../../../utils/useOrders';
import styles from './OrdersPage.module.css';

const OrdersPage = () => {
  const { orders, loading, error } = useOrders();
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [statusMessage, setStatusMessage] = useState('');
  const [modalImage, setModalImage] = useState(null); // for enlarged proof image
  const [pendingCount, setPendingCount] = useState(0); // NEW: State for pending badge

  const statusOptions = ['All', 'Pending Payment', 'Pending Delivery', 'Complete', 'Cancelled'];

  // NEW: Calculate pending count and initial toast
  useEffect(() => {
    if (!loading && orders) {
      const pendings = orders.filter(order => order.status === 'Pending Payment').length;
      setPendingCount(pendings);
      
      // Show toast if any pending (live-updates on new orders via hook)
      if (pendings > 0) {
        setStatusMessage(`🔔 ${pendings} new order(s) pending!`);
        setTimeout(() => setStatusMessage(''), 5000); // Auto-hide after 5s
      }
    }
  }, [orders, loading]); // Re-runs on orders change (real-time from hook)

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const orderDocRef = doc(db, 'orders', orderId);
      await updateDoc(orderDocRef, { status: newStatus });
      setStatusMessage(`Order ${orderId} status updated to ${newStatus}.`);
      
      // NEW: Recalc pending count after status change
      setTimeout(() => {
        const updatedPendings = orders.filter(order => order.status === 'Pending Payment').length;
        setPendingCount(updatedPendings);
      }, 100);
    } catch (err) {
      console.error('Error updating order status:', err);
      setStatusMessage('Failed to update order status. Please try again.');
    } finally {
      setTimeout(() => setStatusMessage(''), 3000);
    }
  };

  // UPDATED: Filter only (hook sorts newest-first)
  const filteredOrders = orders.filter(order => {
    if (selectedStatus === 'All') {
      return true;
    }
    return order.status === selectedStatus;
  });

  if (loading) {
    return <div className={styles.loading}>Loading orders...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <main className={styles.ordersPage}>
      <div className={styles.ordersHeader}>
        {/* UPDATED: Title with pending badge */}
        <h1 className={styles.pageTitle}>
          Order Management {pendingCount > 0 && <span className={styles.badge}>( {pendingCount} )</span>}
        </h1>
        <div className={styles.statusFilters}>
          {statusOptions.map(status => (
            <button
              key={status}
              className={`${styles.filterButton} ${selectedStatus === status ? styles.active : ''}`}
              onClick={() => setSelectedStatus(status)}
            >
              {status}
            </button>
          ))}
        </div>
      </div>
      
      {filteredOrders.length === 0 ? (
        <p className={styles.noOrders}>No orders found with status '{selectedStatus}'.</p>
      ) : (
        <div className={styles.ordersGrid}>
          {filteredOrders.map(order => (
            <div key={order.id} className={styles.orderCard}>
              <div className={styles.orderInfo}>
                <p><strong>Order ID:</strong> {order.id}</p>
                <p><strong>Customer:</strong> {order.userName}</p>
                <p><strong>Email:</strong> {order.userEmail}</p>
                <p><strong>Total:</strong> R{order.totalAmount}</p>
                {/* UPDATED: Full date & time */}
                <p><strong>Placed:</strong> {new Date(order.orderDate).toLocaleString()}</p>
              </div>

              <div className={styles.orderItems}>
                <p><strong>Items:</strong></p>
                <ul>
                  {order.items.map((item, index) => (
                    <li key={index}>{item.name} x {item.quantity} (R{item.price})</li>
                  ))}
                </ul>
              </div>

              {console.log(order.id, order.proofOfPayment)}

              {/* ✅ Proof of Payment Thumbnail */}
              {order.proofOfPayment && (
                <div className={styles.proofSection}>
                  <p><strong>Proof of Payment:</strong></p>
                  <img
                    src={order.proofOfPayment}
                    alt="Proof of Payment"
                    className={styles.proofImage}
                    onClick={() => setModalImage(order.proofOfPayment)}
                  />
                  <p className={styles.clickHint}>(click to enlarge)</p>
                </div>
              )}

              <div className={styles.statusUpdate}>
                <strong>Status:</strong>
                <select
                  value={order.status}
                  onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                  className={styles.statusSelect}
                >
                  <option value="Pending Payment">Pending Payment</option>
                  <option value="Pending Delivery">Pending Delivery</option>
                  <option value="Complete">Complete</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* ✅ Modal for enlarged proof image */}
      {modalImage && (
        <div className={styles.modalOverlay} onClick={() => setModalImage(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <img src={modalImage} alt="Proof of Payment Enlarged" className={styles.modalImage} />
            <button className={styles.closeButton} onClick={() => setModalImage(null)}>✕</button>
          </div>
        </div>
      )}

      {statusMessage && (
        <div className={`${styles.statusMessage} ${statusMessage.includes('Failed') ? styles.error : styles.success}`}>
          {statusMessage}
        </div>
      )}
    </main>
  );
};

export default OrdersPage;