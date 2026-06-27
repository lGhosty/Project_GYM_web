// src/config/database.js
// Configuração central da conexão com PostgreSQL
// O Pool gerencia um conjunto de conexões reutilizáveis (evita abrir/fechar a cada query)

const { Pool } = require('pg')
require('dotenv').config()

const pool = new Pool({
  host:     process.env.DB_HOST,
  port:     Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
})

pool.connect()
  .then(client => {
    console.log('✅ PostgreSQL conectado com sucesso!')
    client.release() // libera a conexão de volta ao pool após o teste
  })
  .catch(err => console.error('❌ Erro ao conectar ao banco:', err.message))

module.exports = pool