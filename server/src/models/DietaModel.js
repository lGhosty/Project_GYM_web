class DietaModel {
  constructor({ id, usuario_id, criado_por, nome, descricao, horario, calorias, criado_em }) {
    this.id         = id
    this.usuario_id = usuario_id
    this.criado_por = criado_por
    this.nome       = nome
    this.descricao  = descricao
    this.horario    = horario
    this.calorias   = calorias
    this.criado_em  = criado_em
  }
}
 
module.exports = DietaModel