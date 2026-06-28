'use client'

/* eslint-disable react-hooks/set-state-in-effect */

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { API_URL, getAuthHeaders, getUsuario } from '../../services/api'
import AlunoNavbar from '../../components/aluno/AlunoNavbar'

type Usuario = {
  id?: number
  nome?: string
  email?: string
  role?: string
  tipo?: string
}

type Exercicio = {
  id?: number
  nome?: string
  series?: number
  repeticoes?: number
  descanso_s?: number
  grupo?: string
}

type Treino = {
  id: number
  nome: string
  dia_semana?: string
  duracao_min?: number
  exercicios?: Exercicio[] | string
}

export default function TreinosPage() {
  const router = useRouter()

  const [usuario] = useState<Usuario | null>(() => getUsuario() as Usuario | null)
  const [treinos, setTreinos] = useState<Treino[]>([])
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(true)

  const carregarTreinos = useCallback(async () => {
    try {
      const resposta = await fetch(`${API_URL}/treinos`, {
        headers: getAuthHeaders()
      })

      const dados = await resposta.json()

      if (!resposta.ok) {
        setErro(dados.erro || 'Erro ao carregar treinos.')
        return
      }

      setTreinos(Array.isArray(dados) ? dados : [])
    } catch {
      setErro('Não foi possível conectar com o servidor.')
    } finally {
      setCarregando(false)
    }
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (!token || !usuario) {
      router.push('/login')
      return
    }

    carregarTreinos()
  }, [router, usuario, carregarTreinos])

  function formatarExercicios(exercicios?: Exercicio[] | string): Exercicio[] {
    if (!exercicios) {
      return []
    }

    if (Array.isArray(exercicios)) {
      return exercicios
    }

    try {
      const convertido = JSON.parse(exercicios)
      return Array.isArray(convertido) ? convertido : []
    } catch {
      return []
    }
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <AlunoNavbar />

      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-black">
            Meus Treinos
          </h1>

          <p className="text-zinc-500 mt-1">
            Veja os treinos cadastrados para você, {usuario?.nome || 'aluno'}.
          </p>
        </div>

        {erro && (
          <div className="mb-6 border border-red-600 bg-red-600/10 text-red-500 rounded-xl p-4">
            {erro}
          </div>
        )}

        {carregando ? (
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6">
            <p className="text-zinc-500">Carregando treinos...</p>
          </div>
        ) : treinos.length === 0 ? (
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6">
            <p className="text-zinc-500">
              Nenhum treino cadastrado para este aluno.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5">
            {treinos.map((treino) => {
              const exercicios = formatarExercicios(treino.exercicios)

              return (
                <div
                  key={treino.id}
                  className="bg-zinc-950 border border-zinc-800 rounded-xl p-6"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
                    <div>
                      <h2 className="text-2xl font-black text-red-600">
                        {treino.nome}
                      </h2>

                      <p className="text-zinc-500 text-sm mt-1">
                        {treino.dia_semana || 'Dia não informado'} ·{' '}
                        {treino.duracao_min || '-'} min
                      </p>
                    </div>

                    <span className="bg-red-600/10 border border-red-600 text-red-500 text-xs font-bold uppercase px-3 py-1 rounded">
                      Treino
                    </span>
                  </div>

                  {exercicios.length === 0 ? (
                    <p className="text-zinc-500">
                      Nenhum exercício cadastrado neste treino.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {exercicios.map((exercicio, index) => (
                        <div
                          key={index}
                          className="bg-black/40 border border-zinc-800 rounded-lg p-4"
                        >
                          <h3 className="font-bold mb-2">
                            {exercicio.nome || `Exercício ${index + 1}`}
                          </h3>

                          <div className="text-sm text-zinc-500 space-y-1">
                            <p>
                              Grupo:{' '}
                              <strong className="text-zinc-300">
                                {exercicio.grupo || '-'}
                              </strong>
                            </p>

                            <p>
                              Séries:{' '}
                              <strong className="text-zinc-300">
                                {exercicio.series || '-'}
                              </strong>
                            </p>

                            <p>
                              Repetições:{' '}
                              <strong className="text-zinc-300">
                                {exercicio.repeticoes || '-'}
                              </strong>
                            </p>

                            <p>
                              Descanso:{' '}
                              <strong className="text-zinc-300">
                                {exercicio.descanso_s || '-'}s
                              </strong>
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </section>
    </main>
  )
}