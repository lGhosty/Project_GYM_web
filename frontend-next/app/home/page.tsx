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
  objetivo?: string
}

type Resumo = {
  treinos: number
  dietas: number
  agendamentos: number
  notificacoes: number
}

export default function HomePage() {
  const router = useRouter()

  const [usuario] = useState<Usuario | null>(() => getUsuario() as Usuario | null)

  const [resumo, setResumo] = useState<Resumo>({
    treinos: 0,
    dietas: 0,
    agendamentos: 0,
    notificacoes: 0
  })

  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(true)

  const buscarLista = useCallback(async (endpoint: string) => {
    try {
      const resposta = await fetch(`${API_URL}${endpoint}`, {
        headers: getAuthHeaders()
      })

      const dados = await resposta.json()

      if (!resposta.ok) {
        return []
      }

      if (Array.isArray(dados)) {
        return dados
      }

      if (Array.isArray(dados.refeicoes)) {
        return dados.refeicoes
      }

      if (Array.isArray(dados.treinos)) {
        return dados.treinos
      }

      if (Array.isArray(dados.agendamentos)) {
        return dados.agendamentos
      }

      if (Array.isArray(dados.notificacoes)) {
        return dados.notificacoes
      }

      return []
    } catch {
      return []
    }
  }, [])

  const carregarResumo = useCallback(async () => {
    setErro('')

    try {
      const [treinos, dietas, agendamentos, notificacoes] = await Promise.all([
        buscarLista('/treinos'),
        buscarLista('/dietas'),
        buscarLista('/agendamentos'),
        buscarLista('/notificacoes')
      ])

      setResumo({
        treinos: treinos.length,
        dietas: dietas.length,
        agendamentos: agendamentos.length,
        notificacoes: notificacoes.length
      })
    } catch {
      setErro('Não foi possível carregar os dados do aluno.')
    } finally {
      setCarregando(false)
    }
  }, [buscarLista])

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (!token || !usuario) {
      router.push('/login')
      return
    }

    carregarResumo()
  }, [router, usuario, carregarResumo])

  return (
    <main className="min-h-screen bg-black text-white">
      <AlunoNavbar />

      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-black">
            Olá, {usuario?.nome || 'Aluno'}!
          </h1>

          <p className="text-zinc-500 mt-1">
            Acompanhe seus treinos, dietas, agenda e notificações.
          </p>
        </div>

        {erro && (
          <div className="mb-6 border border-red-600 bg-red-600/10 text-red-500 rounded-xl p-4">
            {erro}
          </div>
        )}

        {carregando ? (
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6">
            <p className="text-zinc-500">Carregando dados...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 text-center">
                <p className="text-4xl font-black text-red-600">
                  {resumo.treinos}
                </p>
                <p className="text-xs uppercase tracking-widest text-zinc-500 mt-2">
                  Treinos
                </p>
              </div>

              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 text-center">
                <p className="text-4xl font-black text-red-600">
                  {resumo.dietas}
                </p>
                <p className="text-xs uppercase tracking-widest text-zinc-500 mt-2">
                  Refeições
                </p>
              </div>

              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 text-center">
                <p className="text-4xl font-black text-red-600">
                  {resumo.agendamentos}
                </p>
                <p className="text-xs uppercase tracking-widest text-zinc-500 mt-2">
                  Agenda
                </p>
              </div>

              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 text-center">
                <p className="text-4xl font-black text-red-600">
                  {resumo.notificacoes}
                </p>
                <p className="text-xs uppercase tracking-widest text-zinc-500 mt-2">
                  Notificações
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => router.push('/treinos')}
                className="bg-zinc-950 border border-zinc-800 hover:border-red-600 rounded-xl p-6 text-left transition"
              >
                <h2 className="text-xl font-black mb-2">
                  🏋️ Meus Treinos
                </h2>
                <p className="text-zinc-500">
                  Visualize os treinos cadastrados pelo professor.
                </p>
              </button>

              <button
                onClick={() => router.push('/dietas')}
                className="bg-zinc-950 border border-zinc-800 hover:border-red-600 rounded-xl p-6 text-left transition"
              >
                <h2 className="text-xl font-black mb-2">
                  🥗 Minha Dieta
                </h2>
                <p className="text-zinc-500">
                  Veja suas refeições e orientações nutricionais.
                </p>
              </button>

              <button
                onClick={() => router.push('/agenda')}
                className="bg-zinc-950 border border-zinc-800 hover:border-red-600 rounded-xl p-6 text-left transition"
              >
                <h2 className="text-xl font-black mb-2">
                  📅 Minha Agenda
                </h2>
                <p className="text-zinc-500">
                  Acompanhe avaliações, treinos e compromissos.
                </p>
              </button>

              <button
                onClick={() => router.push('/notificacoes')}
                className="bg-zinc-950 border border-zinc-800 hover:border-red-600 rounded-xl p-6 text-left transition"
              >
                <h2 className="text-xl font-black mb-2">
                  🔔 Notificações
                </h2>
                <p className="text-zinc-500">
                  Veja avisos enviados pelo professor.
                </p>
              </button>
            </div>
          </>
        )}
      </section>
    </main>
  )
}