import React, { useEffect, useState } from "react";
import axios from "axios";

const MarqueeModern = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchMarquee = async () => {
      try {
        const res = await axios.get(`${apiUrl}/marquee`);
        if (res.data.isActive && Array.isArray(res.data.messages)) {
          setMessages(res.data.messages);
        }
      } catch (err) {
        console.error("Failed to load marquee messages:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMarquee();
  }, []);

  if (loading) return null;
  if (messages.length === 0) return null;

  return (
    <div className="w-full overflow-hidden secondaryBgColor py-3">
      <div className="marquee-track flex gap-12 whitespace-nowrap text-white text-sm sm:text-base font-medium animate-marquee">
        {[...messages, ...messages].map((msg, index) => (
          <span key={index}>{msg}</span>
        ))}
      </div>
    </div>
  );
};

export default MarqueeModern;
