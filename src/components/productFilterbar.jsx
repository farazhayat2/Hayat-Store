import React from "react";

export default function ProductFilterBar() {
  const handleCategoryClick = () => {
    alert("Category filter clicked");
  };

  const handleSearchClick = () => {
    const value = document.getElementById("product-search").value;
    alert("Searching for: " + value);
  };

  return (
    <div style={styles.wrapper}>
      <button onClick={handleCategoryClick} style={styles.categoryBtn}>
        🗂️ Category
      </button>

      <div style={styles.searchArea}>
        <input
          id="product-search"
          type="text"
          placeholder="Search products..."
          style={styles.input}
        />
        <button onClick={handleSearchClick} style={styles.searchBtn}>
          🔍
        </button>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.6rem 1rem", // Matches navbar padding
    backgroundColor: "transparent",
    boxSizing: "border-box",
    marginTop: "64px", // Matches navbar height
    position: "relative",
    zIndex: 1,
  },
  categoryBtn: {
    padding: "8px 14px",
    backgroundColor: "#f43f5e",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "14px",
  },
  searchArea: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  input: {
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    width: "200px",
    outline: "none",
  },
  searchBtn: {
    background: "none",
    border: "none",
    fontSize: "20px",
    cursor: "pointer",
    color: "#4b6cb7",
  },
};
