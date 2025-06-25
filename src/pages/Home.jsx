import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { auth, db } from "../Firebase/Firebase";
import { signOut } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "products"), (snapshot) => {
      const productList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productList);
      setFiltered(productList);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let filteredData = [...products];
    if (category !== "All") {
      filteredData = filteredData.filter((p) =>
        p.category?.toLowerCase() === category.toLowerCase()
      );
    }
    if (search.trim()) {
      filteredData = filteredData.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFiltered(filteredData);
  }, [search, category, products]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const handleAddToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const idx = cart.findIndex((item) => item.id === product.id);
    if (idx >= 0) {
      cart[idx].quantity++;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("storage"));
  };

  const uniqueCategories = ["All", ...new Set(products.map(p => p.category))];

  return (
    <div style={{ padding: "120px 20px", fontFamily: "Arial" }}>
      {/* 🔍 Search and Category Row */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
        gap: "10px"
      }}>
        {/* 🔍 Search Input */}
        <input
          type="text"
          placeholder="🔍 Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: "1",
            minWidth: "200px",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "6px",
          }}
        />

        {/* 🏷️ Category Dropdown */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "6px",
            minWidth: "160px"
          }}
        >
          {uniqueCategories.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <h2 style={{ marginBottom: "20px", textAlign: "center" }}>🛍️ Latest Products</h2>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          justifyContent: "center",
        }}
      >
        {filtered?.slice(0, 20).map((product) => (
          <div
            key={product.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "16px",
              width: "255px",
              background: "#fff",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Link
              to={`/product/${product.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <img
                src={product.image}
                alt={product.title}
                style={{
                  width: "100%",
                  height: "160px",
                  objectFit: "cover",
                  borderRadius: "6px",
                }}
              />
              <h3 style={{ fontSize: "16px", margin: "12px 0 8px" }}>
                {product.title}
              </h3>
              <p
                style={{
                  fontSize: "14px",
                  color: "#555",
                  marginBottom: "10px",
                  minHeight: "42px",
                }}
              >
                {product.description?.slice(0, 60)}...
              </p>
              <span
                style={{
                  background: "#facc15",
                  padding: "4px 10px",
                  borderRadius: "5px",
                  fontWeight: "bold",
                }}
              >
                ${product.price}
              </span>
            </Link>

            <button
              onClick={() => handleAddToCart(product)}
              style={{
                marginTop: "12px",
                padding: "10px",
                background: "#22c55e",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              🛒 Add to Cart
            </button>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "40px", textAlign: "center" }}>
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: "#ef4444",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          🔒 Logout
        </button>
      </div>
    </div>
  );
}
