import express from 'express';
import axios from 'axios';
import fs from 'fs';
import mongoose from 'mongoose';
import multer from 'multer';
import { franc } from 'franc';
import dotenv from 'dotenv';
import https from 'https';
import sslRootCas from 'ssl-root-cas/latest.js';
import cors from 'cors';



// Configuração do dotenv
dotenv.config();

// Injeção de certificados raiz no Node.js
sslRootCas.inject();

const app = express();
app.use(express.json());
app.use(cors());
// Configuração do MongoDB
mongoose.connect(process.env.MONGODB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Modelo de histórico de conversas
const chatSchema = new mongoose.Schema({
  userMessage: String,
  botResponse: String,
  timestamp: { type: Date, default: Date.now },
});

const Chat = mongoose.model('Chat', chatSchema);

// Configuração do multer para upload de arquivos com nome original
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Salva o arquivo com o nome original prefixado com o timestamp
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Porta da API
const port = 4000;

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
  spa: 'Spanish',
};

// Função para detectar idioma
const detectLanguage = (message) => {
  const langCode = franc(message);
  return langMap[langCode] || 'Portuguese'; // Padrão para português
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

// Configuração do agente HTTPS para depuração (ignorar verificação de certificado)
const httpsAgent = new https.Agent({
  rejectUnauthorized: false, // **Use apenas em desenvolvimento!**
});

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
          { role: 'user', content: message },
        ],
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        httpsAgent, // Usando o agente HTTPS para ignorar verificação
      }
    );

    const chatResponse = response.data.choices[0].message.content;

    // Salvar a conversa no banco de dados
    await Chat.create({ userMessage: message, botResponse: chatResponse });

    res.json({ response: chatResponse });
  } catch (error) {
    console.error('Erro ao acessar a API do ChatGPT:', error.response?.data || error.message);
    res.status(500).json({ error: 'Erro ao acessar a API do ChatGPT.' });
  }
});

// Endpoint para upload de arquivos e interação com o contexto do arquivo
app.post('/api/chat-with-file', upload.single('file'), async (req, res) => {
  // Log de depuração para o corpo da requisição
  console.log('Requisição recebida:');
  console.log('Body:', req.body);

  // Log de depuração para o arquivo enviado
  console.log('Arquivo recebido:', req.file);

  // Validação de entrada
  if (!req.file) {
    console.error('Erro: Nenhum arquivo enviado.');
    return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
  }

  if (!req.body.message) {
    console.error('Erro: Nenhuma mensagem enviada.');
    return res.status(400).json({ error: 'Nenhuma mensagem enviada.' });
  }

  try {
    // Lê o conteúdo do arquivo enviado
    const fileContent = fs.readFileSync(req.file.path, 'utf8');

    // Combina o contexto do sistema com o conteúdo do arquivo
    const context = loadContext() + '\n' + fileContent;
    const language = detectLanguage(req.body.message);

    // Log do contexto gerado
    console.log('Contexto gerado:', context);

    // Chamada à API do ChatGPT
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: generatePrompt(req.body.message, context, language) },
          { role: 'user', content: req.body.message },
        ],
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        httpsAgent, // Usando o agente HTTPS para ignorar verificação
      }
    );

    const chatResponse = response.data.choices[0].message.content;

    // Salva a conversa no banco de dados
    await Chat.create({ userMessage: req.body.message, botResponse: chatResponse });

    // Log do sucesso na resposta
    console.log('Resposta gerada pelo ChatGPT:', chatResponse);

    // Responde ao cliente com o conteúdo gerado
    res.json({ response: chatResponse });
  } catch (error) {
    console.error('Erro ao acessar a API do ChatGPT:', error.response?.data || error.message);
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
