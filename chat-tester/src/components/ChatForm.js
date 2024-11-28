import React, { useState } from 'react';
import axios from 'axios';

const ChatForm = () => {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');

  const sendMessage = async () => {
    try {
      const res = await axios.post('http://localhost:3000/api/chat', { message });
      setResponse(res.data.response);
    } catch (err) {
      setResponse('Erro: ' + err.response?.data?.error || 'Erro desconhecido.');
    }
  };

  return (
    <div>
      <h2>Teste Chat</h2>
      <textarea 
        placeholder="Digite sua mensagem..." 
        value={message} 
        onChange={(e) => setMessage(e.target.value)} 
        rows={4}
      />
      <button onClick={sendMessage}>Enviar</button>
      <div>
        <h4>Resposta:</h4>
        <p>{response}</p>
      </div>
    </div>
  );
};

export default ChatForm;
