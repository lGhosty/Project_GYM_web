class AvaliacaoModel {
  constructor({ id, usuario_id, avaliador_id, peso, gordura_pct, massa_muscular, imc, observacoes, data_avaliacao, criado_em }) {
    this.id             = id
    this.usuario_id     = usuario_id
    this.avaliador_id   = avaliador_id
    this.peso           = peso
    this.gordura_pct    = gordura_pct
    this.massa_muscular = massa_muscular
    this.imc            = imc
    this.observacoes    = observacoes
    this.data_avaliacao = data_avaliacao
    this.criado_em      = criado_em
  }
}
 
module.exports = AvaliacaoModel