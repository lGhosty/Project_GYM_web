const pool       = require('../config/database')
const DietaModel = require('../models/DietaModel')

class DietaRepository {

  async findByUsuarioId(usuarioId) {
    const result = await pool.query(
      'SELECT * FROM dietas WHERE usuario_id = $1 ORDER BY horario',
      [usuarioId]
    )
    return result.rows.map(row => new DietaModel(row))
  }

  async create({ usuarioId, criadoPor, nome, descricao, horario, calorias }) {
    const result = await pool.query(
      `INSERT INTO dietas (usuario_id, criado_por, nome, descricao, horario, calorias)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [usuarioId, criadoPor, nome, descricao, horario, calorias]
    )
    return new DietaModel(result.rows[0])
  }

  async delete(id, usuarioId, isAdmin) {
    // Admin pode deletar qualquer refeição; aluno só as suas
    const query = isAdmin
      ? 'DELETE FROM dietas WHERE id = $1 RETURNING id, nome'
      : 'DELETE FROM dietas WHERE id = $1 AND usuario_id = $2 RETURNING id, nome'
    const params = isAdmin ? [id] : [id, usuarioId]
    const result = await pool.query(query, params)
    return result.rows[0] || null
  }
}

module.exports = new DietaRepository()