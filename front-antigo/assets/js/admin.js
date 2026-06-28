const API = 'http://localhost:3333/api'

const token = localStorage.getItem('token')
const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')
const perfil = usuario.role || usuario.tipo

if (!token || !['admin', 'professor'].includes(perfil)) {
  alert('Acesso negado! Apenas administradores/professores.')
  window.location.href = '../index.html'
}

let alunos = []

function $(id) {
  return document.getElementById(id)
}

function hdrs() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  }
}

async function lerResposta(response) {
  try {
    return await response.json()
  } catch {
    return {}
  }
}

function mostrarMensagem(id, texto) {
  const el = $(id)

  if (!el) {
    return
  }

  el.textContent = texto || 'Ocorreu um erro.'
  el.style.display = 'block'

  setTimeout(() => {
    el.style.display = 'none'
  }, 4000)
}

function alterarStat(id, incremento = 1) {
  const el = $(id)

  if (!el) {
    return
  }

  const atual = Number(el.textContent)
  el.textContent = Number.isFinite(atual) ? atual + incremento : incremento
}

function textoSeguro(valor, fallback = '') {
  return valor ?? fallback
}

function showTab(nome, botao) {
  document.querySelectorAll('.section').forEach(section => {
    section.classList.remove('active')
  })

  document.querySelectorAll('.tab').forEach(tab => {
    tab.classList.remove('active')
  })

  const section = $(`tab-${nome}`)

  if (!section) {
    return
  }

  section.classList.add('active')

  if (botao) {
    botao.classList.add('active')
  }
}

function preencherSelectsAlunos() {
  const options = '<option value="">Selecione...</option>' +
    alunos.map(aluno => `<option value="${aluno.id}">${aluno.nome}</option>`).join('')

  const ids = [
    'select-aluno-treino',
    'select-aluno-dieta',
    'select-aluno-aval',
    'select-aluno-agenda',
    'select-aluno-notif'
  ]

  ids.forEach(id => {
    const select = $(id)

    if (select) {
      select.innerHTML = options
    }
  })
}

async function carregarAlunos() {
  const lista = $('lista-alunos')

  try {
    const response = await fetch(`${API}/usuarios/alunos`, {
      headers: hdrs()
    })

    alunos = await lerResposta(response)

    if (!response.ok) {
      throw new Error(alunos.erro || 'Erro ao carregar alunos.')
    }

    $('total-alunos').textContent = alunos.length
    preencherSelectsAlunos()

    if (!alunos.length) {
      lista.innerHTML = '<p class="muted-text">Nenhum aluno cadastrado.</p>'
      return
    }

    lista.innerHTML = alunos.map(aluno => `
      <div class="aluno-row">
        <div class="aluno-av">🧑</div>

        <div class="aluno-info">
          <div class="aluno-nome">${textoSeguro(aluno.nome)}</div>
          <div class="aluno-email">${textoSeguro(aluno.email)} · ${textoSeguro(aluno.objetivo, 'Sem objetivo')}</div>
        </div>

        <div class="aluno-id">ID: ${aluno.id}</div>
      </div>
    `).join('')
  } catch (error) {
    lista.innerHTML = '<p class="muted-text">Erro ao carregar alunos.</p>'
  }
}

async function criarTreino() {
  const usuario_id = $('select-aluno-treino').value
  const nome = $('t-nome').value.trim()
  const dia_semana = $('t-dia').value
  const duracao_min = Number($('t-dur').value)
  let exercicios = []

  try {
    const exTxt = $('t-exercicios').value.trim()

    if (exTxt) {
      exercicios = JSON.parse(exTxt)
    }
  } catch {
    return mostrarMensagem('err-treino', 'JSON dos exercícios inválido.')
  }

  if (!usuario_id || !nome) {
    return mostrarMensagem('err-treino', 'Selecione um aluno e informe o nome do treino.')
  }

  const response = await fetch(`${API}/treinos`, {
    method: 'POST',
    headers: hdrs(),
    body: JSON.stringify({
      usuario_id: Number(usuario_id),
      nome,
      dia_semana,
      duracao_min,
      exercicios
    })
  })

  const data = await lerResposta(response)

  if (!response.ok) {
    return mostrarMensagem('err-treino', data.erro)
  }

  mostrarMensagem('ok-treino', `Treino "${data.nome}" criado para o aluno com sucesso!`)
  alterarStat('total-treinos')
}

async function criarDieta() {
  const usuario_id = $('select-aluno-dieta').value
  const nome = $('d-nome').value.trim()
  const horario = $('d-hora').value
  const calorias = Number($('d-kcal').value)
  const descricao = $('d-desc').value

  if (!usuario_id || !nome) {
    return mostrarMensagem('err-dieta', 'Selecione um aluno e informe o nome da refeição.')
  }

  const response = await fetch(`${API}/dietas`, {
    method: 'POST',
    headers: hdrs(),
    body: JSON.stringify({
      usuario_id: Number(usuario_id),
      nome,
      horario,
      calorias,
      descricao
    })
  })

  const data = await lerResposta(response)

  if (!response.ok) {
    return mostrarMensagem('err-dieta', data.erro)
  }

  mostrarMensagem('ok-dieta', `Refeição "${data.nome}" adicionada com sucesso!`)
}

