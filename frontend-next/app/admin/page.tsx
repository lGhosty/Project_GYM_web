'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getUsuario } from '../../services/api'
import AlunosTab from '../../components/admin/AlunosTab'
import TreinosTab from '../../components/admin/TreinosTab'

type Usuario = {
  id?: number
  nome?: string
  email?: string
  role?: string
  tipo?: string
}

type Aba = 'alunos' | 'treinos' | 'dietas' | 'avaliacoes' | 'agenda' | 'notificacoes'

export default function AdminPage() {
  const router = useRouter()

  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [abaAtiva, setAbaAtiva] = useState<Aba>('alunos')

  useEffect(() => {
    const token = localStorage.getItem('token')
    const usuarioSalvo = getUsuario()

    if (!token || !usuarioSalvo) {
      router.push('/login')
      return
    }

    const perfil = usuarioSalvo.role || usuarioSalvo.tipo

    if (perfil !== 'admin' && perfil !== 'professor') {
      router.push('/login')
      return
    }

    setUsuario(usuarioSalvo)
  }, [router])

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    router.push('/login')
  }

  const abas = [
    { id: 'alunos', label: '👥 Alunos' },
    { id: 'treinos', label: '🏋️ Treinos' },
    { id: 'dietas', label: '🥗 Dietas' },
    { id: 'avaliacoes', label: '📊 Avaliações' },
    { id: 'agenda', label: '📅 Agenda' },
    { id: 'notificacoes', label: '🔔 Notificações' }
  ] as const

  return (
    <main className="min-h-screen bg-black text-white">
      <nav className="border-b-2 border-red-600 bg-zinc-950 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="text-red-600 font-black text-2xl tracking-widest">
            FREAKYZONE
          </span>

          <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded">
            ADMIN
          </span>
        </div>

        <div className="flex items-center gap-4">
          {usuario && (
            <span className="text-sm text-zinc-500">
              {usuario.nome}
            </span>
          )}

          <button
            onClick={logout}
            className="border border-red-600 text-red-600 hover:bg-red-600 hover:text-white px-4 py-2 rounded-lg transition"
          >
            Sair
          </button>
        </div>
      </nav>

      <section className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-black">
            Painel Administrativo
          </h1>

          <p className="text-zinc-500 mt-1">
            Gerencie alunos, treinos, dietas, avaliações, agenda e notificações.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {abas.map((aba) => (
            <button
              key={aba.id}
              onClick={() => setAbaAtiva(aba.id)}
              className={`px-4 py-2 rounded-lg border font-semibold text-sm transition ${
                abaAtiva === aba.id
                  ? 'bg-red-600 border-red-600 text-white'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:text-white hover:border-red-600'
              }`}
            >
              {aba.label}
            </button>
          ))}
        </div>

        {abaAtiva === 'alunos' && <AlunosTab />}

        {abaAtiva === 'treinos' && <TreinosTab />}

        {abaAtiva !== 'alunos' && abaAtiva !== 'treinos' && (
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6">
            <p className="text-zinc-500">
              Aba em construção. Próximo passo: implementar {abaAtiva}.
            </p>
          </div>
        )}
      </section>
    </main>
  )
}

