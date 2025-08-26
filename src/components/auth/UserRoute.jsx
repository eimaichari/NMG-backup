import { Navigate, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../utils/firebase";

const UserRoute = () => {
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
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      setDataLoading(false);
    };

    checkAdminRole();
  }, [user]);

  if (authLoading || dataLoading) {
    return <div>Loading...</div>;
  }
  
  // If not logged in, redirect to sign-in
  if (!user) {
    return <Navigate to="/auth/signin" />;
  }

  // If logged in and IS an admin, redirect them to the dashboard.
  // This is the logic you wanted for admins being unable to see other pages.
  if (isAdmin) {
    return <Navigate to="/admin/dashboard" />;
  }
  
  // If logged in and NOT an admin, show the content.
  return <Outlet />;
};

export default UserRoute;