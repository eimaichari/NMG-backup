import { Navigate, Outlet } from "react-router-dom";
import {useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../utils/firebase";


const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(null);

  useEffect(() => {
    const checkAdminRole = async () => {
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDocSnapshot = await getDoc(userDocRef);
          if (userDocSnapshot.exists()) {
            const fetchedData = userDocSnapshot.data();
            setIsAdmin(fetchedData.role === 'admin');
          } else {
            setIsAdmin(false);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setIsAdmin(null);
        }
      } else {
        setIsAdmin(null);
      }
    };

    checkAdminRole();
  }, [user]);

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/auth/signin" />;
  if (isAdmin) return <Navigate to="/admin/dashboard" />;

  return <Outlet />;
};

export default ProtectedRoute;