import { Navigate, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../utils/firebase";

const AdminRoute = () => {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    const checkAdminRole = async () => {
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDocSnapshot = await getDoc(userDocRef);
          if (userDocSnapshot.exists() && userDocSnapshot.data().role === 'admin') {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setIsAdmin(false); // Assume not admin on error
        }
      } else {
        setIsAdmin(false);
      }
      setDataLoading(false);
    };

    checkAdminRole();
  }, [user]);

  // Handle initial loading states
  if (authLoading || dataLoading) {
    return <div>Loading...</div>;
  }
  
  // If not logged in, redirect to sign-in
  if (!user) {
    return <Navigate to="/auth/signin" />;
  }

  // If logged in and IS an admin, show the content.
  // If logged in but NOT an admin, redirect them.
  return isAdmin ? <Outlet /> : <Navigate to="/profile" />;
};

export default AdminRoute;