// client/src/App.js
import React, { useState, useEffect, useLocation } from 'react';
import { BrowserRouter as Router, Route, Routes, useParams, useNavigate } from 'react-router-dom';
import MessageDisplay from './MessageDisplay';

const SubmitForm = () => {
  const [message, setMessage] = useState('');
  const [openingDate, setOpeningDate] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [formHeight, setFormHeight] = useState(false);
  const [submitHeight, setSubmitHeight] = useState(false);
  const [submittedMessageUrl, setSubmittedMessageUrl] = useState('');
  const navigate = useNavigate();

  const timeCapsuleStyle = {
    fontFamily: "'Cinzel', serif",
    fontSize: '9rem', // Adjust the size as needed
    color: '#FFEEB6', // Choose a color that fits your design
    textAlign: 'center',
    position: 'absolute',
    top: '1vh',
    width: '100%',
    weight: '200'
  };


  const formStyle = {
    height: formHeight ? '350px' : '0',
    transition: 'all 1s ease-in-out',
  };

  const submittedStyle = {
    height: submitHeight ? '250px' : '0',
    transition: 'all 1s ease-in-out',
    transitionDelay: '1s',
  };
  
  useEffect(() => {
    // Set the initial height after the component mounts
    setFormHeight(false);
    setSubmitHeight(false);
    setFormHeight(true);
  }, []);


  const handleSubmit = async () => {
    if (!message) {
      setErrorMessage('Please enter a valid message');
      return;
    }
    //TODO add || openingDate<(new Date().toISOString()) condition so no earlier capsules crweated
    if (!openingDate ) {
      setErrorMessage('Please enter a valid date after '+new Date());
      return;
    }
    
    try {
      const response = await fetch('http://localhost:3001/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: message, openingDate }),
      });

      if (response.ok) {
        const { messageId } = await response.json();
        const messageUrl = window.location.href + 'message/' + messageId;
        setSubmittedMessageUrl(messageUrl);
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Error submitting message.');
      }
    } catch (error) {
      console.error('Error submitting message:', error.message);
      setErrorMessage('Error submitting message.');
    }
    setFormHeight(false);
    setSubmitHeight(true);
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-[#351948] to-[#160323] text-white">
      <h1 style={timeCapsuleStyle}>TIME CAPSULE</h1>
        <div className='z-10 shadow-[0_0_150px_175px_rgba(83,7,140,0.4)] rounded-full'>
        <div className='h-40 bg-gradient-to-br from-[#5A2C98] to-[#D680CF] rounded-tl-full rounded-tr-full w-full max-w-md'></div>
        <div className='bg-gradient-to-r from-[#9957B4] to-[#D680CF] w-full max-w-md h-0 overflow-hidden flex flex-col justify-center items-center text-center' style={{...submittedStyle}} >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-full max-w-md h-12 justify-center items-center">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>

          <h1 className='text-2xl font-extrabold mb-9 mt-6'>Time capsule sent to the future!</h1>
          <h1 className='text-xl font-extrabold '> See your message: </h1>
          <a className='text-2xl font-extrabold underline hover:text-[#E5E2F5]' href={submittedMessageUrl}>{submittedMessageUrl}</a>
        </div>
        <div className="bg-[#12041C] flex flex-col justify-center items-center shadow-md w-full max-w-md overflow-hidden" style={{ ...formStyle, boxShadow: 'inset 0 0 70px rgba(255,255,255,0.5)' }}>
          
          <div className='p-10 flex-col'>
            <textarea
              className="w-full p-4 mb-4 border border-purple-600 rounded-xl bg-gray-800 text-white"
              placeholder="Type your magical message here ✨"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <input
              className="w-full p-3 mb-4 border border-purple-600 rounded-xl bg-gray-800 text-white"
              type="date"
              value={openingDate}
              onChange={(e) => setOpeningDate(e.target.value)}
            />
            {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
          </div>
      </div>
      <div className='h-40 bg-gradient-to-tr from-[#5A2C98] to-[#D680CF] rounded-bl-full rounded-br-full w-full max-w-md'></div>
      </div>
      <button
        className="mt-20 p-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700"
        onClick={handleSubmit}
      >
        ✨ Submit to the Magic ✨
      </button>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/message/:id" element={<MessageDisplayRouter />} />
        <Route path="/" element={<SubmitForm />} />
      </Routes>
    </Router>
  );
};

const MessageDisplayRouter = () => {
  const { id } = useParams();
  return <MessageDisplay messageId={id} />;
};

export default App;
