const pool         = require('../config/database')
const UsuarioModel = require('../models/UsuarioModel')

class UsuarioRepository {

  // Busca um usuário pelo email
  async findByEmail(email) {
    const result = await pool.query(
      'SELECT * FROM usuarios WHERE email = $1',
      [email]
    )
    if (result.rows.length === 0) return null
    return new UsuarioModel(result.rows[0])
  }

  // Busca um usuário pelo ID
  async findById(id) {
    const result = await pool.query(
      'SELECT * FROM usuarios WHERE id = $1',
      [id]
    )
    if (result.rows.length === 0) return null
    return new UsuarioModel(result.rows[0])
  }

  // Cria um novo usuário no banco
  async create({ nome, email, senhaHash, peso, altura, objetivo }) {
    const result = await pool.query(
      `INSERT INTO usuarios (nome, email, senha, peso, altura, objetivo, role)
       VALUES ($1, $2, $3, $4, $5, $6, 'aluno')
       RETURNING *`,
      [nome, email, senhaHash, peso, altura, objetivo]
    )
    return new UsuarioModel(result.rows[0])
  }

  // Atualiza campos do perfil (COALESCE mantém o valor atual se não informado)
  async update(id, { nome, peso, altura, objetivo }) {
    const result = await pool.query(
      `UPDATE usuarios
       SET nome     = COALESCE($1, nome),
           peso     = COALESCE($2, peso),
           altura   = COALESCE($3, altura),
           objetivo = COALESCE($4, objetivo)
       WHERE id = $5
       RETURNING *`,
      [nome, peso, altura, objetivo, id]
    )
    if (result.rows.length === 0) return null
    return new UsuarioModel(result.rows[0])
  }

  // Lista todos os usuários com papel 'aluno'
  async findAllAlunos() {
    const result = await pool.query(
      `SELECT * FROM usuarios WHERE role = 'aluno' ORDER BY nome`
    )
    return result.rows.map(row => new UsuarioModel(row))
  }
}

module.exports = new UsuarioRepository()