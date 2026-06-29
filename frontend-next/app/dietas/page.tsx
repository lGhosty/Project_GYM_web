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

type Dieta = {
  id: number
  nome: string
  horario?: string
  calorias?: number
  descricao?: string
}

export default function DietasPage() {
  const router = useRouter()

  const [usuario] = useState<Usuario | null>(() => getUsuario() as Usuario | null)
  const [dietas, setDietas] = useState<Dieta[]>([])
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(true)

  const carregarDietas = useCallback(async () => {
    try {
      const resposta = await fetch(`${API_URL}/dietas`, {
        headers: getAuthHeaders()
      })

      const dados = await resposta.json()

      if (!resposta.ok) {
        setErro(dados.erro || 'Erro ao carregar dietas.')
        return
     }

      const listaDietas = Array.isArray(dados)
        ? dados
        : Array.isArray(dados.refeicoes)
          ? dados.refeicoes
          : []

      setDietas(listaDietas)
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

    carregarDietas()
  }, [router, usuario, carregarDietas])

  return (
    <main className="min-h-screen bg-black text-white">
      <AlunoNavbar />

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
