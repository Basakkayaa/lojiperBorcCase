import React, { useState, useEffect } from 'react';
import '../assets/css/style.css';

const Clock: React.FC = () => {
  const [hoursRotation, setHoursRotation] = useState(0);
  const [minutesRotation, setMinutesRotation] = useState(0);

  useEffect(() => {
    document.body.classList.add('home');
    
    const updateClock = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();

      const hoursDeg = 30 * hours; 
      const minutesDeg = 6 * minutes; 

      setHoursRotation(hoursDeg);
      setMinutesRotation(minutesDeg);
    };

    updateClock(); 
    const intervalId = setInterval(updateClock, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div id="watch">
      <div className="digit"><span>1</span></div>
      <div className="digit"><span>2</span></div>
      <div className="digit"><span>3</span></div>
      <div className="digit"><span>4</span></div>
      <div className="digit"><span>5</span></div>
      <div className="digit"><span>6</span></div>
      <div className="digit"><span>7</span></div>
      <div className="digit"><span>8</span></div>
      <div className="digit"><span>9</span></div>
      <div className="digit"><span>10</span></div>
      <div className="digit"><span>11</span></div>
      <div className="digit"><span>12</span></div>
      <div id="mickey"></div>
      <div className="hand left" id="hours" style={{ transform: `rotate(${hoursRotation}deg)` }}></div>
      <div className="hand right" id="minutes" style={{ transform: `rotate(${minutesRotation}deg)` }}></div>
    </div>
  );
};

export default Clock;
