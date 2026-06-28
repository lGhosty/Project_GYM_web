'use client'

import { useEffect, useState } from 'react'
import { API_URL, getAuthHeaders } from '../../services/api'

type Aluno = {
  id: number
  nome: string
  email: string
}

export default function NotificacoesTab() {
  const [alunos, setAlunos] = useState<Aluno[]>([])

  const [usuarioId, setUsuarioId] = useState('')
  const [titulo, setTitulo] = useState('')
  const [mensagem, setMensagem] = useState('')

  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [carregando, setCarregando] = useState(false)

  useEffect(() => {
    async function carregarAlunos() {
      try {
        const resposta = await fetch(`${API_URL}/usuarios/alunos`, {
          headers: getAuthHeaders()
        })

        const dados = await resposta.json()

        if (!resposta.ok) {
          setErro(dados.erro || 'Erro ao carregar alunos.')
          return
        }

        setAlunos(dados)
      } catch {
        setErro('Não foi possível carregar os alunos.')
      }
    }

    carregarAlunos()
  }, [])

  async function enviarNotificacao() {
    setErro('')
    setSucesso('')

    if (!usuarioId) {
      setErro('Selecione um aluno.')
      return
    }

    if (!titulo.trim()) {
      setErro('Informe o título da notificação.')
      return
    }

    if (!mensagem.trim()) {
      setErro('Informe a mensagem da notificação.')
      return
    }

    setCarregando(true)

    try {
      const resposta = await fetch(`${API_URL}/notificacoes`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          usuario_id: Number(usuarioId),
          titulo,
          mensagem
        })
      })

      const dados = await resposta.json()

      if (!resposta.ok) {
        setErro(dados.erro || 'Erro ao enviar notificação.')
        return
      }

      setSucesso('Notificação enviada com sucesso!')

      setUsuarioId('')
      setTitulo('')
      setMensagem('')
    } catch {
      setErro('Não foi possível conectar com o servidor.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <section>
      <h2 className="text-2xl font-black uppercase border-l-4 border-red-600 pl-3 mb-5">
        Enviar Notificação
      </h2>

      <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6">
        {erro && (
          <div className="mb-4 border border-red-600 bg-red-600/10 text-red-500 rounded-lg px-4 py-3 text-sm">
            {erro}
          </div>
        )}

        {sucesso && (
          <div className="mb-4 border border-green-500 bg-green-500/10 text-green-500 rounded-lg px-4 py-3 text-sm">
            {sucesso}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">
            Aluno
          </label>

          <select
            value={usuarioId}
            onChange={(event) => setUsuarioId(event.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 outline-none focus:border-red-600"
          >
            <option value="">Selecione um aluno...</option>

            {alunos.map((aluno) => (
              <option key={aluno.id} value={aluno.id}>
                {aluno.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">
            Título
          </label>

          <input
            value={titulo}
            onChange={(event) => setTitulo(event.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 outline-none focus:border-red-600"
            placeholder="Ex: Seu treino foi atualizado!"
          />
        </div>

        <div className="mb-6">
          <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">
            Mensagem
          </label>

          <textarea
            value={mensagem}
            onChange={(event) => setMensagem(event.target.value)}
            className="w-full min-h-32 bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 outline-none focus:border-red-600 resize-y"
            placeholder="Ex: Olá! Seu novo treino de peito e tríceps já está disponível."
          />
        </div>

        <button
          type="button"
          onClick={enviarNotificacao}
          disabled={carregando}
          className="bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white rounded-lg px-5 py-3 font-bold tracking-widest transition"
        >
          {carregando ? 'ENVIANDO...' : 'ENVIAR NOTIFICAÇÃO'}
        </button>
      </div>
    </section>
  )
}