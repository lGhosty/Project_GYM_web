CREATE TABLE IF NOT EXISTS usuarios (
  id        SERIAL PRIMARY KEY,
  nome      VARCHAR(100) NOT NULL,
  email     VARCHAR(150) UNIQUE NOT NULL,
  senha     VARCHAR(255) NOT NULL,
  peso      DECIMAL(5,2),
  altura    INT,
  objetivo  VARCHAR(100),
  criado_em TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS treinos (
  id          SERIAL PRIMARY KEY,
  usuario_id  INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  nome        VARCHAR(100) NOT NULL,
  dia_semana  VARCHAR(20) NOT NULL,
  duracao_min INT,
  criado_em   TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS exercicios (
  id         SERIAL PRIMARY KEY,
  treino_id  INT NOT NULL REFERENCES treinos(id) ON DELETE CASCADE,
  nome       VARCHAR(100) NOT NULL,
  series     INT NOT NULL,
  repeticoes INT NOT NULL,
  descanso_s INT,
  grupo      VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS dietas (
  id         SERIAL PRIMARY KEY,
  usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  nome       VARCHAR(100) NOT NULL,
  descricao  TEXT,
  horario    VARCHAR(10),
  calorias   INT,
  criado_em  TIMESTAMP DEFAULT NOW()
);