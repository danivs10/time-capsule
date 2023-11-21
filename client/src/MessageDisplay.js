import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom"; 
import 'tailwindcss/tailwind.css';

const MessageDisplay = ({ messageId }) => {
  const [response, setResponse] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [showMessageContent, setShowMessageContent] = useState(false);
  const [showMessage, setShowMessage] = useState(false); // New state for controlling message visibility
  const currentDate = new Date().toISOString();

  const startCountdown = (openingDate) => {
    const intervalId = setInterval(() => {
      const currentDate = new Date().toISOString();
      const remainingTime = new Date(openingDate) - new Date(currentDate);

      if (remainingTime <= 0) {
        clearInterval(intervalId);
        setCountdown(null);
        // Make the message visible after the countdown is complete
        setShowMessage(true);
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

  const displayMessage = {
    height: showMessage ? '350px' : '0',
  };

  const messageContent = {
    opacity: showMessageContent ? '.9' : '0',
    display: showMessageContent ? 'flex' : 'none',
    transition: 'all 2s ease-in-out',
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
  }, [messageId]);

  useEffect(() => {
    setShowMessage(false);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#24063d] to-[#2c103e] text-white flex items-center justify-center w-full">
      <button
                  className="absolute top-12 left-12 text-white hover:text-gray-300"
                  onClick={() => {}}
      >
        <Link to="/"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg></Link>
    </button>
      <div className='z-10 shadow-[0_0_150px_175px_rgba(83,7,140,0.4)] rounded-full'>
        <div className=" bg-gradient-to-br from-[#5A2C98] to-[#D680CF] rounded-full p-10 shadow-md w-full max-w-md">
          {currentDate < response?.openingDate ? (
            <div>
              <h1 className="text-4xl font-extrabold mb-4 text-purple-500">
                ⚙️ Welcome to the Time Machine ⚙️
              </h1>
              <p className="text-gray-300">
                Prepare to embark on a journey to the future: {response?.openingDate}
              </p>
              <p className="text-gray-300">{response?.waitMessage}</p>
              {showMessage && (
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
              )}
            </div>
          ) : (
            <div className="text-center">
              <h1 className="text-4xl font-extrabold mb-4 text-white">
                Time Capsule Unlocked!
              </h1>
              <div className='transition-all ease-in-out duration-3000 overflow-hidden flex items-center justify-center' style={{...displayMessage}}>
                <button className="bg-[#1F2937] text-white px-4 py-2 rounded-lg flex-col items-center justify-center" onClick={() => setShowMessageContent(true)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-auto">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
                <span>Show Message</span>
                </button>
              
              </div>
              <div className='bg-gray-900 rounded-lg h-[60vh] w-[60vw] absolute overflow-auto p-6 left-[50%] top-[50%] -translate-x-1/2  -translate-y-1/2 opacity-30 hidden items-center justify-center' style={{...messageContent}}>
                <p className="text-gray-300 text-[2em]">{response?.content}</p>
                <button
                  className="absolute top-2 right-2 text-white hover:text-gray-300"
                  onClick={() => setShowMessageContent(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
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
