import React, { useState, useEffect } from 'react';
import 'tailwindcss/tailwind.css';

const MessageDisplay = ({ messageId }) => {
  const [response, setResponse] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const currentDate = new Date().toISOString();

  const startCountdown = (openingDate) => {
    const intervalId = setInterval(() => {
      const currentDate = new Date().toISOString();
      const remainingTime = new Date(openingDate) - new Date(currentDate);

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

        setCountdown({ years, months, days, hours, minutes, seconds });
      }
    }, 1000);
  };

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const response = await fetch(`http://localhost:3001/message/${messageId}`);
        if (response?.ok) {
          const openingDate = await response?.json();
          setResponse(openingDate);
          startCountdown(openingDate.openingDate);
        } else {
          console.error('Error fetching message:', response?.statusText);
        }
      } catch (error) {
        console.error('Error fetching message:', error.message);
      }
    };

    fetchMessage();
  }, [messageId]); // Include startCountdown in the dependency array

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#24063d] to-[#2c103e] text-white flex items-center justify-center w-full">
      
      
      <div className='animate-pulse z-10 shadow-[0_0_150px_175px_rgba(83,7,140,0.4)] rounded-full'>
        <div className=" bg-gradient-to-br from-[#5A2C98] to-[#D680CF] rounded-full p-10 shadow-md w-50">
          {currentDate < response?.openingDate ? (
            <div>
              <h1 className="text-4xl font-extrabold mb-4 text-purple-500">
                ⚙️ Welcome to the Time Machine ⚙️
              </h1>
              <p className="text-gray-300">
                Prepare to embark on a journey to the future: {response?.openingDate}
              </p>
              <p className="text-gray-300">{response?.waitMessage}</p>
              <div className="text-gray-300 mt-4">
                <p className="mb-2">
                  Time remaining:
                </p>
                <div className="flex items-center space-x-4">
                  {countdown && (
                    <>
                      <CountdownUnit value={countdown.years} unit="years" />
                      <CountdownUnit value={countdown.months} unit="months" />
                      <CountdownUnit value={countdown.days} unit="days" />
                      <CountdownUnit value={countdown.hours} unit="hours" />
                      <CountdownUnit value={countdown.minutes} unit="minutes" />
                      <CountdownUnit value={countdown.seconds} unit="seconds" />
                    </>
                  )}
                </div>
              </div>
            </div>
        ) : (
          <div className="text-center">
            <h1 className="text-4xl font-extrabold mb-4 text-purple-500">
              🎉 Time Capsule Unlocked! 🎉
            </h1>
            <p className="text-gray-300">{response?.content}</p>
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

const CountdownUnit = ({ value, unit }) => (
  <div className="flex flex-col items-center">
    <span className="text-2xl font-bold text-purple-500">{value}</span>
    <span className="text-xs text-gray-300">{unit}</span>
  </div>
);

export default MessageDisplay;
