const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const router = express.Router();
const JWT_SECRET = "mi_super_secreto";
/**
 * @swagger
 * tags:
 *   - name: auth
 *     description: Operaciones de autenticación y gestión de usuarios
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registro de usuario
 *     description: Crea un nuevo usuario en el sistema y devuelve un token JWT
 *     tags: [auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - email
 *             properties:
 *               username:
 *                 type: string
 *                 description: Nombre de usuario único
 *                 minLength: 3
 *                 maxLength: 50
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario
 *                 minLength: 6
 *                 format: password
 *               email:
 *                 type: string
 *                 description: Correo electrónico del usuario
 *                 format: email
 *     responses:
 *       200:
 *         description: Usuario registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuario registrado
 *                 user:
 *                   type: object
 *                   properties:
 *                     id_user:
 *                       type: integer
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                 token:
 *                   type: string
 *                   description: Token JWT para autenticación
 *       400:
 *         description: Datos de registro inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Usuario o email ya existe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

router.post("/register", async (req, res) => {
  const { username, password, email } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING *",
      [username, hashedPassword, email]
    );
    const token = jwt.sign({ id: result[0].id_user, username: username }, JWT_SECRET, { expiresIn: "1h" });

    res.json({ message: "Usuario registrado", user: result[0], token: token });
  } catch (error) {
    res.status(500).json({ error: "Error en el registro" });
  }
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Inicio de sesión
 *     description: Autentica un usuario y devuelve un token JWT
 *     tags: [auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: Nombre de usuario
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario
 *                 format: password
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token JWT para autenticación
 *                 id:
 *                   type: integer
 *                   description: ID del usuario
 *       401:
 *         description: Credenciales inválidas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.oneOrNone("SELECT * FROM users WHERE username = $1 limit 1", [username]);

    if (!result) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    const isValidPassword = await bcrypt.compare(password, result.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    const token = jwt.sign({ id: result.id_user, username: username }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ token: token, id: result.id_user });
  } catch (error) {
    res.status(500).json({ error: "Error en el login" });
  }
});

/**
 * @swagger
 * /auth/verify:
 *   get:
 *     summary: Verificar token
 *     description: Verifica la validez de un token JWT
 *     tags: [auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token válido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Token válido
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     username:
 *                       type: string
 *       401:
 *         description: Token no proporcionado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Token inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

router.get("/verify", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(403).json({ error: "Token requerido" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Token inválido" });
    res.json({ message: "Token válido", user });
  });
});

module.exports = router;
