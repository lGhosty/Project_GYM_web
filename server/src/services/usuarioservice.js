const UsuarioRepository = require('../repositories/UsuarioRepository')

class UsuarioService {

  async buscarPerfil(usuarioId) {
    const usuario = await UsuarioRepository.findById(usuarioId)
    if (!usuario) {
      throw { status: 404, mensagem: 'Usuário não encontrado.' }
    }
    return usuario.toPublic()
  }

  async atualizarPerfil(usuarioId, dados) {
    const usuario = await UsuarioRepository.update(usuarioId, dados)
    if (!usuario) {
      throw { status: 404, mensagem: 'Usuário não encontrado.' }
    }
    return usuario.toPublic()
  }

  async listarAlunos() {
    const alunos = await UsuarioRepository.findAllAlunos()
    return alunos.map(a => a.toPublic())
  }

  // Busca um aluno e valida que existe e é realmente aluno
  async validarAluno(usuarioId) {
    const usuario = await UsuarioRepository.findById(usuarioId)
    if (!usuario || usuario.role !== 'aluno') {
      throw { status: 404, mensagem: 'Aluno não encontrado.' }
    }
    return usuario
  }
}

module.exports = new UsuarioService()