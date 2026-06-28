'use client'

import { useEffect, useState } from 'react'
import { API_URL, getAuthHeaders } from '../../services/api'

type Aluno = {
  id: number
  nome: string
  email: string
  objetivo?: string
}

export default function AlunosTab() {
  const [alunos, setAlunos] = useState<Aluno[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

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
        setErro('Não foi possível conectar com o servidor.')
      } finally {
        setCarregando(false)
      }
    }

    carregarAlunos()
  }, [])

  if (carregando) {
    return (
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6">
        <p className="text-zinc-500">Carregando alunos...</p>
      </div>
    )
  }

  if (erro) {
    return (
      <div className="bg-red-600/10 border border-red-600 text-red-500 rounded-xl p-6">
        {erro}
      </div>
    )
  }

  return (
    <section>
      <h2 className="text-2xl font-black uppercase border-l-4 border-red-600 pl-3 mb-5">
        Alunos Cadastrados
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 text-center">
          <p className="text-4xl font-black text-red-600">{alunos.length}</p>
          <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">
            Alunos
          </p>
        </div>
      </div>

      <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5">
        {alunos.length === 0 ? (
          <p className="text-zinc-500">Nenhum aluno cadastrado.</p>
        ) : (
          <div className="space-y-3">
            {alunos.map((aluno) => (
              <div
                key={aluno.id}
                className="flex items-center gap-4 border-b border-zinc-800 pb-3 last:border-b-0 last:pb-0"
              >
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center">
                  🧑
                </div>

                <div className="flex-1">
                  <p className="font-bold">{aluno.nome}</p>
                  <p className="text-sm text-zinc-500">
                    {aluno.email} · {aluno.objetivo || 'Sem objetivo'}
                  </p>
                </div>

                <span className="text-xs text-zinc-600">
                  ID: {aluno.id}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}