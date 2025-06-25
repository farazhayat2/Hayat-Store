import React, { useState } from 'react';
import { db } from '../Firebase/Firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import './contact.css';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "feedback"), {
        name,
        email,
        message,
        createdAt: serverTimestamp()
      });
      setSuccess("Feedback sent successfully!");
      setName('');
      setEmail('');
      setMessage('');
    } catch (error) {
      alert("Error sending feedback: " + error.message);
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-content">
        <div className="contact-container">
          <h1>Feedback</h1>
          <p>Feel free to reach out through the form below.</p>

          <form className="contact-form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <textarea
              placeholder="Your Message"
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            ></textarea>
            <button type="submit">Send</button>
            {success && <p style={{ color: 'green' }}>{success}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}
