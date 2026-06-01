require('dotenv').config()
const express = require('express')
const cors    = require('cors')
const path    = require('path')

require('./config/database')

const app  = express()
const PORT = process.env.PORT || 3333

app.use(cors())
app.use(express.json())

app.use(express.static(path.join(__dirname, '../../')))

app.use('/api/auth',     require('./routes/authRoutes'))
app.use('/api/treinos',  require('./routes/treinoRoutes'))
app.use('/api/dietas',   require('./routes/dietaRoutes'))
app.use('/api/usuarios', require('./routes/usuarioRoutes'))

app.listen(PORT, () => {
  console.log(`Servidor: http://localhost:${PORT}`)
  console.log(`Front:    http://localhost:${PORT}/index.html`)
})