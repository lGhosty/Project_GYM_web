-- ============================================================
-- FREAKYZONE — Schema Completo
-- Equipe Freaky | Programação para Web 2026
-- ============================================================
-- Execute: psql -U postgres -d freakyzone -f schema.sql
-- ============================================================

-- ── TABELA 1: usuarios ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS usuarios (
  id        SERIAL PRIMARY KEY,
  nome      VARCHAR(100) NOT NULL,
  email     VARCHAR(150) UNIQUE NOT NULL,
  senha     VARCHAR(255) NOT NULL,
  peso      DECIMAL(5,2),
  altura    INT,
  objetivo  VARCHAR(100),
  role      VARCHAR(20) DEFAULT 'aluno' CHECK (role IN ('aluno','admin')),
  criado_em TIMESTAMP DEFAULT NOW()
);

-- ── TABELA 2: treinos ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS treinos (
  id          SERIAL PRIMARY KEY,
  usuario_id  INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  criado_por  INT REFERENCES usuarios(id) ON DELETE SET NULL,
  nome        VARCHAR(100) NOT NULL,
  dia_semana  VARCHAR(20) NOT NULL,
  duracao_min INT,
  criado_em   TIMESTAMP DEFAULT NOW()
);

-- ── TABELA 3: exercicios ────────────────────────────────────
CREATE TABLE IF NOT EXISTS exercicios (
  id         SERIAL PRIMARY KEY,
  treino_id  INT NOT NULL REFERENCES treinos(id) ON DELETE CASCADE,
  nome       VARCHAR(100) NOT NULL,
  series     INT NOT NULL,
  repeticoes INT NOT NULL,
  descanso_s INT,
  grupo      VARCHAR(50)
);

-- ── TABELA 4: dietas ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS dietas (
  id         SERIAL PRIMARY KEY,
  usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  criado_por INT REFERENCES usuarios(id) ON DELETE SET NULL,
  nome       VARCHAR(100) NOT NULL,
  descricao  TEXT,
  horario    VARCHAR(10),
  calorias   INT,
  criado_em  TIMESTAMP DEFAULT NOW()
);

-- ── TABELA 5: avaliacoes ────────────────────────────────────
CREATE TABLE IF NOT EXISTS avaliacoes (
  id             SERIAL PRIMARY KEY,
  usuario_id     INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  avaliador_id   INT REFERENCES usuarios(id) ON DELETE SET NULL,
  peso           DECIMAL(5,2),
  gordura_pct    DECIMAL(5,2),
  massa_muscular DECIMAL(5,2),
  imc            DECIMAL(5,2),
  observacoes    TEXT,
  data_avaliacao DATE DEFAULT CURRENT_DATE,
  criado_em      TIMESTAMP DEFAULT NOW()
);

-- ── TABELA 6: agendamentos ──────────────────────────────────
CREATE TABLE IF NOT EXISTS agendamentos (
  id         SERIAL PRIMARY KEY,
  usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  criado_por INT REFERENCES usuarios(id) ON DELETE SET NULL,
  titulo     VARCHAR(150) NOT NULL,
  descricao  TEXT,
  data_hora  TIMESTAMP NOT NULL,
  tipo       VARCHAR(50) DEFAULT 'treino' CHECK (tipo IN ('treino','avaliacao','consulta','outro')),
  status     VARCHAR(20) DEFAULT 'pendente' CHECK (status IN ('pendente','confirmado','cancelado')),
  criado_em  TIMESTAMP DEFAULT NOW()
);

-- ── TABELA 7: notificacoes ──────────────────────────────────
CREATE TABLE IF NOT EXISTS notificacoes (
  id           SERIAL PRIMARY KEY,
  usuario_id   INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  remetente_id INT REFERENCES usuarios(id) ON DELETE SET NULL,
  titulo       VARCHAR(150) NOT NULL,
  mensagem     TEXT NOT NULL,
  lida         BOOLEAN DEFAULT FALSE,
  criado_em    TIMESTAMP DEFAULT NOW()
);

-- ── ÍNDICES ─────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_treinos_usuario      ON treinos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_exercicios_treino    ON exercicios(treino_id);
CREATE INDEX IF NOT EXISTS idx_dietas_usuario       ON dietas(usuario_id);
CREATE INDEX IF NOT EXISTS idx_avaliacoes_usuario   ON avaliacoes(usuario_id);
CREATE INDEX IF NOT EXISTS idx_agendamentos_usuario ON agendamentos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_notificacoes_usuario ON notificacoes(usuario_id);

-- ── SEED: Admin padrão ──────────────────────────────────────
-- Senha: admin123
INSERT INTO usuarios (nome, email, senha, objetivo, role)
VALUES (
  'Professor Admin',
  'admin@freakyzone.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh9S',
  'Administrar',
  'admin'
) ON CONFLICT (email) DO NOTHING;