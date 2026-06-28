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
}

type Dieta = {
  id: number
  nome: string
  horario?: string
  calorias?: number
  descricao?: string
}

export default function DietasPage() {
  const router = useRouter()

  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [dietas, setDietas] = useState<Dieta[]>([])
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
    carregarDietas()
  }, [router])

  async function carregarDietas() {
    try {
      const resposta = await fetch(`${API_URL}/dietas`, {
        headers: getAuthHeaders()
      })

      const dados = await resposta.json()

      if (!resposta.ok) {
        setErro(dados.erro || 'Erro ao carregar dietas.')
        return
      }

      setDietas(Array.isArray(dados) ? dados : [])
    } catch {
      setErro('Não foi possível conectar com o servidor.')
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
            className="text-white font-bold"
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
            Minha Dieta
          </h1>

          <p className="text-zinc-500 mt-1">
            Veja as refeições cadastradas para você, {usuario?.nome || 'aluno'}.
          </p>
        </div>

        {erro && (
          <div className="mb-6 border border-red-600 bg-red-600/10 text-red-500 rounded-xl p-4">
            {erro}
          </div>
        )}

        {carregando ? (
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6">
            <p className="text-zinc-500">Carregando dieta...</p>
          </div>
        ) : dietas.length === 0 ? (
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6">
            <p className="text-zinc-500">
              Nenhuma refeição cadastrada para este aluno.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {dietas.map((dieta) => (
              <div
                key={dieta.id}
                className="bg-zinc-950 border border-zinc-800 rounded-xl p-6"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-2xl font-black text-red-600">
                      {dieta.nome}
                    </h2>

                    <p className="text-zinc-500 text-sm mt-1">
                      Horário: {dieta.horario || 'Não informado'}
                    </p>
                  </div>

                  <span className="bg-red-600/10 border border-red-600 text-red-500 text-xs font-bold uppercase px-3 py-1 rounded">
                    {dieta.calorias || 0} kcal
                  </span>
                </div>

                <p className="text-zinc-400">
                  {dieta.descricao || 'Sem descrição cadastrada.'}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}