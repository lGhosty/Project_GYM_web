class ExercicioModel {
  constructor({ id, treino_id, nome, series, repeticoes, descanso_s, grupo }) {
    this.id         = id
    this.treino_id  = treino_id
    this.nome       = nome
    this.series     = series
    this.repeticoes = repeticoes
    this.descanso_s = descanso_s
    this.grupo      = grupo
  }
}
 
module.exports = ExercicioModel