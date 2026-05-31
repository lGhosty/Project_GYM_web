const pool = require('../config/database')

async function verPerfil(req, res) {
  try {
    const result = await pool.query(
      'SELECT id, nome, email, peso, altura, objetivo, criado_em FROM usuarios WHERE id = $1',
      [req.usuarioId]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ erro: 'Usuario nao encontrado.' })
    }

    res.json(result.rows[0])

  } catch (err) {
    res.status(500).json({ erro: 'Erro interno do servidor.' })
  }
}

async function atualizarPerfil(req, res) {
  try {
    const { nome, peso, altura, objetivo } = req.body

    const result = await pool.query(
      `UPDATE usuarios SET
        nome     = COALESCE($1, nome),
        peso     = COALESCE($2, peso),
        altura   = COALESCE($3, altura),
        objetivo = COALESCE($4, objetivo)
       WHERE id = $5
       RETURNING id, nome, email, peso, altura, objetivo`,
      [nome, peso, altura, objetivo, req.usuarioId]
    )

    res.json(result.rows[0])

  } catch (err) {
    res.status(500).json({ erro: 'Erro interno do servidor.' })
  }
}

module.exports = { verPerfil, atualizarPerfil }