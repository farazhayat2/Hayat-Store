import React from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Admin Dashboard 👑</h1>

      <div style={styles.buttonContainer}>
        <button style={styles.button} onClick={() => navigate("/admin/products")}>
          🛍️ Products
        </button>
        <button style={styles.button} onClick={() => navigate("/admin/users")}>
          👥 Users
        </button>
        <button style={styles.button} onClick={() => navigate("/admin/feedback")}>
          💬 Feedback
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    paddingTop: "40px", // this pushes from under navbar
    paddingBottom: "20px",
    fontFamily: "sans-serif",
    textAlign: "center",
  },
  heading: {
    fontSize: "2.3rem",
    marginBottom: "30px",
    color: "#333",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "25px",
    flexWrap: "wrap",
  },
  button: {
    padding: "14px 24px",
    fontSize: "16px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#4b6cb7",
    color: "white",
    cursor: "pointer",
    transition: "background 0.3s",
    minWidth: "150px",
  },
};
