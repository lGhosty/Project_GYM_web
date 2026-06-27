// src/app.js
// Ponto de entrada do servidor

require('dotenv').config()
const express = require('express')
const cors    = require('cors')
const path    = require('path')

// Inicia a conexão com o banco ao subir o servidor
require('./config/database')

const app  = express()
const PORT = process.env.PORT || 3333

// ── MIDDLEWARES GLOBAIS ──────────────────────────────────────
app.use(cors())
app.use(express.json())

// Serve os arquivos estáticos do front-end
app.use(express.static(path.join(__dirname, '../../')))

// ── ROTAS DA API ─────────────────────────────────────────────
app.use('/api/auth',         require('./routes/authRoutes'))
app.use('/api/treinos',      require('./routes/treinoRoutes'))
app.use('/api/dietas',       require('./routes/dietaRoutes'))
app.use('/api/usuarios',     require('./routes/usuarioRoutes'))
app.use('/api/avaliacoes',   require('./routes/avaliacaoRoutes'))
app.use('/api/agendamentos', require('./routes/agendamentoRoutes'))
app.use('/api/notificacoes', require('./routes/notificacaoRoutes'))

// ── ROTA DE STATUS ───────────────────────────────────────────
app.get('/api', (req, res) => {
  res.json({
    projeto: 'FreakyZone API',
    versao:  '3.0.0',
    status:  'online',
    endpoints: [
      'POST   /api/auth/cadastro',
      'POST   /api/auth/login',
      'GET    /api/treinos              (aluno)',
      'POST   /api/treinos              (admin)',
      'PUT    /api/treinos/:id          (admin)',
      'DELETE /api/treinos/:id          (admin)',
      'GET    /api/dietas               (aluno)',
      'POST   /api/dietas               (admin)',
      'DELETE /api/dietas/:id           (auth)',
      'GET    /api/usuarios/perfil      (auth)',
      'PUT    /api/usuarios/perfil      (auth)',
      'GET    /api/usuarios/alunos      (admin)',
      'GET    /api/avaliacoes           (auth)',
      'POST   /api/avaliacoes           (admin)',
      'GET    /api/agendamentos         (auth)',
      'POST   /api/agendamentos         (admin)',
      'PUT    /api/agendamentos/:id     (auth)',
      'GET    /api/notificacoes         (aluno)',
      'POST   /api/notificacoes         (admin)',
      'PUT    /api/notificacoes/:id/ler (aluno)',
    ]
  })
})

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`)
  console.log(`🌐 Front-end:  http://localhost:${PORT}/index.html`)
  console.log(`👨‍💼 Painel Admin: http://localhost:${PORT}/pages/admin.html`)
})