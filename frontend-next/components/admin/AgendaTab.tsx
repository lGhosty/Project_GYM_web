'use client'

import { useEffect, useState } from 'react'
import { API_URL, getAuthHeaders } from '../../services/api'

type Aluno = {
  id: number
  nome: string
  email: string
}

type Agendamento = {
  id: number
  aluno_nome?: string
  titulo: string
  tipo: string
  descricao?: string
  data_hora: string
  status?: string
}

export default function AgendaTab() {
  const [alunos, setAlunos] = useState<Aluno[]>([])
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([])

  const [usuarioId, setUsuarioId] = useState('')
  const [titulo, setTitulo] = useState('')
  const [tipo, setTipo] = useState('treino')
  const [dataHora, setDataHora] = useState('')
  const [descricao, setDescricao] = useState('')

  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [carregando, setCarregando] = useState(false)

  useEffect(() => {
    carregarAlunos()
    carregarAgendamentos()
  }, [])

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

  async function carregarAgendamentos() {
    try {
      const resposta = await fetch(`${API_URL}/agendamentos`, {
        headers: getAuthHeaders()
      })

      const dados = await resposta.json()

      if (!resposta.ok) {
        setErro(dados.erro || 'Erro ao carregar agendamentos.')
        return
      }

      setAgendamentos(dados)
    } catch {
      setErro('Não foi possível carregar os agendamentos.')
    }
  }

  async function criarAgendamento() {
    setErro('')
    setSucesso('')

    if (!usuarioId) {
      setErro('Selecione um aluno.')
      return
    }

    if (!titulo.trim()) {
      setErro('Informe o título do agendamento.')
      return
    }

    if (!dataHora) {
      setErro('Informe a data e hora.')
      return
    }

    setCarregando(true)

    try {
      const resposta = await fetch(`${API_URL}/agendamentos`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          usuario_id: Number(usuarioId),
          titulo,
          tipo,
          data_hora: dataHora,
          descricao
        })
      })

      const dados = await resposta.json()

      if (!resposta.ok) {
        setErro(dados.erro || 'Erro ao criar agendamento.')
        return
      }

      setSucesso(`Evento "${dados.titulo || titulo}" agendado com sucesso!`)

      setUsuarioId('')
      setTitulo('')
      setTipo('treino')
      setDataHora('')
      setDescricao('')

      carregarAgendamentos()
    } catch {
      setErro('Não foi possível conectar com o servidor.')
    } finally {
      setCarregando(false)
    }
  }

  function statusClasse(status?: string) {
    if (status === 'confirmado') {
      return 'border-green-500 text-green-500 bg-green-500/10'
    }

    if (status === 'cancelado') {
      return 'border-red-600 text-red-500 bg-red-600/10'
    }

    return 'border-yellow-400 text-yellow-400 bg-yellow-400/10'
  }

  return (
    <section>
      <h2 className="text-2xl font-black uppercase border-l-4 border-red-600 pl-3 mb-5">
        Agendar Evento
      </h2>

      <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 mb-8">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">
              Título
            </label>

            <input
              value={titulo}
              onChange={(event) => setTitulo(event.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 outline-none focus:border-red-600"
              placeholder="Ex: Avaliação Física"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">
              Tipo
            </label>

            <select
              value={tipo}
              onChange={(event) => setTipo(event.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 outline-none focus:border-red-600"
            >
              <option value="treino">Treino</option>
              <option value="avaliacao">Avaliação</option>
              <option value="consulta">Consulta</option>
              <option value="outro">Outro</option>
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">
            Data e Hora
          </label>

          <input
            type="datetime-local"
            value={dataHora}
            onChange={(event) => setDataHora(event.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 outline-none focus:border-red-600"
          />
        </div>

        <div className="mb-6">
          <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">
            Descrição
          </label>

          <textarea
            value={descricao}
            onChange={(event) => setDescricao(event.target.value)}
            className="w-full min-h-28 bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 outline-none focus:border-red-600 resize-y"
            placeholder="Ex: Reavaliação mensal do aluno"
          />
        </div>

        <button
          type="button"
          onClick={criarAgendamento}
          disabled={carregando}
          className="bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white rounded-lg px-5 py-3 font-bold tracking-widest transition"
        >
          {carregando ? 'AGENDANDO...' : 'AGENDAR'}
        </button>
      </div>

      <h2 className="text-2xl font-black uppercase border-l-4 border-red-600 pl-3 mb-5">
        Todos os Agendamentos
      </h2>

      <div className="space-y-4">
        {agendamentos.length === 0 ? (
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6">
            <p className="text-zinc-500">Nenhum agendamento registrado.</p>
          </div>
        ) : (
          agendamentos.map((agendamento) => {
            const data = new Date(agendamento.data_hora)
            const status = agendamento.status || 'pendente'

            return (
              <div
                key={agendamento.id}
                className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center gap-4"
              >
                <div className="bg-red-600 text-white rounded-lg px-4 py-3 text-center min-w-16">
                  <div className="text-2xl font-black">
                    {data.getDate()}
                  </div>
                  <div className="text-xs uppercase">
                    {data.toLocaleString('pt-BR', { month: 'short' })}
                  </div>
                </div>

                <div className="flex-1">
                  <strong>
                    {agendamento.aluno_nome || 'Aluno'} — {agendamento.titulo}
                  </strong>

                  <p className="text-sm text-zinc-500 mt-1">
                    {data.toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}{' '}
                    · {agendamento.tipo}
                  </p>

                  {agendamento.descricao && (
                    <p className="text-sm text-zinc-500 mt-2">
                      {agendamento.descricao}
                    </p>
                  )}
                </div>

                <span
                  className={`text-xs font-bold uppercase border rounded px-3 py-1 ${statusClasse(status)}`}
                >
                  {status}
                </span>
              </div>
            )
          })
        )}
      </div>
    </section>
  )
}