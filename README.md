# Chat Acadêmico

O **Chat Acadêmico** é uma aplicação desenvolvida para ajudar alunos e professores com dúvidas acadêmicas de forma interativa e personalizada. Ele utiliza a API do ChatGPT para responder a perguntas, oferece suporte a arquivos e registra um histórico de conversas. Desenvolvido com **React Native** no front-end e **Node.js** no back-end, a aplicação é escalável e fácil de usar.

---

## 🚀 Tecnologias Utilizadas

- **Frontend:**  
  - [React Native](https://reactnative.dev/)  
  - Expo (via Snack)
- **Backend:**  
  - [Node.js](https://nodejs.org/)  
  - Express  
  - OpenAI API  
  - MongoDB (para armazenar histórico de conversas)
  - [Multer](https://www.npmjs.com/package/multer) (para upload de arquivos)
  - [Franc](https://www.npmjs.com/package/franc) (para detecção de idioma)
  - [Axios](https://axios-http.com/) (para requisições HTTP)

---

## 📦 Instalação e Configuração

### Pré-requisitos

- Node.js 16 ou superior
- Expo CLI
- Yarn ou npm instalado
- Conta na [OpenAI](https://openai.com/) para obter a chave API

### Backend

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/chat-academico.git
   cd chat-academico/backend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
   ```env
   OPENAI_API_KEY=your_openai_api_key
   MONGODB=mongodb://localhost:27017/chat-academico
   PORT=4000
   ```

4. Inicie o servidor:
   ```bash
   npm start
   ```

5. O backend estará disponível em `http://localhost:4000`.

### Frontend

1. Navegue para o diretório do frontend:
   ```bash
   cd ../frontend
   ```

2. Inicie o projeto com Expo:
   ```bash
   expo start
   ```

3. Use um emulador ou seu dispositivo físico para visualizar a aplicação.

---

## 📚 Funcionalidades

- **Envio de mensagens ao modelo ChatGPT:** Os usuários podem enviar mensagens para o ChatGPT e obter respostas para dúvidas acadêmicas.
- **Identificação automática de idioma:** A aplicação detecta automaticamente o idioma da mensagem do usuário, com suporte para português, inglês e espanhol.
- **Contextualização do chat com arquivos:** Suporte ao envio de arquivos (.txt) junto com as mensagens para fornecer um contexto mais rico e personalizado nas respostas.
- **Histórico de conversas:** Todo o histórico de interações entre o usuário e o bot é salvo no banco de dados MongoDB, permitindo que os usuários consultem conversas anteriores.
- **Respostas personalizadas:** O sistema personaliza as respostas com base no conteúdo do arquivo carregado e no idioma do usuário.

---

## 🌐 Rotas da API

### POST `/api/chat`

**Descrição:** Envia a mensagem do usuário para o ChatGPT e retorna uma resposta.  
**Corpo da Requisição:**
```json
{
  "message": "Qual a capital da França?"
}
```
**Resposta:**
```json
{
  "response": "A capital da França é Paris."
}
```

### POST `/api/chat-with-file`

**Descrição:** Envia uma mensagem e um arquivo para o ChatGPT. O conteúdo do arquivo é usado para fornecer um contexto mais detalhado na resposta.  
**Corpo da Requisição:**
```json
{
  "message": "Explique o que é um algoritmo."
}
```
**Formulário de upload (arquivo):** Anexe o arquivo de texto (`file`).

**Resposta:**
```json
{
  "response": "Um algoritmo é uma sequência de passos finitos para resolver um problema."
}
```

### GET `/api/chat-history`

**Descrição:** Recupera o histórico de conversas armazenadas no banco de dados.  
**Resposta:**
```json
[
  {
    "userMessage": "Qual a capital da França?",
    "botResponse": "A capital da França é Paris.",
    "timestamp": "2024-11-28T00:00:00Z"
  },
  ...
]
```

---

## 🛠 Contribuindo

1. Faça um fork do projeto.
2. Crie uma branch para sua feature ou correção:
   ```bash
   git checkout -b minha-feature
   ```
3. Commit suas alterações:
   ```bash
   git commit -m 'Adiciona nova funcionalidade'
   ```
4. Faça o push para sua branch:
   ```bash
   git push origin minha-feature
   ```
5. Abra um Pull Request.

---

## 📝 Licença

Este projeto está sob a licença MIT. Para mais detalhes, veja o arquivo [LICENSE](LICENSE).

---

## ✉️ Contato

Se tiver dúvidas ou sugestões, sinta-se à vontade para entrar em contato:

- **Email:** reinald_30_2009@hotmail.com
- **LinkedIn:** [Reinald Mendes](https://www.linkedin.com/in/reinald-mendes-b712b9182)

---

### Detalhes Técnicos

- **Histórico de conversas:** A cada interação com o ChatGPT, a mensagem do usuário e a resposta do bot são salvas no MongoDB. Isso permite que o usuário consulte todas as interações anteriores. O histórico é acessado por meio do endpoint `/api/chat-history`.
- **Detecção de idioma:** A detecção de idioma é feita utilizando o pacote `franc`, que identifica a língua da mensagem com base no conteúdo. O idioma detectado é utilizado para ajustar a resposta do modelo de acordo com a língua do usuário.
- **Carregamento de contexto:** O sistema carrega um contexto inicial de um arquivo `.txt` que pode ser personalizado com informações relacionadas ao sistema acadêmico. Se um arquivo for enviado junto com a mensagem, o conteúdo do arquivo é concatenado ao contexto existente para enriquecer as respostas.


