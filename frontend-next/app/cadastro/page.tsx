'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { API_URL } from '../../services/api'

export default function CadastroPage() {
  const router = useRouter()

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [objetivo, setObjetivo] = useState('')
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function cadastrar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setErro('')
    setSucesso('')
    setCarregando(true)

    try {
      const resposta = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nome,
          email,
          senha,
          tipo: 'aluno',
          objetivo
        })
      })

      const dados = await resposta.json()

      if (!resposta.ok) {
        setErro(dados.erro || dados.message || 'Erro ao cadastrar.')
        return
      }

      setSucesso('Cadastro realizado com sucesso!')

      setTimeout(() => {
        router.push('/login')
      }, 1500)
    } catch {
      setErro('Não foi possível conectar com o servidor.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <section className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black tracking-widest text-red-600">
            FREAKYZONE
          </h1>

          <p className="text-zinc-500 mt-2">
            Criar conta de aluno
          </p>
        </div>

        {erro && (
          <div className="mb-4 border border-red-600 bg-red-600/10 text-red-500 rounded-lg px-4 py-3 text-sm">
            {erro}
          </div>
        )}

        {sucesso && (
          <div className="mb-4 border border-green-500 bg-green-500/10 text-green-500 rounded-lg px-4 py-3 text-sm">
            {sucesso}
          </div>
        )}

        <form onSubmit={cadastrar} className="space-y-4">
          <input
            value={nome}
            onChange={(event) => setNome(event.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 outline-none focus:border-red-600"
            placeholder="Nome"
          />

          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 outline-none focus:border-red-600"
            placeholder="E-mail"
          />

          <input
            type="password"
            value={senha}
            onChange={(event) => setSenha(event.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 outline-none focus:border-red-600"
            placeholder="Senha"
          />

          <input
            value={objetivo}
            onChange={(event) => setObjetivo(event.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 outline-none focus:border-red-600"
            placeholder="Objetivo"
          />

          <button
            type="submit"
            disabled={carregando}
            className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-60 rounded-lg py-3 font-bold tracking-widest transition"
          >
            {carregando ? 'CADASTRANDO...' : 'CRIAR CONTA'}
          </button>
        </form>

        <button
          onClick={() => router.push('/login')}
          className="w-full mt-4 text-zinc-500 hover:text-white text-sm transition"
        >
          Já tenho conta. Fazer login.
        </button>
      </section>
    </main>
  )
}