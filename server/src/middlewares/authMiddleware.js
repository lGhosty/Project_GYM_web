const jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports = function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization']

  if (!authHeader) {
    return res.status(401).json({ erro: 'Token não fornecido.' })
  }

  const [tipo, token] = authHeader.split(' ')

  if (tipo !== 'Bearer' || !token) {
    return res.status(401).json({ erro: 'Token mal formatado. Use: Bearer <token>' })
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ erro: 'Token inválido ou expirado.' })
    }

    // Injeta os dados do usuário logado na requisição
    req.usuarioId   = decoded.id
    req.usuarioRole = decoded.role

    next()
  })
}