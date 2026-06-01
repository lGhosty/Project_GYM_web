require('dotenv').config()
const express = require('express')
const cors = require('cors')

require('./config/database')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/auth',     require('./routes/authRoutes'))
app.use('/api/treinos',  require('./routes/treinoRoutes'))
app.use('/api/dietas',   require('./routes/dietaRoutes'))
app.use('/api/usuarios', require('./routes/usuarioRoutes'))

const PORT = process.env.PORT || 3333
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`))