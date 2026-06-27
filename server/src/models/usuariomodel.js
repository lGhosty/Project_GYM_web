class UsuarioModel {
  constructor({ id, nome, email, senha, peso, altura, objetivo, role, criado_em }) {
    this.id        = id
    this.nome      = nome
    this.email     = email
    this.senha     = senha       // hash bcrypt — nunca expor na resposta
    this.peso      = peso
    this.altura    = altura
    this.objetivo  = objetivo
    this.role      = role || 'aluno'
    this.criado_em = criado_em
  }

  // Retorna os dados sem a senha (para enviar ao front-end)
  toPublic() {
    return {
      id:        this.id,
      nome:      this.nome,
      email:     this.email,
      peso:      this.peso,
      altura:    this.altura,
      objetivo:  this.objetivo,
      role:      this.role,
      criado_em: this.criado_em,
    }
  }
}

module.exports = UsuarioModel