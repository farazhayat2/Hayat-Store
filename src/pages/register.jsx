import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../Firebase/Firebase";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.background = "linear-gradient(to right, #667eea, #764ba2)";
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.minHeight = "100vh";

    return () => {
      document.body.style.background = "";
      document.body.style.margin = "";
      document.body.style.padding = "";
      document.body.style.minHeight = "";
    };
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        fullName: name,
        username: name.toLowerCase().replace(/\s+/g, "_"),
        createdAt: serverTimestamp(),
      });

      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  // Responsive container style
  const containerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    width: "100%",
    padding: "20px",
    boxSizing: "border-box",
  };

  // Responsive form box
  const formBoxStyle = {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "10px",
    width: "100%",
    maxWidth: "500px",
    fontFamily: "sans-serif",
    boxShadow: "0 6px 24px rgba(0,0,0,0.15)",
    boxSizing: "border-box",
    textAlign: "center",
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    fontSize: "16px",
    boxSizing: "border-box",
  };

  const buttonStyle = {
    width: "100%",
    padding: "12px",
    backgroundColor: "#4b6cb7",
    color: "white",
    border: "none",
    borderRadius: "5px",
    fontWeight: "bold",
    fontSize: "16px",
    cursor: "pointer",
    marginTop: "12px",
  };

  return (
    <div style={containerStyle}>
      <div style={formBoxStyle}>
        <h2>Create Account</h2>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={inputStyle}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
          />
          <button type="submit" style={buttonStyle}>
            Sign Up
          </button>
        </form>
        {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
        <p style={{ marginTop: "15px", fontSize: "14px" }}>
          Already have an account?{" "}
          <a href="/login" style={{ color: "#4b6cb7", textDecoration: "underline" }}>
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

export default Register;
