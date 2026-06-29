// src/app.js
// Ponto de entrada do servidor FreakyZone

require('dotenv').config()

const express = require('express')
const cors = require('cors')

// Inicia a conexão com o banco ao subir o servidor
require('./config/database')

const app = express()
const PORT = process.env.PORT || 3333

// ── MIDDLEWARES GLOBAIS ──────────────────────────────────────
app.use(cors({
  origin: '*'
}))

app.use(express.json())

// ── ROTAS DA API ─────────────────────────────────────────────
app.use('/api/auth', require('./routes/authRoutes'))
app.use('/api/treinos', require('./routes/treinoRoutes'))
app.use('/api/dietas', require('./routes/dietaRoutes'))
app.use('/api/usuarios', require('./routes/usuarioRoutes'))
app.use('/api/avaliacoes', require('./routes/avaliacaoRoutes'))
app.use('/api/agendamentos', require('./routes/agendamentoRoutes'))
app.use('/api/notificacoes', require('./routes/notificacaoRoutes'))

// ── ROTA DE STATUS ───────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    projeto: 'FreakyZone API',
    versao: '3.0.0',
    status: 'online',
    mensagem: 'API rodando com sucesso!'
  })
})

app.get('/api', (req, res) => {
  res.json({
    projeto: 'FreakyZone API',
    versao: '3.0.0',
    status: 'online',
    endpoints: [
      'POST   /api/auth/cadastro',
      'POST   /api/auth/login',

      'GET    /api/usuarios/perfil',
      'PUT    /api/usuarios/perfil',
      'GET    /api/usuarios/alunos',

      'GET    /api/treinos',
      'POST   /api/treinos',
      'PUT    /api/treinos/:id',
      'DELETE /api/treinos/:id',

      'GET    /api/dietas',
      'POST   /api/dietas',
      'DELETE /api/dietas/:id',

      'GET    /api/avaliacoes',
      'POST   /api/avaliacoes',

      'GET    /api/agendamentos',
      'POST   /api/agendamentos',
      'PUT    /api/agendamentos/:id',

      'GET    /api/notificacoes',
      'POST   /api/notificacoes',
      'PUT    /api/notificacoes/:id/ler'
    ]
  })
})

app.listen(PORT, () => {
  console.log(`🚀 FreakyZone API rodando na porta ${PORT}`)
  console.log(`📌 Status da API: http://localhost:${PORT}/api`)
})