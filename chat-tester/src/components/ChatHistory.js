import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ChatHistory = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/chat-history');
        setHistory(res.data);
      } catch (err) {
        console.error('Erro ao carregar histórico:', err);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div>
      <h2>Histórico de Conversas</h2>
      <ul>
        {history.map((chat, index) => (
          <li key={index}>
            <strong>Usuário:</strong> {chat.userMessage} <br />
            <strong>Bot:</strong> {chat.botResponse} <br />
            <em>{new Date(chat.timestamp).toLocaleString()}</em>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatHistory;
