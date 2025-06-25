import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(saved);
  }, []);

  const handleQuantity = (idx, delta) => {
    const updated = cart
      .map((it, i) =>
        i === idx ? { ...it, quantity: it.quantity + delta } : it
      )
      .filter((it) => it.quantity > 0);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("storage"));
  };

  const total = cart.reduce((sum, it) => sum + it.price * it.quantity, 0);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>🛒 Your Cart</h2>

      {cart.length === 0 ? (
        <p style={styles.empty}>Cart is empty.</p>
      ) : (
        <>
          <ul style={styles.list}>
            {cart.map((it, idx) => (
              <li key={it.id} style={styles.item}>
                <div style={styles.left}>
                  <span style={styles.title}>{it.title}</span>
                  <span style={styles.qty}>x{it.quantity}</span>
                </div>

                <div style={styles.controls}>
                  <button
                    onClick={() => handleQuantity(idx, -1)}
                    style={styles.controlBtn}
                  >
                    −
                  </button>
                  <button
                    onClick={() => handleQuantity(idx, 1)}
                    style={styles.controlBtn}
                  >
                    +
                  </button>
                </div>

                <div style={styles.price}>
                  ${Number(it.price * it.quantity).toFixed(2)}
                </div>
              </li>
            ))}
          </ul>

          <h3 style={styles.total}>Total: ${total.toFixed(2)}</h3>

          <button onClick={() => navigate("/home")} style={styles.backBtn}>
            🛍️ Continue Shopping
          </button>
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "100px 20px 40px",
    maxWidth: "800px",
    margin: "0 auto",
    fontFamily: "'Segoe UI', sans-serif",
  },
  heading: {
    fontSize: "26px",
    textAlign: "center",
    marginBottom: "20px",
    color: "#1e293b",
  },
  empty: {
    textAlign: "center",
    fontSize: "18px",
    color: "#64748b",
  },
  list: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  item: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px",
    marginBottom: "12px",
    backgroundColor: "#f3f4f6",
    borderRadius: "8px",
  },
  left: {
    flex: "1 1 150px",
    display: "flex",
    flexDirection: "column",
    marginRight: "10px",
  },
  title: {
    fontWeight: "bold",
    fontSize: "16px",
    color: "#0f172a",
  },
  qty: {
    fontSize: "14px",
    color: "#64748b",
  },
  controls: {
    display: "flex",
    gap: "6px",
    alignItems: "center",
  },
  controlBtn: {
    width: "30px",
    height: "30px",
    fontSize: "16px",
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  price: {
    fontWeight: "bold",
    color: "#10b981",
    fontSize: "16px",
    textAlign: "right",
    minWidth: "80px",
  },
  total: {
    textAlign: "right",
    fontSize: "20px",
    fontWeight: "bold",
    marginTop: "20px",
    color: "#1e293b",
  },
  backBtn: {
    display: "block",
    width: "100%",
    marginTop: "24px",
    padding: "12px",
    fontSize: "16px",
    fontWeight: "bold",
    backgroundColor: "#1e40af",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};
