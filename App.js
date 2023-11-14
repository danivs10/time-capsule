// client/src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useParams, useNavigate } from 'react-router-dom';
import './App.css';
import MessageDisplay from './MessageDisplay';

const SubmitForm = () => {
  const [message, setMessage] = useState('');
  const [openingDate, setOpeningDate] = useState('');
  const [messageId, setMessageId] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async () => {
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
        setMessageId(messageId);
        navigate('/message/'+messageId);
      } else {
        console.error('Error submitting message:', response.statusText);
      }
    } catch (error) {
      console.error('Error submitting message:', error.message);
    }
  };

  return (
    <div>
        <div>
          <textarea
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <input
            type="date"
            value={openingDate}
            onChange={(e) => setOpeningDate(e.target.value)}
          />
          <button onClick={handleSubmit}>Submit</button>
        </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/message/:id" element={<MessageDisplayRouter/>} />
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
