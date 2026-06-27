const pool               = require('../config/database')
const AgendamentoModel   = require('../models/AgendamentoModel')

class AgendamentoRepository {

  async findByUsuarioId(usuarioId) {
    const result = await pool.query(
      'SELECT * FROM agendamentos WHERE usuario_id = $1 ORDER BY data_hora',
      [usuarioId]
    )
    return result.rows.map(row => new AgendamentoModel(row))
  }

  async findAll() {
    const result = await pool.query(
      `SELECT a.*, u.nome AS aluno_nome
       FROM agendamentos a
       JOIN usuarios u ON a.usuario_id = u.id
       ORDER BY a.data_hora`
    )
    return result.rows.map(row => new AgendamentoModel(row))
  }

  async create({ usuarioId, criadoPor, titulo, descricao, dataHora, tipo }) {
    const result = await pool.query(
      `INSERT INTO agendamentos (usuario_id, criado_por, titulo, descricao, data_hora, tipo)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [usuarioId, criadoPor, titulo, descricao, dataHora, tipo]
    )
    return new AgendamentoModel(result.rows[0])
  }

  async updateStatus(id, status) {
    const result = await pool.query(
      'UPDATE agendamentos SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    )
    if (result.rows.length === 0) return null
    return new AgendamentoModel(result.rows[0])
  }
}

module.exports = new AgendamentoRepository()