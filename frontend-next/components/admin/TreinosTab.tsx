'use client'

import { useEffect, useState } from 'react'
import { API_URL, getAuthHeaders } from '../../services/api'

type Aluno = {
  id: number
  nome: string
  email: string
}

type Exercicio = {
  nome: string
  series: number
  repeticoes: number
  descanso_s: number
  grupo: string
}

export default function TreinosTab() {
  const [alunos, setAlunos] = useState<Aluno[]>([])
  const [usuarioId, setUsuarioId] = useState('')
  const [nome, setNome] = useState('')
  const [diaSemana, setDiaSemana] = useState('Segunda')
  const [duracaoMin, setDuracaoMin] = useState(40)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [carregando, setCarregando] = useState(false)

  const [exercicios, setExercicios] = useState<Exercicio[]>([
    {
      nome: '',
      series: 4,
      repeticoes: 10,
      descanso_s: 90,
      grupo: ''
    }
  ])

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

  function atualizarExercicio(
    index: number,
    campo: keyof Exercicio,
    valor: string | number
  ) {
    const copia = [...exercicios]

    copia[index] = {
      ...copia[index],
      [campo]: valor
    }

    setExercicios(copia)
  }

  function adicionarExercicio() {
    setExercicios([
      ...exercicios,
      {
        nome: '',
        series: 3,
        repeticoes: 10,
        descanso_s: 60,
        grupo: ''
      }
    ])
  }

  function removerExercicio(index: number) {
    if (exercicios.length === 1) {
      return
    }

    setExercicios(exercicios.filter((_, i) => i !== index))
  }

  async function criarTreino() {
    setErro('')
    setSucesso('')

    if (!usuarioId) {
      setErro('Selecione um aluno.')
      return
    }

    if (!nome.trim()) {
      setErro('Informe o nome do treino.')
      return
    }

    const exerciciosValidos = exercicios.filter((exercicio) =>
      exercicio.nome.trim()
    )

    if (exerciciosValidos.length === 0) {
      setErro('Adicione pelo menos um exercício.')
      return
    }

    setCarregando(true)

    try {
      const resposta = await fetch(`${API_URL}/treinos`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          usuario_id: Number(usuarioId),
          nome,
          dia_semana: diaSemana,
          duracao_min: duracaoMin,
          exercicios: exerciciosValidos
        })
      })

      const dados = await resposta.json()

      if (!resposta.ok) {
        setErro(dados.erro || 'Erro ao criar treino.')
        return
      }

      setSucesso(`Treino "${dados.nome || nome}" criado com sucesso!`)

      setNome('')
      setDuracaoMin(40)
      setExercicios([
        {
          nome: '',
          series: 4,
          repeticoes: 10,
          descanso_s: 90,
          grupo: ''
        }
      ])
    } catch {
      setErro('Não foi possível conectar com o servidor.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <section>
      <h2 className="text-2xl font-black uppercase border-l-4 border-red-600 pl-3 mb-5">
        Criar Treino para Aluno
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
              Nome do Treino
            </label>

            <input
              value={nome}
              onChange={(event) => setNome(event.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 outline-none focus:border-red-600"
              placeholder="Ex: Peito e Tríceps"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">
              Dia da Semana
            </label>

            <select
              value={diaSemana}
              onChange={(event) => setDiaSemana(event.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 outline-none focus:border-red-600"
            >
              <option>Segunda</option>
              <option>Terça</option>
              <option>Quarta</option>
              <option>Quinta</option>
              <option>Sexta</option>
              <option>Sábado</option>
              <option>Domingo</option>
            </select>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">
            Duração em minutos
          </label>

          <input
            type="number"
            value={duracaoMin}
            onChange={(event) => setDuracaoMin(Number(event.target.value))}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 outline-none focus:border-red-600"
            placeholder="40"
          />
        </div>

        <h3 className="text-lg font-black mb-4">
          Exercícios
        </h3>

        <div className="space-y-4">
          {exercicios.map((exercicio, index) => (
            <div
              key={index}
              className="border border-zinc-800 rounded-xl p-4 bg-black/40"
            >
              <div className="flex justify-between items-center mb-4">
                <strong>Exercício {index + 1}</strong>

                <button
                  type="button"
                  onClick={() => removerExercicio(index)}
                  className="text-sm text-red-500 hover:text-red-400"
                >
                  Remover
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  value={exercicio.nome}
                  onChange={(event) =>
                    atualizarExercicio(index, 'nome', event.target.value)
                  }
                  className="bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 outline-none focus:border-red-600"
                  placeholder="Nome do exercício"
                />

                <input
                  value={exercicio.grupo}
                  onChange={(event) =>
                    atualizarExercicio(index, 'grupo', event.target.value)
                  }
                  className="bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 outline-none focus:border-red-600"
                  placeholder="Grupo muscular"
                />

                <input
                  type="number"
                  value={exercicio.series}
                  onChange={(event) =>
                    atualizarExercicio(index, 'series', Number(event.target.value))
                  }
                  className="bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 outline-none focus:border-red-600"
                  placeholder="Séries"
                />

                <input
                  type="number"
                  value={exercicio.repeticoes}
                  onChange={(event) =>
                    atualizarExercicio(index, 'repeticoes', Number(event.target.value))
                  }
                  className="bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 outline-none focus:border-red-600"
                  placeholder="Repetições"
                />

                <input
                  type="number"
                  value={exercicio.descanso_s}
                  onChange={(event) =>
                    atualizarExercicio(index, 'descanso_s', Number(event.target.value))
                  }
                  className="bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 outline-none focus:border-red-600 md:col-span-2"
                  placeholder="Descanso em segundos"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 mt-6">
          <button
            type="button"
            onClick={adicionarExercicio}
            className="border border-zinc-700 text-zinc-300 hover:border-red-600 hover:text-white rounded-lg px-5 py-3 transition"
          >
            + Adicionar exercício
          </button>

          <button
            type="button"
            onClick={criarTreino}
            disabled={carregando}
            className="bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white rounded-lg px-5 py-3 font-bold tracking-widest transition"
          >
            {carregando ? 'CRIANDO...' : 'CRIAR TREINO'}
          </button>
        </div>
      </div>
    </section>
  )
}