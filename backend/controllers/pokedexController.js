const axios = require('axios');
const { getAllPokemons,
  searchByName,
  pokemonInfo,
  allPokemonInfo,
  allMoveInfo,
  moveInfo,
  allAbilitiesInfo,
  abilitiesInfo,
  getNames
} = require("../models/pokemonModel");

async function pokeapi() {
  try {
    const URL = 'https://pokeapi.co/api/v2/pokemon/';
    const batchSize = 41;
    const result = [];

    for (let i = 1; i < 1025; i += batchSize) {
      const batchRequests = Array.from({ length: batchSize }, (_, j) =>
        axios.get(`${URL}${i + j}`)
          .then((res) => res.data)
          .catch((err) => {
            console.error(`Error fetching Pokémon #${i + j}:`, err);
            return null;
          })
      );

      const batchResults = await Promise.all(batchRequests);
      const filteredResults = batchResults.filter((data) => data !== null);

      result.push(...filteredResults);
    }

    return result;
  } catch (error) {
    console.error('Error al cargar los datos:', error);
    return null;
  }
}

async function pokeapi_limit(start, limit) {
  const URL = `https://pokeapi.co/api/v2/pokemon/`;
  const result = [];

  for (let i = start; i <= limit; i++) {
    try {
      const response = await axios.get(`${URL}${i}`);
      result.push(response.data);
    } catch (err) {
      console.error(`Error fetching Pokémon #${i}:`, err);
    }
  }

  return result;
}

async function getPokemons(req, res) {
  let { limit, start, end } = req.query;
  start = start ? Math.max(1, Math.min(1025, start)) : 1;
  limit = limit && !isNaN(limit) ? Math.min(Math.max(1, limit), 1025) : 1025;
  end = end ? Math.min(1025, Math.max(start, end)) : start + limit - 1;

  end = Math.min(end, 1025);

  try {
    if (end < start) {
      return res.status(400).json({ message: 'End cannot be less than start' });
    }

    const data = await getAllPokemons(limit, start, end);

    return res.json(data.map(pokemon => ({
      id: pokemon.id_pokemon,
      name: pokemon.name,
      type1: pokemon.type1,
      type2: pokemon.type2,
    })));
  } catch (error) {
    const result = await pokeapi_limit(start, end);
    return res.json(result.map(pokemon => ({
      id: pokemon.id,
      name: pokemon.species.name,
      type1: pokemon.types[0].type.name,
      type2: pokemon.types[1] ? pokemon.types[1].type.name : null,
    })));
  }
}

async function getPokemonByName(req, res) {
  let { name } = req.query;
  if (!name) {
    return;
  }
  let result = await searchByName(name);
  if (!result) {
    const data = await pokeapi();
    const nameFiltered = data.filter(pokemon => {
      return pokemon.species.name.toLowerCase().includes(name.toLowerCase());
    });

    return res.json(nameFiltered.map(pokemon => ({
      id: pokemon.id,
      name: pokemon.species.name,
      type1: pokemon.types[0].type.name,
      type2: pokemon.types[1] ? pokemon.types[1].type.name : null,
    })));
  }
  return res.json(result.map(pokemon => ({
    id: pokemon.id_pokemon,
    name: pokemon.name,
    type1: pokemon.type1,
    type2: pokemon.type2,
  })));
}

async function getAllPokemonMove() {
  let moveData = await allMoveInfo();

  let moves = {};

  for (let i = 1; i <= 1025; i++) {
    moves[i] = moveData
      .filter(move => move.id_pokemon === i)
      .map(move => ({
        id_move: move.id_move,
        text: [
          {
            es: {
              name: move.name_es,
              description: move.description_es,
            },
            en: {
              name: move.name_en,
              description: move.description_en,
            }
          }
        ],
        accuracy: move.accuracy,
        power: move.power,
        type: move.type,
        category: move.category,
      }));

  }
  return moves;
}

