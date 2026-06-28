'use client'

import { useEffect, useState } from 'react'
import { API_URL, getAuthHeaders } from '../../services/api'

type Aluno = {
  id: number
  nome: string
  email: string
}

type Avaliacao = {
  id: number
  aluno_nome?: string
  peso?: number
  gordura_pct?: number
  massa_muscular?: number
  observacoes?: string
  data_avaliacao: string
}

export default function AvaliacoesTab() {
  const [alunos, setAlunos] = useState<Aluno[]>([])
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([])

  const [usuarioId, setUsuarioId] = useState('')
  const [peso, setPeso] = useState('')
  const [gorduraPct, setGorduraPct] = useState('')
  const [massaMuscular, setMassaMuscular] = useState('')
  const [dataAvaliacao, setDataAvaliacao] = useState(
    new Date().toISOString().slice(0, 10)
  )
  const [observacoes, setObservacoes] = useState('')

  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [carregando, setCarregando] = useState(false)

  useEffect(() => {
    carregarAlunos()
    carregarAvaliacoes()
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

  async function carregarAvaliacoes() {
    try {
      const resposta = await fetch(`${API_URL}/avaliacoes`, {
        headers: getAuthHeaders()
      })

      const dados = await resposta.json()

      if (!resposta.ok) {
        setErro(dados.erro || 'Erro ao carregar avaliações.')
        return
      }

      setAvaliacoes(dados)
    } catch {
      setErro('Não foi possível carregar as avaliações.')
    }
  }

  async function criarAvaliacao() {
    setErro('')
    setSucesso('')

    if (!usuarioId) {
      setErro('Selecione um aluno.')
      return
    }

    if (!peso) {
      setErro('Informe o peso do aluno.')
      return
    }

    if (!dataAvaliacao) {
      setErro('Informe a data da avaliação.')
      return
    }

    setCarregando(true)

    try {
      const resposta = await fetch(`${API_URL}/avaliacoes`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          usuario_id: Number(usuarioId),
          peso: Number(peso),
          gordura_pct: gorduraPct ? Number(gorduraPct) : null,
          massa_muscular: massaMuscular ? Number(massaMuscular) : null,
          observacoes,
          data_avaliacao: dataAvaliacao
        })
      })

      const dados = await resposta.json()

      if (!resposta.ok) {
        setErro(dados.erro || 'Erro ao registrar avaliação.')
        return
      }

      setSucesso('Avaliação registrada com sucesso!')

      setUsuarioId('')
      setPeso('')
      setGorduraPct('')
      setMassaMuscular('')
      setDataAvaliacao(new Date().toISOString().slice(0, 10))
      setObservacoes('')

      carregarAvaliacoes()
    } catch {
      setErro('Não foi possível conectar com o servidor.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <section>
      <h2 className="text-2xl font-black uppercase border-l-4 border-red-600 pl-3 mb-5">
        Registrar Avaliação Física
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
              Peso em kg
            </label>

            <input
              type="number"
              value={peso}
              onChange={(event) => setPeso(event.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 outline-none focus:border-red-600"
              placeholder="Ex: 82.5"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">
              % Gordura
            </label>

            <input
              type="number"
              value={gorduraPct}
              onChange={(event) => setGorduraPct(event.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 outline-none focus:border-red-600"
              placeholder="Ex: 14"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">
              Massa Muscular em kg
            </label>

            <input
              type="number"
              value={massaMuscular}
              onChange={(event) => setMassaMuscular(event.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 outline-none focus:border-red-600"
              placeholder="Ex: 45"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">
              Data da Avaliação
            </label>

            <input
              type="date"
              value={dataAvaliacao}
              onChange={(event) => setDataAvaliacao(event.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 outline-none focus:border-red-600"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">
            Observações
          </label>

          <textarea
            value={observacoes}
            onChange={(event) => setObservacoes(event.target.value)}
            className="w-full min-h-28 bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 outline-none focus:border-red-600 resize-y"
            placeholder="Ex: Aluno apresentou boa evolução..."
          />
        </div>

        <button
          type="button"
          onClick={criarAvaliacao}
          disabled={carregando}
          className="bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white rounded-lg px-5 py-3 font-bold tracking-widest transition"
        >
          {carregando ? 'REGISTRANDO...' : 'REGISTRAR AVALIAÇÃO'}
        </button>
      </div>

      <h2 className="text-2xl font-black uppercase border-l-4 border-red-600 pl-3 mb-5">
        Histórico de Avaliações
      </h2>

      <div className="space-y-4">
        {avaliacoes.length === 0 ? (
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6">
            <p className="text-zinc-500">Nenhuma avaliação registrada.</p>
          </div>
        ) : (
          avaliacoes.map((avaliacao) => (
            <div
              key={avaliacao.id}
              className="bg-zinc-950 border border-zinc-800 rounded-xl p-5"
            >
              <div className="flex justify-between gap-4 mb-3">
                <strong>{avaliacao.aluno_nome || 'Aluno'}</strong>

                <span className="text-sm text-zinc-500">
                  {new Date(avaliacao.data_avaliacao).toLocaleDateString('pt-BR')}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                <span>
                  ⚖️ Peso:{' '}
                  <strong>{avaliacao.peso || '-'} kg</strong>
                </span>

                <span>
                  🔥 Gordura:{' '}
                  <strong>{avaliacao.gordura_pct || '-'}%</strong>
                </span>

                <span>
                  💪 Massa:{' '}
                  <strong>{avaliacao.massa_muscular || '-'} kg</strong>
                </span>
              </div>

              {avaliacao.observacoes && (
                <p className="text-zinc-500 text-sm mt-3">
                  {avaliacao.observacoes}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </section>
  )
}