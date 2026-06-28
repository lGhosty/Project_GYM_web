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

type Notificacao = {
  id: number
  titulo: string
  mensagem: string
  lida?: boolean
  criada_em?: string
  created_at?: string
}

export default function NotificacoesPage() {
  const router = useRouter()

  const [usuario] = useState<Usuario | null>(() => getUsuario() as Usuario | null)
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([])
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(true)

  const carregarNotificacoes = useCallback(async () => {
    try {
      const resposta = await fetch(`${API_URL}/notificacoes`, {
        headers: getAuthHeaders()
      })

      const dados = await resposta.json()

      if (!resposta.ok) {
        setErro(dados.erro || 'Erro ao carregar notificações.')
        return
      }

      setNotificacoes(Array.isArray(dados) ? dados : [])
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

    carregarNotificacoes()
  }, [router, usuario, carregarNotificacoes])

  function formatarData(notificacao: Notificacao) {
    const data = notificacao.criada_em || notificacao.created_at

    if (!data) {
      return 'Data não informada'
    }

    return new Date(data).toLocaleString('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'short'
    })
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <AlunoNavbar />

      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-black">
            Notificações
          </h1>

          <p className="text-zinc-500 mt-1">
            Veja os avisos enviados para você, {usuario?.nome || 'aluno'}.
          </p>
        </div>

        {erro && (
          <div className="mb-6 border border-red-600 bg-red-600/10 text-red-500 rounded-xl p-4">
            {erro}
          </div>
        )}

        {carregando ? (
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6">
            <p className="text-zinc-500">Carregando notificações...</p>
          </div>
        ) : notificacoes.length === 0 ? (
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6">
            <p className="text-zinc-500">
              Nenhuma notificação recebida.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {notificacoes.map((notificacao) => (
              <div
                key={notificacao.id}
                className="bg-zinc-950 border border-zinc-800 rounded-xl p-6"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
                  <h2 className="text-xl font-black text-red-600">
                    {notificacao.titulo}
                  </h2>

                  <span className="text-xs text-zinc-500">
                    {formatarData(notificacao)}
                  </span>
                </div>

                <p className="text-zinc-400">
                  {notificacao.mensagem}
                </p>

                <div className="mt-4">
                  <span
                    className={`text-xs font-bold uppercase border rounded px-3 py-1 ${
                      notificacao.lida
                        ? 'border-green-500 text-green-500 bg-green-500/10'
                        : 'border-yellow-400 text-yellow-400 bg-yellow-400/10'
                    }`}
                  >
                    {notificacao.lida ? 'Lida' : 'Nova'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
