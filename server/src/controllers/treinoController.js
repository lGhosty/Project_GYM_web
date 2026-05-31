const pool = require('../config/database')

async function listarTreinos(req, res) {
  try {
    const treinos = await pool.query(
      'SELECT * FROM treinos WHERE usuario_id = $1 ORDER BY id',
      [req.usuarioId]
    )

    const treinosComExercicios = await Promise.all(
      treinos.rows.map(async (treino) => {
        const exercicios = await pool.query(
          'SELECT * FROM exercicios WHERE treino_id = $1 ORDER BY id',
          [treino.id]
        )
        return { ...treino, exercicios: exercicios.rows }
      })
    )

    res.json(treinosComExercicios)

  } catch (err) {
    res.status(500).json({ erro: 'Erro interno do servidor.' })
  }
}

async function criarTreino(req, res) {
  try {
    const { nome, dia_semana, duracao_min, exercicios } = req.body

    if (!nome || !dia_semana) {
      return res.status(400).json({ erro: 'Nome e dia da semana sao obrigatorios.' })
    }

    const result = await pool.query(
      `INSERT INTO treinos (usuario_id, nome, dia_semana, duracao_min)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [req.usuarioId, nome, dia_semana, duracao_min]
    )

    const treino = result.rows[0]

    if (exercicios && exercicios.length > 0) {
      for (const ex of exercicios) {
        await pool.query(
          `INSERT INTO exercicios (treino_id, nome, series, repeticoes, descanso_s, grupo)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [treino.id, ex.nome, ex.series, ex.repeticoes, ex.descanso_s, ex.grupo]
        )
      }
    }

    const exResult = await pool.query('SELECT * FROM exercicios WHERE treino_id = $1', [treino.id])

    res.status(201).json({ ...treino, exercicios: exResult.rows })

  } catch (err) {
    res.status(500).json({ erro: 'Erro interno do servidor.' })
  }
}

module.exports = { listarTreinos, criarTreino }