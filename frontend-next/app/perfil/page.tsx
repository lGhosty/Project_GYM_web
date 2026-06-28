'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getUsuario } from '../../services/api'
import AlunoNavbar from '../../components/aluno/AlunoNavbar'

type Usuario = {
  id?: number
  nome?: string
  email?: string
  role?: string
  tipo?: string
  objetivo?: string
}

export default function PerfilPage() {
  const router = useRouter()

  const [usuario, setUsuario] = useState<Usuario | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const usuarioSalvo = getUsuario()

    if (!token || !usuarioSalvo) {
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

  return (
    <main className="min-h-screen bg-black text-white">
      <AlunoNavbar />

      <section className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-black">
            Meu Perfil
          </h1>

          <p className="text-zinc-500 mt-1">
            Veja suas informações cadastradas no sistema.
          </p>
        </div>

        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6">
          <div className="flex items-center gap-5 mb-8">
            <div className="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center text-3xl font-black">
              {usuario?.nome?.charAt(0).toUpperCase() || 'A'}
            </div>

            <div>
              <h2 className="text-2xl font-black">
                {usuario?.nome || 'Aluno'}
              </h2>

              <p className="text-zinc-500">
                {usuario?.email || 'E-mail não informado'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-black/40 border border-zinc-800 rounded-lg p-4">
              <p className="text-xs uppercase tracking-widest text-zinc-500 mb-2">
                ID do usuário
              </p>

              <p className="font-bold">
                {usuario?.id || 'Não informado'}
              </p>
            </div>

            <div className="bg-black/40 border border-zinc-800 rounded-lg p-4">
              <p className="text-xs uppercase tracking-widest text-zinc-500 mb-2">
                Perfil
              </p>

              <p className="font-bold">
                {usuario?.role || usuario?.tipo || 'Aluno'}
              </p>
            </div>

            <div className="bg-black/40 border border-zinc-800 rounded-lg p-4 md:col-span-2">
              <p className="text-xs uppercase tracking-widest text-zinc-500 mb-2">
                Objetivo
              </p>

              <p className="font-bold">
                {usuario?.objetivo || 'Objetivo não informado'}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}