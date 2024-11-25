import express from 'express';
import axios from 'axios';
import fs from 'fs';
import mongoose from 'mongoose';
import multer from 'multer';
import { franc } from 'franc';
import dotenv from 'dotenv';

// Configuração do dotenv
dotenv.config();

const app = express();
app.use(express.json());

// Configuração do MongoDB
mongoose.connect(process.env.MONGODB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Modelo de histórico de conversas
const chatSchema = new mongoose.Schema({
  userMessage: String,
  botResponse: String,
  timestamp: { type: Date, default: Date.now }
});

const Chat = mongoose.model('Chat', chatSchema);

// Configuração do multer para upload de arquivos
const upload = multer({ dest: 'uploads/' });

// Porta da API
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

// Mapeamento de idiomas
const langMap = {
  eng: 'English',
  por: 'Portuguese',
  spa: 'Spanish'
};

// Função para detectar idioma
const detectLanguage = (message) => {
  const langCode = franc(message);
  return langMap[langCode] || 'Portuguese'; // Padrão para inglês
};

// Função para gerar um prompt contextualizado com base no conteúdo do arquivo
const generatePrompt = (userMessage, context, language) => {
  return `
    Você é um especialista em um sistema de gestão acadêmica. O sistema oferece as seguintes funcionalidades:

    ${context}

    Responda no idioma do usuário: ${language}.

    Pergunta do usuário: "${userMessage}"
  `;
};

// Endpoint principal de chat com histórico e suporte multilíngue
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Por favor, envie uma mensagem.' });
  }

  const context = loadContext();
  const language = detectLanguage(message);

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: generatePrompt(message, context, language) },
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

    // Salvar a conversa no banco de dados
    await Chat.create({ userMessage: message, botResponse: chatResponse });

    res.json({ response: chatResponse });
  } catch (error) {
    console.error('Erro ao acessar a API do ChatGPT:', error.message);
    res.status(500).json({ error: 'Erro ao acessar a API do ChatGPT.' });
  }
});

// Endpoint para upload de arquivos e interação com o contexto do arquivo
app.post('/api/chat-with-file', upload.single('file'), async (req, res) => {
  const { message } = req.body;

  if (!message || !req.file) {
    return res.status(400).json({ error: 'Envie uma mensagem e um arquivo.' });
  }

  const fileContent = fs.readFileSync(req.file.path, 'utf8');
  const context = loadContext() + '\n' + fileContent;
  const language = detectLanguage(message);

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: generatePrompt(message, context, language) },
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

    // Salvar a conversa no banco de dados
    await Chat.create({ userMessage: message, botResponse: chatResponse });

    res.json({ response: chatResponse });
  } catch (error) {
    console.error('Erro ao acessar a API do ChatGPT:', error.message);
    res.status(500).json({ error: 'Erro ao acessar a API do ChatGPT.' });
  }
});

// Endpoint para listar o histórico de conversas
app.get('/api/chat-history', async (req, res) => {
  try {
    const history = await Chat.find().sort({ timestamp: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao recuperar histórico.' });
  }
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`API rodando em http://localhost:${port}`);
});
