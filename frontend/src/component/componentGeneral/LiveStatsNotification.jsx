import React, { useEffect, useState } from "react";
import { Eye } from "lucide-react"; // Lucide icon

const getRandomNumber = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const LiveStatsNotification = () => {
  const [viewers, setViewers] = useState(getRandomNumber(50, 250));

  useEffect(() => {
    const interval = setInterval(() => {
      setViewers(getRandomNumber(59, 250));
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div className="flex items-center space-x-2">
        <Eye className="w-6 h-6 primaryTextColor animate-bounce" />
        <p className="text-md">{viewers} people are viewing this page right now</p>
      </div>
    </div>
  );
};

export default LiveStatsNotification;