async function criarAvaliacao() {
  const usuario_id = $('select-aluno-aval').value
  const peso = Number($('av-peso').value)
  const gordura_pct = Number($('av-gord').value)
  const massa_muscular = Number($('av-massa').value)
  const observacoes = $('av-obs').value
  const data_avaliacao = $('av-data').value

  if (!usuario_id) {
    return mostrarMensagem('err-aval', 'Selecione um aluno.')
  }

  const response = await fetch(`${API}/avaliacoes`, {
    method: 'POST',
    headers: hdrs(),
    body: JSON.stringify({
      usuario_id: Number(usuario_id),
      peso,
      gordura_pct,
      massa_muscular,
      observacoes,
      data_avaliacao
    })
  })

  const data = await lerResposta(response)

  if (!response.ok) {
    return mostrarMensagem('err-aval', data.erro)
  }

  mostrarMensagem('ok-aval', 'Avaliação registrada com sucesso!')
  alterarStat('total-avals')
  carregarAvaliacoes()
}

async function carregarAvaliacoes() {
  const el = $('lista-avals')

  try {
    const response = await fetch(`${API}/avaliacoes`, {
      headers: hdrs()
    })

    const lista = await lerResposta(response)

    if (!response.ok) {
      throw new Error(lista.erro || 'Erro ao carregar avaliações.')
    }

    if (!lista.length) {
      el.innerHTML = '<p class="muted-text">Nenhuma avaliação.</p>'
      $('total-avals').textContent = 0
      return
    }

    el.innerHTML = lista.map(avaliacao => `
      <div class="card">
        <div class="avaliacao-header">
          <strong>${avaliacao.aluno_nome || 'Aluno'}</strong>
          <span class="avaliacao-data">${new Date(avaliacao.data_avaliacao).toLocaleDateString('pt-BR')}</span>
        </div>

        <div class="avaliacao-grid">
          <span>⚖️ Peso: <strong>${avaliacao.peso || '-'} kg</strong></span>
          <span>🔥 Gordura: <strong>${avaliacao.gordura_pct || '-'}%</strong></span>
          <span>💪 Massa: <strong>${avaliacao.massa_muscular || '-'} kg</strong></span>
        </div>

        ${avaliacao.observacoes ? `<p class="avaliacao-obs">${avaliacao.observacoes}</p>` : ''}
      </div>
    `).join('')

    $('total-avals').textContent = lista.length
  } catch {
    el.innerHTML = '<p class="muted-text">Erro ao carregar avaliações.</p>'
  }
}

async function criarAgendamento() {
  const usuario_id = $('select-aluno-agenda').value
  const titulo = $('ag-titulo').value.trim()
  const tipo = $('ag-tipo').value
  const data_hora = $('ag-data').value
  const descricao = $('ag-desc').value

  if (!usuario_id || !titulo || !data_hora) {
    return mostrarMensagem('err-agenda', 'Selecione aluno, informe título e data/hora.')
  }

  const response = await fetch(`${API}/agendamentos`, {
    method: 'POST',
    headers: hdrs(),
    body: JSON.stringify({
      usuario_id: Number(usuario_id),
      titulo,
      tipo,
      data_hora,
      descricao
    })
  })

  const data = await lerResposta(response)

  if (!response.ok) {
    return mostrarMensagem('err-agenda', data.erro)
  }

  mostrarMensagem('ok-agenda', `Evento "${data.titulo}" agendado!`)
  carregarAgendamentos()
}

function classeStatus(status) {
  const statusNormalizado = status || 'pendente'
  return `status-badge status-${statusNormalizado}`
}

async function carregarAgendamentos() {
  const el = $('lista-agendamentos')

  try {
    const response = await fetch(`${API}/agendamentos`, {
      headers: hdrs()
    })

    const lista = await lerResposta(response)

    if (!response.ok) {
      throw new Error(lista.erro || 'Erro ao carregar agendamentos.')
    }

    if (!lista.length) {
      el.innerHTML = '<p class="muted-text">Nenhum agendamento.</p>'
      return
    }

    el.innerHTML = lista.map(agendamento => {
      const data = new Date(agendamento.data_hora)
      const status = agendamento.status || 'pendente'

      return `
        <div class="card agendamento-card">
          <div class="agendamento-data-box">
            <div class="agendamento-dia">${data.getDate()}</div>
            <div class="agendamento-mes">${data.toLocaleString('pt-BR', { month: 'short' }).toUpperCase()}</div>
          </div>

          <div class="agendamento-info">
            <div class="agendamento-titulo">${agendamento.aluno_nome || 'Aluno'} — ${agendamento.titulo}</div>
            <div class="agendamento-meta">${data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} · ${agendamento.tipo}</div>
          </div>

          <span class="${classeStatus(status)}">${status}</span>
        </div>
      `
    }).join('')
  } catch {
    el.innerHTML = '<p class="muted-text">Erro ao carregar agendamentos.</p>'
  }
}

async function enviarNotificacao() {
  const usuario_id = $('select-aluno-notif').value
  const titulo = $('n-titulo').value.trim()
  const mensagem = $('n-msg').value.trim()

  if (!usuario_id || !titulo || !mensagem) {
    return mostrarMensagem('err-notif', 'Preencha todos os campos.')
  }

  const response = await fetch(`${API}/notificacoes`, {
    method: 'POST',
    headers: hdrs(),
    body: JSON.stringify({
      usuario_id: Number(usuario_id),
      titulo,
      mensagem
    })
  })

  const data = await lerResposta(response)

  if (!response.ok) {
    return mostrarMensagem('err-notif', data.erro)
  }

  mostrarMensagem('ok-notif', 'Notificação enviada com sucesso!')
  $('n-titulo').value = ''
  $('n-msg').value = ''
}

function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('usuario')
  window.location.href = '../index.html'
}

carregarAlunos()
carregarAvaliacoes()
carregarAgendamentos()