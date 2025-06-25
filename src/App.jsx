import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import Login from "./login/login";
import Register from "./pages/register";
import Home from "./pages/Home";
import Profile from "./components/Profile";
import Contact from "./components/contact";
import Navbar from "./components/navbar";
import AdminDashboard from "./components/admin";
import ProductsManagement from "./components/ProductManagement";
import AdminFeedback from "./components/AdminFeedback";
import ProductDetail from "./components/productdetail";
import CartPage from "./components/cartpage";

import { auth, db } from "./Firebase/Firebase";
import { doc, getDoc } from "firebase/firestore";
import { CartProvider } from "./components/cartcontext";

import "./App.css";

// Placeholder for admin users
const AdminUsers = () => (
  <h2 style={{ paddingTop: "100px", textAlign: "center" }}>
    👤 User Management Coming Soon
  </h2>
);

function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const docRef = doc(db, "users", currentUser.uid);
          const docSnap = await getDoc(docRef);
          setRole(docSnap.exists() ? docSnap.data().Role || "user" : "user");
        } catch (error) {
          console.error("Error fetching role:", error);
          setRole("user");
        }
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <Router>
      <CartProvider>
        <AppWithNavbar user={user} role={role} />
      </CartProvider>
    </Router>
  );
}

function AppWithNavbar({ user, role }) {
  const location = useLocation();

  const showNavbar =
    user &&
    [
      "/home",
      "/profile",
      "/contact",
      "/admin",
      "/admin/products",
      "/admin/users",
      "/admin/feedback",
      "/cart",
    ].some((path) => location.pathname.startsWith(path)) ||
    location.pathname.startsWith("/product/");

  // ✅ Conditionally add paddingTop for small screens only
  const isSmallScreen = typeof window !== "undefined" && window.innerWidth <= 1024;
  const pageContainerStyle = {
    paddingTop: showNavbar && isSmallScreen ? "80px" : "0px",
  };

  return (
    <>
      {showNavbar && <Navbar role={role} />}
      <div className="page-container" style={pageContainerStyle}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={!user ? <Register /> : <Navigate to="/home" />} />
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/home" />} />

          {/* User Routes */}
          <Route path="/home" element={user ? <Home role={role} /> : <Navigate to="/login" />} />
          <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/contact" element={user ? <Contact /> : <Navigate to="/login" />} />
          <Route path="/product/:id" element={user ? <ProductDetail /> : <Navigate to="/login" />} />
          <Route path="/cart" element={user ? <CartPage /> : <Navigate to="/login" />} />

          {/* Admin Routes */}
          <Route path="/admin" element={user && role === "admin" ? <AdminDashboard /> : <Navigate to="/login" />} />
          <Route path="/admin/products" element={user && role === "admin" ? <ProductsManagement /> : <Navigate to="/login" />} />
          <Route path="/admin/users" element={user && role === "admin" ? <AdminUsers /> : <Navigate to="/login" />} />
          <Route path="/admin/feedback" element={user && role === "admin" ? <AdminFeedback /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
