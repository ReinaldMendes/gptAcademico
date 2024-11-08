// server.js

const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());

const port = 3000;

// Função para gerar um prompt contextualizado sobre a Agro Circula
const generatePrompt = (userMessage) => {
  return `
    A moeda digital Agro Circula é usada para fortalecer a economia do agronegócio em uma região, incentivando o consumo local e a formalização de negócios rurais. 
    A moeda facilita transações entre agricultores, fornecedores, cooperativas e consumidores finais, criando uma rede onde o dinheiro permanece na comunidade.
    
    Respondendo como especialista em Agro Circula:
    - Para onde os usuários podem usar a Agro Circula?
    - Como ela funciona e seus benefícios?
    
    Pergunta do usuário: "${userMessage}"
  `;
};

// Endpoint para enviar mensagens ao ChatGPT com contexto da Agro Circula
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Por favor, envie uma mensagem.' });
  }

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo', // Use 'gpt-4' se disponível
        messages: [
          { role: 'system', content: generatePrompt(message) },
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
