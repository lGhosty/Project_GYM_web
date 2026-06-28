module.exports = function rbac(...rolesPermitidos) {
  return function (req, res, next) {
    if (!req.usuarioRole) {
      return res.status(403).json({ erro: 'Papel do usuário não identificado.' })
    }

    if (!rolesPermitidos.includes(req.usuarioRole)) {
      return res.status(403).json({
        erro: `Acesso negado. Requer: ${rolesPermitidos.join(' ou ')}.`,
      })
    }

    next()
  }
}