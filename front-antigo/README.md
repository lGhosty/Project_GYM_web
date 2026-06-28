# 🏋️ FreakyZone — Plataforma de Gestão de Academia

> Projeto desenvolvido pela **Equipe Freaky** para a disciplina de Programação para Web 2026.

## 📋 Descrição

O **FreakyZone** é uma aplicação web completa para gestão de academias. Professores (admin) criam treinos, dietas e avaliações físicas para os alunos. Alunos acessam seu painel pessoal com treinos, dieta, agenda e histórico de avaliações.

## 👥 Equipe Freaky

| Nome | Função |
|------|--------|
| — | Front-end |
| — | Back-end |
| — | Banco de Dados |
| — | Documentação |

## 🔑 Papéis no Sistema (RBAC)

| Papel | Acesso |
|-------|--------|
| **Admin/Professor** | Cria treinos, dietas, avaliações, agendamentos e notificações para os alunos |
| **Aluno** | Visualiza seus próprios treinos, dieta, agenda, avaliações e notificações |

**Login admin padrão:**
- Email: `admin@freakyzone.com`
- Senha: `admin123`

## 🚀 Tecnologias

| Camada | Tecnologia |
|--------|-----------|
| Front-end | HTML5 + CSS3 + JavaScript (Fetch API) |
| Back-end | Node.js + Express |
| Banco de Dados | PostgreSQL |
| Autenticação | JWT + RBAC |
| Deploy Front | Vercel / Netlify |
| Deploy Back | Railway / Render |

## 📁 Estrutura do Projeto

```
Project_Gym_web/
├── index.html              → Login
├── pages/
│   ├── cadastro.html       → Cadastro de alunos
│   ├── home.html           → Dashboard do aluno
│   ├── treino.html         → Treinos do aluno
│   ├── dieta.html          → Dieta do aluno
│   ├── agenda.html         → Agenda do aluno
│   ├── perfil.html         → Perfil do aluno
│   └── admin.html          → Painel do professor/admin
├── assets/css/style.css    → Estilos globais
├── docs/                   → Diagramas
└── server/                 → Back-end Node.js
    ├── src/
    │   ├── app.js
    │   ├── config/
    │   │   ├── database.js
    │   │   └── schema.sql
    │   ├── controllers/
    │   │   ├── authController.js
    │   │   ├── treinoController.js
    │   │   ├── dietaController.js
    │   │   ├── usuarioController.js
    │   │   ├── avaliacaoController.js
    │   │   ├── agendamentoController.js
    │   │   └── notificacaoController.js
    │   ├── middlewares/
    │   │   ├── authMiddleware.js
    │   │   └── rbacMiddleware.js
    │   └── routes/
    │       ├── authRoutes.js
    │       ├── treinoRoutes.js
    │       ├── dietaRoutes.js
    │       ├── usuarioRoutes.js
    │       ├── avaliacaoRoutes.js
    │       ├── agendamentoRoutes.js
    │       └── notificacaoRoutes.js
    ├── .env.example
    └── package.json
```

## ⚙️ Como Executar Localmente

### 1. Criar o banco de dados

```bash
psql -U postgres
CREATE DATABASE freakyzone;
\q
```

### 2. Criar as tabelas

```bash
psql -U postgres -d freakyzone -f server/src/config/schema.sql
```

### 3. Configurar variáveis de ambiente

```bash
cd server
cp .env.example .env
# Edite o .env com suas credenciais do PostgreSQL
```

### 4. Instalar dependências e iniciar o servidor

```bash
npm install
npm run dev
```

### 5. Abrir o front-end

Abra `index.html` no navegador ou use a extensão **Live Server** do VS Code.

> ⚠️ A variável `API_URL` nos arquivos HTML aponta para `http://localhost:3333/api` em desenvolvimento.
> Em produção, substitua pela URL do deploy do back-end.

## 🌐 Deploy

| Serviço | URL |
|---------|-----|
| Front-end (Vercel) | *em breve* |
| Back-end (Railway) | *em breve* |

## 📡 Endpoints da API

| Método | Endpoint | Papel | Descrição |
|--------|----------|-------|-----------|
| POST | /api/auth/cadastro | Público | Cadastrar novo aluno |
| POST | /api/auth/login | Público | Login (aluno ou admin) |
| GET | /api/treinos | Aluno | Listar seus treinos |
| POST | /api/treinos | Admin | Criar treino para aluno |
| PUT | /api/treinos/:id | Admin | Editar treino |
| DELETE | /api/treinos/:id | Admin | Deletar treino |
| GET | /api/dietas | Aluno | Listar sua dieta |
| POST | /api/dietas | Admin | Adicionar refeição para aluno |
| DELETE | /api/dietas/:id | Auth | Deletar refeição |
| GET | /api/usuarios/perfil | Auth | Ver perfil |
| PUT | /api/usuarios/perfil | Auth | Atualizar perfil |
| GET | /api/usuarios/alunos | Admin | Listar todos os alunos |
| GET | /api/avaliacoes | Auth | Listar avaliações |
| POST | /api/avaliacoes | Admin | Criar avaliação física |
| GET | /api/agendamentos | Auth | Listar agendamentos |
| POST | /api/agendamentos | Admin | Criar agendamento |
| PUT | /api/agendamentos/:id | Auth | Atualizar status |
| GET | /api/notificacoes | Aluno | Listar notificações |
| POST | /api/notificacoes | Admin | Enviar notificação |
| PUT | /api/notificacoes/:id/ler | Aluno | Marcar como lida |

## 🗄️ Banco de Dados

| Tabela | Descrição |
|--------|-----------|
| usuarios | Dados de cadastro e autenticação (com campo role) |
| treinos | Treinos atribuídos a cada aluno |
| exercicios | Exercícios de cada treino |
| dietas | Refeições do plano alimentar |
| avaliacoes | Avaliações físicas periódicas *(Entrega 03)* |
| agendamentos | Agenda de eventos e treinos *(Entrega 03)* |
| notificacoes | Notificações do professor para o aluno *(Entrega 03)* |


## 🎨 Design do Projeto
Você pode visualizar o protótipo interativo no Figma através do link abaixo:
* [Protótipo no Figma](https://www.figma.com/design/elYdlws8eHOEnBasBrfRBw/Figma-basics?node-id=1847-2&t=piWF2I648WdjimWg-1)

## 📊 Diagrama de Casos de Uso
Abaixo está a representação visual das funcionalidades do sistema:

![Diagrama de Casos de Uso](./docs/diagrama_de_casos_de_uso.png)


## 📊 Diagrama de Classes
Abaixo está a representação visual das funcionalidades que represente o domínio da
aplicação back-end:
![Diagrama de Classes](./docs/diagrama_de_classes.png)



## 👨‍💻 Autor

Desenvolvido por **Fernandes**
