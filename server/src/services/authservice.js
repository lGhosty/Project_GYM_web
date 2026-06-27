const bcrypt            = require('bcryptjs')
const jwt               = require('jsonwebtoken')
const UsuarioRepository = require('../repositories/UsuarioRepository')
require('dotenv').config()

class AuthService {

  // Regra de negócio do cadastro
  async cadastrar({ nome, email, senha, peso, altura, objetivo }) {
    // 1. Validação de campos obrigatórios
    if (!nome || !email || !senha) {
      throw { status: 400, mensagem: 'Nome, email e senha são obrigatórios.' }
    }

    // 2. Verifica se o email já está em uso
    const usuarioExistente = await UsuarioRepository.findByEmail(email)
    if (usuarioExistente) {
      throw { status: 409, mensagem: 'Este email já está cadastrado.' }
    }

    // 3. Criptografa a senha (nunca salvar senha em texto puro)
    const senhaHash = await bcrypt.hash(senha, 10)

    // 4. Cria o usuário no banco via Repository
    const usuario = await UsuarioRepository.create({ nome, email, senhaHash, peso, altura, objetivo })

    // 5. Gera o token JWT com id e role dentro do payload
    const token = this._gerarToken(usuario)

    return { token, usuario: usuario.toPublic() }
  }

  // Regra de negócio do login
  async login({ email, senha }) {
    if (!email || !senha) {
      throw { status: 400, mensagem: 'Email e senha são obrigatórios.' }
    }

    // 1. Busca o usuário — mensagem genérica para não revelar se o email existe
    const usuario = await UsuarioRepository.findByEmail(email)
    if (!usuario) {
      throw { status: 401, mensagem: 'Email ou senha incorretos.' }
    }

    // 2. Compara a senha com o hash (bcrypt faz isso de forma segura)
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha)
    if (!senhaCorreta) {
      throw { status: 401, mensagem: 'Email ou senha incorretos.' }
    }

    // 3. Gera e retorna o token
    const token = this._gerarToken(usuario)

    return { token, usuario: usuario.toPublic() }
  }

  // Método privado (convenção _ = interno) para gerar o token JWT
  _gerarToken(usuario) {
    return jwt.sign(
      { id: usuario.id, role: usuario.role }, // payload: dados dentro do token
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    )
  }
}

module.exports = new AuthService()