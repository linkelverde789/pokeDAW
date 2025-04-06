const db = require("../config/db");

async function getAllPokemons(limit, start, end) {
  try {
    const result = db.manyOrNone('select * from pokemon where id_pokemon>=$1 and id_pokemon<=$2 limit $3', [start, end, limit]);
    return result;
  } catch (error) {
    return null;
  }
}

async function searchByName(name) {
  try {
    const result = await db.manyOrNone("SELECT * FROM pokemon WHERE name ilike $1", [`%${name}%`]);
    return result;
  } catch (error) {
    return null;
  }
}


async function allMoveInfo() {
  try {
    return await db.manyOrNone('select * from pokedex_moves');
  } catch (error) {
    return null;
  }
}

async function moveInfo(id_pokemon) {
  try {
    return await db.manyOrNone('select * from pokedex_moves where id_pokemon=$1', [id_pokemon]);
  } catch (error) {
    return null;
  }
}
async function pokemonInfo(id_pokemon) {
  try {
    return await db.oneOrNone('select * from pokedex_global where id_pokemon=$1', [id_pokemon]);
  } catch (error) {
    return null;
  }
}

async function allPokemonInfo() {
  try {
    return await db.manyOrNone('select * from pokedex_global');
  } catch (error) {
    return null;
  }
}

async function allAbilitiesInfo() {
  try {
    return await db.manyOrNone('select * from pokedex_ability');
  } catch (error) {
    return null;
  }
}

async function abilitiesInfo(id_pokemon) {
  try {
    return await db.manyOrNone('select * from pokedex_ability where id_pokemon=$1', [id_pokemon]);
  } catch (error) {
    return null;
  }
}

async function getNames() {
  try {
    return await db.manyOrNone('select * from all_names');
  } catch (error) {
    return null;
  }
}

module.exports = {
  getAllPokemons,
  searchByName,
  pokemonInfo,
  allPokemonInfo,
  allMoveInfo,
  moveInfo,
  allAbilitiesInfo,
  abilitiesInfo,
  getNames
};