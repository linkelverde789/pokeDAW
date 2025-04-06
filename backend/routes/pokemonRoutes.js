const express = require("express");
const { getPokemons, getPokemonByName, getPokemonPokedex, getAllnames } = require("../controllers/pokedexController");
const { getPokemonCalculator } = require("../controllers/poketoolsController");
const { getPokemonGuess, getPokemonEntry, getPokemondle } = require("../controllers/pokeplayController");
const {getAllItems} = require("../controllers/miscController");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: pokeplay
 *     description: Juegos interactivos relacionados con Pokémon
 *   - name: poketools
 *     description: Herramientas útiles para cálculos y análisis de Pokémon
 *   - name: pokedex
 *     description: Operaciones relacionadas con la Pokédex y búsqueda de Pokémon
 *   - name: items
 *     description: Gestión de objetos y elementos del juego
 */

/**
 * @swagger
 * /api/pokeplay/guess:
 *   get:
 *     summary: Iniciar juego de adivinanza
 *     description: Obtiene un Pokémon aleatorio para jugar a adivinarlo
 *     tags: [pokeplay]
 *     responses:
 *       200:
 *         description: Pokémon aleatorio para adivinar
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pokemon:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     image:
 *                       type: string
 *                     hints:
 *                       type: array
 *                       items:
 *                         type: string
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/pokeplay/guess", getPokemonGuess);

/**
 * @swagger
 * /api/pokeplay/entry:
 *   get:
 *     summary: Obtener entrada de Pokédex
 *     description: Devuelve una entrada aleatoria de la Pokédex con información detallada
 *     tags: [pokeplay]
 *     responses:
 *       200:
 *         description: Entrada de Pokédex
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 entry:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     type:
 *                       type: array
 *                       items:
 *                         type: string
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/pokeplay/entry", getPokemonEntry);

/**
 * @swagger
 * /api/pokeplay/pokemondle:
 *   post:
 *     summary: Jugar Pokemondle
 *     description: Inicia una ronda del juego Pokemondle (similar a Wordle pero con Pokémon)
 *     tags: [pokeplay]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               guess:
 *                 type: string
 *                 description: Nombre del Pokémon que el usuario cree que es
 *     responses:
 *       200:
 *         description: Resultado de la adivinanza
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 correct:
 *                   type: boolean
 *                 feedback:
 *                   type: array
 *                   items:
 *                     type: string
 *       400:
 *         description: Entrada inválida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/pokeplay/pokemondle", getPokemondle);

/**
 * @swagger
 * /api/poketools/calculator:
 *   get:
 *     summary: Calculadora de estadísticas
 *     description: Calcula las estadísticas de un Pokémon basadas en sus IVs y EVs
 *     tags: [poketools]
 *     parameters:
 *       - in: query
 *         name: pokemon
 *         schema:
 *           type: string
 *         required: true
 *         description: Nombre del Pokémon
 *       - in: query
 *         name: level
 *         schema:
 *           type: integer
 *         required: true
 *         description: Nivel del Pokémon
 *     responses:
 *       200:
 *         description: Estadísticas calculadas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 stats:
 *                   type: object
 *                   properties:
 *                     hp:
 *                       type: integer
 *                     attack:
 *                       type: integer
 *                     defense:
 *                       type: integer
 *                     spAttack:
 *                       type: integer
 *                     spDefense:
 *                       type: integer
 *                     speed:
 *                       type: integer
 *       400:
 *         description: Parámetros inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/poketools/calculator", getPokemonCalculator);

/**
 * @swagger
 * /api/pokedex/all:
 *   get:
 *     summary: Lista completa de Pokémon
 *     description: Obtiene la lista completa de todos los Pokémon disponibles
 *     tags: [pokedex]
 *     responses:
 *       200:
 *         description: Lista de Pokémon
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
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/pokedex/all", getPokemons);

/**
 * @swagger
 * /api/pokedex/search:
 *   get:
 *     summary: Búsqueda por nombre
 *     description: Busca un Pokémon específico por su nombre
 *     tags: [pokedex]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: Nombre del Pokémon a buscar
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
 *       404:
 *         description: Pokémon no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/pokedex/search", getPokemonByName);

/**
 * @swagger
 * /api/pokemon:
 *   get:
 *     summary: Pokédex completa
 *     description: Obtiene la Pokédex completa con información detallada
 *     tags: [pokedex]
 *     responses:
 *       200:
 *         description: Pokédex completa
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
 *                   description:
 *                     type: string
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/pokemon/", getPokemonPokedex);

/**
 * @swagger
 * /api/pokemon/{id_pokemon}:
 *   get:
 *     summary: Pokémon por ID
 *     description: Obtiene la información detallada de un Pokémon específico por su ID
 *     tags: [pokedex]
 *     parameters:
 *       - in: path
 *         name: id_pokemon
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del Pokémon en la Pokédex
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
 *                 description:
 *                   type: string
 *       404:
 *         description: Pokémon no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/pokemon/:id_pokemon", getPokemonPokedex);

/**
 * @swagger
 * /api/names:
 *   get:
 *     summary: Lista de nombres
 *     description: Obtiene una lista de todos los nombres de Pokémon disponibles
 *     tags: [pokedex]
 *     responses:
 *       200:
 *         description: Lista de nombres
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/names", getAllnames);

/**
 * @swagger
 * /api/items:
 *   get:
 *     summary: Lista de objetos
 *     description: Obtiene una lista de todos los objetos disponibles en el juego
 *     tags: [items]
 *     parameters:
 *       - in: query
 *         name: holdable
 *         schema:
 *           type: boolean
 *         required: false
 *         description: Filtrar por objetos equipables
 *     responses:
 *       200:
 *         description: Lista de objetos
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
 *                   holdable:
 *                     type: boolean
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/items", getAllItems);

module.exports = router;
