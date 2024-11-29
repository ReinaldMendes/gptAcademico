const API_URL = 'http://localhost:4000/api';

// Elementos do DOM
const messageInput = document.getElementById('messageInput');
const sendMessageButton = document.getElementById('sendMessageButton');
const messageResponse = document.getElementById('messageResponse');

const fileInput = document.getElementById('fileInput');
const fileMessageInput = document.getElementById('fileMessageInput');
const sendFileButton = document.getElementById('sendFileButton');
const fileResponse = document.getElementById('fileResponse');

// Enviar mensagem para a API de chat
sendMessageButton.addEventListener('click', async () => {
  const message = messageInput.value;

  if (!message) {
    messageResponse.textContent = 'Por favor, insira uma mensagem.';
    return;
  }

  try {
    const response = await fetch(`${API_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();
    messageResponse.textContent = data.response || 'Erro na resposta da API.';
  } catch (error) {
    messageResponse.textContent = 'Erro ao conectar-se à API.';
    console.error(error);
  }
});

// Enviar arquivo e mensagem para a API de chat
sendFileButton.addEventListener('click', async () => {
  const file = fileInput.files[0];
  const message = fileMessageInput.value;

  if (!file || !message) {
    fileResponse.textContent = 'Por favor, envie um arquivo e uma mensagem.';
    return;
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('message', message);

  try {
    const response = await fetch(`${API_URL}/chat-with-file`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    fileResponse.textContent = data.response || 'Erro na resposta da API.';
  } catch (error) {
    fileResponse.textContent = 'Erro ao conectar-se à API.';
    console.error(error);
  }
});
