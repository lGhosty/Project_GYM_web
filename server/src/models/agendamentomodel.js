class AgendamentoModel {
  constructor({ id, usuario_id, criado_por, titulo, descricao, data_hora, tipo, status, criado_em }) {
    this.id         = id
    this.usuario_id = usuario_id
    this.criado_por = criado_por
    this.titulo     = titulo
    this.descricao  = descricao
    this.data_hora  = data_hora
    this.tipo       = tipo   || 'treino'
    this.status     = status || 'pendente'
    this.criado_em  = criado_em
  }
}
 
module.exports = AgendamentoModel