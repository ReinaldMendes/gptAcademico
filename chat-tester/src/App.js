import React from 'react';
import ChatForm from './components/ChatForm';
import FileUpload from './components/FileUpload';
import ChatHistory from './components/ChatHistory';

const App = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Teste da API Chat</h1>
      <ChatForm />
      <hr />
      <FileUpload />
      <hr />
      <ChatHistory />
    </div>
  );
};

export default App;
