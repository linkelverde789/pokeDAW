const express = require("express");
const {createPokemonMember, updatePokemonMember, deletePokemonMember, readAllPokemonTeam, createPokemonTeam, getTeams} = require('../controllers/poketeamController');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: poketeam
 *     description: Gestión de equipos Pokémon personalizados
 */

/**
 * @swagger
 * /poketeam/pokemember/create:
 *   post:
 *     summary: Crear miembro de equipo
 *     description: Crea un nuevo Pokémon personalizado para el equipo del usuario
 *     tags: [poketeam]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - pokemonId
 *               - name
 *               - level
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: ID del usuario propietario
 *               pokemonId:
 *                 type: integer
 *                 description: ID del Pokémon base
 *               name:
 *                 type: string
 *                 description: Nombre personalizado del Pokémon
 *               level:
 *                 type: integer
 *                 description: Nivel del Pokémon
 *                 minimum: 1
 *                 maximum: 100
 *               ability:
 *                 type: string
 *                 description: Habilidad del Pokémon
 *               moves:
 *                 type: array
 *                 description: Lista de movimientos (máximo 4)
 *                 items:
 *                   type: string
 *               ivs:
 *                 type: object
 *                 description: Valores individuales
 *                 properties:
 *                   hp:
 *                     type: integer
 *                   attack:
 *                     type: integer
 *                   defense:
 *                     type: integer
 *                   spAttack:
 *                     type: integer
 *                   spDefense:
 *                     type: integer
 *                   speed:
 *                     type: integer
 *               evs:
 *                 type: object
 *                 description: Valores de esfuerzo
 *                 properties:
 *                   hp:
 *                     type: integer
 *                   attack:
 *                     type: integer
 *                   defense:
 *                     type: integer
 *                   spAttack:
 *                     type: integer
 *                   spDefense:
 *                     type: integer
 *                   speed:
 *                     type: integer
 *     responses:
 *       200:
 *         description: Miembro de equipo creado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Miembro de equipo creado exitosamente
 *                 teamMember:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     level:
 *                       type: integer
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/pokemember/create", createPokemonMember);

/**
 * @swagger
 * /poketeam/pokemember/update:
 *   put:
 *     summary: Actualizar miembro de equipo
 *     description: Actualiza los datos de un Pokémon personalizado del equipo
 *     tags: [poketeam]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - teamMemberId
 *             properties:
 *               teamMemberId:
 *                 type: integer
 *                 description: ID del miembro del equipo a actualizar
 *               name:
 *                 type: string
 *                 description: Nuevo nombre personalizado
 *               level:
 *                 type: integer
 *                 description: Nuevo nivel
 *                 minimum: 1
 *                 maximum: 100
 *               ability:
 *                 type: string
 *                 description: Nueva habilidad
 *               moves:
 *                 type: array
 *                 description: Nueva lista de movimientos
 *                 items:
 *                   type: string
 *               ivs:
 *                 type: object
 *                 description: Nuevos valores individuales
 *               evs:
 *                 type: object
 *                 description: Nuevos valores de esfuerzo
 *     responses:
 *       200:
 *         description: Miembro de equipo actualizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Miembro de equipo actualizado exitosamente
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Miembro de equipo no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put("/pokemember/update", updatePokemonMember);

/**
 * @swagger
 * /poketeam/pokemember/delete:
 *   delete:
 *     summary: Eliminar miembro de equipo
 *     description: Elimina un Pokémon personalizado del equipo
 *     tags: [poketeam]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - teamMemberId
 *             properties:
 *               teamMemberId:
 *                 type: integer
 *                 description: ID del miembro del equipo a eliminar
 *     responses:
 *       200:
 *         description: Miembro de equipo eliminado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Miembro de equipo eliminado exitosamente
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Miembro de equipo no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete("/pokemember/delete", deletePokemonMember);

/**
 * @swagger
 * /poketeam/pokemember/readAll:
 *   post:
 *     summary: Listar equipo completo
 *     description: Obtiene todos los Pokémon personalizados del equipo de un usuario
 *     tags: [poketeam]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: ID del usuario
 *     responses:
 *       200:
 *         description: Lista de miembros del equipo
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   level:
 *                     type: integer
 *                   ability:
 *                     type: string
 *                   moves:
 *                     type: array
 *                     items:
 *                       type: string
 *                   ivs:
 *                     type: object
 *                   evs:
 *                     type: object
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/pokemember/readAll", readAllPokemonTeam);


router.post("/create",createPokemonTeam );

/**
 * @swagger
 * /poketeam/readAll:
 *   post:
 *     summary: Obtener equipos completos
 *     description: Obtiene todos los equipos completos de un usuario con los detalles de cada Pokémon
 *     tags: [poketeam]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_user
 *             properties:
 *               id_user:
 *                 type: integer
 *                 description: ID del usuario
 *     responses:
 *       200:
 *         description: Lista de equipos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_team:
 *                     type: integer
 *                   team_name:
 *                     type: string
 *                   pokemon_members:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                         base_pokemon:
 *                           type: integer
 *                         nature:
 *                           type: string
 *                         item:
 *                           type: object
 *                         level:
 *                           type: integer
 *                         ability:
 *                           type: object
 *                         stats:
 *                           type: object
 *                         moves:
 *                           type: array
 *                         position:
 *                           type: integer
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: No se encontraron equipos
 */
router.post("/readAll", getTeams);

module.exports = router;