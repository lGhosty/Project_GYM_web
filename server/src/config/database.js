const { Pool } = require('pg')
require('dotenv').config()

const isProduction = process.env.NODE_ENV === 'production'

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: isProduction
    ? {
        rejectUnauthorized: false
      }
    : false
})

pool
  .connect()
  .then((client) => {
    console.log('✅ Conectado ao banco PostgreSQL com sucesso!')
    client.release()
  })
  .catch((error) => {
    console.error('❌ Erro ao conectar ao banco:', error.message)
  })

module.exports = pool