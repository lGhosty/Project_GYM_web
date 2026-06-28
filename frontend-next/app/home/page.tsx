'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { API_URL, getAuthHeaders, getUsuario } from '../../services/api'

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

  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [resumo, setResumo] = useState<Resumo>({
    treinos: 0,
    dietas: 0,
    agendamentos: 0,
    notificacoes: 0
  })

  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const usuarioSalvo = getUsuario()

    if (!token || !usuarioSalvo) {
      router.push('/login')
      return
    }

    setUsuario(usuarioSalvo)
    carregarResumo()
  }, [router])

  async function buscarLista(endpoint: string) {
    try {
      const resposta = await fetch(`${API_URL}${endpoint}`, {
        headers: getAuthHeaders()
      })

      const dados = await resposta.json()

      if (!resposta.ok) {
        return []
      }

      return Array.isArray(dados) ? dados : []
    } catch {
      return []
    }
  }

  async function carregarResumo() {
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
  }

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    router.push('/login')
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <nav className="border-b-2 border-red-600 bg-zinc-950 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="text-red-600 font-black text-2xl tracking-widest">
            FREAKYZONE
          </span>

          <span className="bg-zinc-800 text-zinc-300 text-xs font-bold px-3 py-1 rounded">
            ALUNO
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/home')}
            className="text-zinc-400 hover:text-white transition"
          >
            Home
          </button>

          <button
            onClick={() => router.push('/treinos')}
            className="text-zinc-400 hover:text-white transition"
          >
            Treinos
          </button>

          <button
            onClick={() => router.push('/dietas')}
            className="text-zinc-400 hover:text-white transition"
          >
            Dietas
          </button>

          <button
            onClick={() => router.push('/agenda')}
            className="text-zinc-400 hover:text-white transition"
          >
            Agenda
          </button>

          <button
            onClick={logout}
            className="border border-red-600 text-red-600 hover:bg-red-600 hover:text-white px-4 py-2 rounded-lg transition"
          >
            Sair
          </button>
        </div>
      </nav>

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