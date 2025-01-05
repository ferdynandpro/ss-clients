import React, { useEffect, useState } from "react";
import '../../assets/styles/components/dashboard.css'

const CurrentDateTime = () => {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const formattedTime = new Intl.DateTimeFormat("id-ID", {
        dateStyle: "full",
        timeStyle: "medium",
      }).format(now);
      setCurrentTime(formattedTime);
    }, 1000);

    return () => clearInterval(interval); // Bersihkan interval saat komponen unmount
  }, []);

  return (
    <div className="date-time-container">
      <p>{currentTime}</p>
    </div>
  );
};

export default CurrentDateTime;
