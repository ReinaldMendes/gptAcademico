import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = () => {
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState('');

  const sendFile = async () => {
    const formData = new FormData();
    formData.append('message', message);
    formData.append('file', file);

    try {
      const res = await axios.post('http://localhost:3000/api/chat-with-file', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResponse(res.data.response);
    } catch (err) {
      setResponse('Erro: ' + err.response?.data?.error || 'Erro desconhecido.');
    }
  };

  return (
    <div>
      <h2>Teste Upload com Arquivo</h2>
      <textarea 
        placeholder="Digite sua mensagem..." 
        value={message} 
        onChange={(e) => setMessage(e.target.value)} 
        rows={4}
      />
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={sendFile}>Enviar</button>
      <div>
        <h4>Resposta:</h4>
        <p>{response}</p>
      </div>
    </div>
  );
};

export default FileUpload;
