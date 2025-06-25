import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Firebase/Firebase";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [added, setAdded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.error("Product not found");
        }
      } catch (error) {
        console.error("Error loading product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const alreadyInCart = cart.find((item) => item.id === product.id);

    if (!alreadyInCart) {
      cart.push({ ...product, quantity: 1 });
      localStorage.setItem("cart", JSON.stringify(cart));
      setAdded(true);
      window.dispatchEvent(new Event("storage"));
    } else {
      alert("✅ Already in cart!");
    }
  };

  if (!product)
    return (
      <div style={styles.loadingContainer}>
        <p>Loading product...</p>
      </div>
    );

  return (
    <div style={styles.container}>
      <button onClick={() => navigate("/home")} style={styles.backBtn}>
        ← Back to Home
      </button>

      <div style={styles.card}>
        <img src={product.image} alt={product.title} style={styles.image} />

        <div style={styles.details}>
          <h2 style={styles.title}>{product.title}</h2>
          <p style={styles.category}>Category: {product.category}</p>
          <p style={styles.description}>{product.description}</p>
          <p style={styles.price}>
            Price: <span style={styles.priceTag}>${product.price}</span>
          </p>

          <button
            onClick={handleAddToCart}
            style={added ? styles.disabledBtn : styles.addBtn}
            disabled={added}
          >
            {added ? "✔ Added to Cart" : "🛒 Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "100px 20px 40px",
    maxWidth: "1000px",
    margin: "0 auto",
    fontFamily: "Segoe UI, sans-serif",
  },
  backBtn: {
    backgroundColor: "#1e40af",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "6px",
    marginBottom: "24px",
    cursor: "pointer",
  },
  card: {
    display: "flex",
    flexDirection: "row",
    gap: "40px",
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
    padding: "24px",
    flexWrap: "wrap",
  },
  image: {
    width: "100%",
    maxWidth: "300px",
    height: "300px",
    objectFit: "cover",
    borderRadius: "8px",
    flexShrink: 0,
  },
  details: {
    flex: 1,
    minWidth: "250px",
  },
  title: {
    fontSize: "26px",
    marginBottom: "12px",
    color: "#1f2937",
  },
  category: {
    color: "#64748b",
    marginBottom: "10px",
    fontStyle: "italic",
    fontSize: "15px",
  },
  description: {
    fontSize: "16px",
    marginBottom: "20px",
    lineHeight: "1.6",
    color: "#374151",
  },
  price: {
    fontWeight: "bold",
    fontSize: "18px",
    marginBottom: "16px",
  },
  priceTag: {
    color: "#22c55e",
  },
  addBtn: {
    padding: "12px 20px",
    backgroundColor: "#10b981",
    color: "#fff",
    fontWeight: "bold",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  disabledBtn: {
    padding: "12px 20px",
    backgroundColor: "#6b7280",
    color: "#fff",
    fontWeight: "bold",
    border: "none",
    borderRadius: "6px",
    cursor: "not-allowed",
  },
  loadingContainer: {
    paddingTop: "120px",
    textAlign: "center",
    fontFamily: "Segoe UI, sans-serif",
  },
};
