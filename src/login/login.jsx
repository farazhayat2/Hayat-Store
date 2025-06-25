import React from "react";
import { auth, db } from "../../src/Firebase/Firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        if (userData.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/home");
        }
      } else {
        console.error("No such user document!");
        navigate("/home");
      }
    } catch (error) {
      alert("Login failed: " + error.message);
    }
  };

  return (
    <div style={styles.fullscreen}>
      <form onSubmit={handleLogin} style={styles.form}>
        <h2 style={styles.title}>Login</h2>
        <input name="email" type="email" placeholder="Email" required style={styles.input} />
        <input name="password" type="password" placeholder="Password" required style={styles.input} />
        <button type="submit" style={styles.button}>Login</button>

        <button
          type="button"
          onClick={() => navigate("/")}
          style={styles.linkButton}
        >
          Create Account
        </button>
      </form>
    </div>
  );
}

const styles = {
  fullscreen: {
    width: "100vw",
    height: "100vh",
    background: "linear-gradient(to right, #667eea, #764ba2)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    boxSizing: "border-box",
  },
  form: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 6px 25px rgba(0, 0, 0, 0.15)",
    width: "100%",
    maxWidth: "360px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#333",
    fontFamily: "cursive",
    fontSize: "24px",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "16px",
    marginBottom: "15px",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#4b6cb7",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    fontFamily: "cursive",
    cursor: "pointer",
    marginBottom: "10px",
  },
  linkButton: {
    background: "transparent",
    border: "none",
    color: "#4b6cb7",
    fontSize: "14px",
    cursor: "pointer",
    textDecoration: "underline",
  },
};

export default Login;
