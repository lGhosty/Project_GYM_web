'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

export default function AlunoNavbar() {
  const router = useRouter()
  const pathname = usePathname()

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    router.push('/login')
  }

  function linkClasse(path: string) {
    return pathname === path
      ? 'text-white font-bold'
      : 'text-zinc-400 hover:text-white transition'
  }

  return (
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
        <Link href="/home" className={linkClasse('/home')}>
          Home
        </Link>

        <Link href="/treinos" className={linkClasse('/treinos')}>
          Treinos
        </Link>

        <Link href="/dietas" className={linkClasse('/dietas')}>
          Dietas
        </Link>

        <Link href="/agenda" className={linkClasse('/agenda')}>
          Agenda
        </Link>

        <Link href="/notificacoes" className={linkClasse('/notificacoes')}>
          Notificações
        </Link>

        <Link href="/perfil" className={linkClasse('/perfil')}>
          Perfil
        </Link>

        <button
          onClick={logout}
          className="border border-red-600 text-red-600 hover:bg-red-600 hover:text-white px-4 py-2 rounded-lg transition"
        >
          Sair
        </button>
      </div>
    </nav>
  )
}