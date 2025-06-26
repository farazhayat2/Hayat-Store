import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../Firebase/Firebase";
import { doc, getDoc } from "firebase/firestore";
import "./profile.css"; // Make sure to create this CSS file

function Profile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserData({
            ...docSnap.data(),
            email: user.email,
          });
        } else {
          console.log("No such document!");
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading profile...</p>;
  }

  if (!userData) {
    return <p style={{ textAlign: "center", marginTop: "50px" }}>No user data found.</p>;
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2 className="profile-heading">👤 Profile Information</h2>
        <div className="info-list">
          <InfoRow label="Username" value={userData.username} />
          <InfoRow label="Full Name" value={userData.fullName} />
          <InfoRow label="Email" value={userData.email} />
          <InfoRow label="Phone" value={userData.phone || "Not provided"} />
          <InfoRow label="Address" value={userData.address || "Not provided"} />
          <InfoRow label="Joined On" value={userData.joinedDate || "N/A"} />
        </div>
        <p className="profile-note">
          Keep your profile updated to enjoy personalized experiences.
        </p>
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="info-row">
      <span className="label">{label}:</span>
      <span className="value">{value}</span>
    </div>
  );
}

export default Profile;
