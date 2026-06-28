const pool               = require('../config/database')
const NotificacaoModel   = require('../models/NotificacaoModel')

class NotificacaoRepository {

  async findByUsuarioId(usuarioId) {
    const result = await pool.query(
      'SELECT * FROM notificacoes WHERE usuario_id = $1 ORDER BY criado_em DESC',
      [usuarioId]
    )
    return result.rows.map(row => new NotificacaoModel(row))
  }

  async create({ usuarioId, remetenteId, titulo, mensagem }) {
    const result = await pool.query(
      `INSERT INTO notificacoes (usuario_id, remetente_id, titulo, mensagem)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [usuarioId, remetenteId, titulo, mensagem]
    )
    return new NotificacaoModel(result.rows[0])
  }

  async marcarLida(id, usuarioId) {
    const result = await pool.query(
      'UPDATE notificacoes SET lida = true WHERE id = $1 AND usuario_id = $2 RETURNING *',
      [id, usuarioId]
    )
    if (result.rows.length === 0) return null
    return new NotificacaoModel(result.rows[0])
  }
}

module.exports = new NotificacaoRepository()