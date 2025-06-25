import React, { useEffect, useState } from "react";
import { db } from "../Firebase/Firebase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function ProductsManagement() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    image: "",
    description: "",
    price: "",
  });
  const [editId, setEditId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "products"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(data);
    });
    return () => unsub();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAdd = async () => {
    const { title, category, image, description, price } = formData;
    if (title && category && image && description && price) {
      await addDoc(collection(db, "products"), {
        ...formData,
        createdAt: new Date(),
      });
      setFormData({ title: "", category: "", image: "", description: "", price: "" });
    }
  };

  const handleEdit = (product) => {
    setEditId(product.id);
    setFormData({
      title: product.title,
      category: product.category,
      image: product.image,
      description: product.description,
      price: product.price,
    });
  };

  const handleUpdate = async () => {
    if (editId) {
      const docRef = doc(db, "products", editId);
      await updateDoc(docRef, { ...formData });
      setEditId(null);
      setFormData({ title: "", category: "", image: "", description: "", price: "" });
    }
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "products", id));
  };

  const handleGoBack = () => navigate("/admin");

  // ✅ Detect screen width to conditionally add top padding
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className="product-page-wrapper"
      style={{
        padding: isMobile ? "20px" : "100px 20px 20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2>📦 Product Management</h2>

      <div style={{ marginBottom: "14px", display: "flex", flexDirection: "column", maxWidth: "400px" }}>
        <input name="title" placeholder="Product Title" value={formData.title} onChange={handleChange} style={inputStyle} />
        <input name="category" placeholder="Category" value={formData.category} onChange={handleChange} style={inputStyle} />
        <input name="image" placeholder="Image URL" value={formData.image} onChange={handleChange} style={inputStyle} />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} style={{ ...inputStyle, height: 60 }} />
        <input name="price" placeholder="Price" value={formData.price} onChange={handleChange} style={inputStyle} />

        {editId ? (
          <button onClick={handleUpdate} style={styles.button}>Update</button>
        ) : (
          <button onClick={handleAdd} style={styles.button}>Add</button>
        )}
      </div>

      <button onClick={handleGoBack} style={styles.goBack}>← Go Back</button>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {products.map((p) => (
          <li key={p.id} style={styles.productCard}>
            <img src={p.image} alt={p.title} style={{ width: 60, height: 60, borderRadius: 4, marginRight: 12 }} />
            <div style={{ flex: 1 }}>
              <strong>{p.title}</strong>
              <p style={{ margin: "4px 0" }}>{p.description}</p>
              <small>Category: {p.category}</small><br />
              <small>Price: ${p.price}</small>
            </div>
            <div>
              <button onClick={() => handleEdit(p)} style={styles.smallBtn}>Edit</button>
              <button onClick={() => handleDelete(p.id)} style={styles.smallBtn}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

const inputStyle = {
  padding: "8px",
  marginBottom: "10px",
  border: "1px solid #ccc",
  borderRadius: "6px",
};

const styles = {
  button: {
    padding: "10px 12px",
    backgroundColor: "#22c55e",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  goBack: {
    backgroundColor: "#4b6cb7",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    marginBottom: "20px"
  },
  smallBtn: {
    padding: "4px 8px",
    marginLeft: "6px",
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  productCard: {
    marginBottom: "10px",
    display: "flex",
    alignItems: "center",
    backgroundColor: "#f0f4f8",
    padding: "10px",
    borderRadius: "6px",
  }
};