async function getPokemonMove(id_pokemon) {
  let moveData = await moveInfo(id_pokemon);

  if (!moveData) {
    return null
  }

  let moves = {};

  moves[id_pokemon] = moveData.map(move => ({
    id_move: move.id_move,
    text: {
      es: {
        name: move.name_es,
        description: move.description_es,
      },
      en: {
        name: move.name_en,
        description: move.description_en,
      }
    },
    accuracy: move.accuracy,
    power: move.power,
    type: move.type,
    category: move.category,
  }));
  return moves;
}

async function getAllPokemonAbilities() {
  let data = await allAbilitiesInfo();
  let result = {};

  for (let i = 1; i <= 1025; i++) {
    result[i] = data.filter(ability => ability.id_pokemon == i).map(ability => {
      return {
        id: ability.id_ability,
        type: ability.type,
        text: {
          es: {
            name: ability.name_es,
            description: ability.description_es,
          },
          en: {
            name: ability.name_en,
            description: ability.description_en,
          },
        },
      }
    })
  }
  return result;

}
async function getPokemonAbilities(id_pokemon) {
  let data = await abilitiesInfo(id_pokemon);
  let result = {};
  result[id_pokemon] = data.map(ability => {
    return {
      id: ability.id_ability,
      type: ability.type,
      text: {
        es: {
          name: ability.name_es,
          description: ability.description_es,
        },
        en: {
          name: ability.name_en,
          description: ability.description_en,
        },
      },
    }
  });
  return result;
}

async function getPokemonPokedex(req, res) {
  let { id_pokemon } = req.params;

  if (id_pokemon && isNaN(Number(id_pokemon))) {
    let searchingPokemon = await searchByName(id_pokemon);
    id_pokemon = searchingPokemon[0].id_pokemon;
  }

  let result;
  let moves;
  let abilities;
  if (!id_pokemon) {
    result = await allPokemonInfo();
    moves = await getAllPokemonMove();
    abilities = await getAllPokemonAbilities();
  } else {
    result = await pokemonInfo(id_pokemon);
    moves = await getPokemonMove(id_pokemon);
    abilities = await getPokemonAbilities(id_pokemon);
  }

  const resultArray = Array.isArray(result) ? result : [result];
  return res.json(
    resultArray.map(pokemon => {
      return {
        id: pokemon.id_pokemon,
        name: pokemon.name,
        type1: pokemon.type1,
        type2: pokemon.type2,
        base_stat: {
          attack: pokemon.base_attack,
          defense: pokemon.base_defense,
          special_attack: pokemon.base_special_attack,
          special_defense: pokemon.base_special_defense,
          speed: pokemon.base_speed,
          hp: pokemon.base_hp,
          total: pokemon.base_attack + pokemon.base_defense + pokemon.base_speed + pokemon.base_special_defense + pokemon.base_special_attack + pokemon.base_hp,
        },
        generation: pokemon.generation,
        height: pokemon.height,
        weight: pokemon.weight,
        colour: pokemon.colour,
        evolution_state: pokemon.evolution_state,
        can_evolve: pokemon.can_evolve,
        next_evolution_id: pokemon.next_evolution_id,
        evolution_chain: {
          pokemon1: {
            name: pokemon.evolution_pokemon_1,
            id: pokemon.evolution_id_1,
          },
          pokemon2: {
            name: pokemon.evolution_pokemon_2,
            id: pokemon.evolution_id_2,
          },
          pokemon3: {
            name: pokemon.evolution_pokemon_3,
            id: pokemon.evolution_id_3,
          },
        },
        text: {
          es: {
            specie: pokemon.specie_es,
            description: pokemon.description_es,
          },
          en: {
            specie: pokemon.specie_en,
            description: pokemon.description_en,
          },
        },
        abilities: abilities[pokemon.id_pokemon],
        moves: moves[pokemon.id_pokemon],
      }
    })
  );

}

async function getAllnames(req, res) {

  let data = await getNames();

  return res.json(data.map(pokemon => {
    return {
      id: pokemon.id_pokemon,
      name: pokemon.name,
    }
  }));
}


module.exports = { getPokemons, getPokemonByName, getPokemonPokedex, getAllnames };