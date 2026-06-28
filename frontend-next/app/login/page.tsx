'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { API_URL } from '../../services/api'

type Usuario = {
  id?: number
  nome?: string
  email?: string
  role?: string
  tipo?: string
}

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState('admin@freakyzone.com')
  const [senha, setSenha] = useState('admin123')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function fazerLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setErro('')
    setCarregando(true)

    try {
      const resposta = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          senha
        })
      })

      const dados = await resposta.json()

      if (!resposta.ok) {
        setErro(dados.erro || dados.message || 'Erro ao fazer login.')
        return
      }

      const token = dados.token
      const usuario: Usuario = dados.usuario || dados.user

      if (!token || !usuario) {
        setErro('A API não retornou token ou usuário.')
        return
      }

      localStorage.setItem('token', token)
      localStorage.setItem('usuario', JSON.stringify(usuario))

      const perfil = usuario.role || usuario.tipo

      if (perfil === 'admin' || perfil === 'professor') {
        router.push('/admin')
      } else {
        router.push('/')
      }
    } catch {
      setErro('Não foi possível conectar com o servidor.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <section className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black tracking-widest text-red-600">
            FREAKYZONE
          </h1>
          <p className="text-zinc-500 mt-2">
            Acesse sua conta
          </p>
        </div>

        {erro && (
          <div className="mb-4 border border-red-600 bg-red-600/10 text-red-500 rounded-lg px-4 py-3 text-sm">
            {erro}
          </div>
        )}

        <form onSubmit={fazerLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">
              E-mail
            </label>

            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 outline-none focus:border-red-600"
              placeholder="Digite seu e-mail"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">
              Senha
            </label>

            <input
              type="password"
              value={senha}
              onChange={(event) => setSenha(event.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 outline-none focus:border-red-600"
              placeholder="Digite sua senha"
            />
          </div>

          <button
            type="submit"
            disabled={carregando}
            className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-60 rounded-lg py-3 font-bold tracking-widest transition"
          >
            {carregando ? 'ENTRANDO...' : 'ENTRAR'}
          </button>
        </form>
      </section>
    </main>
  )
}