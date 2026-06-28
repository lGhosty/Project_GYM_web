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

type Agendamento = {
  id: number
  titulo: string
  tipo: string
  descricao?: string
  data_hora: string
  status?: string
}

export default function AgendaPage() {
  const router = useRouter()

  const [usuario] = useState<Usuario | null>(() => getUsuario() as Usuario | null)
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([])
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(true)

  const carregarAgendamentos = useCallback(async () => {
    try {
      const resposta = await fetch(`${API_URL}/agendamentos`, {
        headers: getAuthHeaders()
      })

      const dados = await resposta.json()

      if (!resposta.ok) {
        setErro(dados.erro || 'Erro ao carregar agenda.')
        return
      }

      setAgendamentos(Array.isArray(dados) ? dados : [])
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

    carregarAgendamentos()
  }, [router, usuario, carregarAgendamentos])

  function statusClasse(status?: string) {
    if (status === 'confirmado') {
      return 'border-green-500 text-green-500 bg-green-500/10'
    }

    if (status === 'cancelado') {
      return 'border-red-600 text-red-500 bg-red-600/10'
    }

    return 'border-yellow-400 text-yellow-400 bg-yellow-400/10'
  }

  function statusTexto(status?: string) {
    if (status === 'pendente') {
      return 'Agendado'
    }

    return status || 'Agendado'
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <AlunoNavbar />

      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-black">
            Minha Agenda
          </h1>

          <p className="text-zinc-500 mt-1">
            Veja seus compromissos, {usuario?.nome || 'aluno'}.
          </p>
        </div>

        {erro && (
          <div className="mb-6 border border-red-600 bg-red-600/10 text-red-500 rounded-xl p-4">
            {erro}
          </div>
        )}

        {carregando ? (
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6">
            <p className="text-zinc-500">Carregando agenda...</p>
          </div>
        ) : agendamentos.length === 0 ? (
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6">
            <p className="text-zinc-500">
              Nenhum agendamento cadastrado para este aluno.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {agendamentos.map((agendamento) => {
              const data = new Date(agendamento.data_hora)
              const status = agendamento.status || 'pendente'

              return (
                <div
                  key={agendamento.id}
                  className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 flex flex-col md:flex-row md:items-center gap-5"
                >
                  <div className="bg-red-600 text-white rounded-lg px-5 py-4 text-center min-w-20">
                    <div className="text-3xl font-black">
                      {data.getDate()}
                    </div>

                    <div className="text-xs uppercase tracking-widest">
                      {data.toLocaleString('pt-BR', { month: 'short' })}
                    </div>
                  </div>

                  <div className="flex-1">
                    <h2 className="text-xl font-black text-red-600">
                      {agendamento.titulo}
                    </h2>

                    <p className="text-zinc-500 text-sm mt-1">
                      {data.toLocaleDateString('pt-BR')} às{' '}
                      {data.toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}{' '}
                      · {agendamento.tipo}
                    </p>

                    {agendamento.descricao && (
                      <p className="text-zinc-400 mt-3">
                        {agendamento.descricao}
                      </p>
                    )}
                  </div>

                  <span
                    className={`text-xs font-bold uppercase border rounded px-3 py-1 ${statusClasse(status)}`}
                  >
                    {statusTexto(status)}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </section>
    </main>
  )
}