import React, { useState, useEffect } from 'react';

const MessageDisplay = ({ messageId }) => {
  console.log('MessageDisplay component rendered');
  const [openingDate, setOpeningDate] = useState(null);
  const [countdown, setCountdown] = useState(null);
  console.log('Opening Date:', openingDate);
  console.log('Countdown:', countdown);

  const startCountdown = (openingDate) => {
    const intervalId = setInterval(() => {
      const currentDate = new Date().toISOString();
      const remainingTime = new Date(openingDate) - new Date(currentDate);
  
      console.log('remainingTime:', remainingTime);
  
      if (remainingTime <= 0) {
        clearInterval(intervalId);
        setCountdown(null);
      } else {
        const seconds = Math.floor((remainingTime / 1000) % 60);
        const minutes = Math.floor((remainingTime / (1000 * 60)) % 60);
        const hours = Math.floor((remainingTime / (1000 * 60 * 60)) % 24);
        const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
        const months = Math.floor(days / 30); // Assuming a month is 30 days
        const years = Math.floor(months / 12);
  
        console.log('countdown:', { years, months, days, hours, minutes, seconds });
  
        setCountdown({ years, months, days, hours, minutes, seconds });
      }
    }, 1000);
  };
  

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const response = await fetch(`http://localhost:3001/message/${messageId}`);
        if (response.ok) {
          const openingDate = await response.json();
          setOpeningDate(openingDate);
          startCountdown(openingDate.openingDate);
        } else {
          console.error('Error fetching message:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching message:', error.message);
      }
    };

    fetchMessage();
  }, [messageId]); // Include startCountdown in the dependency array

  return (
    <div>
      {openingDate ? (
          <div>
            <p>Wait for the {openingDate.openingDate}</p>
            <p>{openingDate.waitMessage}</p>
            {countdown !== null && (
              <p>
                Time remaining: {countdown.years} years, {countdown.months} months, {countdown.days} days,{' '}
                {countdown.hours} hours, {countdown.minutes} minutes, and {countdown.seconds} seconds
              </p>
            )}
          </div>
        ) : (
        <p>Loading message...</p>
      )}
    </div>
  );
};

export default MessageDisplay;
