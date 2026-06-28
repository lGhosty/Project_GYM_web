'use client'

import { useEffect, useState } from 'react'
import { API_URL, getAuthHeaders } from '../../services/api'

type Aluno = {
  id: number
  nome: string
  email: string
}

export default function DietasTab() {
  const [alunos, setAlunos] = useState<Aluno[]>([])
  const [usuarioId, setUsuarioId] = useState('')
  const [nome, setNome] = useState('')
  const [horario, setHorario] = useState('')
  const [calorias, setCalorias] = useState(0)
  const [descricao, setDescricao] = useState('')
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

  async function criarDieta() {
    setErro('')
    setSucesso('')

    if (!usuarioId) {
      setErro('Selecione um aluno.')
      return
    }

    if (!nome.trim()) {
      setErro('Informe o nome da refeição.')
      return
    }

    if (!horario.trim()) {
      setErro('Informe o horário da refeição.')
      return
    }

    setCarregando(true)

    try {
      const resposta = await fetch(`${API_URL}/dietas`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          usuario_id: Number(usuarioId),
          nome,
          horario,
          calorias,
          descricao
        })
      })

      const dados = await resposta.json()

      if (!resposta.ok) {
        setErro(dados.erro || 'Erro ao criar dieta.')
        return
      }

      setSucesso(`Refeição "${dados.nome || nome}" adicionada com sucesso!`)

      setNome('')
      setHorario('')
      setCalorias(0)
      setDescricao('')
    } catch {
      setErro('Não foi possível conectar com o servidor.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <section>
      <h2 className="text-2xl font-black uppercase border-l-4 border-red-600 pl-3 mb-5">
        Adicionar Refeição para Aluno
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">
              Nome da Refeição
            </label>

            <input
              value={nome}
              onChange={(event) => setNome(event.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 outline-none focus:border-red-600"
              placeholder="Ex: Café da Manhã"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">
              Horário
            </label>

            <input
              value={horario}
              onChange={(event) => setHorario(event.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 outline-none focus:border-red-600"
              placeholder="Ex: 07:00"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">
            Calorias
          </label>

          <input
            type="number"
            value={calorias}
            onChange={(event) => setCalorias(Number(event.target.value))}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 outline-none focus:border-red-600"
            placeholder="Ex: 620"
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
            placeholder="Ex: Ovos, aveia, banana e café sem açúcar"
          />
        </div>

        <button
          type="button"
          onClick={criarDieta}
          disabled={carregando}
          className="bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white rounded-lg px-5 py-3 font-bold tracking-widest transition"
        >
          {carregando ? 'ADICIONANDO...' : 'ADICIONAR REFEIÇÃO'}
        </button>
      </div>
    </section>
  )
}