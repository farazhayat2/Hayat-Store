import React, { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../Firebase/Firebase";

export default function AdminFeedback() {
  const [feedbackList, setFeedbackList] = useState([]);

  const fetchFeedback = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "feedback"));
      const feedbacks = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFeedbackList(feedbacks);
    } catch (err) {
      console.error("Error fetching feedback:", err);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this feedback?");
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "feedback", id));
      setFeedbackList((prev) => prev.filter((fb) => fb.id !== id));
    } catch (error) {
      console.error("Error deleting feedback:", error);
      alert("Failed to delete feedback");
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <h2 style={styles.heading}>📩 User Feedback</h2>

      <div style={styles.feedbackWrapper}>
        {feedbackList.length === 0 ? (
          <p style={styles.noFeedback}>No feedback submitted yet.</p>
        ) : (
          <ul style={styles.list}>
            {feedbackList.map((fb) => (
              <li key={fb.id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <div>
                    <p style={styles.name}>{fb.name}</p>
                    <span style={styles.email}>📧 {fb.email}</span>
                  </div>
                  <button onClick={() => handleDelete(fb.id)} style={styles.deleteBtn}>
                    🗑️
                  </button>
                </div>
                <p style={styles.message}>{fb.message}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

const styles = {
  pageWrapper: {
    paddingTop: "100px",
    fontFamily: "'Segoe UI', sans-serif",
    background: "linear-gradient(to right, #667eea, #764ba2)",
    minHeight: "100vh",
    paddingBottom: "40px",
  },
  heading: {
    fontSize: "28px",
    marginBottom: "30px",
    textAlign: "center",
    color: "#ffffff",
    textShadow: "1px 1px 4px rgba(0,0,0,0.2)",
  },
  feedbackWrapper: {
    maxWidth: "800px",
    margin: "0 auto",
    textAlign: "left",
    padding: "0 20px",
  },
  list: {
    listStyleType: "none",
    padding: 0,
    margin: 0,
  },
  card: {
    background: "#ffffff",
    borderRadius: "10px",
    padding: "16px",
    marginBottom: "20px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },
  name: {
    fontSize: "18px",
    fontWeight: "bold",
    margin: 0,
    color: "#1e293b",
  },
  email: {
    fontSize: "14px",
    color: "#64748b",
  },
  message: {
    fontSize: "16px",
    color: "#334155",
    lineHeight: "1.5",
    marginTop: "8px",
  },
  deleteBtn: {
    backgroundColor: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "6px 10px",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "14px",
  },
  noFeedback: {
    textAlign: "center",
    fontSize: "18px",
    color: "#f1f5f9",
  },
};
