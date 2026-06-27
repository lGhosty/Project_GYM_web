class NotificacaoModel {
  constructor({ id, usuario_id, remetente_id, titulo, mensagem, lida, criado_em }) {
    this.id           = id
    this.usuario_id   = usuario_id
    this.remetente_id = remetente_id
    this.titulo       = titulo
    this.mensagem     = mensagem
    this.lida         = lida || false
    this.criado_em    = criado_em
  }
}
 
module.exports = NotificacaoModel