const bcrypt = require('bcryptjs')
const jwt    = require('jsonwebtoken')
const pool   = require('../config/database')
require('dotenv').config()

async function cadastrar(req, res) {
  try {
    const { nome, email, senha, peso, altura, objetivo } = req.body

    if (!nome || !email || !senha) {
      return res.status(400).json({ erro: 'Nome, email e senha sao obrigatorios.' })
    }

    const existe = await pool.query('SELECT id FROM usuarios WHERE email = $1', [email])
    if (existe.rows.length > 0) {
      return res.status(409).json({ erro: 'Email ja cadastrado.' })
    }

    const senhaHash = await bcrypt.hash(senha, 10)

    const result = await pool.query(
      `INSERT INTO usuarios (nome, email, senha, peso, altura, objetivo)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, nome, email, objetivo`,
      [nome, email, senhaHash, peso, altura, objetivo]
    )

    const usuario = result.rows[0]
    const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: '7d' })

    res.status(201).json({ mensagem: 'Usuario cadastrado com sucesso!', token, usuario })

  } catch (err) {
    res.status(500).json({ erro: 'Erro interno do servidor.' })
  }
}

async function login(req, res) {
  try {
    const { email, senha } = req.body

    if (!email || !senha) {
      return res.status(400).json({ erro: 'Email e senha sao obrigatorios.' })
    }

    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email])
    if (result.rows.length === 0) {
      return res.status(401).json({ erro: 'Email ou senha incorretos.' })
    }

    const usuario = result.rows[0]
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha)
    if (!senhaCorreta) {
      return res.status(401).json({ erro: 'Email ou senha incorretos.' })
    }

    const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: '7d' })

    res.json({
      token,
      usuario: {
        id:       usuario.id,
        nome:     usuario.nome,
        email:    usuario.email,
        objetivo: usuario.objetivo,
        peso:     usuario.peso,
        altura:   usuario.altura,
      }
    })

  } catch (err) {
    res.status(500).json({ erro: 'Erro interno do servidor.' })
  }
}

module.exports = { cadastrar, login }