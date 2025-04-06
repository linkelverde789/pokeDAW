const express = require("express");
const router = express.Router(); 
const {
    create,
    readAll,
    readOne,
    readCommunitymonPerUser,
    deleteCommunitymon,
    update
} = require("../controllers/communitymonController");

/**
 * @swagger
 * tags:
 *   - name: communitymon
 *     description: Gestión de Pokémon compartidos por la comunidad
 */

/**
 * @swagger
 * /communitymon/create:
 *   post:
 *     summary: Crear Pokémon comunitario
 *     description: Crea un nuevo Pokémon para compartir con la comunidad
 *     tags: [communitymon]
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
 *               - description
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: ID del usuario que crea el Pokémon
 *               pokemonId:
 *                 type: integer
 *                 description: ID del Pokémon base
 *               name:
 *                 type: string
 *                 description: Nombre personalizado del Pokémon
 *               description:
 *                 type: string
 *                 description: Descripción del Pokémon
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
 *                 description: Lista de movimientos
 *                 items:
 *                   type: string
 *               ivs:
 *                 type: object
 *                 description: Valores individuales
 *               evs:
 *                 type: object
 *                 description: Valores de esfuerzo
 *     responses:
 *       200:
 *         description: Pokémon comunitario creado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Pokémon comunitario creado exitosamente
 *                 communitymon:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
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
router.post("/create", create);

/**
 * @swagger
 * /communitymon/all:
 *   get:
 *     summary: Listar Pokémon comunitarios
 *     description: Obtiene todos los Pokémon compartidos por la comunidad
 *     tags: [communitymon]
 *     responses:
 *       200:
 *         description: Lista de Pokémon comunitarios
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
 *                   description:
 *                     type: string
 *                   level:
 *                     type: integer
 *                   ability:
 *                     type: string
 *                   moves:
 *                     type: array
 *                     items:
 *                       type: string
 *                   creator:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       username:
 *                         type: string
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/all", readAll);

/**
 * @swagger
 * /communitymon/{id_communitymon}:
 *   get:
 *     summary: Obtener Pokémon comunitario
 *     description: Obtiene los detalles de un Pokémon comunitario específico
 *     tags: [communitymon]
 *     parameters:
 *       - in: path
 *         name: id_communitymon
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del Pokémon comunitario
 *     responses:
 *       200:
 *         description: Detalles del Pokémon comunitario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 level:
 *                   type: integer
 *                 ability:
 *                   type: string
 *                 moves:
 *                   type: array
 *                   items:
 *                     type: string
 *                 ivs:
 *                   type: object
 *                 evs:
 *                   type: object
 *                 creator:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     username:
 *                       type: string
 *       404:
 *         description: Pokémon comunitario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:id_communitymon", readOne);

/**
 * @swagger
 * /communitymon/update:
 *   put:
 *     summary: Actualizar Pokémon comunitario
 *     description: Actualiza la información de un Pokémon comunitario
 *     tags: [communitymon]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_communitymon
 *             properties:
 *               id_communitymon:
 *                 type: integer
 *                 description: ID del Pokémon comunitario a actualizar
 *               name:
 *                 type: string
 *                 description: Nuevo nombre
 *               description:
 *                 type: string
 *                 description: Nueva descripción
 *               level:
 *                 type: integer
 *                 description: Nuevo nivel
 *               ability:
 *                 type: string
 *                 description: Nueva habilidad
 *               moves:
 *                 type: array
 *                 description: Nueva lista de movimientos
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Pokémon comunitario actualizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Pokémon comunitario actualizado exitosamente
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
 *         description: Pokémon comunitario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/update", update);

/**
 * @swagger
 * /communitymon/delete:
 *   delete:
 *     summary: Eliminar Pokémon comunitario
 *     description: Elimina un Pokémon comunitario
 *     tags: [communitymon]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_communitymon
 *             properties:
 *               id_communitymon:
 *                 type: integer
 *                 description: ID del Pokémon comunitario a eliminar
 *     responses:
 *       200:
 *         description: Pokémon comunitario eliminado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Pokémon comunitario eliminado exitosamente
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Pokémon comunitario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/delete", deleteCommunitymon);

/**
 * @swagger
 * /communitymon/my_communitymon:
 *   post:
 *     summary: Listar Pokémon comunitarios del usuario
 *     description: Obtiene todos los Pokémon comunitarios creados por un usuario
 *     tags: [communitymon]
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
 *         description: Lista de Pokémon comunitarios del usuario
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
 *                   description:
 *                     type: string
 *                   level:
 *                     type: integer
 *                   ability:
 *                     type: string
 *                   moves:
 *                     type: array
 *                     items:
 *                       type: string
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/my_communitymon", readCommunitymonPerUser);

module.exports = router;
