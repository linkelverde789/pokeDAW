const express = require("express");
const router = express.Router();
const { addFavPokemon, addCapturedPokemon, getInfo, catchedPokemon, favouritesPokemon } = require("../controllers/userPokemonController");

/**
 * @swagger
 * tags:
 *   - name: user-pokemon
 *     description: Gestión de Pokémon favoritos y capturados por el usuario
 */

/**
 * @swagger
 * /user/info:
 *   post:
 *     summary: Información de Pokémon
 *     description: Obtiene información detallada de un Pokémon específico
 *     tags: [user-pokemon]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pokemonId
 *             properties:
 *               pokemonId:
 *                 type: integer
 *                 description: ID del Pokémon
 *     responses:
 *       200:
 *         description: Información del Pokémon
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 types:
 *                   type: array
 *                   items:
 *                     type: string
 *                 stats:
 *                   type: object
 *                 abilities:
 *                   type: array
 *                   items:
 *                     type: string
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Pokémon no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/info", getInfo);

/**
 * @swagger
 * /user/putFav:
 *   post:
 *     summary: Añadir a favoritos
 *     description: Marca un Pokémon como favorito del usuario
 *     tags: [user-pokemon]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pokemonId
 *             properties:
 *               pokemonId:
 *                 type: integer
 *                 description: ID del Pokémon a marcar como favorito
 *     responses:
 *       200:
 *         description: Pokémon añadido a favoritos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Pokémon añadido a favoritos
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Pokémon no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/putFav", addFavPokemon);

/**
 * @swagger
 * /user/putCapture:
 *   post:
 *     summary: Marcar como capturado
 *     description: Marca un Pokémon como capturado por el usuario
 *     tags: [user-pokemon]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pokemonId
 *             properties:
 *               pokemonId:
 *                 type: integer
 *                 description: ID del Pokémon a marcar como capturado
 *     responses:
 *       200:
 *         description: Pokémon marcado como capturado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Pokémon capturado
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Pokémon no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/putCapture", addCapturedPokemon);

/**
 * @swagger
 * /user/getFavouritePokemon:
 *   post:
 *     summary: Listar favoritos
 *     description: Obtiene la lista de Pokémon favoritos del usuario
 *     tags: [user-pokemon]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de Pokémon favoritos
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
 *                   types:
 *                     type: array
 *                     items:
 *                       type: string
 *                   image:
 *                     type: string
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/getFavouritePokemon", favouritesPokemon);

/**
 * @swagger
 * /user/getCatchedPokemon:
 *   post:
 *     summary: Listar capturados
 *     description: Obtiene la lista de Pokémon capturados por el usuario
 *     tags: [user-pokemon]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de Pokémon capturados
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
 *                   types:
 *                     type: array
 *                     items:
 *                       type: string
 *                   image:
 *                     type: string
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/getCatchedPokemon", catchedPokemon);

module.exports = router;
