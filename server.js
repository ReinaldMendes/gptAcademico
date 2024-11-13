// server.js

const express = require('express');
const axios = require('axios');
const fs = require('fs');
require('dotenv').config();

const app = express();
app.use(express.json());

const port = 3000;

// Função para carregar o contexto de um arquivo .txt
const loadContext = () => {
  try {
    return fs.readFileSync('./context.txt', 'utf8');
  } catch (error) {
    console.error('Erro ao ler o arquivo de contexto:', error.message);
    return '';
  }
};

// Função para gerar um prompt contextualizado com base no conteúdo do arquivo
const generatePrompt = (userMessage, context) => {
  return `
    ${context}
    
    Respondendo como especialista:
    Pergunta do usuário: "${userMessage}"
  `;
};

// Endpoint para enviar mensagens ao ChatGPT com contexto da Agro Circula
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Por favor, envie uma mensagem.' });
  }

  const context = loadContext(); // Carrega o contexto do arquivo

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo', // Use 'gpt-4' se disponível
        messages: [
          { role: 'system', content: generatePrompt(message, context) },
          { role: 'user', content: message }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const chatResponse = response.data.choices[0].message.content;
    res.json({ response: chatResponse });
  } catch (error) {
    console.error('Erro ao acessar a API do ChatGPT:', error.message);
    res.status(500).json({ error: 'Erro ao acessar a API do ChatGPT.' });
  }
});

app.listen(port, () => {
  console.log(`API rodando em http://localhost:${port}`);
});
