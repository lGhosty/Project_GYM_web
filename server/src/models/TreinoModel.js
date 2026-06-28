class TreinoModel {
  constructor({ id, usuario_id, criado_por, nome, dia_semana, duracao_min, criado_em, exercicios = [] }) {
    this.id          = id
    this.usuario_id  = usuario_id
    this.criado_por  = criado_por
    this.nome        = nome
    this.dia_semana  = dia_semana
    this.duracao_min = duracao_min
    this.criado_em   = criado_em
    this.exercicios  = exercicios  // array de ExercicioModel
  }
}
 
module.exports = TreinoModel