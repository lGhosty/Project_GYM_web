const pool          = require('../config/database')
const TreinoModel   = require('../models/TreinoModel')
const ExercicioModel = require('../models/ExercicioModel')

class TreinoRepository {

  // Busca todos os treinos de um usuário com seus exercícios
  async findByUsuarioId(usuarioId) {
    const treinos = await pool.query(
      'SELECT * FROM treinos WHERE usuario_id = $1 ORDER BY id',
      [usuarioId]
    )

    // Para cada treino, busca seus exercícios em paralelo
    const treinosComExercicios = await Promise.all(
      treinos.rows.map(async (treino) => {
        const exercicios = await pool.query(
          'SELECT * FROM exercicios WHERE treino_id = $1 ORDER BY id',
          [treino.id]
        )
        return new TreinoModel({
          ...treino,
          exercicios: exercicios.rows.map(ex => new ExercicioModel(ex))
        })
      })
    )

    return treinosComExercicios
  }

  // Cria um treino e seus exercícios (usando transação para garantir consistência)
  async create({ usuarioId, criadoPor, nome, diaSemana, duracaoMin, exercicios }) {
    const client = await pool.connect()
    try {
      await client.query('BEGIN') // inicia a transação

      const treinoResult = await client.query(
        `INSERT INTO treinos (usuario_id, criado_por, nome, dia_semana, duracao_min)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [usuarioId, criadoPor, nome, diaSemana, duracaoMin]
      )
      const treino = treinoResult.rows[0]

      const exerciciosCriados = []
      if (exercicios && exercicios.length > 0) {
        for (const ex of exercicios) {
          const exResult = await client.query(
            `INSERT INTO exercicios (treino_id, nome, series, repeticoes, descanso_s, grupo)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [treino.id, ex.nome, ex.series, ex.repeticoes, ex.descanso_s, ex.grupo]
          )
          exerciciosCriados.push(new ExercicioModel(exResult.rows[0]))
        }
      }

      await client.query('COMMIT') // confirma a transação

      return new TreinoModel({ ...treino, exercicios: exerciciosCriados })

    } catch (err) {
      await client.query('ROLLBACK') // desfaz tudo se houver erro
      throw err
    } finally {
      client.release()
    }
  }

  // Atualiza um treino pelo ID
  async update(id, { nome, diaSemana, duracaoMin }) {
    const result = await pool.query(
      `UPDATE treinos
       SET nome        = COALESCE($1, nome),
           dia_semana  = COALESCE($2, dia_semana),
           duracao_min = COALESCE($3, duracao_min)
       WHERE id = $4 RETURNING *`,
      [nome, diaSemana, duracaoMin, id]
    )
    if (result.rows.length === 0) return null
    return new TreinoModel(result.rows[0])
  }

  // Deleta um treino pelo ID (exercícios são deletados em cascata)
  async delete(id) {
    const result = await pool.query(
      'DELETE FROM treinos WHERE id = $1 RETURNING id, nome',
      [id]
    )
    return result.rows[0] || null
  }
}

module.exports = new TreinoRepository()